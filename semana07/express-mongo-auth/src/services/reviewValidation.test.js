// Comprobación mínima de la validación: node --test
import test from 'node:test';
import assert from 'node:assert/strict';
import { parseImage, parseReview } from './reviewValidation.js';

const valid = { title: ' Videodrome ', year: '1983', text: 'Buena', score: 9 };
const PNG = 'data:image/png;base64,iVBORw0KGgo=';

test('crea con datos válidos y recorta espacios', () => {
  const { fields } = parseReview(valid);
  assert.equal(fields.title, 'Videodrome');
  assert.equal(fields.year, 1983);
});

test('exige título, año y reseña al crear', () => {
  assert.throws(() => parseReview({ title: 'x' }), /obligatorios/);
  assert.throws(() => parseReview({ ...valid, title: '  ' }), /obligatorio/);
});

test('rechaza valores fuera de rango', () => {
  assert.throws(() => parseReview({ ...valid, score: 11 }), /nota/);
  assert.throws(() => parseReview({ ...valid, year: 1500 }), /año/);
  assert.throws(() => parseReview({ ...valid, title: 'a'.repeat(121) }), /120/);
});

test('en actualización parcial solo valida lo enviado', () => {
  assert.deepEqual(parseReview({ score: 5 }, { partial: true }).fields, { score: 5 });
  assert.throws(() => parseReview({ title: '' }, { partial: true }), /obligatorio/);
});

test('imagen: acepta PNG, null elimina, rechaza tipo y tamaño', () => {
  assert.equal(parseImage(PNG).type, 'image/png');
  assert.equal(parseImage(null), null);
  assert.equal(parseImage(undefined), undefined);
  assert.throws(() => parseImage('data:image/svg+xml;base64,AAAA'), /JPEG, PNG o WebP/);
  assert.throws(() => parseImage('texto'), /JPEG, PNG o WebP/);
  const big = `data:image/png;base64,${Buffer.alloc(1024 * 1024 + 1).toString('base64')}`;
  assert.throws(() => parseImage(big), /1 MB/);
});
