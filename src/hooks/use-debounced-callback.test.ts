import { test, describe } from 'node:test';
import assert from 'node:assert';

/**
 * Simplified version of the hook for testing the logic without React dependencies
 */
function debouncedLogic<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number,
  timeoutRef: { current: NodeJS.Timeout | undefined }
) {
  return (...args: Args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

describe('useDebouncedCallback logic', () => {
  test('should handle execution after delay', (t, done) => {
    const timeoutRef = { current: undefined as NodeJS.Timeout | undefined };
    let called = false;
    const callback = (val: boolean) => {
      called = val;
    };

    const debounced = debouncedLogic(callback, 10, timeoutRef);

    debounced(true);
    assert.strictEqual(called, false);

    setTimeout(() => {
      assert.strictEqual(called, true);
      done();
    }, 20);
  });

  test('should clear previous timeout if called again', (t, done) => {
    const timeoutRef = { current: undefined as NodeJS.Timeout | undefined };
    let callCount = 0;
    const callback = () => {
      callCount++;
    };

    const debounced = debouncedLogic(callback, 50, timeoutRef);

    debounced();
    const firstTimeout = timeoutRef.current;
    assert.notStrictEqual(firstTimeout, undefined);

    setTimeout(() => {
      debounced();
      assert.notStrictEqual(timeoutRef.current, firstTimeout);
    }, 20);

    setTimeout(() => {
      assert.strictEqual(callCount, 1);
      done();
    }, 100);
  });
});
