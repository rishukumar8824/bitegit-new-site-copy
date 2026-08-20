const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
const { createMonitoringService } = require('../lib/monitoring-service');

let mongod;
let client;
let db;
let withdrawalRequests;
let walletFailures;

function fakeAlertService() {
  const calls = [];
  return {
    calls,
    async notify(key, subject, message) {
      calls.push({ key, subject, message });
      return { sent: true };
    }
  };
}

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  client = new MongoClient(mongod.getUri());
  await client.connect();
  db = client.db('monitoring_test');
  withdrawalRequests = db.collection('withdrawal_requests');
  walletFailures = db.collection('wallet_failures');
}, 60000);

afterAll(async () => {
  if (client) await client.close();
  if (mongod) await mongod.stop();
});

afterEach(async () => {
  await withdrawalRequests.deleteMany({});
  await walletFailures.deleteMany({});
});

describe('checkStuckWithdrawals', () => {
  test('alerts when a pending withdrawal is older than the threshold', async () => {
    await withdrawalRequests.insertOne({
      requestId: 'wd_1',
      userId: 'usr_alice',
      amount: 100,
      currency: 'USDT',
      status: 'pending',
      createdAt: new Date(Date.now() - 60 * 60 * 1000)
    });

    const alertService = fakeAlertService();
    const monitoringService = createMonitoringService({
      withdrawalRequests,
      walletFailures,
      alertService,
      stuckWithdrawalThresholdMs: 30 * 60 * 1000
    });

    const result = await monitoringService.checkStuckWithdrawals();
    expect(result.stuckCount).toBe(1);
    expect(alertService.calls).toHaveLength(1);
    expect(alertService.calls[0].key).toBe('stuck_withdrawals');
    expect(alertService.calls[0].message).toContain('wd_1');
  });

  test('does not alert for a recent pending withdrawal', async () => {
    await withdrawalRequests.insertOne({
      requestId: 'wd_2',
      userId: 'usr_bob',
      amount: 50,
      currency: 'USDT',
      status: 'pending',
      createdAt: new Date()
    });

    const alertService = fakeAlertService();
    const monitoringService = createMonitoringService({
      withdrawalRequests,
      walletFailures,
      alertService,
      stuckWithdrawalThresholdMs: 30 * 60 * 1000
    });

    const result = await monitoringService.checkStuckWithdrawals();
    expect(result.stuckCount).toBe(0);
    expect(alertService.calls).toHaveLength(0);
  });

  test('does not alert for a completed withdrawal even if old', async () => {
    await withdrawalRequests.insertOne({
      requestId: 'wd_3',
      userId: 'usr_carol',
      amount: 20,
      currency: 'USDT',
      status: 'completed',
      createdAt: new Date(Date.now() - 60 * 60 * 1000)
    });

    const alertService = fakeAlertService();
    const monitoringService = createMonitoringService({
      withdrawalRequests,
      walletFailures,
      alertService,
      stuckWithdrawalThresholdMs: 30 * 60 * 1000
    });

    const result = await monitoringService.checkStuckWithdrawals();
    expect(result.stuckCount).toBe(0);
  });
});

describe('checkFraudPatterns', () => {
  test('alerts when a user crosses the failure threshold within the window', async () => {
    const now = new Date();
    const docs = Array.from({ length: 5 }, (_, i) => ({
      operation: 'debit_available',
      userId: 'usr_suspect',
      reason: 'Insufficient balance',
      createdAt: new Date(now.getTime() - i * 1000)
    }));
    await walletFailures.insertMany(docs);

    const alertService = fakeAlertService();
    const monitoringService = createMonitoringService({
      withdrawalRequests,
      walletFailures,
      alertService,
      fraudFailureThreshold: 5,
      fraudWindowMs: 10 * 60 * 1000
    });

    const result = await monitoringService.checkFraudPatterns();
    expect(result.flaggedUsers).toBe(1);
    expect(alertService.calls).toHaveLength(1);
    expect(alertService.calls[0].message).toContain('usr_suspect');
  });

  test('does not alert when failures are below the threshold', async () => {
    await walletFailures.insertMany([
      { userId: 'usr_normal', createdAt: new Date() },
      { userId: 'usr_normal', createdAt: new Date() }
    ]);

    const alertService = fakeAlertService();
    const monitoringService = createMonitoringService({
      withdrawalRequests,
      walletFailures,
      alertService,
      fraudFailureThreshold: 5
    });

    const result = await monitoringService.checkFraudPatterns();
    expect(result.flaggedUsers).toBe(0);
    expect(alertService.calls).toHaveLength(0);
  });

  test('ignores failures outside the detection window', async () => {
    const stale = Array.from({ length: 5 }, () => ({
      userId: 'usr_old_burst',
      createdAt: new Date(Date.now() - 60 * 60 * 1000)
    }));
    await walletFailures.insertMany(stale);

    const alertService = fakeAlertService();
    const monitoringService = createMonitoringService({
      withdrawalRequests,
      walletFailures,
      alertService,
      fraudFailureThreshold: 5,
      fraudWindowMs: 10 * 60 * 1000
    });

    const result = await monitoringService.checkFraudPatterns();
    expect(result.flaggedUsers).toBe(0);
  });
});

describe('runMonitoringSweep', () => {
  test('runs both checks and survives one of them throwing', async () => {
    await withdrawalRequests.insertOne({
      requestId: 'wd_4',
      userId: 'usr_dave',
      amount: 10,
      currency: 'USDT',
      status: 'pending',
      createdAt: new Date(Date.now() - 60 * 60 * 1000)
    });

    const alertService = fakeAlertService();
    const monitoringService = createMonitoringService({
      withdrawalRequests,
      // A collection whose aggregate() rejects simulates a DB hiccup on one check —
      // the other check must still run and the sweep must not throw.
      walletFailures: { aggregate: () => ({ toArray: () => Promise.reject(new Error('boom')) }) },
      alertService,
      stuckWithdrawalThresholdMs: 30 * 60 * 1000
    });

    const result = await expect(monitoringService.runMonitoringSweep()).resolves.toBeDefined();
    const finalResult = await monitoringService.runMonitoringSweep();
    expect(finalResult.stuckCount).toBe(1);
    expect(finalResult.flaggedUsers).toBe(0);
  });
});
