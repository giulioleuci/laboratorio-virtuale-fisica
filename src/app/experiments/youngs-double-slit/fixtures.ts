
import type { MeasurementRow } from "@/lib/types";

// Gruppo 1: Laser verde (532 nm), d = 0.1 mm, L = 2 m
const doubleGroup1: MeasurementRow[] = [
    { id: 1, d: 0.0001, sigma_d: 1e-6, L: 2.0, sigma_L: 0.005, m: 1, y_2m: 0.0213, sigma_y_2m: 0.0001 },
];

const singleGroup1: MeasurementRow[] = [
    { id: 1, d: 0.0001, sigma_d: 1e-6, L: 2.0, sigma_L: 0.005, m: 1, y_m: 0.0106, sigma_y_m: 0.00005 },
];

// Gruppo 2: Laser rosso (650 nm), d = 0.05 mm, L = 1.5 m
const doubleGroup2: MeasurementRow[] = [
    { id: 1, d: 0.00005, sigma_d: 5e-7, L: 1.5, sigma_L: 0.003, m: 1, y_2m: 0.039, sigma_y_2m: 0.0002 },
];

const singleGroup2: MeasurementRow[] = [
    { id: 1, d: 0.00005, sigma_d: 5e-7, L: 1.5, sigma_L: 0.003, m: 1, y_m: 0.0195, sigma_y_m: 0.0001 },
];

// Gruppo 3: Laser blu (450 nm), d = 0.2 mm, L = 3 m
const doubleGroup3: MeasurementRow[] = [
    { id: 1, d: 0.0002, sigma_d: 2e-6, L: 3.0, sigma_L: 0.008, m: 1, y_2m: 0.0135, sigma_y_2m: 0.00008 },
];

const singleGroup3: MeasurementRow[] = [
    { id: 1, d: 0.0002, sigma_d: 2e-6, L: 3.0, sigma_L: 0.008, m: 1, y_m: 0.00675, sigma_y_m: 0.00004 },
];

export const youngsDoubleSlitFixtures: { [key: string]: MeasurementRow[] } = {
    'youngs-double-slit-double-1': doubleGroup1,
    'youngs-double-slit-double-2': doubleGroup2,
    'youngs-double-slit-double-3': doubleGroup3,
    'youngs-double-slit-single-1': singleGroup1,
    'youngs-double-slit-single-2': singleGroup2,
    'youngs-double-slit-single-3': singleGroup3,
    // Manteniamo compatibilità con il vecchio formato
    'youngs-double-slit-double': doubleGroup1,
    'youngs-double-slit-single': singleGroup1,
};
