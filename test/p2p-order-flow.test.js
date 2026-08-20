const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
const { createWalletService } = require('../lib/wallet-service');

// P2P order lifecycle is where real user money moves between wallets on the
// live exchange — escrow locked at ad-creation is released to the buyer and
// unlocked from the seller here. These tests run against a real (in-memory)
// MongoDB to catch actual race conditions and status-transition bugs.
let mongod;
let client;
let db;
let wallets;
let p2pOffers;
let p2pOrders;
let walletService;

async function seedOffer(overrides = {}) {
  const offer = {
    id: overrides.id || 'ad_1',
    status: 'ACTIVE',
    availableAmount: 100,
    available: 100,
    createdByUserId: 'usr_seller',
    ...overrides
  };
  await p2pOffers.insertOne(offer);
  return offer;
}

function baseOrderInput(overrides = {}) {
  return {
    id: `ord_${Date.now()}_${Math.floor(Math.random() * 100000)}`,
    reference: `P2P-${Math.floor(Math.random() * 100000)}`,
    adId: 'ad_1',
    offerId: 'ad_1',
    sellerUserId: 'usr_seller',
    sellerUsername: 'seller',
    buyerUserId: 'usr_buyer',
    buyerUsername: 'buyer',
    asset: 'USDT',
    price: 90,
    assetAmount: 10,
    amountInr: 900,
    expiresAt: Date.now() + 15 * 60 * 1000,
    messages: [],
    ...overrides
  };
}

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  client = new MongoClient(mongod.getUri());
  await client.connect();
  db = client.db('p2p_test');

  wallets = db.collection('wallets');
  p2pOffers = db.collection('p2p_offers');
  p2pOrders = db.collection('p2p_orders');

  const collections = {
    wallets,
    p2pOrders,
    p2pOffers,
    p2pCredentials: db.collection('p2p_credentials'),
    ledgerEntries: db.collection('ledger_entries'),
    walletFailures: db.collection('wallet_failures'),
    withdrawalRequests: db.collection('withdrawal_requests')
  };

  walletService = createWalletService(collections, client);
}, 60000);

afterAll(async () => {
  if (client) await client.close();
  if (mongod) await mongod.stop();
});

afterEach(async () => {
  await wallets.deleteMany({});
  await p2pOffers.deleteMany({});
  await p2pOrders.deleteMany({});
});

describe('createEscrowOrder', () => {
  test('creates the order and atomically decrements offer availableAmount', async () => {
    await seedOffer({ availableAmount: 100, available: 100 });
    const order = await walletService.createEscrowOrder(baseOrderInput({ assetAmount: 10 }));

    expect(order.status).toBe('CREATED');
    expect(order.escrowAmount).toBe(10);

    const offer = await p2pOffers.findOne({ id: 'ad_1' });
    expect(offer.availableAmount).toBe(90);
  });

  test('rejects when the offer does not exist', async () => {
    await expect(
      walletService.createEscrowOrder(baseOrderInput({ adId: 'missing_ad' }))
    ).rejects.toThrow('Ad not found');
  });

  test('rejects when the offer is not ACTIVE', async () => {
    await seedOffer({ status: 'PAUSED' });
    await expect(walletService.createEscrowOrder(baseOrderInput())).rejects.toThrow(
      'Ad is no longer active'
    );
  });

  test('rejects when escrow amount exceeds available liquidity', async () => {
    await seedOffer({ availableAmount: 5, available: 5 });
    await expect(
      walletService.createEscrowOrder(baseOrderInput({ assetAmount: 10 }))
    ).rejects.toThrow('Ad does not have enough available amount');

    const offer = await p2pOffers.findOne({ id: 'ad_1' });
    expect(offer.availableAmount).toBe(5);
  });

  test('does not oversell liquidity under concurrent order creation', async () => {
    await seedOffer({ availableAmount: 10, available: 10 });

    // Two buyers both try to take the full 10 available at the same time —
    // the atomic $gte-guarded decrement must let exactly one through.
    const results = await Promise.allSettled([
      walletService.createEscrowOrder(
        baseOrderInput({ buyerUserId: 'usr_buyer_a', assetAmount: 10 })
      ),
      walletService.createEscrowOrder(
        baseOrderInput({ buyerUserId: 'usr_buyer_b', assetAmount: 10 })
      )
    ]);

    const fulfilled = results.filter((r) => r.status === 'fulfilled');
    expect(fulfilled).toHaveLength(1);

    const offer = await p2pOffers.findOne({ id: 'ad_1' });
    expect(offer.availableAmount).toBe(0);
  });
});

