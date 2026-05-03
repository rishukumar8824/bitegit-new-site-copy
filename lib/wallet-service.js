const { buildLedgerEntry } = require('../models/Ledger');
const {
  toAmount,
  sanitizeWallet,
  resolveAvailableBalance,
  resolveLockedBalance,
  resolveMerchantDepositLocked
} = require('../models/UserWallet');
const { buildWithdrawalRequest, normalizeWithdrawalStatus, toWithdrawalResponse } = require('../models/WithdrawalRequest');
const { normalizeP2PAdPayload, buildP2PAdDocument } = require('../models/P2PAd');

const ACTIVE_ORDER_STATUSES = ['CREATED', 'PAYMENT_SENT', 'PENDING', 'PAID', 'DISPUTED'];
const CANCELLABLE_ORDER_STATUSES = ['CREATED', 'PENDING', 'PAYMENT_SENT', 'PAID'];
const EXPIRABLE_ORDER_STATUSES = ['CREATED'];
const PAYMENT_MARKED_ORDER_STATUSES = ['PAYMENT_SENT', 'PAID'];

const TX_OPTIONS = {
  readPreference: 'primary',
  readConcern: { level: 'local' },
  writeConcern: { w: 'majority' }
};

function createAppError(code, message, status = 400) {
  const error = new Error(message);
  error.code = code;
  error.status = status;
  return error;
}

function resolveActorUserId(actor) {
  return String(actor?.userId || actor?.id || '').trim();
}

function buildP2PSystemMessage(now, suffix, role, text) {
  return {
    id: `msg_${now}_${suffix}_${Math.floor(Math.random() * 1000)}`,
    sender: 'System',
    senderRole: 'system',
    messageType: 'system',
    isSystem: true,
    role,
    text,
    createdAt: now
  };
}

function normalizeAppealAttachments(items = [], at = Date.now()) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .slice(0, 3)
    .map((item, index) => {
      const dataUrl = typeof item === 'string'
        ? item.trim()
        : String(item?.dataUrl || item?.imageBase64 || item?.imageUrl || '').trim();
      if (!dataUrl) {
        return null;
      }
      return {
        id: `appeal_file_${at}_${index}`,
        name: typeof item === 'object' && item ? String(item.name || `appeal-${index + 1}.png`).trim() : `appeal-${index + 1}.png`,
        dataUrl,
        uploadedAt: at
      };
    })
    .filter(Boolean);
}

function normalizeAppealDetails(payload = {}, actor = {}, order = {}) {
  const now = Date.now();
  const type = String(payload?.appealType || payload?.type || '').trim();
  const reason = String(payload?.appealReason || payload?.reason || '').trim();
  const attachments = normalizeAppealAttachments(payload?.appealImages || payload?.attachments, now);

  if (!type && !reason && attachments.length === 0) {
    return null;
  }

  return {
    type,
    reason,
    attachments,
    submittedAt: now,
    submittedBy: {
      userId: String(actor?.id || actor?.userId || '').trim(),
      username: String(actor?.username || actor?.name || '').trim(),
      role: String(actor?.role || '').trim()
    },
    orderSnapshot: {
      orderId: String(order?.id || '').trim(),
      reference: String(order?.reference || '').trim(),
      amountInr: toAmount(order?.amountInr),
      assetAmount: toAmount(order?.assetAmount),
      asset: String(order?.asset || 'USDT').trim().toUpperCase()
    }
  };
}

function makeSeedUserId(advertiser) {
  const slug = String(advertiser || 'marketmaker')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 32);

  return `seed_${slug || 'marketmaker'}`;
}

