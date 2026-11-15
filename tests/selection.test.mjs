import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { selectionParams, selectionFromParams } from '../src/lib/selection.mjs';
import { estimate } from '../src/lib/pricing.mjs';
const catalog = JSON.parse(await readFile(new URL('../src/data/catalog.json', import.meta.url)));

test('Un enlace recupera las opciones y el mismo subtotal sin incluir datos personales', () => {
  const selection = { model: 'equi-60', area: 60, finish: 'forest', equipment: 'comfort', extras: ['terrace', 'solar', 'terrace'], location: 'Ubicación privada', email: 'private@example.com' };
  const params = selectionParams(catalog, selection);
  const recovered = selectionFromParams(catalog, new URLSearchParams(params.toString()));
  assert.equal(estimate(catalog, recovered).subtotal, 46100);
  assert.deepEqual(recovered.extras, ['terrace', 'solar']);
  assert.equal(params.has('location'), false);
  assert.equal(params.has('email'), false);
});

test('La calculadora conserva superficies personalizadas sin inventar un precio', () => {
  const selection = { model: 'equi-60', area: 75, finish: 'natural', equipment: 'essential', extras: [] };
  const recovered = selectionFromParams(catalog, selectionParams(catalog, selection));
  assert.equal(recovered.area, 75);
  assert.equal(estimate(catalog, recovered).subtotal, null);
});

test('Los enlaces incompletos o manipulados no se convierten en presupuestos válidos', () => {
  assert.equal(selectionFromParams(catalog, new URLSearchParams('model=equi-60')), null);
  const params = selectionParams(catalog, { model: 'equi-60', finish: 'natural', equipment: 'essential' });
  params.append('extra', 'unrecognized');
  assert.throws(() => selectionFromParams(catalog, params));
  params.delete('extra'); params.set('area', '0');
  assert.throws(() => selectionFromParams(catalog, params));
});
