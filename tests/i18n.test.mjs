import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { routes, localizedPath } from '../src/i18n/routes.mjs';
import { translateCatalog, translateHtml, translateText } from '../src/i18n/translate.mjs';
import { estimate, euros } from '../src/lib/pricing.mjs';
import { selectionParams, selectionFromParams } from '../src/lib/selection.mjs';
const catalog = JSON.parse(await readFile(new URL('../src/data/catalog.json', import.meta.url)));

test('Cada ruta tiene una traducción única y los enlaces conservan parámetros y anclas', () => {
  assert.equal(Object.keys(routes).length, 13);
  assert.equal(new Set(Object.values(routes)).size, 13);
  assert.equal(localizedPath('configurador/?finish=forest#resumen', 'en'), 'en/configurator/?finish=forest#resumen');
  assert.equal(localizedPath('/viviendas/equi-60/#distribucion', 'en'), '/en/homes/equi-60/#distribucion');
  assert.equal(localizedPath('images/exterior-640.webp', 'en'), 'images/exterior-640.webp');
  assert.equal(localizedPath('/contacto/', 'es'), '/contacto/');
});

test('Traducir el catálogo conserva los identificadores y todos los precios', () => {
  const english = translateCatalog(catalog);
  for (const finish of catalog.finishes) for (const equipment of catalog.equipment) for (let mask = 0; mask < 8; mask++) {
    const selection = { model: 'equi-60', finish: finish.id, equipment: equipment.id, extras: catalog.extras.filter((_, i) => mask & (1 << i)).map(x => x.id) };
    const restored = selectionFromParams(english, selectionParams(catalog, selection));
    assert.equal(estimate(english, restored).subtotal, estimate(catalog, selection).subtotal);
  }
  assert.equal(english.finishes.find(x => x.id === 'forest').name, 'Forest');
  assert.equal(english.models.length, 1);
  assert.equal(english.models[0].id, 'equi-60');
  assert.equal(english.contactEndpoint, null);
});

test('Se traducen texto, atributos accesibles y metadatos sin alterar identificadores', () => {
  const missing = new Set();
  const result = translateHtml('<meta name="description" content="Tu espacio."><button id="gallery" aria-label="Imagen siguiente">Ver interior</button>', missing);
  assert.match(result, /content="Your space\."/);
  assert.match(result, /aria-label="Next image"/);
  assert.match(result, /id="gallery"/);
  assert.match(result, />View interior</);
  assert.equal(missing.size, 0);
  translateText('Texto sin traducir de prueba', missing);
  assert.equal(missing.size, 1);
});

test('La traducción conserva EUR y los importes desconocidos siguen sin precio', () => {
  assert.equal(translateText('36.000 €'), '€36,000');
  assert.equal(translateText('50.000–75.000 €'), '€50,000–€75,000');
  assert.equal(euros(null, 'en-GB'), 'To be confirmed');
  assert.equal(euros(36000, 'en-GB'), '€36,000');
});
