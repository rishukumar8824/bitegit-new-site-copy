const { createAlertService } = require('../lib/alert-service');

describe('createAlertService', () => {
  test('sends an email through the injected sendEmail function', async () => {
    const sent = [];
    const alertService = createAlertService({
      sendEmail: async (msg) => {
        sent.push(msg);
        return { delivered: true, reason: 'sent_via_test' };
      },
      adminEmail: 'admin@bitcovex.com'
    });

    const result = await alertService.notify('test_key', 'Something broke', 'details here');
    expect(result.sent).toBe(true);
    expect(sent).toHaveLength(1);
    expect(sent[0].to).toBe('admin@bitcovex.com');
    expect(sent[0].subject).toContain('Something broke');
    expect(sent[0].text).toBe('details here');
  });

  test('does not send when adminEmail is not configured', async () => {
    const alertService = createAlertService({
      sendEmail: async () => ({ delivered: true }),
      adminEmail: ''
    });
    const result = await alertService.notify('test_key', 'subject', 'msg');
    expect(result.sent).toBe(false);
    expect(result.reason).toBe('no_email_configured');
  });

  test('dedupes repeated alerts with the same key within the interval', async () => {
    let callCount = 0;
    const alertService = createAlertService({
      sendEmail: async () => {
        callCount += 1;
        return { delivered: true };
      },
      adminEmail: 'admin@bitcovex.com',
      minIntervalMs: 10 * 60 * 1000
    });

    const first = await alertService.notify('dup_key', 'subject', 'msg');
    const second = await alertService.notify('dup_key', 'subject', 'msg');

    expect(first.sent).toBe(true);
    expect(second.sent).toBe(false);
    expect(second.reason).toBe('deduped');
    expect(callCount).toBe(1);
  });

  test('does not dedupe alerts with different keys', async () => {
    let callCount = 0;
    const alertService = createAlertService({
      sendEmail: async () => {
        callCount += 1;
        return { delivered: true };
      },
      adminEmail: 'admin@bitcovex.com',
      minIntervalMs: 10 * 60 * 1000
    });

    await alertService.notify('key_a', 'subject', 'msg');
    await alertService.notify('key_b', 'subject', 'msg');
    expect(callCount).toBe(2);
  });

  test('swallows a sendEmail error and reports it instead of throwing', async () => {
    const alertService = createAlertService({
      sendEmail: async () => {
        throw new Error('SMTP down');
      },
      adminEmail: 'admin@bitcovex.com'
    });

    const result = await alertService.notify('test_key', 'subject', 'msg');
    expect(result.sent).toBe(false);
    expect(result.reason).toContain('SMTP down');
  });
});
