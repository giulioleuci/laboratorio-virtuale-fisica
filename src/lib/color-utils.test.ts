import { test, describe } from 'node:test';
import assert from 'node:assert';
import { hexToHsl } from './color-utils.ts';

describe('hexToHsl', () => {
  test('should convert 6-digit hex to HSL', () => {
    assert.strictEqual(hexToHsl('#ffffff'), '0 0% 100%');
    assert.strictEqual(hexToHsl('#000000'), '0 0% 0%');
    assert.strictEqual(hexToHsl('#ff0000'), '0 100% 50%');
    assert.strictEqual(hexToHsl('#00ff00'), '120 100% 50%');
    assert.strictEqual(hexToHsl('#0000ff'), '240 100% 50%');
  });

  test('should convert 3-digit hex to HSL', () => {
    assert.strictEqual(hexToHsl('#fff'), '0 0% 100%');
    assert.strictEqual(hexToHsl('#000'), '0 0% 0%');
    assert.strictEqual(hexToHsl('#f00'), '0 100% 50%');
    assert.strictEqual(hexToHsl('#0f0'), '120 100% 50%');
    assert.strictEqual(hexToHsl('#00f'), '240 100% 50%');
  });

  test('should handle case insensitivity', () => {
    assert.strictEqual(hexToHsl('#FFFFFF'), '0 0% 100%');
    assert.strictEqual(hexToHsl('#FF0000'), '0 100% 50%');
  });

  test('should return null for invalid hex strings', () => {
    assert.strictEqual(hexToHsl('invalid'), null);
    assert.strictEqual(hexToHsl('#1234'), null);
    assert.strictEqual(hexToHsl('#12345'), null);
    assert.strictEqual(hexToHsl('#1234567'), null);
    assert.strictEqual(hexToHsl(''), null);
  });

  test('should handle intermediate colors correctly', () => {
    // #808080 is Gray
    assert.strictEqual(hexToHsl('#808080'), '0 0% 50%');
    // #ffff00 is Yellow
    assert.strictEqual(hexToHsl('#ffff00'), '60 100% 50%');
    // #00ffff is Cyan
    assert.strictEqual(hexToHsl('#00ffff'), '180 100% 50%');
    // #ff00ff is Magenta
    assert.strictEqual(hexToHsl('#ff00ff'), '300 100% 50%');
  });
});
