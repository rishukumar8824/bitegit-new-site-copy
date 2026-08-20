const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
const { createAdminStore } = require('../admin/services/admin-store');

// KYC admin-review gates who is allowed to trade real money on the platform —
// an admin's APPROVED/REJECTED decision here is what /api/p2p/me trusts to
// decide whether a user is verified. Runs against real (in-memory) MongoDB.
let mongod;
let client;
let db;
let adminUserProfiles;
let adminKycDocuments;
let p2pKycRequests;
let p2pCredentials;
let adminStore;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  client = new MongoClient(mongod.getUri());
  await client.connect();
  db = client.db('kyc_test');

  adminUserProfiles = db.collection('admin_user_profiles');
  adminKycDocuments = db.collection('admin_kyc_documents');
  p2pKycRequests = db.collection('p2p_kyc_requests');
  p2pCredentials = db.collection('p2p_credentials');

  adminStore = createAdminStore({
    collections: {
      adminUserProfiles,
      adminKycDocuments,
      p2pKycRequests,
      p2pCredentials
    },
    repos: {
      async getP2PCredentialByUserId(userId) {
        return p2pCredentials.findOne({ userId });
      },
      async updateP2PCredentialKyc(email, patch) {
        const kycStatus = patch.status === 'APPROVED' ? 'VERIFIED'
          : patch.status === 'REJECTED' ? 'REJECTED'
          : 'PENDING_REVIEW';
        await p2pCredentials.updateOne(
          { email },
          { $set: { kycStatus, kycRejectionReason: patch.rejectionReason || '' } }
        );
      }
    },
    walletService: null,
    tokenService: null,
    isDbConnected: () => true
  });
}, 60000);

afterAll(async () => {
  if (client) await client.close();
  if (mongod) await mongod.stop();
});

afterEach(async () => {
  await adminUserProfiles.deleteMany({});
  await adminKycDocuments.deleteMany({});
  await p2pKycRequests.deleteMany({});
  await p2pCredentials.deleteMany({});
});

describe('getUserKyc', () => {
  test('falls back to NOT_SUBMITTED when nothing exists yet', async () => {
    const kyc = await adminStore.getUserKyc('usr_new');
    expect(kyc.kycStatus).toBe('NOT_SUBMITTED');
  });

  test('reflects the submitted request status before any admin review', async () => {
    await p2pKycRequests.insertOne({ userId: 'usr_alice', status: 'PENDING_REVIEW' });
    const kyc = await adminStore.getUserKyc('usr_alice');
    expect(kyc.kycStatus).toBe('PENDING_REVIEW');
  });
});

describe('reviewKyc', () => {
  test('rejects an invalid decision value', async () => {
    await expect(adminStore.reviewKyc('usr_alice', 'MAYBE', '')).rejects.toThrow(
      'Invalid KYC decision'
    );
  });

  test('approving sets kycStatus to APPROVED on the admin profile', async () => {
    await p2pKycRequests.insertOne({ userId: 'usr_alice', status: 'PENDING_REVIEW' });
    const result = await adminStore.reviewKyc('usr_alice', 'approved', 'Looks good');

    expect(result.kycStatus).toBe('APPROVED');
    expect(result.remarks).toBe('Looks good');

    const profile = await adminUserProfiles.findOne({ userId: 'usr_alice' });
    expect(profile.kycStatus).toBe('APPROVED');
  });

  test('approving syncs p2p_credentials so /api/p2p/me sees VERIFIED', async () => {
    await p2pKycRequests.insertOne({ userId: 'usr_bob', status: 'PENDING_REVIEW', email: 'bob@example.com' });
    await p2pCredentials.insertOne({ userId: 'usr_bob', email: 'bob@example.com', kycStatus: 'PENDING_REVIEW' });

    await adminStore.reviewKyc('usr_bob', 'APPROVED', '');

    const cred = await p2pCredentials.findOne({ email: 'bob@example.com' });
    expect(cred.kycStatus).toBe('VERIFIED');
  });

  test('rejecting syncs p2p_credentials to REJECTED with the given reason', async () => {
    await p2pKycRequests.insertOne({ userId: 'usr_carol', status: 'PENDING_REVIEW', email: 'carol@example.com' });
    await p2pCredentials.insertOne({ userId: 'usr_carol', email: 'carol@example.com', kycStatus: 'PENDING_REVIEW' });

    await adminStore.reviewKyc('usr_carol', 'REJECTED', 'Blurry document photo');

    const cred = await p2pCredentials.findOne({ email: 'carol@example.com' });
    expect(cred.kycStatus).toBe('REJECTED');
    expect(cred.kycRejectionReason).toBe('Blurry document photo');
  });

  test('re-reviewing an already-decided user overwrites the previous decision', async () => {
    await p2pKycRequests.insertOne({ userId: 'usr_dave', status: 'PENDING_REVIEW' });
    await adminStore.reviewKyc('usr_dave', 'REJECTED', 'Bad photo');
    let kyc = await adminStore.getUserKyc('usr_dave');
    expect(kyc.kycStatus).toBe('REJECTED');

    await adminStore.reviewKyc('usr_dave', 'APPROVED', 'Resubmitted, now fine');
    kyc = await adminStore.getUserKyc('usr_dave');
    expect(kyc.kycStatus).toBe('APPROVED');
    expect(kyc.remarks).toBe('Resubmitted, now fine');
  });
});

describe('getKycDocuments', () => {
  test('throws when userId is missing', async () => {
    await expect(adminStore.getKycDocuments('')).rejects.toThrow('userId is required');
  });

  test('returns PENDING with no documents when nothing was submitted', async () => {
    const docs = await adminStore.getKycDocuments('usr_new');
    expect(docs.status).toBe('PENDING');
    expect(docs.aadhaarFront).toBeNull();
  });

  test('reflects submitted request fields even before review', async () => {
    await p2pKycRequests.insertOne({
      userId: 'usr_eve',
      status: 'PENDING_REVIEW',
      fullName: 'Eve Example',
      aadhaarMasked: 'XXXX-XXXX-1234'
    });
    const docs = await adminStore.getKycDocuments('usr_eve');
    expect(docs.status).toBe('PENDING_REVIEW');
    expect(docs.fullName).toBe('Eve Example');
    expect(docs.aadhaarLast4).toBe('1234');
  });
});
