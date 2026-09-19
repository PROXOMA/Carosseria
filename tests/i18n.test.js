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

test('applyLanguage updates text, attributes, document language and active button', () => {
  const textNode = { dataset: { i18n: 'nav.offer' }, textContent: '' };
  const attrNode = {
    dataset: { i18nAttr: 'aria-label:nav.language' },
    attrs: {},
    setAttribute(key, value) { this.attrs[key] = value; }
  };
  const buttons = ['pl', 'en'].map(code => ({
    dataset: { language: code },
    attrs: {},
    setAttribute(key, value) { this.attrs[key] = value; },
    removeAttribute(key) { delete this.attrs[key]; }
  }));
  const document = {
    documentElement: { lang: '' },
    querySelectorAll(selector) {
      if (selector === '[data-i18n]') return [textNode];
      if (selector === '[data-i18n-attr]') return [attrNode];
      return buttons;
    },
    dispatchEvent() {}
  };

  assert.equal(i18n.applyLanguage(document, 'en'), 'en');
  assert.equal(textNode.textContent, i18n.translations.en['nav.offer']);
  assert.equal(attrNode.attrs['aria-label'], i18n.translations.en['nav.language']);
  assert.equal(document.documentElement.lang, 'en');
  assert.equal(buttons[1].attrs['aria-current'], 'true');
  assert.equal(buttons[0].attrs['aria-current'], undefined);
});
