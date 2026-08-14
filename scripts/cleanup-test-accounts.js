#!/usr/bin/env node
/**
 * One-off cleanup: find (and, with --confirm, delete) every document
 * belonging to the given test-account emails across all collections.
 *
 * Usage:
 *   node scripts/cleanup-test-accounts.js               # dry run, prints counts only
 *   node scripts/cleanup-test-accounts.js --confirm      # actually deletes
 *
 * Run this where MONGODB_URI is already set (e.g. Render Shell for this
 * service) — it does not read/require a local .env value.
 */
const crypto = require('crypto');
const { connectToMongo, getCollections } = require('../lib/db');

const TARGET_EMAILS = [
  'sumitkunwal8824@gmail.com',
  'sumitkmina8824@gmail.com'
];

function makeP2PUserId(email) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const userHash = crypto.createHash('sha1').update(normalizedEmail).digest('hex').slice(0, 16);
  return `usr_${userHash}`;
}

async function main() {
  const confirm = process.argv.includes('--confirm');
  await connectToMongo();
  const col = getCollections();

  const targets = TARGET_EMAILS.map((email) => ({
    email: email.trim().toLowerCase(),
    userId: makeP2PUserId(email)
  }));
  const emails = targets.map((t) => t.email);
  const userIds = targets.map((t) => t.userId);

  console.log('Target emails:', emails);
  console.log('Derived userIds:', userIds);
  console.log(`Mode: ${confirm ? 'DELETE (--confirm passed)' : 'DRY RUN (no data will be removed)'}\n`);

  const plan = [
    { name: 'p2pCredentials', collection: col.p2pCredentials, filter: { $or: [{ email: { $in: emails } }, { userId: { $in: userIds } }] } },
    { name: 'adminUserProfiles', collection: col.adminUserProfiles, filter: { userId: { $in: userIds } } },
    { name: 'refreshTokens', collection: col.refreshTokens, filter: { $or: [{ email: { $in: emails } }, { userId: { $in: userIds } }] } },
    { name: 'p2pKycRequests', collection: col.p2pKycRequests, filter: { userId: { $in: userIds } } },
    { name: 'p2pUserSessions', collection: col.p2pUserSessions, filter: { userId: { $in: userIds } } },
    { name: 'wallets', collection: col.wallets, filter: { userId: { $in: userIds } } },
    { name: 'ledgerEntries', collection: col.ledgerEntries, filter: { userId: { $in: userIds } } },
    { name: 'walletFailures', collection: col.walletFailures, filter: { $or: [{ userId: { $in: userIds } }, { counterpartyUserId: { $in: userIds } }] } },
    { name: 'withdrawalRequests', collection: col.withdrawalRequests, filter: { $or: [{ email: { $in: emails } }, { userId: { $in: userIds } }] } },
    { name: 'auditLogs', collection: col.auditLogs, filter: { userId: { $in: userIds } } },
    { name: 'p2pOffers', collection: col.p2pOffers, filter: { createdByUserId: { $in: userIds } } },
    {
      name: 'p2pOrders',
      collection: col.p2pOrders,
      filter: {
        $or: [
          { buyerUserId: { $in: userIds } }, { buyerId: { $in: userIds } },
          { sellerUserId: { $in: userIds } }, { sellerId: { $in: userIds } }
        ]
      }
    },
    { name: 'tradeOrders', collection: col.tradeOrders, filter: { userId: { $in: userIds } } },
    { name: 'merchantApplications', collection: col.merchantApplications, filter: { $or: [{ email: { $in: emails } }, { userId: { $in: userIds } }] } },
    { name: 'p2pPaymentMethods', collection: col.p2pPaymentMethods, filter: { userId: { $in: userIds } } },
    {
      name: 'p2pRatings',
      collection: col.p2pRatings,
      filter: { $or: [{ raterId: { $in: userIds } }, { rateeId: { $in: userIds } }, { targetUserId: { $in: userIds } }] }
    },
    {
      name: 'p2pBlockedUsers',
      collection: col.p2pBlockedUsers,
      filter: { $or: [{ blockerId: { $in: userIds } }, { blockedId: { $in: userIds } }] }
    },
    { name: 'deviceTokens', collection: col.deviceTokens, filter: { userId: { $in: userIds } } },
    { name: 'signupOtps', collection: col.signupOtps, filter: { contact: { $in: emails } } },
    { name: 'adminKycDocuments', collection: col.adminKycDocuments, filter: { userId: { $in: userIds } } }
  ];

  let totalFound = 0;
  let totalDeleted = 0;

  for (const step of plan) {
    if (!step.collection) {
      console.log(`[skip] ${step.name}: collection not found in getCollections()`);
      continue;
    }
    const count = await step.collection.countDocuments(step.filter);
    totalFound += count;
    if (count === 0) {
      console.log(`${step.name}: 0`);
      continue;
    }
    if (confirm) {
      const res = await step.collection.deleteMany(step.filter);
      totalDeleted += res.deletedCount;
      console.log(`${step.name}: ${count} found -> ${res.deletedCount} deleted`);
    } else {
      const samples = await step.collection.find(step.filter).limit(2).toArray();
      console.log(`${step.name}: ${count} found (sample _id(s): ${samples.map((d) => d._id).join(', ')})`);
    }
  }

  console.log(`\nTotal documents found: ${totalFound}`);
  if (confirm) {
    console.log(`Total documents deleted: ${totalDeleted}`);
  } else {
    console.log('Dry run only — re-run with --confirm to actually delete these documents.');
  }

  process.exit(0);
}

main().catch((err) => {
  console.error('Cleanup script failed:', err);
  process.exit(1);
});
