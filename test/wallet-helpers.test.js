const { ensurePositiveAmount, ensureUserId, createAppError, makeSeedUserId } = require('../lib/wallet-service');

describe('ensurePositiveAmount', () => {
  test('accepts a positive number', () => {
    expect(ensurePositiveAmount(50)).toBe(50);
  });

  test('accepts a positive numeric string', () => {
    expect(ensurePositiveAmount('12.5')).toBe(12.5);
  });

  test('rejects zero', () => {
    expect(() => ensurePositiveAmount(0)).toThrow('must be greater than 0');
  });

  test('rejects negative amounts', () => {
    expect(() => ensurePositiveAmount(-10)).toThrow('must be greater than 0');
  });

  test('rejects NaN / garbage input', () => {
    expect(() => ensurePositiveAmount('not-a-number')).toThrow('must be greater than 0');
  });

  test('uses the custom field name in the error message', () => {
    expect(() => ensurePositiveAmount(-5, 'Withdrawal amount')).toThrow('Withdrawal amount must be greater than 0');
  });
});

describe('ensureUserId', () => {
  test('accepts a non-empty userId and trims it', () => {
    expect(ensureUserId('  usr_123  ')).toBe('usr_123');
  });

  test('rejects an empty userId', () => {
    expect(() => ensureUserId('')).toThrow('is required');
  });

  test('rejects a whitespace-only userId', () => {
    expect(() => ensureUserId('   ')).toThrow('is required');
  });
});

describe('createAppError', () => {
  test('builds an error with code, message, and status', () => {
    const err = createAppError('INSUFFICIENT_BALANCE', 'Not enough funds.', 400);
    expect(err).toBeInstanceOf(Error);
    expect(err.code).toBe('INSUFFICIENT_BALANCE');
    expect(err.message).toBe('Not enough funds.');
    expect(err.status).toBe(400);
  });

  test('defaults status to 400 when not provided', () => {
    const err = createAppError('SOME_ERROR', 'Something went wrong.');
    expect(err.status).toBe(400);
  });
});

describe('makeSeedUserId', () => {
  test('is deterministic for the same advertiser name', () => {
    expect(makeSeedUserId('Trader One')).toBe(makeSeedUserId('Trader One'));
  });

  test('slugifies the advertiser name', () => {
    expect(makeSeedUserId('Trader One')).toBe('seed_trader_one');
  });

  test('falls back to "marketmaker" for empty input', () => {
    expect(makeSeedUserId('')).toBe('seed_marketmaker');
  });
});
