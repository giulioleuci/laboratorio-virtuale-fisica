import { test, describe } from 'node:test';
import assert from 'node:assert';

/**
 * Logic-only extraction for testing the context mechanism and state logic.
 * This mirrors the implementation in global-loading.tsx but is decoupled
 * from React components and TSX syntax to run in the Node test runner.
 */

function simulateGlobalLoadingLogic(initialPathname: string) {
  let isLoading = false;
  let currentPathname = initialPathname;
  let timeoutId: NodeJS.Timeout | undefined;

  const setIsLoading = (val: boolean) => {
    isLoading = val;
  };

  // Simulates the useEffect hook in the component
  const triggerEffect = (newPathname: string) => {
    currentPathname = newPathname;
    setIsLoading(true);

    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  };

  return {
    getIsLoading: () => isLoading,
    setIsLoading,
    triggerEffect,
    getPathname: () => currentPathname
  };
}

describe('GlobalLoading Logic Simulation', () => {
  test('should default to not loading', () => {
    const simulation = simulateGlobalLoadingLogic('/');
    assert.strictEqual(simulation.getIsLoading(), false);
  });

  test('should update loading state manually', () => {
    const simulation = simulateGlobalLoadingLogic('/');
    simulation.setIsLoading(true);
    assert.strictEqual(simulation.getIsLoading(), true);
    simulation.setIsLoading(false);
    assert.strictEqual(simulation.getIsLoading(), false);
  });

  test('should set loading to true on pathname change and false after timeout', (t, done) => {
    const simulation = simulateGlobalLoadingLogic('/');

    simulation.triggerEffect('/new-path');
    assert.strictEqual(simulation.getIsLoading(), true, 'Should be loading immediately');
    assert.strictEqual(simulation.getPathname(), '/new-path');

    setTimeout(() => {
      assert.strictEqual(simulation.getIsLoading(), false, 'Should stop loading after 300ms');
      done();
    }, 350);
  });

  test('should clear previous timeout if pathname changes again quickly', (t, done) => {
    const simulation = simulateGlobalLoadingLogic('/');

    simulation.triggerEffect('/path-1');
    assert.strictEqual(simulation.getIsLoading(), true);

    setTimeout(() => {
      simulation.triggerEffect('/path-2');
      assert.strictEqual(simulation.getIsLoading(), true);
    }, 100);

    setTimeout(() => {
      // At 350ms, the first timeout (at 300ms) would have fired if not cleared.
      // The second timeout (at 100+300=400ms) should not have fired yet.
      assert.strictEqual(simulation.getIsLoading(), true, 'Should still be loading because second timeout is pending');
    }, 350);

    setTimeout(() => {
      assert.strictEqual(simulation.getIsLoading(), false, 'Should finally stop loading');
      done();
    }, 450);
  });
});