describe('markOrderPaid', () => {
  test('buyer can move a CREATED order to PAYMENT_SENT', async () => {
    await seedOffer();
    const order = await walletService.createEscrowOrder(baseOrderInput());

    const updated = await walletService.markOrderPaid(order.id, {
      userId: 'usr_buyer',
      username: 'buyer'
    });
    expect(updated.status).toBe('PAYMENT_SENT');
  });

  test('rejects when the actor is not the buyer', async () => {
    await seedOffer();
    const order = await walletService.createEscrowOrder(baseOrderInput());

    await expect(
      walletService.markOrderPaid(order.id, { userId: 'usr_seller', username: 'seller' })
    ).rejects.toThrow('Only buyer can mark this order as paid');
  });

  test('rejects when order is not in CREATED status', async () => {
    await seedOffer();
    const order = await walletService.createEscrowOrder(baseOrderInput());
    await walletService.markOrderPaid(order.id, { userId: 'usr_buyer', username: 'buyer' });

    await expect(
      walletService.markOrderPaid(order.id, { userId: 'usr_buyer', username: 'buyer' })
    ).rejects.toThrow('Order must be in CREATED status');
  });

  test('auto-cancels and rejects an expired order', async () => {
    await seedOffer();
    const order = await walletService.createEscrowOrder(
      baseOrderInput({ expiresAt: Date.now() - 1000 })
    );

    await expect(
      walletService.markOrderPaid(order.id, { userId: 'usr_buyer', username: 'buyer' })
    ).rejects.toThrow('Order has expired');

    const stored = await p2pOrders.findOne({ id: order.id });
    expect(stored.status).toBe('EXPIRED');
    // Liquidity restored to the offer after auto-expiry.
    const offer = await p2pOffers.findOne({ id: 'ad_1' });
    expect(offer.availableAmount).toBe(100);
  });
});

describe('releaseOrder', () => {
  async function createAndPaySeeded(assetAmount = 10) {
    await seedOffer({ availableAmount: 100, available: 100 });
    // Seller's escrow funds are locked when the ad was created — simulate that here.
    await wallets.insertOne({
      userId: 'usr_seller',
      username: 'seller',
      availableBalance: 0,
      balance: 0,
      lockedBalance: assetAmount,
      p2pLocked: assetAmount
    });
    const order = await walletService.createEscrowOrder(baseOrderInput({ assetAmount }));
    await walletService.markOrderPaid(order.id, { userId: 'usr_buyer', username: 'buyer' });
    return order;
  }

  test('moves escrow from seller locked balance to buyer available balance', async () => {
    const order = await createAndPaySeeded(10);

    const released = await walletService.releaseOrder(order.id, {
      userId: 'usr_seller',
      username: 'seller'
    });
    expect(released.status).toBe('COMPLETED');

    const sellerWallet = await wallets.findOne({ userId: 'usr_seller' });
    expect(sellerWallet.lockedBalance).toBe(0);

    const buyerWallet = await wallets.findOne({ userId: 'usr_buyer' });
    expect(buyerWallet.availableBalance).toBe(10);
  });

  test('rejects release from anyone other than the seller', async () => {
    const order = await createAndPaySeeded(10);
    await expect(
      walletService.releaseOrder(order.id, { userId: 'usr_buyer', username: 'buyer' })
    ).rejects.toThrow('Only seller can release escrow');
  });

  test('rejects release when order is not in PAYMENT_SENT status', async () => {
    await seedOffer();
    const order = await walletService.createEscrowOrder(baseOrderInput());
    // Order is still CREATED — payment was never marked.
    await expect(
      walletService.releaseOrder(order.id, { userId: 'usr_seller', username: 'seller' })
    ).rejects.toThrow('Only payment-sent orders can be released');
  });

  test('does not double-release the same order under concurrent calls', async () => {
    const order = await createAndPaySeeded(10);

    const results = await Promise.allSettled([
      walletService.releaseOrder(order.id, { userId: 'usr_seller', username: 'seller' }),
      walletService.releaseOrder(order.id, { userId: 'usr_seller', username: 'seller' })
    ]);
    const fulfilled = results.filter((r) => r.status === 'fulfilled');
    expect(fulfilled).toHaveLength(1);

    const buyerWallet = await wallets.findOne({ userId: 'usr_buyer' });
    expect(buyerWallet.availableBalance).toBe(10);
  });
});

