# Issue #1 Contact Form and Internationalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace VehiclesDB with a complete manual contact form and deliver a responsive, single-URL interface in Polish, English, French, Ukrainian, Russian, German, and Lithuanian.

**Architecture:** Keep the site dependency-free and static. Put pure language selection and translation data in `scripts/i18n.js`, browser wiring in the same focused module, form request construction and submission in `scripts/contact-form.js`, and the unrelated compact-header behavior in `scripts/site.js`; exercise pure behavior with Node's built-in test runner and verify markup contracts statically.

**Tech Stack:** HTML5, CSS3, browser JavaScript, FormSubmit AJAX API, Node.js `node:test` and `assert/strict`.

**Spec:** `docs/superpowers/specs/2026-09-20-issue-1-contact-form-i18n-design.md`

## Global Constraints

- Keep one `index.html` document at one public URL.
- Support exactly PL, EN, FR, UK, RU, DE, and LT; use the browser preference only on the first visit and fall back to PL.
- A valid manual choice stored in `localStorage` overrides browser preferences.
- Translate every visible interface string and accessibility label except CAROSSERIA, Allegro, OVOKO, postal/email addresses, and phone numbers.
- Keep submitted field names stable and descriptive regardless of interface language.
- Do not add runtime dependencies or a build step.
- Keep the page responsive on desktop, iPhone-sized, and iPad-sized viewports.
- Treat a request as successful only after a successful FormSubmit response.

## Review Focus

- Browser preferences such as `en-US`, `uk-UA`, or an unsupported locale must normalize to EN, UK, or PL respectively; Task 1 tests all three.
- Corrupt, unsupported, or unavailable `localStorage` must never prevent rendering; Task 1 tests invalid storage and storage exceptions.
- A translation key missing from a non-Polish dictionary must render the Polish value, never `undefined`; Task 1 tests the fallback.
- Network rejection, non-2xx response, and malformed success payload must preserve form values and show an error; Task 3 tests each failure class.
- Repeated submit events while one request is pending must create exactly one request; Task 3 tests the in-flight guard.

---

### Task 1: Language core and complete dictionaries

**Files:**
- Create: `scripts/i18n.js`
- Create: `tests/i18n.test.js`

**Interfaces:**
- Produces: `CarosseriaI18n.SUPPORTED_LANGUAGES: readonly string[]`, `normalizeLanguage(value: string): string`, `selectInitialLanguage(storage: StorageLike, browserLanguages: string[]): string`, `translate(language: string, key: string): string`, `applyLanguage(document: Document, language: string): string`, and `initI18n(window: Window): void`.
- Emits: `document` event `carosseria:languagechange` with `detail.language` after applying a language.

- [ ] **Step 1: Write failing tests for language normalization and selection**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const i18n = require('../scripts/i18n.js');

test('normalizes regional codes and falls back to Polish', () => {
  assert.equal(i18n.normalizeLanguage('en-US'), 'en');
  assert.equal(i18n.normalizeLanguage('uk-UA'), 'uk');
  assert.equal(i18n.normalizeLanguage('es-ES'), 'pl');
});

test('stored manual choice wins over browser preferences', () => {
  const storage = { getItem: () => 'de' };
  assert.equal(i18n.selectInitialLanguage(storage, ['fr-FR']), 'de');
});

