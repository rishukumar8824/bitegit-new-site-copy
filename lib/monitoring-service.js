// Periodic sweep that turns silent DB state into alerts: a withdrawal that
// never left "pending", or a burst of failed balance operations against the
// same user (either a bug or someone probing the wallet endpoints).

function createMonitoringService({
  withdrawalRequests,
  walletFailures,
  alertService,
  stuckWithdrawalThresholdMs = 30 * 60 * 1000,
  fraudFailureThreshold = 5,
  fraudWindowMs = 10 * 60 * 1000
} = {}) {
  if (!withdrawalRequests || !walletFailures || !alertService) {
    throw new Error('withdrawalRequests, walletFailures and alertService are required.');
  }

  async function checkStuckWithdrawals() {
    const cutoff = new Date(Date.now() - stuckWithdrawalThresholdMs);
    const stuck = await withdrawalRequests
      .find({ status: 'pending', createdAt: { $lte: cutoff } })
      .toArray();

    if (stuck.length === 0) {
      return { stuckCount: 0 };
    }

    const summary = stuck
      .slice(0, 20)
      .map((w) => `  - ${w.requestId} | user=${w.userId} | ${w.amount} ${w.currency} | since ${new Date(w.createdAt).toISOString()}`)
      .join('\n');

    await alertService.notify(
      'stuck_withdrawals',
      `${stuck.length} withdrawal request(s) stuck in pending`,
      `${stuck.length} withdrawal(s) have been pending for over ${Math.round(stuckWithdrawalThresholdMs / 60000)} minutes:\n${summary}`
    );

    return { stuckCount: stuck.length };
  }

  async function checkFraudPatterns() {
    const cutoff = new Date(Date.now() - fraudWindowMs);
    const rows = await walletFailures
      .aggregate([
        { $match: { createdAt: { $gte: cutoff } } },
        { $group: { _id: '$userId', count: { $sum: 1 } } },
        { $match: { count: { $gte: fraudFailureThreshold } } }
      ])
      .toArray();

    if (rows.length === 0) {
      return { flaggedUsers: 0 };
    }

    const summary = rows.map((r) => `  - user=${r._id}: ${r.count} failed balance operations`).join('\n');
    await alertService.notify(
      'fraud_pattern_failed_balance_ops',
      `${rows.length} user(s) with repeated failed balance operations`,
      `${rows.length} user(s) hit ${fraudFailureThreshold}+ failed balance operations in the last ${Math.round(fraudWindowMs / 60000)} minutes:\n${summary}`
    );

    return { flaggedUsers: rows.length };
  }

  async function runMonitoringSweep() {
    const [stuckResult, fraudResult] = await Promise.all([
      checkStuckWithdrawals().catch((error) => {
        console.error('[monitoring] checkStuckWithdrawals failed:', error?.message || error);
        return { stuckCount: 0, error: error?.message };
      }),
      checkFraudPatterns().catch((error) => {
        console.error('[monitoring] checkFraudPatterns failed:', error?.message || error);
        return { flaggedUsers: 0, error: error?.message };
      })
    ]);
    return { ...stuckResult, ...fraudResult };
  }

  return {
    checkStuckWithdrawals,
    checkFraudPatterns,
    runMonitoringSweep
  };
}

module.exports = {
  createMonitoringService
};
