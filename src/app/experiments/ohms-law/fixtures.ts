
import type { MeasurementRow } from "@/lib/types";

// Gruppo 1: Resistore da 10Ω (resistenza media)
const fitGroup1: MeasurementRow[] = [
    { id: 1, v: 1.0, sigma_v: 0.05, i: 0.10, sigma_i: 0.01 },
    { id: 2, v: 2.0, sigma_v: 0.05, i: 0.21, sigma_i: 0.01 },
    { id: 3, v: 3.0, sigma_v: 0.05, i: 0.29, sigma_i: 0.01 },
    { id: 4, v: 4.0, sigma_v: 0.05, i: 0.41, sigma_i: 0.01 },
    { id: 5, v: 5.0, sigma_v: 0.05, i: 0.50, sigma_i: 0.01 },
];

const averageGroup1: MeasurementRow[] = [
    { id: 1, v: 10.0, sigma_v: 0.1, i: 0.99, sigma_i: 0.02 },
    { id: 2, v: 10.0, sigma_v: 0.1, i: 1.01, sigma_i: 0.02 },
    { id: 3, v: 10.0, sigma_v: 0.1, i: 1.00, sigma_i: 0.02 },
];

// Gruppo 2: Resistore da 22Ω (resistenza alta)
const fitGroup2: MeasurementRow[] = [
    { id: 1, v: 1.1, sigma_v: 0.02, i: 0.050, sigma_i: 0.005 },
    { id: 2, v: 2.2, sigma_v: 0.02, i: 0.100, sigma_i: 0.005 },
    { id: 3, v: 3.3, sigma_v: 0.02, i: 0.150, sigma_i: 0.005 },
    { id: 4, v: 4.4, sigma_v: 0.02, i: 0.200, sigma_i: 0.005 },
    { id: 5, v: 5.5, sigma_v: 0.02, i: 0.250, sigma_i: 0.005 },
];

const averageGroup2: MeasurementRow[] = [
    { id: 1, v: 6.6, sigma_v: 0.02, i: 0.299, sigma_i: 0.005 },
    { id: 2, v: 6.6, sigma_v: 0.02, i: 0.301, sigma_i: 0.005 },
    { id: 3, v: 6.6, sigma_v: 0.02, i: 0.300, sigma_i: 0.005 },
];

// Gruppo 3: Resistore da 4.7Ω (resistenza bassa)
const fitGroup3: MeasurementRow[] = [
    { id: 1, v: 0.94, sigma_v: 0.1, i: 0.20, sigma_i: 0.02 },
    { id: 2, v: 1.88, sigma_v: 0.1, i: 0.40, sigma_i: 0.02 },
    { id: 3, v: 2.82, sigma_v: 0.1, i: 0.60, sigma_i: 0.02 },
    { id: 4, v: 3.76, sigma_v: 0.1, i: 0.80, sigma_i: 0.02 },
    { id: 5, v: 4.70, sigma_v: 0.1, i: 1.00, sigma_i: 0.02 },
];

const averageGroup3: MeasurementRow[] = [
    { id: 1, v: 2.35, sigma_v: 0.1, i: 0.49, sigma_i: 0.02 },
    { id: 2, v: 2.35, sigma_v: 0.1, i: 0.51, sigma_i: 0.02 },
    { id: 3, v: 2.35, sigma_v: 0.1, i: 0.50, sigma_i: 0.02 },
];

export const ohmsLawFixtures: { [key: string]: MeasurementRow[] } = {
    'ohms-law-fit-1': fitGroup1,
    'ohms-law-fit-2': fitGroup2,
    'ohms-law-fit-3': fitGroup3,
    'ohms-law-average-1': averageGroup1,
    'ohms-law-average-2': averageGroup2,
    'ohms-law-average-3': averageGroup3,
    // Manteniamo compatibilità con il vecchio formato
    'ohms-law-fit': fitGroup1,
    'ohms-law-average': averageGroup1,
};
