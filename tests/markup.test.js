const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const html = fs.readFileSync('index.html', 'utf8');

test('menu uses required order', () => {
  assert.ok(html.indexOf('href="#zakupy"') < html.indexOf('href="#oferta"'));
  assert.ok(html.indexOf('href="#oferta"') < html.indexOf('href="#kontakt"'));
});

test('markup has all language controls and no VehiclesDB dependency', () => {
  for (const code of ['pl', 'en', 'fr', 'uk', 'ru', 'de', 'lt']) {
    assert.match(html, new RegExp(`data-language="${code}"`));
  }
  assert.doesNotMatch(html, /VehiclesDB|scripts\/cars\.js|brandSelect|modelSelect|yearSelect/);
});

test('manual form exposes eight required named fields', () => {
  for (const name of ['email', 'Tytuł wiadomości', 'Marka pojazdu', 'Model pojazdu', 'Rocznik', 'Typ nadwozia', 'Pojemność silnika i rodzaj paliwa', 'Treść wiadomości']) {
    assert.match(html, new RegExp(`name="${name}"[^>]*required|required[^>]*name="${name}"`));
  }
});

test('every visible content block and relevant accessibility attribute is translatable', () => {
  assert.match(html, /data-i18n="hero\.lead"/);
  assert.match(html, /data-i18n="footer\.text"/);
  assert.match(html, /data-i18n-attr="alt:gallery\.alt1"/);
  assert.match(html, /data-i18n-attr="title:map\.title"/);
});