test('invalid or inaccessible storage safely uses browser preference', () => {
  assert.equal(i18n.selectInitialLanguage({ getItem: () => 'xx' }, ['lt-LT']), 'lt');
  assert.equal(i18n.selectInitialLanguage({ getItem: () => { throw Error('blocked'); } }, ['ru']), 'ru');
});
```

- [ ] **Step 2: Run the tests and verify the expected failure**

Run: `node --test tests/i18n.test.js`

Expected: FAIL because `scripts/i18n.js` does not exist.

- [ ] **Step 3: Implement exports, normalization, safe storage, and Polish fallback lookup**

```js
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.CarosseriaI18n = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const SUPPORTED_LANGUAGES = Object.freeze(['pl', 'en', 'fr', 'uk', 'ru', 'de', 'lt']);
  const translations = { pl: {}, en: {}, fr: {}, uk: {}, ru: {}, de: {}, lt: {} };
  const normalizeLanguage = value => {
    const code = String(value || '').toLowerCase().split('-')[0];
    return SUPPORTED_LANGUAGES.includes(code) ? code : 'pl';
  };
  function selectInitialLanguage(storage, browserLanguages) {
    try {
      const stored = storage && storage.getItem('carosseria-language');
      if (SUPPORTED_LANGUAGES.includes(stored)) return stored;
    } catch (_) {}
    const match = (browserLanguages || []).map(normalizeLanguage)
      .find((code, index) => code !== 'pl' || String(browserLanguages[index] || '').toLowerCase().startsWith('pl'));
    return match || 'pl';
  }
  function translate(language, key) {
    const selected = translations[normalizeLanguage(language)] || translations.pl;
    return selected[key] ?? translations.pl[key] ?? '';
  }
  return { SUPPORTED_LANGUAGES, translations, normalizeLanguage, selectInitialLanguage, translate };
});
```

- [ ] **Step 4: Add the complete Polish key set and all six complete translations**

Define keys grouped as `meta.*`, `nav.*`, `hero.*`, `features.*`, `shops.*`, `offer.*`, `gallery.*`, `order.*`, `contact.*`, `form.*`, `status.*`, and `footer.*`. Include normal text, placeholders, image `alt` values, iframe/title text, language-switcher label, and success/error/sending states. Preserve intentional inline emphasis by splitting headings into separate keys rather than storing HTML.

- [ ] **Step 5: Add completeness and fallback tests**

```js
test('every language contains the complete Polish key set', () => {
  const required = Object.keys(i18n.translations.pl).sort();
  for (const language of i18n.SUPPORTED_LANGUAGES) {
    assert.deepEqual(Object.keys(i18n.translations[language]).sort(), required, language);
  }
});

test('missing translated value falls back to Polish', () => {
  const original = i18n.translations.en['nav.offer'];
  delete i18n.translations.en['nav.offer'];
  assert.equal(i18n.translate('en', 'nav.offer'), i18n.translations.pl['nav.offer']);
  i18n.translations.en['nav.offer'] = original;
});
```

- [ ] **Step 6: Implement safe DOM application and browser initialization**

`applyLanguage(document, language)` must update `[data-i18n]` with `textContent`, handle `[data-i18n-attr="attribute:key"]` with `setAttribute`, set `document.documentElement.lang`, and update each `[data-language]` button's `aria-current`. `initI18n(window)` must select the initial language, wire button clicks, safely persist manual choices, and dispatch `carosseria:languagechange`.

- [ ] **Step 7: Test DOM mutation with small fakes and run the suite**

```js
test('applyLanguage updates text, document language and active button', () => {
  const textNode = { dataset: { i18n: 'nav.offer' }, textContent: '' };
  const buttons = ['pl', 'en'].map(code => ({ dataset: { language: code }, attrs: {}, setAttribute(k,v){this.attrs[k]=v;}, removeAttribute(k){delete this.attrs[k];} }));
  const document = {
    documentElement: { lang: '' },
    querySelectorAll(selector) { return selector === '[data-i18n]' ? [textNode] : selector === '[data-i18n-attr]' ? [] : buttons; },
    dispatchEvent() {}
  };
  assert.equal(i18n.applyLanguage(document, 'en'), 'en');
  assert.equal(textNode.textContent, i18n.translations.en['nav.offer']);
  assert.equal(document.documentElement.lang, 'en');
  assert.equal(buttons[1].attrs['aria-current'], 'true');
});
```

Run: `node --test tests/i18n.test.js`

Expected: all tests PASS.

- [ ] **Step 8: Commit the language core**

```bash
git add scripts/i18n.js tests/i18n.test.js
git commit -m "feat: add multilingual translation core"
```

### Task 2: Localized markup, manual vehicle fields, and responsive switcher

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Create: `scripts/site.js`
- Create: `tests/markup.test.js`
- Delete: `scripts/cars.js`

**Interfaces:**
- Consumes: `CarosseriaI18n.initI18n(window)` and the `data-i18n`, `data-i18n-attr`, and `data-language` contracts from Task 1.
- Produces: form `#contactForm`, status region `#formStatus`, submit button `#submitButton`, language controls, and eight named required form fields consumed by Task 3.

- [ ] **Step 1: Write failing static contract tests**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const html = fs.readFileSync('index.html', 'utf8');

test('menu uses required order', () => {
  assert.ok(html.indexOf('href="#zakupy"') < html.indexOf('href="#oferta"'));
  assert.ok(html.indexOf('href="#oferta"') < html.indexOf('href="#kontakt"'));
});

test('markup has all language controls and no VehiclesDB dependency', () => {
  for (const code of ['pl','en','fr','uk','ru','de','lt']) assert.match(html, new RegExp(`data-language="${code}"`));
  assert.doesNotMatch(html, /VehiclesDB|scripts\/cars\.js|brandSelect|modelSelect|yearSelect/);
});

