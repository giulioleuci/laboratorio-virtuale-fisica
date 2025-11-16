
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

// Fixtures per metodo indiretto (misura volume con v_i e v_f)
// Gruppo 1: Acqua (densità ~1 g/cm³)
const indirectFitGroup1: MeasurementRow[] = [
    { id: 1, m: 10.1, sigma_m: 0.1, v_i: 50.0, sigma_v_i: 0.5, v_f: 60.0, sigma_v_f: 0.5 },
    { id: 2, m: 20.0, sigma_m: 0.1, v_i: 50.0, sigma_v_i: 0.5, v_f: 70.2, sigma_v_f: 0.5 },
    { id: 3, m: 29.8, sigma_m: 0.1, v_i: 50.0, sigma_v_i: 0.5, v_f: 80.0, sigma_v_f: 0.5 },
    { id: 4, m: 40.3, sigma_m: 0.1, v_i: 50.0, sigma_v_i: 0.5, v_f: 90.1, sigma_v_f: 0.5 },
    { id: 5, m: 49.9, sigma_m: 0.1, v_i: 50.0, sigma_v_i: 0.5, v_f: 100.0, sigma_v_f: 0.5 },
];

const indirectAverageGroup1: MeasurementRow[] = [
    { id: 1, m: 50.0, sigma_m: 0.1, v_i: 30.0, sigma_v_i: 0.5, v_f: 80.1, sigma_v_f: 0.5 },
    { id: 2, m: 50.1, sigma_m: 0.1, v_i: 30.0, sigma_v_i: 0.5, v_f: 79.9, sigma_v_f: 0.5 },
    { id: 3, m: 49.9, sigma_m: 0.1, v_i: 30.0, sigma_v_i: 0.5, v_f: 80.0, sigma_v_f: 0.5 },
];

// Gruppo 2: Olio vegetale (densità ~0.92 g/cm³)
const indirectFitGroup2: MeasurementRow[] = [
    { id: 1, m: 9.2, sigma_m: 0.05, v_i: 40.0, sigma_v_i: 0.3, v_f: 50.0, sigma_v_f: 0.3 },
    { id: 2, m: 18.4, sigma_m: 0.05, v_i: 40.0, sigma_v_i: 0.3, v_f: 60.0, sigma_v_f: 0.3 },
    { id: 3, m: 27.6, sigma_m: 0.05, v_i: 40.0, sigma_v_i: 0.3, v_f: 70.0, sigma_v_f: 0.3 },
    { id: 4, m: 36.8, sigma_m: 0.05, v_i: 40.0, sigma_v_i: 0.3, v_f: 80.0, sigma_v_f: 0.3 },
    { id: 5, m: 46.0, sigma_m: 0.05, v_i: 40.0, sigma_v_i: 0.3, v_f: 90.0, sigma_v_f: 0.3 },
];

const indirectAverageGroup2: MeasurementRow[] = [
    { id: 1, m: 23.0, sigma_m: 0.05, v_i: 35.0, sigma_v_i: 0.3, v_f: 60.0, sigma_v_f: 0.3 },
    { id: 2, m: 23.1, sigma_m: 0.05, v_i: 35.0, sigma_v_i: 0.3, v_f: 60.1, sigma_v_f: 0.3 },
    { id: 3, m: 22.9, sigma_m: 0.05, v_i: 35.0, sigma_v_i: 0.3, v_f: 59.9, sigma_v_f: 0.3 },
];

// Gruppo 3: Glicerina (densità ~1.26 g/cm³)
const indirectFitGroup3: MeasurementRow[] = [
    { id: 1, m: 12.6, sigma_m: 0.2, v_i: 45.0, sigma_v_i: 0.6, v_f: 55.0, sigma_v_f: 0.6 },
    { id: 2, m: 25.2, sigma_m: 0.2, v_i: 45.0, sigma_v_i: 0.6, v_f: 65.0, sigma_v_f: 0.6 },
    { id: 3, m: 37.8, sigma_m: 0.2, v_i: 45.0, sigma_v_i: 0.6, v_f: 75.0, sigma_v_f: 0.6 },
    { id: 4, m: 50.4, sigma_m: 0.2, v_i: 45.0, sigma_v_i: 0.6, v_f: 85.0, sigma_v_f: 0.6 },
    { id: 5, m: 63.0, sigma_m: 0.2, v_i: 45.0, sigma_v_i: 0.6, v_f: 95.0, sigma_v_f: 0.6 },
];

const indirectAverageGroup3: MeasurementRow[] = [
    { id: 1, m: 31.5, sigma_m: 0.2, v_i: 42.0, sigma_v_i: 0.6, v_f: 67.0, sigma_v_f: 0.6 },
    { id: 2, m: 31.6, sigma_m: 0.2, v_i: 42.0, sigma_v_i: 0.6, v_f: 67.1, sigma_v_f: 0.6 },
    { id: 3, m: 31.4, sigma_m: 0.2, v_i: 42.0, sigma_v_i: 0.6, v_f: 66.9, sigma_v_f: 0.6 },
];

export const densityMeasurementFixtures: { [key: string]: MeasurementRow[] } = {
    // Metodo diretto
    'density-measurement-direct-fit-1': fitGroup1,
    'density-measurement-direct-fit-2': fitGroup2,
    'density-measurement-direct-fit-3': fitGroup3,
    'density-measurement-direct-average-1': averageGroup1,
    'density-measurement-direct-average-2': averageGroup2,
    'density-measurement-direct-average-3': averageGroup3,
    // Metodo indiretto
    'density-measurement-indirect-fit-1': indirectFitGroup1,
    'density-measurement-indirect-fit-2': indirectFitGroup2,
    'density-measurement-indirect-fit-3': indirectFitGroup3,
    'density-measurement-indirect-average-1': indirectAverageGroup1,
    'density-measurement-indirect-average-2': indirectAverageGroup2,
    'density-measurement-indirect-average-3': indirectAverageGroup3,
    // Manteniamo compatibilità con il vecchio formato
    'density-measurement-fit': fitGroup1,
    'density-measurement-average': averageGroup1,
};