function normalizeReference(reference, fallbackType, fallbackReferenceId) {
  if (typeof reference === 'string') {
    return {
      referenceId: String(reference).trim() || fallbackReferenceId,
      type: fallbackType,
      currency: 'USDT',
      metadata: {}
    };
  }

  const candidate = reference && typeof reference === 'object' ? reference : {};

  return {
    referenceId:
      String(candidate.referenceId || candidate.id || '').trim() ||
      fallbackReferenceId ||
      `ref_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    type: String(candidate.type || fallbackType || '').trim().toLowerCase() || fallbackType,
    currency: String(candidate.currency || 'USDT')
      .trim()
      .toUpperCase(),
    metadata: candidate.metadata && typeof candidate.metadata === 'object' ? { ...candidate.metadata } : {},
    username: String(candidate.username || '').trim(),
    fromUsername: String(candidate.fromUsername || '').trim(),
    toUsername: String(candidate.toUsername || '').trim()
  };
}

function resolveOfferLockedAmount(offer) {
  const candidates = [offer?.escrowLockedAmount, offer?.availableAmount, offer?.available];
  for (const candidate of candidates) {
    const parsed = toAmount(candidate);
    if (parsed > 0) {
      return parsed;
    }
  }
  return 0;
}

function normalizeMerchantLevel(rawLevel) {
  const level = String(rawLevel || '')
    .trim()
    .toLowerCase();
  if (['trial', 'verified', 'elite'].includes(level)) {
    return level;
  }
  return 'trial';
}

function resolveMerchantCredentialState(credential = {}) {
  const merchant = credential?.merchant && typeof credential.merchant === 'object' ? credential.merchant : {};
  const merchantLevel = normalizeMerchantLevel(merchant.level || credential.merchantLevel);
  const rawDepositLocked = Number(merchant.depositLocked);
  const depositLocked = Number.isFinite(rawDepositLocked) && rawDepositLocked > 0 ? toAmount(rawDepositLocked) : 0;
  const isMerchant = merchant.isMerchant === true || credential.isMerchant === true;
  const merchantDepositLocked = credential.merchantDepositLocked === true || depositLocked > 0;
  const activatedAtRaw = merchant.activatedAt || credential.activatedAt || null;
  const activatedAt = activatedAtRaw ? new Date(activatedAtRaw) : null;

  return {
    isMerchant,
    merchantDepositLocked,
    depositLocked,
    merchantLevel,
    activatedAt: activatedAt && !Number.isNaN(activatedAt.getTime()) ? activatedAt : null
  };
}

function ensurePositiveAmount(rawAmount, fieldName = 'Amount') {
  const amount = toAmount(rawAmount);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw createAppError('INVALID_AMOUNT', `${fieldName} must be greater than 0.`);
  }
  return amount;
}

function ensureUserId(rawUserId, fieldName = 'userId') {
  const userId = String(rawUserId || '').trim();
  if (!userId) {
    throw createAppError('INVALID_USER_ID', `${fieldName} is required.`);
  }
  return userId;
}

function createWalletService(collections, mongoClient, options = {}) {
  const { wallets, p2pOrders, p2pOffers, p2pCredentials, ledgerEntries, walletFailures, withdrawalRequests } = collections;
  const DEFAULT_USER_WALLET_BALANCE = toAmount(process.env.P2P_DEFAULT_USER_BALANCE || 10000);
  const DEFAULT_SEED_WALLET_BALANCE = toAmount(process.env.P2P_DEFAULT_SEED_WALLET_BALANCE || 1000000);
  const P2P_FEE_PERCENT = Math.max(0, toAmount(process.env.P2P_FEE_PERCENT || 0));
  const P2P_REVENUE_WALLET_USER_ID = String(process.env.P2P_REVENUE_WALLET_USER_ID || 'system_revenue_wallet').trim();
  const P2P_REVENUE_WALLET_USERNAME = String(process.env.P2P_REVENUE_WALLET_USERNAME || 'Bitegit Revenue').trim();

  const beforeOperationHook =
    typeof options.beforeOperation === 'function'
      ? options.beforeOperation
      : typeof options?.hooks?.beforeOperation === 'function'
        ? options.hooks.beforeOperation
        : null;
  const afterOperationHook =
    typeof options.afterOperation === 'function'
      ? options.afterOperation
      : typeof options?.hooks?.afterOperation === 'function'
        ? options.hooks.afterOperation
        : null;
  const failedOperationHook =
    typeof options.onOperationError === 'function'
      ? options.onOperationError
      : typeof options?.hooks?.onOperationError === 'function'
        ? options.hooks.onOperationError
        : null;

  if (!mongoClient) {
    throw new Error('Mongo client is required for wallet service.');
  }

  async function logFailedBalanceAttempt(operation, payload, error) {
    try {
      await walletFailures.insertOne({
        operation,
        userId: String(payload?.userId || '').trim(),
        counterpartyUserId: String(payload?.counterpartyUserId || '').trim(),
        amount: toAmount(payload?.amount),
        referenceId: String(payload?.referenceId || '').trim(),
        reason: String(error?.message || 'Unknown wallet failure'),
        errorCode: String(error?.code || 'WALLET_ERROR'),
        metadata: payload?.metadata && typeof payload.metadata === 'object' ? payload.metadata : {},
        createdAt: new Date()
      });
    } catch (logError) {
      // Ignore logging failures to avoid masking primary error.
    }
  }

  async function runInTransaction(work) {
    let session = null;
    try {
      session = mongoClient.startSession();
      let payload = null;
      await session.withTransaction(async () => {
        payload = await work(session);
      }, TX_OPTIONS);
      return payload;
    } catch (err) {
      // Standalone MongoDB does not support transactions — fall back to no-session mode.
      if (
        err.codeName === 'IllegalOperation' ||
        err.code === 20 ||
        (err.message && (
          err.message.includes('Transaction') ||
          err.message.includes('replica set') ||
          err.message.includes('not supported')
        ))
      ) {
        return work(null);
      }
      throw err;
    } finally {
      if (session) {
        try { await session.endSession(); } catch (_) {}
      }
    }
  }

  async function ensureWallet(userId, opts = {}, session = null) {
    const normalizedUserId = ensureUserId(userId);
    const now = new Date();
    const initialBalance =
      opts.initialBalance !== undefined ? toAmount(opts.initialBalance) : DEFAULT_USER_WALLET_BALANCE;
    const normalizedUsername = String(opts.username || normalizedUserId).trim();
    const nextMerchantDepositLocked =
      opts.merchantDepositLocked !== undefined ? Boolean(opts.merchantDepositLocked) : undefined;

    const existingWallet = await wallets.findOne({ userId: normalizedUserId }, { session });
    if (existingWallet) {
      const normalizedAvailable = resolveAvailableBalance(existingWallet);
      const normalizedLocked = resolveLockedBalance(existingWallet);
      const merchantDepositLocked =
        nextMerchantDepositLocked !== undefined
          ? nextMerchantDepositLocked
          : resolveMerchantDepositLocked(existingWallet);
      await wallets.updateOne(
        { _id: existingWallet._id },
        {
          $set: {
            userId: normalizedUserId,
            username: normalizedUsername || existingWallet.username || normalizedUserId,
            availableBalance: normalizedAvailable,
            balance: normalizedAvailable,
            p2pLocked: normalizedLocked,
            lockedBalance: normalizedLocked,
            merchantDepositLocked,
            updatedAt: now
          }
        },
        { session }
      );

      const refreshedWallet = await wallets.findOne({ _id: existingWallet._id }, { session });
      return sanitizeWallet(refreshedWallet || existingWallet);
    }

    const newWallet = {
      userId: normalizedUserId,
      username: normalizedUsername,
      availableBalance: initialBalance,
      balance: initialBalance,
      p2pLocked: 0,
      lockedBalance: 0,
      merchantDepositLocked: nextMerchantDepositLocked === undefined ? false : nextMerchantDepositLocked,
      createdAt: now,
      updatedAt: now
    };

    try {
      await wallets.insertOne(newWallet, { session });

      if (initialBalance > 0) {
        const ledgerDoc = buildLedgerEntry({
          userId: normalizedUserId,
          type: 'deposit',
          amount: initialBalance,
          currency: 'USDT',
          beforeAvailable: 0,
          afterAvailable: initialBalance,
          beforeLocked: 0,
          afterLocked: 0,
          referenceId: `wallet_init_${normalizedUserId}`,
          metadata: {
            source: 'wallet_service.ensure_wallet',
            reason: 'initial_wallet_funding'
          },
          createdAt: now
        });
        await ledgerEntries.insertOne(ledgerDoc, { session });
      }

      return sanitizeWallet(newWallet);
    } catch (error) {
      if (error?.code !== 11000) {
        throw error;
      }

      await wallets.updateOne(
        { userId: normalizedUserId },
        {
          $set: {
            username: normalizedUsername,
            updatedAt: now
          }
        },
        { session }
      );

      const racedWallet = await wallets.findOne({ userId: normalizedUserId }, { session });
      return sanitizeWallet(racedWallet);
    }
  }

  async function applyWalletDeltaInSession({
    session,
    userId,
    username,
    initialBalance,
    deltaAvailable,
    deltaLocked,
    amount,
    type,
    currency = 'USDT',
    referenceId,
    metadata = {}
  }) {
    const normalizedUserId = ensureUserId(userId);
    const normalizedDeltaAvailable = toAmount(deltaAvailable);
    const normalizedDeltaLocked = toAmount(deltaLocked);
    const normalizedAmount = ensurePositiveAmount(amount);
    const normalizedType = String(type || '').trim().toLowerCase();

    if (!normalizedType) {
      throw createAppError('INVALID_LEDGER_TYPE', 'Ledger type is required.');
    }

    await ensureWallet(
      normalizedUserId,
      {
        username: username || normalizedUserId,
        initialBalance:
          initialBalance !== undefined
            ? toAmount(initialBalance)
            : normalizedUserId.startsWith('seed_')
              ? DEFAULT_SEED_WALLET_BALANCE
              : DEFAULT_USER_WALLET_BALANCE
      },
      session
    );

    const MAX_ATTEMPTS = 5;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
      const walletDoc = await wallets.findOne({ userId: normalizedUserId }, { session });
      if (!walletDoc) {
        throw createAppError('WALLET_NOT_FOUND', 'Wallet not found.', 404);
      }

      const beforeAvailable = resolveAvailableBalance(walletDoc);
      const beforeLocked = resolveLockedBalance(walletDoc);
      const afterAvailable = toAmount(beforeAvailable + normalizedDeltaAvailable);
      const afterLocked = toAmount(beforeLocked + normalizedDeltaLocked);

      if (afterAvailable < 0) {
        throw createAppError('INSUFFICIENT_BALANCE', 'Insufficient available balance.', 400);
      }
      if (afterLocked < 0) {
        throw createAppError('INSUFFICIENT_LOCKED_BALANCE', 'Insufficient locked balance.', 400);
      }

      const now = new Date();
      const result = await wallets.updateOne(
        {
          _id: walletDoc._id,
          availableBalance: beforeAvailable,
          $or: [{ p2pLocked: beforeLocked }, { p2pLocked: { $exists: false }, lockedBalance: beforeLocked }]
        },
        {
          $set: {
            userId: normalizedUserId,
            username: String(username || walletDoc.username || normalizedUserId).trim(),
            availableBalance: afterAvailable,
            balance: afterAvailable,
            p2pLocked: afterLocked,
            lockedBalance: afterLocked,
            updatedAt: now
          }
        },
        { session }
      );

      if (result.modifiedCount === 1) {
        const ledgerDoc = buildLedgerEntry({
          userId: normalizedUserId,
          type: normalizedType,
          amount: normalizedAmount,
          currency: String(currency || 'USDT')
            .trim()
            .toUpperCase(),
          beforeAvailable,
          afterAvailable,
          beforeLocked,
          afterLocked,
          referenceId,
          metadata,
          createdAt: now
        });

        await ledgerEntries.insertOne(ledgerDoc, { session });

        return sanitizeWallet({
          ...walletDoc,
          availableBalance: afterAvailable,
          balance: afterAvailable,
          p2pLocked: afterLocked,
          lockedBalance: afterLocked,
          updatedAt: now
        });
      }
    }

    throw createAppError('WALLET_CONFLICT', 'Wallet update conflict. Retry the operation.', 409);
  }

  async function invokeBeforeHook(payload) {
    if (!beforeOperationHook) {
      return;
    }
    await beforeOperationHook(payload);
  }

  async function invokeAfterHook(payload) {
    if (!afterOperationHook) {
      return;
    }
    await afterOperationHook(payload);
  }

  async function invokeFailedHook(payload, error) {
    if (!failedOperationHook) {
      return;
    }
    await failedOperationHook(payload, error);
  }

  async function creditAvailable(userId, amount, reference = {}) {
    const normalizedUserId = ensureUserId(userId);
    const normalizedAmount = ensurePositiveAmount(amount, 'Credit amount');
    const ref = normalizeReference(reference, 'deposit', `credit_${Date.now()}`);

    await invokeBeforeHook({
      operation: 'credit_available',
      userId: normalizedUserId,
      amount: normalizedAmount,
      referenceId: ref.referenceId,
      metadata: ref.metadata
    });

    try {
      const result = await runInTransaction(async (session) => {
        return applyWalletDeltaInSession({
          session,
          userId: normalizedUserId,
          username: ref.username,
          deltaAvailable: normalizedAmount,
          deltaLocked: 0,
          amount: normalizedAmount,
          type: ref.type || 'deposit',
          currency: ref.currency,
          referenceId: ref.referenceId,
          metadata: ref.metadata
        });
      });
      await invokeAfterHook({
        operation: 'credit_available',
        userId: normalizedUserId,
        amount: normalizedAmount,
        referenceId: ref.referenceId,
        metadata: ref.metadata
      });
      return result;
    } catch (error) {
      await logFailedBalanceAttempt(
        'credit_available',
        {
          userId: normalizedUserId,
          amount: normalizedAmount,
          referenceId: ref.referenceId,
          metadata: ref.metadata
        },
        error
      );
      await invokeFailedHook(
        {
          operation: 'credit_available',
          userId: normalizedUserId,
          amount: normalizedAmount,
          referenceId: ref.referenceId,
          metadata: ref.metadata
        },
        error
      );
      throw error;
    }
  }

  async function debitAvailable(userId, amount, reference = {}) {
    const normalizedUserId = ensureUserId(userId);
    const normalizedAmount = ensurePositiveAmount(amount, 'Debit amount');
    const ref = normalizeReference(reference, 'withdrawal', `debit_${Date.now()}`);

    await invokeBeforeHook({
      operation: 'debit_available',
      userId: normalizedUserId,
      amount: normalizedAmount,
      referenceId: ref.referenceId,
      metadata: ref.metadata
    });

    try {
      const result = await runInTransaction(async (session) => {
        return applyWalletDeltaInSession({
          session,
          userId: normalizedUserId,
          username: ref.username,
          deltaAvailable: -normalizedAmount,
          deltaLocked: 0,
          amount: normalizedAmount,
          type: ref.type || 'withdrawal',
          currency: ref.currency,
          referenceId: ref.referenceId,
          metadata: ref.metadata
        });
      });
      await invokeAfterHook({
        operation: 'debit_available',
        userId: normalizedUserId,
        amount: normalizedAmount,
        referenceId: ref.referenceId,
        metadata: ref.metadata
      });
      return result;
    } catch (error) {
      await logFailedBalanceAttempt(
        'debit_available',
        {
          userId: normalizedUserId,
          amount: normalizedAmount,
          referenceId: ref.referenceId,
          metadata: ref.metadata
        },
        error
      );
      await invokeFailedHook(
        {
          operation: 'debit_available',
          userId: normalizedUserId,
          amount: normalizedAmount,
          referenceId: ref.referenceId,
          metadata: ref.metadata
        },
        error
      );
      throw error;
    }
  }

  async function lockFunds(userId, amount, reference = {}) {
    const normalizedUserId = ensureUserId(userId);
    const normalizedAmount = ensurePositiveAmount(amount, 'Lock amount');
    const ref = normalizeReference(reference, 'trade_sell', `lock_${Date.now()}`);

    await invokeBeforeHook({
      operation: 'lock_funds',
      userId: normalizedUserId,
      amount: normalizedAmount,
      referenceId: ref.referenceId,
      metadata: ref.metadata
    });

    try {
      const result = await runInTransaction(async (session) => {
        return applyWalletDeltaInSession({
          session,
          userId: normalizedUserId,
          username: ref.username,
          deltaAvailable: -normalizedAmount,
          deltaLocked: normalizedAmount,
          amount: normalizedAmount,
          type: ref.type || 'trade_sell',
          currency: ref.currency,
          referenceId: ref.referenceId,
          metadata: {
            stage: 'lock_funds',
            ...ref.metadata
          }
        });
      });
      await invokeAfterHook({
        operation: 'lock_funds',
        userId: normalizedUserId,
        amount: normalizedAmount,
        referenceId: ref.referenceId,
        metadata: ref.metadata
      });
      return result;
    } catch (error) {
      await logFailedBalanceAttempt(
        'lock_funds',
        {
          userId: normalizedUserId,
          amount: normalizedAmount,
          referenceId: ref.referenceId,
          metadata: ref.metadata
        },
        error
      );
      await invokeFailedHook(
        {
          operation: 'lock_funds',
          userId: normalizedUserId,
          amount: normalizedAmount,
          referenceId: ref.referenceId,
          metadata: ref.metadata
        },
        error
      );
      throw error;
    }
  }

  async function unlockFunds(userId, amount, reference = {}) {
    const normalizedUserId = ensureUserId(userId);
    const normalizedAmount = ensurePositiveAmount(amount, 'Unlock amount');
    const ref = normalizeReference(reference, 'refund', `unlock_${Date.now()}`);

    await invokeBeforeHook({
      operation: 'unlock_funds',
      userId: normalizedUserId,
      amount: normalizedAmount,
      referenceId: ref.referenceId,
      metadata: ref.metadata
    });

    try {
      const result = await runInTransaction(async (session) => {
        return applyWalletDeltaInSession({
          session,
          userId: normalizedUserId,
          username: ref.username,
          deltaAvailable: normalizedAmount,
          deltaLocked: -normalizedAmount,
          amount: normalizedAmount,
          type: ref.type || 'refund',
          currency: ref.currency,
          referenceId: ref.referenceId,
          metadata: {
            stage: 'unlock_funds',
            ...ref.metadata
          }
        });
      });
      await invokeAfterHook({
        operation: 'unlock_funds',
        userId: normalizedUserId,
        amount: normalizedAmount,
        referenceId: ref.referenceId,
        metadata: ref.metadata
      });
      return result;
    } catch (error) {
      await logFailedBalanceAttempt(
        'unlock_funds',
        {
          userId: normalizedUserId,
          amount: normalizedAmount,
          referenceId: ref.referenceId,
          metadata: ref.metadata
        },
        error
      );
      await invokeFailedHook(
        {
          operation: 'unlock_funds',
          userId: normalizedUserId,
          amount: normalizedAmount,
          referenceId: ref.referenceId,
          metadata: ref.metadata
        },
        error
      );
      throw error;
    }
  }

  async function transferLockedToAvailable(fromUserId, toUserId, amount, reference = {}) {
    const normalizedFromUserId = ensureUserId(fromUserId, 'fromUserId');
    const normalizedToUserId = ensureUserId(toUserId, 'toUserId');
    const normalizedAmount = ensurePositiveAmount(amount, 'Transfer amount');

    if (normalizedFromUserId === normalizedToUserId) {
      throw createAppError('INVALID_TRANSFER', 'Source and destination wallet cannot be same.');
    }

    const ref = normalizeReference(reference, 'trade_sell', `xfer_${Date.now()}`);

    await invokeBeforeHook({
      operation: 'transfer_locked_to_available',
      userId: normalizedFromUserId,
      counterpartyUserId: normalizedToUserId,
      amount: normalizedAmount,
      referenceId: ref.referenceId,
      metadata: ref.metadata
    });

    try {
      const result = await runInTransaction(async (session) => {
        const fromWallet = await applyWalletDeltaInSession({
          session,
          userId: normalizedFromUserId,
          username: ref.fromUsername,
          deltaAvailable: 0,
          deltaLocked: -normalizedAmount,
          amount: normalizedAmount,
          type: 'trade_sell',
          currency: ref.currency,
          referenceId: ref.referenceId,
          metadata: {
            role: 'seller',
            direction: 'locked_to_release',
            ...ref.metadata
          }
        });

        const toWallet = await applyWalletDeltaInSession({
          session,
          userId: normalizedToUserId,
          username: ref.toUsername,
          deltaAvailable: normalizedAmount,
          deltaLocked: 0,
          amount: normalizedAmount,
          type: 'trade_buy',
          currency: ref.currency,
          referenceId: ref.referenceId,
          metadata: {
            role: 'buyer',
            direction: 'escrow_receive',
            ...ref.metadata
          }
        });

        return { fromWallet, toWallet };
      });
      await invokeAfterHook({
        operation: 'transfer_locked_to_available',
        userId: normalizedFromUserId,
        counterpartyUserId: normalizedToUserId,
        amount: normalizedAmount,
        referenceId: ref.referenceId,
        metadata: ref.metadata
      });
      return result;
    } catch (error) {
      await logFailedBalanceAttempt(
        'transfer_locked_to_available',
        {
          userId: normalizedFromUserId,
          counterpartyUserId: normalizedToUserId,
          amount: normalizedAmount,
          referenceId: ref.referenceId,
          metadata: ref.metadata
        },
        error
      );
      await invokeFailedHook(
        {
          operation: 'transfer_locked_to_available',
          userId: normalizedFromUserId,
          counterpartyUserId: normalizedToUserId,
          amount: normalizedAmount,
          referenceId: ref.referenceId,
          metadata: ref.metadata
        },
        error
      );
      throw error;
    }
  }

  async function adminAdjustBalance(userId, amount, reason, reference = {}) {
    const normalizedUserId = ensureUserId(userId);
    const normalizedAmount = toAmount(amount);

    if (!Number.isFinite(normalizedAmount) || normalizedAmount === 0) {
      throw createAppError('INVALID_AMOUNT', 'Admin adjustment amount must be non-zero.');
    }

    const ref = normalizeReference(reference, 'admin_adjustment', `admin_adj_${Date.now()}`);
    const adjustmentDirection = normalizedAmount > 0 ? 'credit' : 'debit';
    const absoluteAmount = toAmount(Math.abs(normalizedAmount));

    await invokeBeforeHook({
      operation: 'admin_adjust_balance',
      userId: normalizedUserId,
      amount: absoluteAmount,
      direction: adjustmentDirection,
      referenceId: ref.referenceId,
      metadata: ref.metadata
    });

    try {
      const result = await runInTransaction(async (session) => {
        const wallet = await applyWalletDeltaInSession({
          session,
          userId: normalizedUserId,
          username: ref.username,
          deltaAvailable: normalizedAmount,
          deltaLocked: 0,
          amount: absoluteAmount,
          type: 'admin_adjustment',
          currency: ref.currency,
          referenceId: ref.referenceId,
          metadata: {
            reason: String(reason || '').trim(),
            direction: adjustmentDirection,
            ...ref.metadata
          }
        });

        return wallet;
      });
      await invokeAfterHook({
        operation: 'admin_adjust_balance',
        userId: normalizedUserId,
        amount: absoluteAmount,
        direction: adjustmentDirection,
        referenceId: ref.referenceId,
        metadata: {
          reason: String(reason || '').trim(),
          ...ref.metadata
        }
      });
      return result;
    } catch (error) {
      await logFailedBalanceAttempt(
        'admin_adjust_balance',
        {
          userId: normalizedUserId,
          amount: absoluteAmount,
          referenceId: ref.referenceId,
          metadata: {
            reason: String(reason || '').trim(),
            ...ref.metadata
          }
        },
        error
      );
      await invokeFailedHook(
        {
          operation: 'admin_adjust_balance',
          userId: normalizedUserId,
          amount: absoluteAmount,
          direction: adjustmentDirection,
          referenceId: ref.referenceId,
          metadata: {
            reason: String(reason || '').trim(),
            ...ref.metadata
          }
        },
        error
      );
      throw error;
    }
  }

  async function getWallet(userId) {
    const normalizedUserId = String(userId || '').trim();
    if (!normalizedUserId) {
      return null;
    }

    const wallet = await wallets.findOne({ userId: normalizedUserId });
    return sanitizeWallet(wallet);
  }

  async function ensureSeedWallets(seedOffers = []) {
    if (!Array.isArray(seedOffers) || seedOffers.length === 0) {
      return { ensured: 0 };
    }

    let ensured = 0;
    const dedupe = new Set();

    for (const offer of seedOffers) {
      const ownerId = String(offer.createdByUserId || '').trim() || makeSeedUserId(offer.advertiser);
      if (dedupe.has(ownerId)) {
        continue;
      }
      dedupe.add(ownerId);

      const username = String(offer.createdByUsername || offer.advertiser || ownerId).trim();
      await ensureWallet(ownerId, {
        username,
        initialBalance: DEFAULT_SEED_WALLET_BALANCE
      });
      ensured += 1;
    }

    return { ensured };
  }

  async function activateMerchant({ actor, depositAmount = 200 }) {
    const actorUserId = ensureUserId(actor?.id || actor?.userId, 'actor.id');
    const actorEmail = String(actor?.email || '')
      .trim()
      .toLowerCase();
    const actorUsername = String(actor?.username || actorUserId).trim();
    const lockAmount = ensurePositiveAmount(depositAmount, 'Merchant activation deposit');
    const activationReferenceId = `merchant_activate_${actorUserId}_${Date.now()}`;

    if (!actorEmail) {
      throw createAppError('EMAIL_REQUIRED', 'Email is required for merchant activation.');
    }

    await invokeBeforeHook({
      operation: 'activate_merchant',
      userId: actorUserId,
      amount: lockAmount,
      referenceId: activationReferenceId,
      metadata: { email: actorEmail }
    });

    try {
      const activation = await runInTransaction(async (session) => {
        const credential = await p2pCredentials.findOne({ email: actorEmail }, { session });
        if (!credential) {
          throw createAppError('MERCHANT_PROFILE_NOT_FOUND', 'Merchant profile not found.', 404);
        }

        const merchantState = resolveMerchantCredentialState(credential);

        const ensuredWallet = await ensureWallet(actorUserId, { username: actorUsername }, session);
        if (ensuredWallet.availableBalance < lockAmount) {
          throw createAppError(
            'INSUFFICIENT_BALANCE',
            `Merchant activation requires at least ${lockAmount} USDT available balance.`,
            409
          );
        }

        await applyWalletDeltaInSession({
          session,
          userId: actorUserId,
          username: actorUsername,
          deltaAvailable: -lockAmount,
          deltaLocked: lockAmount,
          amount: lockAmount,
          type: 'trade_sell',
          currency: 'USDT',
          referenceId: activationReferenceId,
          metadata: {
            stage: 'merchant_activation_lock',
            email: actorEmail
          }
        });

        const activatedAt = merchantState.activatedAt || new Date();
        const nextDepositLocked = toAmount(merchantState.depositLocked + lockAmount);
        const nextMerchantLevel = merchantState.merchantLevel || 'trial';

        await p2pCredentials.updateOne(
          { _id: credential._id },
          {
            $set: {
              isMerchant: true,
              merchantDepositLocked: true,
              merchantLevel: nextMerchantLevel,
              'merchant.isMerchant': true,
              'merchant.depositLocked': nextDepositLocked,
              'merchant.level': nextMerchantLevel,
              'merchant.activatedAt': activatedAt,
              updatedAt: new Date()
            }
          },
          { session }
        );

        const [updatedCredential, updatedWallet] = await Promise.all([
          p2pCredentials.findOne({ _id: credential._id }, { session }),
          wallets.findOne({ userId: actorUserId }, { session })
        ]);
        const nextMerchantState = resolveMerchantCredentialState(updatedCredential || credential);

        return {
          merchant: {
            isMerchant: nextMerchantState.isMerchant,
            depositLocked: nextMerchantState.depositLocked,
            activatedAt: nextMerchantState.activatedAt ? nextMerchantState.activatedAt.toISOString() : null,
            level: nextMerchantState.merchantLevel
          },
          wallet: sanitizeWallet(updatedWallet || ensuredWallet)
        };
      });

      await invokeAfterHook({
        operation: 'activate_merchant',
        userId: actorUserId,
        amount: lockAmount,
        referenceId: activationReferenceId,
        metadata: { email: actorEmail }
      });
      return activation;
    } catch (error) {
      await logFailedBalanceAttempt(
        'activate_merchant',
        {
          userId: actorUserId,
          amount: lockAmount,
          referenceId: activationReferenceId,
          metadata: { email: actorEmail }
        },
        error
      );
      await invokeFailedHook(
        {
          operation: 'activate_merchant',
          userId: actorUserId,
          amount: lockAmount,
          referenceId: activationReferenceId,
          metadata: { email: actorEmail }
        },
        error
      );
      throw error;
    }
  }

  async function createEscrowAd({ actor, offerId, payload }) {
    const actorUserId = ensureUserId(actor?.id || actor?.userId, 'actor.id');
    const actorEmail = String(actor?.email || '')
      .trim()
      .toLowerCase();
    const actorUsername = String(actor?.username || actorUserId).trim();
    if (!actorEmail) {
      throw createAppError('EMAIL_REQUIRED', 'Email is required to create P2P ads.');
    }

    const normalized = normalizeP2PAdPayload(payload || {});
    const createdOfferId = String(offerId || '').trim();
    if (!createdOfferId) {
      throw createAppError('INVALID_AD_ID', 'Offer id is required.');
    }

    const referenceId = `p2p_ad_lock_${createdOfferId}`;

    return runInTransaction(async (session) => {
      await ensureWallet(
        actorUserId,
        {
          username: actorUsername,
          merchantDepositLocked: true
        },
        session
      );

      await applyWalletDeltaInSession({
        session,
        userId: actorUserId,
        username: actorUsername,
        deltaAvailable: -normalized.availableAmount,
        deltaLocked: normalized.availableAmount,
        amount: normalized.availableAmount,
        type: 'trade_sell',
        currency: normalized.asset,
        referenceId,
        metadata: {
          stage: 'p2p_ad_lock',
          offerId: createdOfferId,
          adType: normalized.adType,
          side: normalized.side
        }
      });

      const _baseCounts = [40, 113, 370, 405, 88, 215, 312, 178];
      const _baseIdx = actorUsername.split('').reduce(function(a,c){return a+c.charCodeAt(0);},0) % _baseCounts.length;
      const offerDoc = buildP2PAdDocument({
        id: createdOfferId,
        ...normalized,
        advertiser: actorUsername,
        createdByUserId: actorUserId,
        createdByUsername: actorUsername,
        createdByEmail: actorEmail,
        completionRate: 100,
        orders: 0,
        baseOrders: _baseCounts[_baseIdx]
      });

      await p2pOffers.insertOne(offerDoc, { session });

      const mapped = { ...offerDoc };
      delete mapped._id;
      return mapped;
    });
  }

  async function cleanupDemoAds(actor = {}) {
    return runInTransaction(async (session) => {
      const offers = await p2pOffers
        .find(
          {
            $or: [
              { isDemo: true },
              { environment: 'demo' },
              { fundingSource: { $ne: 'ad_locked' } },
              { createdByUserId: { $exists: false } },
              { createdByUserId: '' }
            ],
            status: { $nin: ['disabled', 'DISABLED'] }
          },
          { session }
        )
        .toArray();

      let cleanedCount = 0;
      let unlockedCount = 0;
      const now = new Date();
      const actorId = String(actor.id || actor.userId || 'admin').trim() || 'admin';
      const actorEmail = String(actor.email || '')
        .trim()
        .toLowerCase();

      for (const offer of offers) {
        const userId = String(offer.createdByUserId || '').trim();
        const unlockAmountTarget = resolveOfferLockedAmount(offer);

        if (userId && unlockAmountTarget > 0) {
          const wallet = await wallets.findOne({ userId }, { session });
          if (wallet) {
            const beforeAvailable = resolveAvailableBalance(wallet);
            const beforeLocked = resolveLockedBalance(wallet);
            const unlockAmount = toAmount(Math.min(beforeLocked, unlockAmountTarget));

            if (unlockAmount > 0) {
              const afterAvailable = toAmount(beforeAvailable + unlockAmount);
              const afterLocked = toAmount(beforeLocked - unlockAmount);

              const walletUpdate = await wallets.updateOne(
                {
                  _id: wallet._id,
                  availableBalance: beforeAvailable,
                  $or: [{ p2pLocked: beforeLocked }, { p2pLocked: { $exists: false }, lockedBalance: beforeLocked }]
                },
                {
                  $set: {
                    availableBalance: afterAvailable,
                    balance: afterAvailable,
                    p2pLocked: afterLocked,
                    lockedBalance: afterLocked,
                    updatedAt: now
                  }
                },
                { session }
              );

              if (walletUpdate.modifiedCount !== 1) {
                throw createAppError(
                  'WALLET_CONFLICT',
                  `Wallet changed while cleaning demo ad ${String(offer.id || '').trim()}.`,
                  409
                );
              }

              await ledgerEntries.insertOne(
                buildLedgerEntry({
                  userId,
                  type: 'refund',
                  amount: unlockAmount,
                  currency: String(offer.asset || 'USDT')
                    .trim()
                    .toUpperCase(),
                  beforeAvailable,
                  afterAvailable,
                  beforeLocked,
                  afterLocked,
                  referenceId: `demo_cleanup_${String(offer.id || Date.now()).trim()}`,
                  metadata: {
                    stage: 'demo_ad_cleanup_unlock',
                    offerId: String(offer.id || '').trim(),
                    actorId,
                    actorEmail
                  },
                  createdAt: now
                }),
                { session }
              );

              unlockedCount += 1;
            }
          }
        }

        await p2pOffers.updateOne(
          { _id: offer._id },
          {
            $set: {
              status: 'DISABLED',
              updatedAt: now,
              disabledReason: 'demo_cleanup',
              cleanupBy: actorId,
              cleanupAt: now
            }
          },
          { session }
        );
        cleanedCount += 1;
      }

      return { cleanedCount, unlockedCount };
    });
  }

  async function createEscrowOrder(orderInput) {
    const escrowAmount = ensurePositiveAmount(orderInput.assetAmount, 'Escrow amount');
    const orderPrice = ensurePositiveAmount(orderInput.price, 'Price');
    const fiatAmount = ensurePositiveAmount(orderInput.amountInr || orderInput.fiatAmount, 'Fiat amount');

    // ── Pre-flight checks OUTSIDE the transaction ─────────────────────────
    // Doing these before opening a session keeps the transaction lean (4 ops
    // instead of 7+) and eliminates the 30-second Render timeout risk.
    const sellerUserId = ensureUserId(orderInput.sellerUserId, 'sellerUserId');
    const buyerUserId  = ensureUserId(orderInput.buyerUserId,  'buyerUserId');
    const sellerUsername = String(orderInput.sellerUsername || sellerUserId).trim();
    const buyerUsername  = String(orderInput.buyerUsername  || buyerUserId).trim();
    const adId = String(orderInput.adId || orderInput.offerId || '').trim();
    if (!adId) {
      throw createAppError('INVALID_AD_ID', 'adId is required for order creation.');
    }

    // Ensure wallets exist before the transaction so the transaction only does
    // atomic balance work (no upsert overhead inside the session).
    console.log('[createEscrowOrder] preflight: seller', sellerUserId, 'buyer', buyerUserId, 'ad', adId, 'amount', escrowAmount);
    try {
      await ensureWallet(sellerUserId, {
        username: sellerUsername,
        initialBalance: sellerUserId.startsWith('seed_') ? DEFAULT_SEED_WALLET_BALANCE : DEFAULT_USER_WALLET_BALANCE
      });
      await ensureWallet(buyerUserId, {
        username: buyerUsername,
        initialBalance: buyerUserId.startsWith('seed_') ? DEFAULT_SEED_WALLET_BALANCE : DEFAULT_USER_WALLET_BALANCE
      });
      console.log('[createEscrowOrder] preflight: wallets OK');
    } catch (walletErr) {
      console.error('[createEscrowOrder] ensureWallet failed:', walletErr?.message || walletErr);
      throw createAppError('WALLET_SETUP_FAILED', 'Could not initialize trader wallets: ' + (walletErr?.message || 'DB error'), 503);
    }
    // ─────────────────────────────────────────────────────────────────────

    let _adRef = null; // tracked so we can rollback availableAmount on E11000

    try {
      const now = Date.now();
      console.log('[createEscrowOrder] step1: looking up offer', adId);

      const matchedOffer = await p2pOffers.findOne({ id: adId });
      if (!matchedOffer) {
        throw createAppError('AD_NOT_AVAILABLE', 'Ad not found.', 404);
      }
      if (String(matchedOffer.status || '').trim().toUpperCase() !== 'ACTIVE') {
        throw createAppError('AD_NOT_AVAILABLE', 'Ad is no longer active.', 409);
      }
      console.log('[createEscrowOrder] step2: offer found, status', matchedOffer.status);

      const currentAvailable = toAmount(matchedOffer.availableAmount ?? matchedOffer.available ?? 0);
      if (currentAvailable < escrowAmount) {
        throw createAppError('INSUFFICIENT_AD_LIQUIDITY', 'Ad does not have enough available amount.', 409);
      }
      console.log('[createEscrowOrder] step3: currentAvailable', currentAvailable, 'escrow', escrowAmount);

      // Atomic decrement — filter includes $gte so concurrent requests can't both succeed
      // unless there's genuinely enough liquidity for both
      const adUpdate = await p2pOffers.updateOne(
        { _id: matchedOffer._id, status: 'ACTIVE', availableAmount: { $gte: escrowAmount } },
        { $inc: { availableAmount: -escrowAmount, available: -escrowAmount }, $set: { updatedAt: new Date(now) } }
      );
      console.log('[createEscrowOrder] step4: adUpdate modifiedCount', adUpdate.modifiedCount);

      if (adUpdate.modifiedCount !== 1) {
        throw createAppError('AD_STATE_RACE', 'Ad is no longer active. Please try again.', 409);
      }

      // Track for rollback — set AFTER successful adUpdate so we only rollback if insertOne fails
      _adRef = matchedOffer;

      const orderDoc = {
        ...orderInput,
        adId,
        offerId: adId,
        sellerUserId,
        sellerUsername,
        buyerUserId,
        buyerUsername,
        assetAmount: escrowAmount,
        escrowAmount,
        price: orderPrice,
        amountInr: fiatAmount,
        fiatAmount,
        status: 'CREATED',
        createdAt: now,
        updatedAt: now
      };

      console.log('[createEscrowOrder] step5: inserting order', orderDoc.id);
      await p2pOrders.insertOne(orderDoc);
      console.log('[createEscrowOrder] step6: order inserted OK');

      await invokeAfterHook({
        operation: 'create_escrow_order',
        userId: String(orderInput?.sellerUserId || '').trim(),
        counterpartyUserId: String(orderInput?.buyerUserId || '').trim(),
        amount: escrowAmount,
        referenceId: String(orderInput?.reference || orderInput?.id || '').trim(),
        metadata: {
          orderId: String(orderInput?.id || '').trim(),
          offerId: String(orderInput?.offerId || '').trim()
        }
      });
      return orderDoc;

    } catch (error) {
      // E11000 = seller already has an active order (double-submit or previous timeout)
      // Rollback the availableAmount we already decremented, then return the existing order
      // so the buyer can continue with it — makes creation idempotent.
      if (error?.code === 11000 || String(error?.message || '').includes('E11000')) {
        if (_adRef) {
          try {
            await p2pOffers.updateOne(
              { _id: _adRef._id },
              { $inc: { availableAmount: escrowAmount, available: escrowAmount }, $set: { updatedAt: new Date() } }
            );
            console.log('[createEscrowOrder] rolled back availableAmount +', escrowAmount, 'for ad', adId);
          } catch (rbErr) {
            console.error('[createEscrowOrder] rollback failed:', rbErr?.message);
          }
        }
        const existingOrder = await p2pOrders.findOne({
          sellerUserId,
          status: { $in: SELLER_ACTIVE_ORDER_STATUSES }
        }).catch(() => null);
        if (existingOrder) {
          console.log('[createEscrowOrder] idempotent: returning existing active order', existingOrder.id);
          const { _id: _omit, ...cleanOrder } = existingOrder;
          return cleanOrder;
        }
        throw createAppError('ACTIVE_ORDER_EXISTS', 'You already have an active order. Please complete or cancel it first.', 409);
      }

      await logFailedBalanceAttempt(
        'create_escrow_order',
        {
          userId: orderInput?.sellerUserId,
          counterpartyUserId: orderInput?.buyerUserId,
          amount: escrowAmount,
          referenceId: String(orderInput?.reference || orderInput?.id || '').trim(),
          metadata: {
            offerId: String(orderInput?.offerId || '').trim()
          }
        },
        error
      );
      await invokeFailedHook(
        {
          operation: 'create_escrow_order',
          userId: String(orderInput?.sellerUserId || '').trim(),
          counterpartyUserId: String(orderInput?.buyerUserId || '').trim(),
          amount: escrowAmount,
          referenceId: String(orderInput?.reference || orderInput?.id || '').trim(),
          metadata: {
            offerId: String(orderInput?.offerId || '').trim()
          }
        },
        error
      );

      throw error;
    }
  }

  async function markOrderPaid(orderId, actor) {
    const userId = resolveActorUserId(actor);
    if (!userId) {
      throw createAppError('INVALID_ACTOR', 'Actor is required.');
    }

    const now = Date.now();
    const existingOrder = await p2pOrders.findOne({ id: orderId });
    if (!existingOrder) {
      throw createAppError('ORDER_NOT_FOUND', 'Order not found.', 404);
    }
    if (existingOrder.buyerUserId !== userId) {
      throw createAppError('FORBIDDEN', 'Only buyer can mark this order as paid.', 403);
    }
    if (existingOrder.status !== 'CREATED') {
      throw createAppError('INVALID_ORDER_STATUS', 'Order must be in CREATED status.');
    }
    if (Number(existingOrder.expiresAt || 0) <= now) {
      await cancelOrder(
        orderId,
        {
          userId: 'system',
          username: 'System',
          isSystem: true
        },
        'EXPIRED'
      );
      throw createAppError('ORDER_EXPIRED', 'Order has expired and was auto-cancelled.', 409);
    }

    const actorName = actor.username || 'Buyer';
    const statusResult = await p2pOrders.updateOne(
      {
        id: orderId,
        status: 'CREATED',
        buyerUserId: userId
      },
      {
        $set: {
          status: 'PAYMENT_SENT',
          updatedAt: now
        },
        $push: {
          messages: {
            $each: [
              buildP2PSystemMessage(
                now,
                'paid_buyer',
                'buyer',
                "You've marked the order as paid. Please wait for the seller to release your assets."
              ),
              buildP2PSystemMessage(
                now,
                'paid_seller',
                'seller',
                `${actorName} has marked the order as paid. Confirm that you received payment, then release the assets.`
              )
            ]
          }
        }
      }
    );

    if (statusResult.modifiedCount !== 1) {
      throw createAppError('ORDER_STATE_RACE', 'Order status changed while marking as paid.', 409);
    }

    const updated = await p2pOrders.findOne({ id: orderId });
    return updated;
  }

  async function setOrderDisputed(orderId, actor, options = {}) {
    const userId = resolveActorUserId(actor);
    if (!userId) {
      throw createAppError('INVALID_ACTOR', 'Actor is required.');
    }

    const order = await p2pOrders.findOne({ id: orderId });
    if (!order) {
      throw createAppError('ORDER_NOT_FOUND', 'Order not found.', 404);
    }
    if (![order.sellerUserId, order.buyerUserId].includes(userId)) {
      throw createAppError('FORBIDDEN', 'Only participants can raise dispute.', 403);
    }
    if (!['PENDING', 'PAID', 'PAYMENT_SENT'].includes(order.status)) {
      throw createAppError('INVALID_ORDER_STATUS', 'Only active orders can be disputed.');
    }

    const now = Date.now();
    const actorName = actor.username || 'User';
    const actorRole = order.buyerUserId === userId ? 'buyer' : 'seller';
    const otherRole = actorRole === 'buyer' ? 'seller' : 'buyer';
    const disputeReason = String(options.reason || options.appealReason || '').trim();
    const appealDetails = normalizeAppealDetails(options, actor, order);
    await p2pOrders.updateOne(
      { id: orderId },
      {
        $set: {
          status: 'DISPUTED',
          updatedAt: now,
          disputedAt: now,
          disputeStatus: 'UNDER_REVIEW',
          disputedBy: actorName,
          appealedByRole: actorRole,
          appealedByUserId: userId,
          preDisputeStatus: order.status,
          ...(disputeReason ? { disputeReason: disputeReason.slice(0, 500) } : {}),
          ...(appealDetails ? { appealDetails } : {})
        },
        $push: {
          messages: {
            $each: [
              buildP2PSystemMessage(
                now,
                'dispute_actor',
                actorRole,
                `Appeal submitted${disputeReason ? ': ' + disputeReason.slice(0, 180) : ''}. Support will review this order.`
              ),
              buildP2PSystemMessage(now, 'dispute_counterparty', otherRole, `${actorName} has filed an appeal for this order.`)
            ]
          }
        }
      }
    );

    return p2pOrders.findOne({ id: orderId });
  }

  async function releaseOrder(orderId, actor) {
    const actorId = resolveActorUserId(actor);
    if (!actorId) {
      throw createAppError('INVALID_ACTOR', 'Actor is required.');
    }

    try {
      // Non-transactional path (standalone MongoDB compatible).
      // Balance ops use optimistic retry loops inside applyWalletDeltaInSession.
      const result = await (async () => {
        const order = await p2pOrders.findOne({ id: orderId });
        if (!order) {
          throw createAppError('ORDER_NOT_FOUND', 'Order not found.', 404);
        }
        if (order.status !== 'PAYMENT_SENT') {
          throw createAppError('INVALID_ORDER_STATUS', 'Only payment-sent orders can be released.');
        }
        if (order.sellerUserId !== actorId) {
          throw createAppError('FORBIDDEN', 'Only seller can release escrow.', 403);
        }

        const now = Date.now();
        const escrowAmount = ensurePositiveAmount(order.escrowAmount || order.assetAmount, 'Escrow amount');
        const releaseReference = String(order.reference || order.id || `release_${now}`).trim();

        await applyWalletDeltaInSession({
          session: null,
          userId: order.sellerUserId,
          username: order.sellerUsername,
          deltaAvailable: 0,
          deltaLocked: -escrowAmount,
          amount: escrowAmount,
          type: 'trade_sell',
          currency: String(order.asset || 'USDT').trim().toUpperCase(),
          referenceId: releaseReference,
          metadata: {
            role: 'seller',
            direction: 'locked_to_release',
            stage: 'escrow_release',
            orderId: order.id,
            orderReference: order.reference,
            offerId: order.offerId
          }
        });

        await applyWalletDeltaInSession({
          session: null,
          userId: order.buyerUserId,
          username: order.buyerUsername,
          deltaAvailable: escrowAmount,
          deltaLocked: 0,
          amount: escrowAmount,
          type: 'trade_buy',
          currency: String(order.asset || 'USDT').trim().toUpperCase(),
          referenceId: releaseReference,
          metadata: {
            role: 'buyer',
            direction: 'escrow_receive',
            stage: 'escrow_release',
            orderId: order.id,
            orderReference: order.reference,
            offerId: order.offerId
          }
        });

        let feeAmount = 0;
        if (P2P_FEE_PERCENT > 0) {
          feeAmount = toAmount((escrowAmount * P2P_FEE_PERCENT) / 100);
          if (feeAmount > 0) {
            await applyWalletDeltaInSession({
              session: null,
              userId: order.buyerUserId,
              username: order.buyerUsername,
              deltaAvailable: -feeAmount,
              deltaLocked: 0,
              amount: feeAmount,
              type: 'fee',
              currency: String(order.asset || 'USDT').trim().toUpperCase(),
              referenceId: `${releaseReference}_fee`,
              metadata: {
                stage: 'p2p_release_fee_debit',
                orderId: order.id,
                orderReference: order.reference,
                feePercent: P2P_FEE_PERCENT
              }
            });

            await applyWalletDeltaInSession({
              session: null,
              userId: P2P_REVENUE_WALLET_USER_ID,
              username: P2P_REVENUE_WALLET_USERNAME,
              initialBalance: 0,
              deltaAvailable: feeAmount,
              deltaLocked: 0,
              amount: feeAmount,
              type: 'fee',
              currency: String(order.asset || 'USDT').trim().toUpperCase(),
              referenceId: `${releaseReference}_fee`,
              metadata: {
                stage: 'p2p_release_fee_credit',
                orderId: order.id,
                orderReference: order.reference,
                feePercent: P2P_FEE_PERCENT,
                fromUserId: order.buyerUserId
              }
            });
          }
        }

        const statusUpdate = await p2pOrders.updateOne(
          {
            id: orderId,
            status: 'PAYMENT_SENT'
          },
          {
            $set: {
              status: 'COMPLETED',
              updatedAt: now,
              completedAt: now,
              feeAmount
            },
            $push: {
              messages: {
                $each: [
                  buildP2PSystemMessage(
                    now,
                    'release_buyer',
                    'buyer',
                    `Seller released the assets. ${String(order.asset || 'USDT').toUpperCase()} has been credited to your account.`
                  ),
                  buildP2PSystemMessage(
                    now,
                    'release_seller',
                    'seller',
                    feeAmount > 0
                      ? `You've released the assets successfully. Fee deducted: ${feeAmount} ${String(order.asset || 'USDT').toUpperCase()}.`
                      : "You've released the assets successfully."
                  )
                ]
              }
            }
          }
        );

        if (statusUpdate.modifiedCount !== 1) {
          throw createAppError('ORDER_STATE_RACE', 'Order status changed during release.', 409);
        }

        return p2pOrders.findOne({ id: orderId });
      })();
      // Increment completed orders count OUTSIDE transaction so it always runs
      const _offerId = result && (result.offerId || result.adId);
      if (_offerId) {
        await p2pOffers.updateOne({ id: _offerId }, { $inc: { orders: 1 } }).catch(() => {});
      }
      await invokeAfterHook({
        operation: 'release_order',
        userId: actorId,
        referenceId: String(orderId || '').trim(),
        metadata: {
          orderId: String(orderId || '').trim()
        }
      });
      return result;
    } catch (error) {
      await logFailedBalanceAttempt(
        'release_order',
        {
          userId: actorId,
          amount: 0,
          referenceId: String(orderId || '').trim(),
          metadata: {
            orderId: String(orderId || '').trim()
          }
        },
        error
      );
      await invokeFailedHook(
        {
          operation: 'release_order',
          userId: actorId,
          referenceId: String(orderId || '').trim(),
          metadata: {
            orderId: String(orderId || '').trim()
          }
        },
        error
      );
      throw error;
    }
  }

  async function cancelOrder(orderId, actor, status = 'CANCELLED') {
    const targetStatus = status === 'EXPIRED' ? 'EXPIRED' : 'CANCELLED';
    const actorId = resolveActorUserId(actor);
    const isSystem = actor?.isSystem === true;

    try {
      // Non-transactional path (standalone MongoDB compatible).
      const result = await (async () => {
        const order = await p2pOrders.findOne({ id: orderId });
        if (!order) {
          throw createAppError('ORDER_NOT_FOUND', 'Order not found.', 404);
        }
        const allowedStatuses = targetStatus === 'EXPIRED' ? EXPIRABLE_ORDER_STATUSES : CANCELLABLE_ORDER_STATUSES;
        if (!allowedStatuses.includes(order.status)) {
          throw createAppError('INVALID_ORDER_STATUS', `Order cannot be ${targetStatus.toLowerCase()}.`);
        }

        if (!isSystem && ![order.sellerUserId, order.buyerUserId].includes(actorId)) {
          throw createAppError('FORBIDDEN', 'Only buyer/seller can cancel this order.', 403);
        }
        if (
          !isSystem &&
          targetStatus === 'CANCELLED' &&
          PAYMENT_MARKED_ORDER_STATUSES.includes(order.status) &&
          actorId !== order.buyerUserId
        ) {
          throw createAppError('FORBIDDEN', 'Only the buyer can cancel after marking payment as paid.', 403);
        }

        const now = Date.now();
        const escrowAmount = ensurePositiveAmount(order.escrowAmount || order.assetAmount, 'Escrow amount');

        const adId = String(order.adId || order.offerId || '').trim();
        if (adId) {
          const offer = await p2pOffers.findOne({ id: adId });
          if (offer) {
            const currentAvailable = toAmount(offer.availableAmount ?? offer.available ?? 0);
            const restoredAvailable = toAmount(currentAvailable + escrowAmount);
            await p2pOffers.updateOne(
              { _id: offer._id },
              {
                $set: {
                  availableAmount: restoredAvailable,
                  available: restoredAvailable,
                  updatedAt: new Date(now)
                }
              }
            );
          }
        }

        const actorName = actor?.username || (isSystem ? 'System' : 'User');
        const cancelledByBuyer = actorId && actorId === order.buyerUserId;
        const cancelledBySeller = actorId && actorId === order.sellerUserId;
        const buyerCancelText =
          targetStatus === 'EXPIRED'
            ? 'Order expired because payment was not completed in time.'
            : cancelledByBuyer
              ? "You've cancelled the order."
              : 'The seller has cancelled the order.';
        const sellerCancelText =
          targetStatus === 'EXPIRED'
            ? 'Order expired because the buyer did not complete payment in time.'
            : cancelledBySeller
              ? "You've cancelled the order."
              : 'The buyer has cancelled the order.';
        await p2pOrders.updateOne(
          {
            id: orderId,
            status: { $in: allowedStatuses }
          },
          {
            $set: {
              status: targetStatus,
              updatedAt: now
            },
            $push: {
              messages: {
                $each: [
                  buildP2PSystemMessage(now, 'cancel_buyer', 'buyer', buyerCancelText),
                  buildP2PSystemMessage(now, 'cancel_seller', 'seller', sellerCancelText)
                ]
              }
            }
          }
        );

        return p2pOrders.findOne({ id: orderId });
      })();
      await invokeAfterHook({
        operation: 'cancel_order',
        userId: actorId || 'system',
        referenceId: String(orderId || '').trim(),
        metadata: {
          orderId: String(orderId || '').trim(),
          status: targetStatus
        }
      });
      return result;
    } catch (error) {
      await logFailedBalanceAttempt(
        'cancel_order',
        {
          userId: actorId,
          amount: 0,
          referenceId: String(orderId || '').trim(),
          metadata: {
            orderId: String(orderId || '').trim(),
            status: targetStatus
          }
        },
        error
      );
      await invokeFailedHook(
        {
          operation: 'cancel_order',
          userId: actorId || 'system',
          referenceId: String(orderId || '').trim(),
          metadata: {
            orderId: String(orderId || '').trim(),
            status: targetStatus
          }
        },
        error
      );
      throw error;
    }
  }

  function normalizeWithdrawalCurrency(rawCurrency) {
    return String(rawCurrency || 'USDT')
      .trim()
      .toUpperCase();
  }

  function ensureWithdrawalAddress(rawAddress) {
    const address = String(rawAddress || '').trim();
    if (!address) {
      throw createAppError('INVALID_WITHDRAWAL_ADDRESS', 'Withdrawal address is required.');
    }
    if (address.length < 6 || address.length > 256) {
      throw createAppError('INVALID_WITHDRAWAL_ADDRESS', 'Withdrawal address format is invalid.');
    }
    return address;
  }

  function createWithdrawalRequestId() {
    return `wd_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
  }

  async function createWithdrawalRequest(userId, payload = {}) {
    const normalizedUserId = ensureUserId(userId);
    const normalizedAmount = ensurePositiveAmount(payload.amount, 'Withdrawal amount');
    const currency = normalizeWithdrawalCurrency(payload.currency);
    const address = ensureWithdrawalAddress(payload.address);
    const requestId = createWithdrawalRequestId();
    const metadata = payload.metadata && typeof payload.metadata === 'object' ? payload.metadata : {};

    await invokeBeforeHook({
      operation: 'create_withdrawal_request',
      userId: normalizedUserId,
      amount: normalizedAmount,
      referenceId: requestId,
      metadata
    });

    try {
      const created = await runInTransaction(async (session) => {
        const sixtySecondsAgo = new Date(Date.now() - 60 * 1000);
        const existingPending = await withdrawalRequests.findOne(
          {
            userId: normalizedUserId,
            currency,
            address,
            amount: normalizedAmount,
            status: 'pending',
            createdAt: { $gte: sixtySecondsAgo }
          },
          { session }
        );

        if (existingPending) {
          throw createAppError(
            'DUPLICATE_WITHDRAWAL_REQUEST',
            'Withdrawal already submitted. Please wait a moment before trying again.',
            409
          );
        }

        await applyWalletDeltaInSession({
          session,
          userId: normalizedUserId,
          username: String(payload.username || normalizedUserId).trim(),
          deltaAvailable: -normalizedAmount,
          deltaLocked: normalizedAmount,
          amount: normalizedAmount,
          type: 'withdrawal',
          currency,
          referenceId: requestId,
          metadata: {
            stage: 'withdrawal_pending_lock',
            address,
            ...metadata
          }
        });

        const doc = buildWithdrawalRequest({
          requestId,
          userId: normalizedUserId,
          amount: normalizedAmount,
          currency,
          address,
          status: 'pending',
          createdAt: new Date(),
          metadata
        });

        await withdrawalRequests.insertOne(doc, { session });
        return toWithdrawalResponse(doc);
      });

      await invokeAfterHook({
        operation: 'create_withdrawal_request',
        userId: normalizedUserId,
        amount: normalizedAmount,
        referenceId: requestId,
        metadata: {
          currency,
          address
        }
      });
      return created;
    } catch (error) {
      await logFailedBalanceAttempt(
        'create_withdrawal_request',
        {
          userId: normalizedUserId,
          amount: normalizedAmount,
          referenceId: requestId,
          metadata: {
            currency,
            address,
            ...metadata
          }
        },
        error
      );
      await invokeFailedHook(
        {
          operation: 'create_withdrawal_request',
          userId: normalizedUserId,
          amount: normalizedAmount,
          referenceId: requestId,
          metadata: {
            currency,
            address,
            ...metadata
          }
        },
        error
      );
      throw error;
    }
  }

  async function listWithdrawalRequests(userId, options = {}) {
    const normalizedUserId = ensureUserId(userId);
    const limit = Math.min(Math.max(Number(options.limit || 25), 1), 100);
    const rows = await withdrawalRequests
      .find({ userId: normalizedUserId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
    return rows.map((row) => toWithdrawalResponse(row));
  }

  async function getWithdrawalRequestById(requestId) {
    const normalizedRequestId = String(requestId || '').trim();
    if (!normalizedRequestId) {
      return null;
    }
    const row = await withdrawalRequests.findOne({ requestId: normalizedRequestId });
    return toWithdrawalResponse(row);
  }

  async function processWithdrawalRequest(requestId, status, actor = {}) {
    const normalizedRequestId = String(requestId || '').trim();
    if (!normalizedRequestId) {
      throw createAppError('INVALID_WITHDRAWAL_REQUEST_ID', 'Withdrawal request id is required.');
    }
    const targetStatus = normalizeWithdrawalStatus(status);
    const actorId = String(actor.userId || actor.id || '').trim() || 'system';
    const actorName = String(actor.username || actor.name || 'System').trim() || 'System';
    const isAdminAction = actor.isAdmin === true;

    await invokeBeforeHook({
      operation: 'process_withdrawal_request',
      userId: actorId,
      referenceId: normalizedRequestId,
      metadata: {
        status: targetStatus
      }
    });

    try {
      const processed = await runInTransaction(async (session) => {
        const request = await withdrawalRequests.findOne({ requestId: normalizedRequestId }, { session });
        if (!request) {
          throw createAppError('WITHDRAWAL_NOT_FOUND', 'Withdrawal request not found.', 404);
        }
        if (!isAdminAction && String(request.userId || '').trim() !== actorId) {
          throw createAppError('FORBIDDEN', 'You cannot process another user withdrawal request.', 403);
        }

        const amount = ensurePositiveAmount(request.amount, 'Withdrawal amount');
        const currency = normalizeWithdrawalCurrency(request.currency);
        const currentStatus = normalizeWithdrawalStatus(request.status || 'pending');

        if (currentStatus === targetStatus) {
          return toWithdrawalResponse(request);
        }

        if (targetStatus === 'approved') {
          if (!isAdminAction) {
            throw createAppError('FORBIDDEN', 'Only admin can approve withdrawal requests.', 403);
          }
          if (currentStatus !== 'pending') {
            throw createAppError('INVALID_WITHDRAWAL_STATE', 'Only pending withdrawals can be approved.');
          }
        } else if (targetStatus === 'rejected') {
          if (!['pending', 'approved'].includes(currentStatus)) {
            throw createAppError('INVALID_WITHDRAWAL_STATE', 'Only pending/approved withdrawals can be rejected.');
          }
          await applyWalletDeltaInSession({
            session,
            userId: request.userId,
            username: String(actor.username || request.userId).trim(),
            deltaAvailable: amount,
            deltaLocked: -amount,
            amount,
            type: 'refund',
            currency,
            referenceId: `${normalizedRequestId}_reject`,
            metadata: {
              stage: 'withdrawal_rejected_unlock',
              actorId,
              actorName,
              reason: String(actor.reason || '').trim()
            }
          });
        } else if (targetStatus === 'sent') {
          if (!isAdminAction) {
            throw createAppError('FORBIDDEN', 'Only admin can mark withdrawal as sent.', 403);
          }
          if (!['approved', 'pending'].includes(currentStatus)) {
            throw createAppError('INVALID_WITHDRAWAL_STATE', 'Only approved/pending withdrawals can be sent.');
          }
          await applyWalletDeltaInSession({
            session,
            userId: request.userId,
            username: String(actor.username || request.userId).trim(),
            deltaAvailable: 0,
            deltaLocked: -amount,
            amount,
            type: 'withdrawal',
            currency,
            referenceId: `${normalizedRequestId}_sent`,
            metadata: {
              stage: 'withdrawal_sent_finalize',
              actorId,
              actorName
            }
          });
        }

        const processedAt = new Date();
        await withdrawalRequests.updateOne(
          { requestId: normalizedRequestId },
          {
            $set: {
              status: targetStatus,
              processedAt,
              metadata: {
                ...(request.metadata && typeof request.metadata === 'object' ? request.metadata : {}),
                actorId,
                actorName,
                reason: String(actor.reason || '').trim()
              }
            }
          },
          { session }
        );

        const updated = await withdrawalRequests.findOne({ requestId: normalizedRequestId }, { session });
        return toWithdrawalResponse(updated);
      });

      await invokeAfterHook({
        operation: 'process_withdrawal_request',
        userId: actorId,
        referenceId: normalizedRequestId,
        metadata: {
          status: targetStatus
        }
      });
      return processed;
    } catch (error) {
      await logFailedBalanceAttempt(
        'process_withdrawal_request',
        {
          userId: actorId,
          referenceId: normalizedRequestId,
          metadata: {
            status: targetStatus
          }
        },
        error
      );
      await invokeFailedHook(
        {
          operation: 'process_withdrawal_request',
          userId: actorId,
          referenceId: normalizedRequestId,
          metadata: {
            status: targetStatus
          }
        },
        error
      );
      throw error;
    }
  }

  async function expireOrders(nowMs = Date.now()) {
    const candidates = await p2pOrders
      .find({
        status: { $in: EXPIRABLE_ORDER_STATUSES },
        expiresAt: { $lte: nowMs }
      })
      .project({ id: 1 })
      .limit(100)
      .toArray();

    let expired = 0;
    for (const order of candidates) {
      try {
        await cancelOrder(
          order.id,
          {
            userId: 'system',
            username: 'System',
            isSystem: true
          },
          'EXPIRED'
        );
        expired += 1;
      } catch (error) {
        if (!['ORDER_NOT_FOUND', 'INVALID_ORDER_STATUS'].includes(error.code)) {
          throw error;
        }
      }
    }

    return { expired };
  }

  return {
    ensureWallet,
    getWallet,
    ensureSeedWallets,
    creditAvailable,
    debitAvailable,
    lockFunds,
    unlockFunds,
    transferLockedToAvailable,
    adminAdjustBalance,
    createWithdrawalRequest,
    getWithdrawalRequestById,
    listWithdrawalRequests,
    processWithdrawalRequest,
    activateMerchant,
    createEscrowOrder,
    markOrderPaid,
    setOrderDisputed,
    releaseOrder,
    cancelOrder,
    expireOrders,
    createEscrowAd,
    cleanupDemoAds,
    makeSeedUserId,
    createAppError
  };
}

module.exports = {
  createWalletService,
  makeSeedUserId,
  createAppError
};
