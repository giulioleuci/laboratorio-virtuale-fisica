import type { MeasurementRow } from "@/lib/types";

// Gruppo 1: Caduta da altezza media (5m)
const spaceTimeGroup1: MeasurementRow[] = [
    { id: 1, t: 0.1, sigma_t: 0.01, h: 4.9, sigma_h: 0.1 },
    { id: 2, t: 0.2, sigma_t: 0.01, h: 4.7, sigma_h: 0.1 },
    { id: 3, t: 0.3, sigma_t: 0.01, h: 4.4, sigma_h: 0.1 },
    { id: 4, t: 0.4, sigma_t: 0.01, h: 3.9, sigma_h: 0.1 },
    { id: 5, t: 0.5, sigma_t: 0.01, h: 3.4, sigma_h: 0.1 },
    { id: 6, t: 0.6, sigma_t: 0.01, h: 2.7, sigma_h: 0.1 },
    { id: 7, t: 0.7, sigma_t: 0.01, h: 1.9, sigma_h: 0.1 },
    { id: 8, t: 0.8, sigma_t: 0.01, h: 1.0, sigma_h: 0.1 },
];

const speedTimeGroup1: MeasurementRow[] = [
    { id: 1, t: 0.1, sigma_t: 0.01, v: -0.98, sigma_v: 0.1 },
    { id: 2, t: 0.2, sigma_t: 0.01, v: -1.96, sigma_v: 0.1 },
    { id: 3, t: 0.3, sigma_t: 0.01, v: -2.94, sigma_v: 0.1 },
    { id: 4, t: 0.4, sigma_t: 0.01, v: -3.92, sigma_v: 0.1 },
    { id: 5, t: 0.5, sigma_t: 0.01, v: -4.90, sigma_v: 0.1 },
];

// Gruppo 2: Caduta da altezza maggiore (8m)
const spaceTimeGroup2: MeasurementRow[] = [
    { id: 1, t: 0.1, sigma_t: 0.005, h: 7.95, sigma_h: 0.05 },
    { id: 2, t: 0.2, sigma_t: 0.005, h: 7.80, sigma_h: 0.05 },
    { id: 3, t: 0.3, sigma_t: 0.005, h: 7.56, sigma_h: 0.05 },
    { id: 4, t: 0.4, sigma_t: 0.005, h: 7.22, sigma_h: 0.05 },
    { id: 5, t: 0.5, sigma_t: 0.005, h: 6.78, sigma_h: 0.05 },
    { id: 6, t: 0.6, sigma_t: 0.005, h: 6.24, sigma_h: 0.05 },
    { id: 7, t: 0.7, sigma_t: 0.005, h: 5.60, sigma_h: 0.05 },
    { id: 8, t: 0.8, sigma_t: 0.005, h: 4.86, sigma_h: 0.05 },
    { id: 9, t: 0.9, sigma_t: 0.005, h: 4.02, sigma_h: 0.05 },
    { id: 10, t: 1.0, sigma_t: 0.005, h: 3.08, sigma_h: 0.05 },
];

const speedTimeGroup2: MeasurementRow[] = [
    { id: 1, t: 0.1, sigma_t: 0.005, v: -0.98, sigma_v: 0.05 },
    { id: 2, t: 0.2, sigma_t: 0.005, v: -1.96, sigma_v: 0.05 },
    { id: 3, t: 0.3, sigma_t: 0.005, v: -2.94, sigma_v: 0.05 },
    { id: 4, t: 0.4, sigma_t: 0.005, v: -3.92, sigma_v: 0.05 },
    { id: 5, t: 0.5, sigma_t: 0.005, v: -4.90, sigma_v: 0.05 },
    { id: 6, t: 0.6, sigma_t: 0.005, v: -5.88, sigma_v: 0.05 },
];

// Gruppo 3: Caduta da altezza minore (2m)
const spaceTimeGroup3: MeasurementRow[] = [
    { id: 1, t: 0.05, sigma_t: 0.02, h: 1.99, sigma_h: 0.02 },
    { id: 2, t: 0.1, sigma_t: 0.02, h: 1.95, sigma_h: 0.02 },
    { id: 3, t: 0.2, sigma_t: 0.02, h: 1.80, sigma_h: 0.02 },
    { id: 4, t: 0.3, sigma_t: 0.02, h: 1.56, sigma_h: 0.02 },
    { id: 5, t: 0.4, sigma_t: 0.02, h: 1.22, sigma_h: 0.02 },
    { id: 6, t: 0.5, sigma_t: 0.02, h: 0.78, sigma_h: 0.02 },
    { id: 7, t: 0.6, sigma_t: 0.02, h: 0.24, sigma_h: 0.02 },
];

const speedTimeGroup3: MeasurementRow[] = [
    { id: 1, t: 0.1, sigma_t: 0.02, v: -0.98, sigma_v: 0.2 },
    { id: 2, t: 0.2, sigma_t: 0.02, v: -1.96, sigma_v: 0.2 },
    { id: 3, t: 0.3, sigma_t: 0.02, v: -2.94, sigma_v: 0.2 },
    { id: 4, t: 0.4, sigma_t: 0.02, v: -3.92, sigma_v: 0.2 },
];

export const freeFallFixtures: { [key: string]: MeasurementRow[] } = {
    'free-fall-space-time-1': spaceTimeGroup1,
    'free-fall-space-time-2': spaceTimeGroup2,
    'free-fall-space-time-3': spaceTimeGroup3,
    'free-fall-speed-time-1': speedTimeGroup1,
    'free-fall-speed-time-2': speedTimeGroup2,
    'free-fall-speed-time-3': speedTimeGroup3,
    // Manteniamo compatibilità con il vecchio formato
    'free-fall-space-time': spaceTimeGroup1,
    'free-fall-speed-time': speedTimeGroup1,
};
