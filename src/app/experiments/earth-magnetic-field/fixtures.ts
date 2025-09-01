
import type { MeasurementRow } from "@/lib/types";

// Gruppo 1: Bobina standard (N=200, L=0.5m, R=10Ω)
const group1: MeasurementRow[] = [
    { id: 1, N: 200, sigma_N: 1, L: 0.5, sigma_L: 0.001, R: 10, sigma_R: 0.1, V: 1.0, sigma_V: 0.01 },
    { id: 2, N: 200, sigma_N: 1, L: 0.5, sigma_L: 0.001, R: 10, sigma_R: 0.1, V: 0.99, sigma_V: 0.01 },
    { id: 3, N: 200, sigma_N: 1, L: 0.5, sigma_L: 0.001, R: 10, sigma_R: 0.1, V: 1.01, sigma_V: 0.01 },
];

// Gruppo 2: Bobina più sensibile (N=500, L=0.8m, R=25Ω)
const group2: MeasurementRow[] = [
    { id: 1, N: 500, sigma_N: 2, L: 0.8, sigma_L: 0.002, R: 25, sigma_R: 0.2, V: 2.0, sigma_V: 0.02 },
    { id: 2, N: 500, sigma_N: 2, L: 0.8, sigma_L: 0.002, R: 25, sigma_R: 0.2, V: 1.98, sigma_V: 0.02 },
    { id: 3, N: 500, sigma_N: 2, L: 0.8, sigma_L: 0.002, R: 25, sigma_R: 0.2, V: 2.02, sigma_V: 0.02 },
];

// Gruppo 3: Bobina compatta (N=100, L=0.3m, R=5Ω)
const group3: MeasurementRow[] = [
    { id: 1, N: 100, sigma_N: 0.5, L: 0.3, sigma_L: 0.0005, R: 5, sigma_R: 0.05, V: 0.75, sigma_V: 0.008 },
    { id: 2, N: 100, sigma_N: 0.5, L: 0.3, sigma_L: 0.0005, R: 5, sigma_R: 0.05, V: 0.74, sigma_V: 0.008 },
    { id: 3, N: 100, sigma_N: 0.5, L: 0.3, sigma_L: 0.0005, R: 5, sigma_R: 0.05, V: 0.76, sigma_V: 0.008 },
];

export const earthMagneticFieldFixtures: { [key: string]: MeasurementRow[] } = {
    'earth-magnetic-field-1': group1,
    'earth-magnetic-field-2': group2,
    'earth-magnetic-field-3': group3,
    // Manteniamo compatibilità con il vecchio formato
    'earth-magnetic-field': group1,
};
