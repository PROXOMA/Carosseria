const test = require('node:test');
const assert = require('node:assert/strict');
const contact = require('../scripts/contact-form.js');

const entries = [
  ['email', 'a@b.pl'],
  ['Tytuł wiadomości', 'Błotnik'],
  ['Marka pojazdu', 'Volvo'],
  ['Model pojazdu', 'V60'],
  ['Rocznik', '2018'],
  ['Typ nadwozia', 'Kombi'],
  ['Pojemność silnika i rodzaj paliwa', '2.0 Diesel'],
  ['Treść wiadomości', 'Szukam lewego błotnika']
];

function harness(fetchImpl, options = {}) {
  const form = {
    action: 'https://formsubmit.co/carosseria-parts@wp.pl',
    resetCalls: 0,
    checkValidity: () => options.valid !== false,
    reportValidityCalls: 0,
    reportValidity() { this.reportValidityCalls++; },
    reset() { this.resetCalls++; }
  };
  const status = { textContent: '', className: 'form-status' };
  const button = { disabled: false };
  const payload = new Map(entries);
  const controller = contact.createController({
    form,
    status,
    button,
    fetchImpl,
    getMessage: key => `translated:${key}`,
    createFormData: () => payload
  });
  return { controller, form, status, button, payload };
}

test('posts all eight fields to the AJAX endpoint and resets only after confirmed success', async () => {
  let request;
  const h = harness(async (url, options) => {
    request = { url, options };
    return { ok: true, json: async () => ({ success: 'true' }) };
  });
  await h.controller.submit({ preventDefault() {} });
  assert.equal(request.url, 'https://formsubmit.co/ajax/carosseria-parts@wp.pl');
  assert.equal(request.options.method, 'POST');
  assert.equal(request.options.headers.Accept, 'application/json');
  assert.equal(request.options.headers['Content-Type'], undefined);
  assert.deepEqual([...request.options.body.entries()], entries);
  assert.equal(h.form.resetCalls, 1);
  assert.equal(h.status.textContent, 'translated:status.success');
  assert.equal(h.status.className, 'form-status is-success');
});

test('does not request when browser validation fails', async () => {
  let calls = 0;
  const h = harness(async () => { calls++; }, { valid: false });
  await h.controller.submit({ preventDefault() {} });
  assert.equal(calls, 0);
  assert.equal(h.form.reportValidityCalls, 1);
});

test('preserves values and reports errors for rejected requests', async () => {
  const h = harness(async () => { throw Error('offline'); });
  await h.controller.submit({ preventDefault() {} });
  assert.equal(h.form.resetCalls, 0);
  assert.equal(h.status.textContent, 'translated:status.error');
  assert.equal(h.status.className, 'form-status is-error');
  assert.equal(h.button.disabled, false);
});

test('non-2xx, malformed and explicit failure responses are not successes', async () => {
  const responses = [
    { ok: false, json: async () => ({}) },
    { ok: true, json: async () => { throw Error('bad json'); } },
    { ok: true, json: async () => ({ success: 'false' }) }
  ];
  for (const response of responses) {
    const h = harness(async () => response);
    await h.controller.submit({ preventDefault() {} });
    assert.equal(h.form.resetCalls, 0);
    assert.equal(h.status.textContent, 'translated:status.error');
  }
});

test('ignores a second submission while the first is pending', async () => {
  let release;
  let calls = 0;
  const h = harness(() => {
    calls++;
    return new Promise(resolve => { release = resolve; });
  });
  const first = h.controller.submit({ preventDefault() {} });
  const second = h.controller.submit({ preventDefault() {} });
  assert.equal(calls, 1);
  release({ ok: true, json: async () => ({ success: 'true' }) });
  await Promise.all([first, second]);
});

test('refreshMessage re-renders the current status in the active language', async () => {
  let language = 'pl';
  const h = harness(async () => ({ ok: true, json: async () => ({ success: true }) }));
  h.controller = contact.createController({
    form: h.form,
    status: h.status,
    button: h.button,
    fetchImpl: async () => ({ ok: true, json: async () => ({ success: true }) }),
    getMessage: key => `${language}:${key}`,
    createFormData: () => h.payload
  });
  await h.controller.submit({ preventDefault() {} });
  language = 'de';
  h.controller.refreshMessage();
  assert.equal(h.status.textContent, 'de:status.success');
});
