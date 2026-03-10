import { performance } from "perf_hooks";

function original(input: string) {
    return (input.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [])
      .filter((v, i, a) => a.indexOf(v) === i)
      // @ts-ignore
      .reduce((acc, v) => ({ ...acc, [v]: { value: "", sigma: "" } }), {});
}

function optimized(input: string) {
    const matches = input.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
    const newVariables: any = {};
    for (let i = 0; i < matches.length; i++) {
        const v = matches[i];
        if (!newVariables[v]) {
            newVariables[v] = { value: "", sigma: "" };
        }
    }
    return newVariables;
}

// long formula with many variables
const testString = Array.from({length: 100}, (_, i) => `var_${i}`).join(" + ") + " + " + Array.from({length: 100}, (_, i) => `var_${i}`).join(" + ");

console.log("Starting benchmark...");

// Warmup
for (let i = 0; i < 100; i++) {
    original(testString);
    optimized(testString);
}

const ITERATIONS = 1000;

const startOriginal = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    original(testString);
}
const endOriginal = performance.now();

const startOptimized = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    optimized(testString);
}
const endOptimized = performance.now();

console.log(`Original: ${endOriginal - startOriginal}ms`);
console.log(`Optimized: ${endOptimized - startOptimized}ms`);
console.log(`Speedup: ${((endOriginal - startOriginal) / (endOptimized - startOptimized)).toFixed(2)}x`);
