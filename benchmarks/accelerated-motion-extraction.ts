import { performance } from 'perf_hooks';
import type { MeasurementRow } from '../src/lib/types.js';

// Setup data
const createData = (size: number): MeasurementRow[] => {
    return Array.from({ length: size }, (_, i) => {
        // Create occasional nulls to simulate real data
        const isNull = Math.random() < 0.05;
        return {
            id: i,
            t: isNull ? null : Math.random() * 10,
            x: isNull ? null : Math.random() * 100,
            sigma_t: 0.1,
            sigma_x: isNull ? null : 0.1,
        };
    });
};

const sizes = [100, 1000, 10000, 100000];
const iterations = 100;

console.log('Benchmarking array extraction methods (tValues, xValues, xSigmas)...');
console.log('=====================================================================');

for (const size of sizes) {
    const rawData = createData(size);

    // Original method (map + filter)
    let start = performance.now();
    for (let i = 0; i < iterations; i++) {
        const tValues = rawData.map(r => r.t).filter(v => v !== null) as number[];
        const xValues = rawData.map(r => r.x).filter(v => v !== null) as number[];
        const xSigmas = rawData.map(r => r.sigma_x).filter(v => v !== null) as (number | null | undefined)[];
    }
    const originalTime = performance.now() - start;

    // New method (single for loop)
    start = performance.now();
    for (let i = 0; i < iterations; i++) {
        const tValues: number[] = [];
        const xValues: number[] = [];
        const xSigmas: (number | null | undefined)[] = [];
        for (let j = 0; j < rawData.length; j++) {
            const row = rawData[j];
            if (row.t !== null && row.t !== undefined && row.x !== null && row.x !== undefined) {
                tValues.push(row.t);
                xValues.push(row.x);
                // The original map+filter logic for xSigmas ignored nulls, but here we can keep them aligned
                // For a fair comparison, let's say we just push it since the regression functions handle null/undefined
                xSigmas.push(row.sigma_x);
            }
        }
    }
    const loopTime = performance.now() - start;

    console.log(`Size: ${size} elements (${iterations} iterations)`);
    console.log(`- Original (map+filter): ${originalTime.toFixed(2)} ms`);
    console.log(`- For loop:              ${loopTime.toFixed(2)} ms (${(originalTime / loopTime).toFixed(2)}x faster)`);
    console.log('---');
}

export {};
