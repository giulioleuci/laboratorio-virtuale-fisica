import { performance } from 'perf_hooks';

const columns = Array.from({ length: 50 }, (_, i) => ({
    id: `col_${i}`,
    label: `Column ${i} <b>(unit)</b>`,
    unit: 'unit'
}));

// Original logic
const findColumnIdOriginal = (header: string): string | null => {
    const cleanHeader = header.trim().toLowerCase();

    // Try exact label match (e.g., "Massa (m)")
    let found = columns.find(c => c.label.replace(/<[^>]*>?/gm, '').trim().toLowerCase() === cleanHeader);
    if (found) return found.id;

    // Try matching sigma labels like "σ (Massa (m))"
    const sigmaMatch = cleanHeader.match(/^(σ|sigma)\s*\((.+)\)$/);
    if (sigmaMatch) {
        const potentialLabel = sigmaMatch[2].trim();
        found = columns.find(c => c.label.replace(/<[^>]*>?/gm, '').trim().toLowerCase() === potentialLabel);
        if (found) return `sigma_${found.id}`;
    }

    // Try matching ID (e.g., "m" or "sigma_m")
    found = columns.find(c => c.id.toLowerCase() === cleanHeader);
    if (found) return found.id;

    if (cleanHeader.startsWith('sigma_')) {
        const potentialId = cleanHeader.substring(6);
        found = columns.find(c => c.id.toLowerCase() === potentialId);
        if (found) return `sigma_${found.id}`;
    }

    return null;
};

// Optimized logic
const labelToId = new Map<string, string>();
const idToId = new Map<string, string>();

columns.forEach(c => {
     const cleanLabel = c.label.replace(/<[^>]*>?/gm, '').trim().toLowerCase();
     labelToId.set(cleanLabel, c.id);
     idToId.set(c.id.toLowerCase(), c.id);
});

const findColumnIdOptimized = (header: string): string | null => {
    const cleanHeader = header.trim().toLowerCase();

    if (labelToId.has(cleanHeader)) return labelToId.get(cleanHeader)!;

    const sigmaMatch = cleanHeader.match(/^(σ|sigma)\s*\((.+)\)$/);
    if (sigmaMatch) {
        const potentialLabel = sigmaMatch[2].trim();
        if (labelToId.has(potentialLabel)) return `sigma_${labelToId.get(potentialLabel)!}`;
    }

    if (idToId.has(cleanHeader)) return idToId.get(cleanHeader)!;

    if (cleanHeader.startsWith('sigma_')) {
        const potentialId = cleanHeader.substring(6);
        if (idToId.has(potentialId)) return `sigma_${idToId.get(potentialId)!}`;
    }

    return null;
};


// Test data
const headers = [];
for (let i = 0; i < 50; i++) {
    headers.push(`column ${i} (unit)`);
    headers.push(`sigma (column ${i} (unit))`);
    headers.push(`col_${i}`);
    headers.push(`sigma_col_${i}`);
    headers.push(`unknown_${i}`);
}

const numIterations = 10000;

console.log('Running benchmark...');

// Measure original
const startOriginal = performance.now();
for (let i = 0; i < numIterations; i++) {
    headers.forEach(h => findColumnIdOriginal(h));
}
const endOriginal = performance.now();
const timeOriginal = endOriginal - startOriginal;

console.log(`Original Time: ${timeOriginal.toFixed(2)}ms`);

// Measure optimized
const startOptimized = performance.now();
for (let i = 0; i < numIterations; i++) {
    headers.forEach(h => findColumnIdOptimized(h));
}
const endOptimized = performance.now();
const timeOptimized = endOptimized - startOptimized;

console.log(`Optimized Time: ${timeOptimized.toFixed(2)}ms`);