describe('cancelOrder', () => {
  test('buyer can cancel a CREATED order and liquidity is restored to the offer', async () => {
    await seedOffer({ availableAmount: 100, available: 100 });
    const order = await walletService.createEscrowOrder(baseOrderInput({ assetAmount: 10 }));

    const cancelled = await walletService.cancelOrder(order.id, {
      userId: 'usr_buyer',
      username: 'buyer'
    });
    expect(cancelled.status).toBe('CANCELLED');

    const offer = await p2pOffers.findOne({ id: 'ad_1' });
    expect(offer.availableAmount).toBe(100);
  });

  test('rejects cancellation from a non-participant', async () => {
    await seedOffer();
    const order = await walletService.createEscrowOrder(baseOrderInput());

    await expect(
      walletService.cancelOrder(order.id, { userId: 'usr_stranger', username: 'stranger' })
    ).rejects.toThrow('Only buyer/seller can cancel this order');
  });

  test('rejects seller cancelling after the buyer has marked payment sent', async () => {
    await seedOffer();
    const order = await walletService.createEscrowOrder(baseOrderInput());
    await walletService.markOrderPaid(order.id, { userId: 'usr_buyer', username: 'buyer' });

    await expect(
      walletService.cancelOrder(order.id, { userId: 'usr_seller', username: 'seller' })
    ).rejects.toThrow('Only the buyer can cancel after marking payment as paid');
  });

  test('rejects cancelling an already-completed order', async () => {
    await seedOffer({ availableAmount: 100, available: 100 });
    await wallets.insertOne({
      userId: 'usr_seller',
      username: 'seller',
      availableBalance: 0,
      balance: 0,
      lockedBalance: 10,
      p2pLocked: 10
    });
    const order = await walletService.createEscrowOrder(baseOrderInput({ assetAmount: 10 }));
    await walletService.markOrderPaid(order.id, { userId: 'usr_buyer', username: 'buyer' });
    await walletService.releaseOrder(order.id, { userId: 'usr_seller', username: 'seller' });

    await expect(
      walletService.cancelOrder(order.id, { userId: 'usr_buyer', username: 'buyer' })
    ).rejects.toThrow('Order cannot be cancelled');
  });
});

describe('setOrderDisputed', () => {
  test('a participant can raise a dispute on an active order', async () => {
    await seedOffer();
    const order = await walletService.createEscrowOrder(baseOrderInput());
    await walletService.markOrderPaid(order.id, { userId: 'usr_buyer', username: 'buyer' });

    const disputed = await walletService.setOrderDisputed(
      order.id,
      { userId: 'usr_buyer', username: 'buyer' },
      { reason: 'Payment not received' }
    );
    expect(disputed.status).toBe('DISPUTED');
    expect(disputed.disputeStatus).toBe('UNDER_REVIEW');
    expect(disputed.appealedByRole).toBe('buyer');
  });

  test('rejects a dispute raised by a non-participant', async () => {
    await seedOffer();
    const order = await walletService.createEscrowOrder(baseOrderInput());

    await expect(
      walletService.setOrderDisputed(order.id, { userId: 'usr_stranger', username: 'stranger' }, {})
    ).rejects.toThrow('Only participants can raise dispute');
  });

  test('rejects disputing a completed order', async () => {
    await seedOffer({ availableAmount: 100, available: 100 });
    await wallets.insertOne({
      userId: 'usr_seller',
      username: 'seller',
      availableBalance: 0,
      balance: 0,
      lockedBalance: 10,
      p2pLocked: 10
    });
    const order = await walletService.createEscrowOrder(baseOrderInput({ assetAmount: 10 }));
    await walletService.markOrderPaid(order.id, { userId: 'usr_buyer', username: 'buyer' });
    await walletService.releaseOrder(order.id, { userId: 'usr_seller', username: 'seller' });

    await expect(
      walletService.setOrderDisputed(order.id, { userId: 'usr_buyer', username: 'buyer' }, {})
    ).rejects.toThrow('Only active orders can be disputed');
  });
});
