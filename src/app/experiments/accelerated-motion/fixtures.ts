
import type { MeasurementRow } from "@/lib/types";

// Gruppo 1: Carrello su piano inclinato (accelerazione moderata)
const fitGroup1: MeasurementRow[] = [
    { id: 1, t: 0.0, sigma_t: 0.02, x: 0.5, sigma_x: 0.05 },
    { id: 2, t: 0.5, sigma_t: 0.02, x: 1.13, sigma_x: 0.05 },
    { id: 3, t: 1.0, sigma_t: 0.02, x: 2.5, sigma_x: 0.05 },
    { id: 4, t: 1.5, sigma_t: 0.02, x: 4.63, sigma_x: 0.05 },
    { id: 5, t: 2.0, sigma_t: 0.02, x: 7.5, sigma_x: 0.05 },
];

const averageGroup1: MeasurementRow[] = [
    { id: 1, t: 0.5, sigma_t: 0.02, s: 0.625, sigma_s: 0.03 },
    { id: 2, t: 1.0, sigma_t: 0.02, s: 2.5, sigma_s: 0.05 },
    { id: 3, t: 1.5, sigma_t: 0.02, s: 5.625, sigma_s: 0.08 },
    { id: 4, t: 2.0, sigma_t: 0.02, s: 10.0, sigma_s: 0.1 },
];

// Gruppo 2: Sfera su rotaia (accelerazione alta)
const fitGroup2: MeasurementRow[] = [
    { id: 1, t: 0.0, sigma_t: 0.01, x: 0.2, sigma_x: 0.03 },
    { id: 2, t: 0.3, sigma_t: 0.01, x: 0.89, sigma_x: 0.03 },
    { id: 3, t: 0.6, sigma_t: 0.01, x: 2.0, sigma_x: 0.03 },
    { id: 4, t: 0.9, sigma_t: 0.01, x: 3.61, sigma_x: 0.03 },
    { id: 5, t: 1.2, sigma_t: 0.01, x: 5.72, sigma_x: 0.03 },
];

const averageGroup2: MeasurementRow[] = [
    { id: 1, t: 0.3, sigma_t: 0.01, s: 0.45, sigma_s: 0.02 },
    { id: 2, t: 0.6, sigma_t: 0.01, s: 1.8, sigma_s: 0.03 },
    { id: 3, t: 0.9, sigma_t: 0.01, s: 4.05, sigma_s: 0.05 },
    { id: 4, t: 1.2, sigma_t: 0.01, s: 7.2, sigma_s: 0.07 },
];

// Gruppo 3: Carrello su piano poco inclinato (accelerazione bassa)
const fitGroup3: MeasurementRow[] = [
    { id: 1, t: 0.0, sigma_t: 0.05, x: 0.1, sigma_x: 0.02 },
    { id: 2, t: 1.0, sigma_t: 0.05, x: 0.6, sigma_x: 0.02 },
    { id: 3, t: 2.0, sigma_t: 0.05, x: 1.6, sigma_x: 0.02 },
    { id: 4, t: 3.0, sigma_t: 0.05, x: 3.1, sigma_x: 0.02 },
    { id: 5, t: 4.0, sigma_t: 0.05, x: 5.1, sigma_x: 0.02 },
];

const averageGroup3: MeasurementRow[] = [
    { id: 1, t: 1.0, sigma_t: 0.05, s: 0.25, sigma_s: 0.01 },
    { id: 2, t: 2.0, sigma_t: 0.05, s: 1.0, sigma_s: 0.02 },
    { id: 3, t: 3.0, sigma_t: 0.05, s: 2.25, sigma_s: 0.03 },
    { id: 4, t: 4.0, sigma_t: 0.05, s: 4.0, sigma_s: 0.04 },
];

export const acceleratedMotionFixtures: { [key: string]: MeasurementRow[] } = {
    'accelerated-motion-fit-1': fitGroup1,
    'accelerated-motion-fit-2': fitGroup2,
    'accelerated-motion-fit-3': fitGroup3,
    'accelerated-motion-average-1': averageGroup1,
    'accelerated-motion-average-2': averageGroup2,
    'accelerated-motion-average-3': averageGroup3,
    // Manteniamo compatibilità con il vecchio formato
    'accelerated-motion-fit': fitGroup1,
    'accelerated-motion-average': averageGroup1,
};
