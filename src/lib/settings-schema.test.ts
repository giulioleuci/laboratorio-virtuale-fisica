
import { test } from 'node:test';
import assert from 'node:assert';
import { settingsSchema } from './settings-schema.ts';

test('settingsSchema validates correct settings', () => {
  const validSettings = {
    precisionMode: 'auto',
    fixedDigits: 5,
    primaryColor: 'red',
    categoryColors: { 'Strumenti': 'blue' }
  };
  const result = settingsSchema.safeParse(validSettings);
  assert.strictEqual(result.success, true);
});

test('settingsSchema allows optional fields', () => {
  const partialSettings = {
    precisionMode: 'fixed'
  };
  const result = settingsSchema.safeParse(partialSettings);
  assert.strictEqual(result.success, true);
});

test('settingsSchema rejects invalid precisionMode', () => {
  const invalidSettings = {
    precisionMode: 'invalid'
  };
  const result = settingsSchema.safeParse(invalidSettings);
  assert.strictEqual(result.success, false);
});

test('settingsSchema rejects invalid fixedDigits (too large)', () => {
  const invalidSettings = {
    fixedDigits: 11
  };
  const result = settingsSchema.safeParse(invalidSettings);
  assert.strictEqual(result.success, false);
});

test('settingsSchema rejects invalid fixedDigits (negative)', () => {
  const invalidSettings = {
    fixedDigits: -1
  };
  const result = settingsSchema.safeParse(invalidSettings);
  assert.strictEqual(result.success, false);
});

test('settingsSchema rejects invalid fixedDigits (not integer)', () => {
  const invalidSettings = {
    fixedDigits: 3.5
  };
  const result = settingsSchema.safeParse(invalidSettings);
  assert.strictEqual(result.success, false);
});

test('settingsSchema rejects non-string primaryColor', () => {
  const invalidSettings = {
    primaryColor: 123
  };
  const result = settingsSchema.safeParse(invalidSettings);
  assert.strictEqual(result.success, false);
});

test('settingsSchema rejects non-record categoryColors', () => {
  const invalidSettings = {
    categoryColors: 'not-a-record'
  };
  const result = settingsSchema.safeParse(invalidSettings);
  assert.strictEqual(result.success, false);
});
