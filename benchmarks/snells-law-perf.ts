
export {};

type MeasurementRow = {
  id: number;
  [key: string]: number | null | undefined;
};

const n1 = 1.00029;
const toRadians = (deg: number) => deg * (Math.PI / 180);

function originalAverage(rawData: MeasurementRow[]) {
    const n2_values = rawData.map(row => {
        const theta_i = row.theta_i ?? null;
        const theta_r = row.theta_r ?? null;
        if (theta_i == null || theta_r == null || theta_r === 0) return null;
        return n1 * Math.sin(toRadians(theta_i)) / Math.sin(toRadians(theta_r));
    }).filter(n => n !== null) as number[];

    const sigmas = rawData.map(row => {
        const { theta_i, sigma_theta_i, theta_r, sigma_theta_r } = row;
        if (theta_i == null || theta_r == null || sigma_theta_i == null || sigma_theta_r == null) return 0;
        const d_n2_d_theta_i = n1 * Math.cos(toRadians(theta_i)) / Math.sin(toRadians(theta_r));
        const d_n2_d_theta_r = -n1 * Math.sin(toRadians(theta_i)) * Math.cos(toRadians(theta_r)) / Math.sin(toRadians(theta_r))**2;

        const sigma_n2_sq = (d_n2_d_theta_i * toRadians(sigma_theta_i))**2 + (d_n2_d_theta_r * toRadians(sigma_theta_r))**2;
        return Math.sqrt(sigma_n2_sq);
    });

    return { n2_values, sigmas };
}

function optimizedAverage(rawData: MeasurementRow[]) {
    const n2_values: number[] = [];
    const sigmas: number[] = [];
    const n = rawData.length;

    for (let i = 0; i < n; i++) {
        const row = rawData[i];
        const { theta_i, sigma_theta_i, theta_r, sigma_theta_r } = row;

        if (theta_i != null && theta_r != null && theta_r !== 0 && sigma_theta_i != null && sigma_theta_r != null) {
            const rad_i = toRadians(theta_i);
            const rad_r = toRadians(theta_r);
            const sin_i = Math.sin(rad_i);
            const sin_r = Math.sin(rad_r);
            const cos_i = Math.cos(rad_i);
            const cos_r = Math.cos(rad_r);

            n2_values.push(n1 * sin_i / sin_r);

            const d_n2_d_theta_i = n1 * cos_i / sin_r;
            const d_n2_d_theta_r = -n1 * sin_i * cos_r / (sin_r * sin_r);

            const sigma_n2_sq = (d_n2_d_theta_i * toRadians(sigma_theta_i))**2 + (d_n2_d_theta_r * toRadians(sigma_theta_r))**2;
            sigmas.push(Math.sqrt(sigma_n2_sq));
        }
    }

    return { n2_values, sigmas };
}

function originalFit(rawData: MeasurementRow[]) {
    const sin_theta_i = rawData.map(r => r.theta_i != null ? Math.sin(toRadians(r.theta_i)) : null).filter(v => v !== null) as number[];
    const sin_theta_r = rawData.map(r => r.theta_r != null ? Math.sin(toRadians(r.theta_r)) : null).filter(v => v !== null) as number[];

    const sigma_sin_theta_r = rawData.map(r => {
        if (r.theta_r == null || r.sigma_theta_r == null) return null;
        return Math.abs(Math.cos(toRadians(r.theta_r))) * toRadians(r.sigma_theta_r);
    }).filter(v => v !== null) as (number | null | undefined)[];

    return { sin_theta_i, sin_theta_r, sigma_sin_theta_r };
}

function optimizedFit(rawData: MeasurementRow[]) {
    const sin_theta_i: number[] = [];
    const sin_theta_r: number[] = [];
    const sigma_sin_theta_r: number[] = [];
    const n = rawData.length;

    for (let i = 0; i < n; i++) {
        const row = rawData[i];
        const { theta_i, theta_r, sigma_theta_r } = row;

        if (theta_i != null && theta_r != null && sigma_theta_r != null) {
            sin_theta_i.push(Math.sin(toRadians(theta_i)));
            const rad_r = toRadians(theta_r);
            sin_theta_r.push(Math.sin(rad_r));
            sigma_sin_theta_r.push(Math.abs(Math.cos(rad_r)) * toRadians(sigma_theta_r));
        }
    }

    return { sin_theta_i, sin_theta_r, sigma_sin_theta_r };
}

// Data generation
const size = 10000;
const data: MeasurementRow[] = Array.from({ length: size }, (_, i) => ({
    id: i,
    theta_i: Math.random() * 80 + 5,
    theta_r: Math.random() * 40 + 5,
    sigma_theta_i: 0.1,
    sigma_theta_r: 0.1,
}));

// Warmup
for (let i = 0; i < 100; i++) {
    originalAverage(data);
    optimizedAverage(data);
    originalFit(data);
    optimizedFit(data);
}

const iterations = 1000;

console.log(`Running benchmarks with ${size} rows and ${iterations} iterations...`);

console.time('originalAverage');
for (let i = 0; i < iterations; i++) {
    originalAverage(data);
}
console.timeEnd('originalAverage');

console.time('optimizedAverage');
for (let i = 0; i < iterations; i++) {
    optimizedAverage(data);
}
console.timeEnd('optimizedAverage');

console.time('originalFit');
for (let i = 0; i < iterations; i++) {
    originalFit(data);
}
console.timeEnd('originalFit');

console.time('optimizedFit');
for (let i = 0; i < iterations; i++) {
    optimizedFit(data);
}
console.timeEnd('optimizedFit');

// Sanity check
const resOrigAvg = originalAverage(data);
const resOptAvg = optimizedAverage(data);
console.log('Average mode sanity check:',
    resOrigAvg.n2_values.length === resOptAvg.n2_values.length &&
    resOrigAvg.sigmas.length === resOptAvg.sigmas.length);

const resOrigFit = originalFit(data);
const resOptFit = optimizedFit(data);
console.log('Fit mode sanity check:',
    resOrigFit.sin_theta_i.length === resOptFit.sin_theta_i.length &&
    resOrigFit.sin_theta_r.length === resOptFit.sin_theta_r.length &&
    resOrigFit.sigma_sin_theta_r.length === resOptFit.sigma_sin_theta_r.length);