test('manual form exposes eight required named fields', () => {
  for (const name of ['email','Tytuł wiadomości','Marka pojazdu','Model pojazdu','Rocznik','Typ nadwozia','Pojemność silnika i rodzaj paliwa','Treść wiadomości']) {
    assert.match(html, new RegExp(`name="${name}"[^>]*required|required[^>]*name="${name}"`));
  }
});
```

- [ ] **Step 2: Run the static tests and verify they fail**

Run: `node --test tests/markup.test.js`

Expected: FAIL on menu order, language controls, VehiclesDB references, and manual fields.

- [ ] **Step 3: Rewrite the header and annotate every translatable node**

Reorder the links to `#zakupy`, `#oferta`, `#kontakt`; add a `.language-switcher` containing seven `button type="button" data-language="…"` controls; add matching `data-i18n` keys to every visible text fragment. Use separate spans for emphasized heading segments. Add `data-i18n-attr` to meta descriptions, image alt text, iframe title, placeholders, and ARIA labels.

- [ ] **Step 4: Replace vehicle selectors with eight manual fields and status output**

Use `id="contactForm"`, keep `action="https://formsubmit.co/carosseria-parts@wp.pl"`, and add required text/email controls with the exact stable names tested above. Add `<p id="formStatus" class="form-status" role="status" aria-live="polite"></p>` and `id="submitButton"` to the submit button.

- [ ] **Step 5: Move compact-header behavior into `scripts/site.js` and update script tags**

```js
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const heroLogo = document.querySelector('.racing-banner-image');
  if (!header || !heroLogo) return;
  const update = () => header.classList.toggle('is-condensed', window.scrollY > heroLogo.offsetTop + heroLogo.offsetHeight);
  window.addEventListener('scroll', update, { passive: true });
  update();
});
```

Load `scripts/i18n.js`, `scripts/site.js`, and `scripts/contact-form.js` with `defer`. Remove the `scripts/cars.js` tag and delete the file.

- [ ] **Step 6: Add responsive and state styles**

Make the header's third grid column host `.language-switcher`; give language buttons visible hover, focus, and `[aria-current="true"]` states. At `850px` and `520px`, allow a dedicated wrapping row with no horizontal page overflow. Remove `.model-other`, `.vehicle-note`, and `.vehicle-credit` rules; add `.form-status`, `.form-status.is-success`, `.form-status.is-error`, and disabled submit-button styles.

- [ ] **Step 7: Run markup and language tests**

Run: `node --test tests/i18n.test.js tests/markup.test.js`

Expected: all tests PASS.

- [ ] **Step 8: Commit markup and responsive UI**

```bash
git add index.html style.css scripts/site.js scripts/cars.js tests/markup.test.js
git commit -m "feat: localize page and simplify contact form"
```

### Task 3: Reliable localized AJAX form submission

**Files:**
- Create: `scripts/contact-form.js`
- Create: `tests/contact-form.test.js`
- Modify: `scripts/i18n.js`

**Interfaces:**
- Consumes: form `#contactForm`, status `#formStatus`, button `#submitButton`, and `CarosseriaI18n.translate(language, key)`.
- Produces: `CarosseriaContact.createController({ form, status, button, fetchImpl, getMessage }): { submit(event): Promise<void>, refreshMessage(): void }` and `initContactForm(window): void`.

- [ ] **Step 1: Write failing payload and success tests**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const contact = require('../scripts/contact-form.js');

function harness(fetchImpl) {
  const entries = [['email','a@b.pl'],['Marka pojazdu','Volvo'],['Model pojazdu','V60']];
  const form = { action: 'https://formsubmit.co/carosseria-parts@wp.pl', resetCalls: 0, reset(){this.resetCalls++;} };
  const status = { textContent: '', className: 'form-status' };
  const button = { disabled: false };
  const controller = contact.createController({ form, status, button, fetchImpl, getMessage: key => key, createFormData: () => new Map(entries) });
  return { controller, form, status, button };
}

