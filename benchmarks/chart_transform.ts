
import { performance } from 'perf_hooks';
import assert from 'node:assert';

type ChartDataPoint = {
    x: number;
    y: number;
    sigma_x?: number;
    sigma_y?: number;
    y_fit?: number;
    size?: number;
};

// Mock data generation
const DATA_SIZE = 1000; // Smaller size for quick correctness check
const initialData: ChartDataPoint[] = [];
for (let i = 0; i < DATA_SIZE; i++) {
    initialData.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        sigma_x: Math.random(),
        sigma_y: Math.random(),
    });
}

const chartState = {
    swapped: true,
    pointSize: 40,
};

const currentFit = {
    slope: 1.5,
    intercept: 2.0,
};

function getOriginalResult() {
    // Original Logic
    const baseData = chartState.swapped
        ? initialData.map(p => ({ ...p, x: p.y, y: p.x, sigma_x: p.sigma_y, sigma_y: p.sigma_x }))
        : initialData;

    const transformedData = baseData.map(p => ({
        ...p,
        y_fit: p.y_fit !== undefined ? p.y_fit : (currentFit ? currentFit.slope * p.x + currentFit.intercept : undefined),
        size: chartState.pointSize,
    }));

    return transformedData;
}

function getOptimizedResult() {
    // Optimized Logic
    const transformedData = initialData.map(p => {
        // Handle swapping
        let x = p.x;
        let y = p.y;
        let sigma_x = p.sigma_x;
        let sigma_y = p.sigma_y;

        if (chartState.swapped) {
            x = p.y;
            y = p.x;
            sigma_x = p.sigma_y;
            sigma_y = p.sigma_x;
        }

        const y_fit = p.y_fit !== undefined
            ? p.y_fit
            : (currentFit ? currentFit.slope * x + currentFit.intercept : undefined);

        return {
            ...p,
            x,
            y,
            sigma_x,
            sigma_y,
            y_fit,
            size: chartState.pointSize
        };
    });

    return transformedData;
}

// Correctness Check
const originalResult = getOriginalResult();
const optimizedResult = getOptimizedResult();

try {
    assert.deepStrictEqual(originalResult, optimizedResult);
    console.log("✅ Correctness Check Passed: Optimized logic matches original logic.");
} catch (e) {
    console.error("❌ Correctness Check Failed!");
    // console.error(e);
    process.exit(1);
}

// Performance Benchmarking (with larger data)
const BENCHMARK_SIZE = 500000;
const benchmarkData: ChartDataPoint[] = [];
for (let i = 0; i < BENCHMARK_SIZE; i++) {
    benchmarkData.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        sigma_x: Math.random(),
        sigma_y: Math.random(),
    });
}

function runOriginalBench() {
    const start = performance.now();
    const baseData = chartState.swapped
        ? benchmarkData.map(p => ({ ...p, x: p.y, y: p.x, sigma_x: p.sigma_y, sigma_y: p.sigma_x }))
        : benchmarkData;
    const transformedData = baseData.map(p => ({
        ...p,
        y_fit: p.y_fit !== undefined ? p.y_fit : (currentFit ? currentFit.slope * p.x + currentFit.intercept : undefined),
        size: chartState.pointSize,
    }));
    const end = performance.now();
    return end - start;
}

function runOptimizedBench() {
    const start = performance.now();
    const transformedData = benchmarkData.map(p => {
        let x = p.x;
        let y = p.y;
        let sigma_x = p.sigma_x;
        let sigma_y = p.sigma_y;
        if (chartState.swapped) {
            x = p.y;
            y = p.x;
            sigma_x = p.sigma_y;
            sigma_y = p.sigma_x;
        }
        const y_fit = p.y_fit !== undefined
            ? p.y_fit
            : (currentFit ? currentFit.slope * x + currentFit.intercept : undefined);
        return {
            ...p,
            x,
            y,
            sigma_x,
            sigma_y,
            y_fit,
            size: chartState.pointSize
        };
    });
    const end = performance.now();
    return end - start;
}

console.log("Running benchmarks with", BENCHMARK_SIZE, "items...");
let totalOriginal = 0;
let totalOptimized = 0;
const ITERATIONS = 10;

// Warmup
runOriginalBench();
runOptimizedBench();

for (let i = 0; i < ITERATIONS; i++) {
    totalOriginal += runOriginalBench();
    totalOptimized += runOptimizedBench();
}

console.log(`Original Average: ${(totalOriginal / ITERATIONS).toFixed(2)} ms`);
console.log(`Optimized Average: ${(totalOptimized / ITERATIONS).toFixed(2)} ms`);
console.log(`Improvement: ${((totalOriginal - totalOptimized) / totalOriginal * 100).toFixed(2)}%`);
