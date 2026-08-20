const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
const { createWalletService } = require('../lib/wallet-service');

// These tests run against a real (in-memory) MongoDB instead of mocks — the
// whole point is to catch real balance-mutation bugs (races, wrong deltas,
// letting a withdrawal through it shouldn't), which a mocked DB would hide.
let mongod;
let client;
let db;
let wallets;
let ledgerEntries;
let walletFailures;
let walletService;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  client = new MongoClient(mongod.getUri());
  await client.connect();
  db = client.db('wallet_test');

  wallets = db.collection('wallets');
  ledgerEntries = db.collection('ledger_entries');
  walletFailures = db.collection('wallet_failures');

  const collections = {
    wallets,
    p2pOrders: db.collection('p2p_orders'),
    p2pOffers: db.collection('p2p_offers'),
    p2pCredentials: db.collection('p2p_credentials'),
    ledgerEntries,
    walletFailures,
    withdrawalRequests: db.collection('withdrawal_requests')
  };

  walletService = createWalletService(collections, client);
}, 60000);

afterAll(async () => {
  if (client) await client.close();
  if (mongod) await mongod.stop();
});

afterEach(async () => {
  // Isolate each test's wallet/ledger state.
  await wallets.deleteMany({});
  await ledgerEntries.deleteMany({});
  await walletFailures.deleteMany({});
});

describe('creditAvailable', () => {
  test('creates a wallet on first credit and increases the available balance', async () => {
    const wallet = await walletService.creditAvailable('usr_alice', 100, { type: 'deposit' });
    expect(wallet.availableBalance).toBe(100);
    expect(wallet.lockedBalance).toBe(0);
  });

  test('writes a ledger entry for every credit', async () => {
    await walletService.creditAvailable('usr_alice', 100, { type: 'deposit' });
    const entries = await ledgerEntries.find({ userId: 'usr_alice' }).toArray();
    expect(entries).toHaveLength(1);
    expect(entries[0].type).toBe('deposit');
    expect(entries[0].amount).toBe(100);
  });

  test('rejects a zero or negative credit amount', async () => {
    await expect(walletService.creditAvailable('usr_alice', 0)).rejects.toThrow('must be greater than 0');
    await expect(walletService.creditAvailable('usr_alice', -5)).rejects.toThrow('must be greater than 0');
  });
});

describe('debitAvailable', () => {
  test('decreases the available balance', async () => {
    await walletService.creditAvailable('usr_bob', 200, { type: 'deposit' });
    const wallet = await walletService.debitAvailable('usr_bob', 50, { type: 'withdrawal' });
    expect(wallet.availableBalance).toBe(150);
  });

  test('refuses to debit more than the available balance', async () => {
    await walletService.creditAvailable('usr_bob', 100, { type: 'deposit' });
    await expect(
      walletService.debitAvailable('usr_bob', 150, { type: 'withdrawal' })
    ).rejects.toThrow('Insufficient available balance');

    // Balance must be unchanged after a rejected withdrawal.
    const wallet = await walletService.getWallet('usr_bob');
    expect(wallet.availableBalance).toBe(100);
  });

  test('logs a wallet_failures entry when a debit is rejected', async () => {
    await walletService.creditAvailable('usr_bob', 10, { type: 'deposit' });
    await expect(walletService.debitAvailable('usr_bob', 999)).rejects.toThrow();
    const failures = await walletFailures.find({ userId: 'usr_bob' }).toArray();
    expect(failures.length).toBeGreaterThan(0);
    expect(failures[0].operation).toBe('debit_available');
  });

  test('two concurrent withdrawals never let combined debits exceed the available balance', async () => {
    // The classic double-withdraw bug: user has 100, fires two withdrawals of
    // 80 each "at the same time". At most one should succeed.
    await walletService.creditAvailable('usr_racer', 100, { type: 'deposit' });

    const results = await Promise.allSettled([
      walletService.debitAvailable('usr_racer', 80, { type: 'withdrawal', referenceId: 'race_1' }),
      walletService.debitAvailable('usr_racer', 80, { type: 'withdrawal', referenceId: 'race_2' })
    ]);

    const succeeded = results.filter((r) => r.status === 'fulfilled');
    const failed = results.filter((r) => r.status === 'rejected');

    expect(succeeded).toHaveLength(1);
    expect(failed).toHaveLength(1);

    const wallet = await walletService.getWallet('usr_racer');
    expect(wallet.availableBalance).toBe(20);
    expect(wallet.availableBalance).toBeGreaterThanOrEqual(0);
  });
});

describe('lockFunds / unlockFunds', () => {
  test('lockFunds moves money from available to locked, not out of the wallet', async () => {
    await walletService.creditAvailable('usr_carol', 100, { type: 'deposit' });
    const wallet = await walletService.lockFunds('usr_carol', 40, { type: 'trade_sell' });
    expect(wallet.availableBalance).toBe(60);
    expect(wallet.lockedBalance).toBe(40);
    expect(wallet.totalBalance).toBe(100);
  });

  test('unlockFunds reverses a lock exactly', async () => {
    await walletService.creditAvailable('usr_carol', 100, { type: 'deposit' });
    await walletService.lockFunds('usr_carol', 40, { type: 'trade_sell' });
    const wallet = await walletService.unlockFunds('usr_carol', 40, { type: 'refund' });
    expect(wallet.availableBalance).toBe(100);
    expect(wallet.lockedBalance).toBe(0);
  });

  test('cannot lock more than the available balance', async () => {
    await walletService.creditAvailable('usr_carol', 30, { type: 'deposit' });
    await expect(
      walletService.lockFunds('usr_carol', 50, { type: 'trade_sell' })
    ).rejects.toThrow('Insufficient available balance');
  });

  test('cannot unlock more than what is actually locked', async () => {
    await walletService.creditAvailable('usr_carol', 100, { type: 'deposit' });
    await walletService.lockFunds('usr_carol', 20, { type: 'trade_sell' });
    await expect(
      walletService.unlockFunds('usr_carol', 50, { type: 'refund' })
    ).rejects.toThrow('Insufficient locked balance');
  });
});