test('posts form data to the AJAX endpoint and resets only after success', async () => {
  let request;
  const h = harness(async (url, options) => { request = { url, options }; return { ok: true, json: async () => ({ success: 'true' }) }; });
  await h.controller.submit({ preventDefault() {} });
  assert.equal(request.url, 'https://formsubmit.co/ajax/carosseria-parts@wp.pl');
  assert.equal(request.options.method, 'POST');
  assert.equal(h.form.resetCalls, 1);
  assert.equal(h.status.textContent, 'status.success');
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node --test tests/contact-form.test.js`

Expected: FAIL because `scripts/contact-form.js` does not exist.

- [ ] **Step 3: Implement the controller and browser initialization**

Build the AJAX URL by replacing `https://formsubmit.co/` with `https://formsubmit.co/ajax/`. Submit `new FormData(form)` with `Accept: application/json`; do not manually set `Content-Type`. Set an internal `pending` boolean before awaiting `fetchImpl`. Success requires both `response.ok` and a parsed response that does not explicitly report failure. Always restore the button in `finally`.

- [ ] **Step 4: Add failure, malformed response, and duplicate-submit tests**

```js
test('preserves values and reports errors for rejected requests', async () => {
  const h = harness(async () => { throw Error('offline'); });
  await h.controller.submit({ preventDefault() {} });
  assert.equal(h.form.resetCalls, 0);
  assert.equal(h.status.textContent, 'status.error');
  assert.equal(h.button.disabled, false);
});

test('non-2xx and malformed responses are not successes', async () => {
  for (const response of [{ ok: false, json: async () => ({}) }, { ok: true, json: async () => { throw Error('bad json'); } }]) {
    const h = harness(async () => response);
    await h.controller.submit({ preventDefault() {} });
    assert.equal(h.form.resetCalls, 0);
    assert.equal(h.status.textContent, 'status.error');
  }
});

test('ignores a second submission while the first is pending', async () => {
  let release;
  let calls = 0;
  const h = harness(() => { calls++; return new Promise(resolve => { release = resolve; }); });
  const first = h.controller.submit({ preventDefault() {} });
  const second = h.controller.submit({ preventDefault() {} });
  assert.equal(calls, 1);
  release({ ok: true, json: async () => ({ success: 'true' }) });
  await Promise.all([first, second]);
});
```

- [ ] **Step 5: Refresh status translations after language changes**

Track the current status key (`status.sending`, `status.success`, or `status.error`) rather than only its rendered text. `refreshMessage()` re-renders that key, and `initContactForm` listens for `carosseria:languagechange` to call it.

- [ ] **Step 6: Run all automated tests**

Run: `node --test tests/*.test.js`

Expected: all tests PASS.

- [ ] **Step 7: Commit form submission behavior**

```bash
git add scripts/contact-form.js scripts/i18n.js tests/contact-form.test.js
git commit -m "feat: submit localized contact form reliably"
```

### Task 4: Browser verification and release check

**Files:**
- Modify if defects are found: `index.html`, `style.css`, `scripts/i18n.js`, `scripts/contact-form.js`, `scripts/site.js`
- Update tests if a defect requires a regression case: `tests/*.test.js`

**Interfaces:**
- Consumes: the complete page delivered by Tasks 1–3.
- Produces: a visually verified, release-ready implementation of issue #1.

- [ ] **Step 1: Run the full automated suite and static hygiene checks**

Run: `node --test tests/*.test.js`

Expected: all tests PASS.

Run: `rg -n 'VehiclesDB|vehiclesdb|cars\.js|brandSelect|modelSelect|yearSelect' index.html style.css scripts tests`

Expected: no matches except negative assertions in `tests/markup.test.js`.

Run: `git diff --check`

Expected: no output and exit status 0.

- [ ] **Step 2: Serve the site locally**

Run: `python3 -m http.server 8000`

Expected: server listens on `http://127.0.0.1:8000/` with no missing local assets.

- [ ] **Step 3: Verify desktop behavior at 1440 × 1000**

Check that all seven language controls are visible, active state changes, all content changes without reload, the menu order is correct, scrolling still condenses the header, and the eight-field form is aligned with no console errors.

- [ ] **Step 4: Verify iPad behavior at 768 × 1024**

Check navigation and languages wrap without overlap or horizontal scrolling; all controls remain reachable by keyboard/touch; translated German, French, and Russian headings do not clip.

- [ ] **Step 5: Verify iPhone behavior at 390 × 844**

Check language buttons wrap without page overflow, form controls fill the available width, the sticky header does not cover anchored headings, and Ukrainian and Lithuanian copy remains readable.

- [ ] **Step 6: Exercise submission outcomes without sending a real inquiry**

In browser developer tooling or an injected fetch stub, verify sending disables the button, simulated success clears fields and shows the localized success text, and simulated network failure preserves fields and shows the localized error. Do not submit a real customer message during verification.

- [ ] **Step 7: Fix any discovered defect with a regression test and rerun verification**

For each defect, first add the smallest failing assertion to the owning `tests/*.test.js`, run it to observe failure, patch the owning source file, rerun `node --test tests/*.test.js`, then repeat the affected viewport check.

- [ ] **Step 8: Commit verified release state**

```bash
git add index.html style.css scripts tests
git commit -m "test: verify responsive multilingual contact flow"
```
