
import type { MeasurementRow } from "@/lib/types";

// Gruppo 1: Acqua (densità ~1 g/cm³)
const fitGroup1: MeasurementRow[] = [
    { id: 1, m: 10.1, sigma_m: 0.1, v: 10.0, sigma_v: 0.2 },
    { id: 2, m: 20.0, sigma_m: 0.1, v: 20.2, sigma_v: 0.2 },
    { id: 3, m: 29.8, sigma_m: 0.1, v: 30.0, sigma_v: 0.2 },
    { id: 4, m: 40.3, sigma_m: 0.1, v: 40.1, sigma_v: 0.2 },
    { id: 5, m: 49.9, sigma_m: 0.1, v: 50.0, sigma_v: 0.2 },
];

const averageGroup1: MeasurementRow[] = [
    { id: 1, m: 50.0, sigma_m: 0.1, v: 50.1, sigma_v: 0.2 },
    { id: 2, m: 50.1, sigma_m: 0.1, v: 49.9, sigma_v: 0.2 },
    { id: 3, m: 49.9, sigma_m: 0.1, v: 50.0, sigma_v: 0.2 },
];

// Gruppo 2: Olio vegetale (densità ~0.92 g/cm³)
const fitGroup2: MeasurementRow[] = [
    { id: 1, m: 9.2, sigma_m: 0.05, v: 10.0, sigma_v: 0.1 },
    { id: 2, m: 18.4, sigma_m: 0.05, v: 20.0, sigma_v: 0.1 },
    { id: 3, m: 27.6, sigma_m: 0.05, v: 30.0, sigma_v: 0.1 },
    { id: 4, m: 36.8, sigma_m: 0.05, v: 40.0, sigma_v: 0.1 },
    { id: 5, m: 46.0, sigma_m: 0.05, v: 50.0, sigma_v: 0.1 },
];

const averageGroup2: MeasurementRow[] = [
    { id: 1, m: 23.0, sigma_m: 0.05, v: 25.0, sigma_v: 0.1 },
    { id: 2, m: 23.1, sigma_m: 0.05, v: 25.1, sigma_v: 0.1 },
    { id: 3, m: 22.9, sigma_m: 0.05, v: 24.9, sigma_v: 0.1 },
];

// Gruppo 3: Glicerina (densità ~1.26 g/cm³)
const fitGroup3: MeasurementRow[] = [
    { id: 1, m: 12.6, sigma_m: 0.2, v: 10.0, sigma_v: 0.3 },
    { id: 2, m: 25.2, sigma_m: 0.2, v: 20.0, sigma_v: 0.3 },
    { id: 3, m: 37.8, sigma_m: 0.2, v: 30.0, sigma_v: 0.3 },
    { id: 4, m: 50.4, sigma_m: 0.2, v: 40.0, sigma_v: 0.3 },
    { id: 5, m: 63.0, sigma_m: 0.2, v: 50.0, sigma_v: 0.3 },
];

const averageGroup3: MeasurementRow[] = [
    { id: 1, m: 31.5, sigma_m: 0.2, v: 25.0, sigma_v: 0.3 },
    { id: 2, m: 31.6, sigma_m: 0.2, v: 25.1, sigma_v: 0.3 },
    { id: 3, m: 31.4, sigma_m: 0.2, v: 24.9, sigma_v: 0.3 },
];

export const densityMeasurementFixtures: { [key: string]: MeasurementRow[] } = {
    'density-measurement-fit-1': fitGroup1,
    'density-measurement-fit-2': fitGroup2,
    'density-measurement-fit-3': fitGroup3,
    'density-measurement-average-1': averageGroup1,
    'density-measurement-average-2': averageGroup2,
    'density-measurement-average-3': averageGroup3,
    // Manteniamo compatibilità con il vecchio formato
    'density-measurement-fit': fitGroup1,
    'density-measurement-average': averageGroup1,
};
