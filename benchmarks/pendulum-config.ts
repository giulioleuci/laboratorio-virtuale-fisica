import { performance } from 'perf_hooks';

// Mock data
const generateData = (n: number) => {
    return Array.from({ length: n }, (_, i) => ({
        l: Math.random() * 10,
        T: Math.random() * 2,
        sigma_T: Math.random() * 0.1,
    }));
};

const dataWithPeriod = generateData(1000000);

const runBaseline = () => {
    const start = performance.now();
    const lValues = dataWithPeriod.map(r => r['l']).filter(v => v != null) as number[];
    const T_values = dataWithPeriod.map(r => r.T).filter(v => v != null) as number[];
    const tSquaredValues = T_values.map(t => t * t);

    const T_sigmas = dataWithPeriod.map(r => r.sigma_T).filter(v => v !== null) as number[];
    // Propagate error from T to T^2: sigma(T^2) = 2 * T * sigma(T)
    const tSquaredSigmas = T_values.map((t, i) => T_sigmas[i] ? 2 * t * T_sigmas[i] : null);

    const end = performance.now();
    return end - start;
};

const runOptimized = () => {
    const start = performance.now();
    const lValues: number[] = [];
    const tSquaredValues: number[] = [];
    const tSquaredSigmas: (number | null)[] = [];

    for (let i = 0; i < dataWithPeriod.length; i++) {
        const row = dataWithPeriod[i];
        if (row['l'] != null && row.T != null) {
            lValues.push(row['l']);
            tSquaredValues.push(row.T * row.T);
            if (row.sigma_T != null) {
                tSquaredSigmas.push(2 * row.T * row.sigma_T);
            } else {
                tSquaredSigmas.push(null);
            }
        }
    }
    const end = performance.now();
    return end - start;
};

// Warmup
for (let i = 0; i < 5; i++) {
    runBaseline();
    runOptimized();
}

let baselineSum = 0;
let optimizedSum = 0;
const iterations = 10;

for (let i = 0; i < iterations; i++) {
    baselineSum += runBaseline();
    optimizedSum += runOptimized();
}

console.log(`Baseline: ${baselineSum / iterations} ms`);
console.log(`Optimized: ${optimizedSum / iterations} ms`);
console.log(`Improvement: ${((baselineSum - optimizedSum) / baselineSum * 100).toFixed(2)}%`);
