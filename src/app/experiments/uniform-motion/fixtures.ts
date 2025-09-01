
import type { MeasurementRow } from "@/lib/types";

// Gruppo 1: Carrello su rotaia ad aria (velocità media)
const positionsFitGroup1: MeasurementRow[] = [
    { id: 1, t: 0.5, sigma_t: 0.01, x: 1.1, sigma_x: 0.05 },
    { id: 2, t: 1.0, sigma_t: 0.01, x: 2.0, sigma_x: 0.05 },
    { id: 3, t: 1.5, sigma_t: 0.01, x: 2.9, sigma_x: 0.05 },
    { id: 4, t: 2.0, sigma_t: 0.01, x: 4.1, sigma_x: 0.05 },
    { id: 5, t: 2.5, sigma_t: 0.01, x: 5.0, sigma_x: 0.05 },
];

const positionsAverageGroup1: MeasurementRow[] = [
    { id: 1, t: 1.0, sigma_t: 0.01, x: 2.0, sigma_x: 0.05 },
    { id: 2, t: 1.0, sigma_t: 0.01, x: 2.1, sigma_x: 0.05 },
    { id: 3, t: 1.0, sigma_t: 0.01, x: 1.9, sigma_x: 0.05 },
];

const displacementsAverageGroup1: MeasurementRow[] = [
    { id: 1, t: 0.5, sigma_t: 0.01, x: 1.0, sigma_x: 0.05 },
    { id: 2, t: 1.0, sigma_t: 0.01, x: 2.0, sigma_x: 0.05 },
    { id: 3, t: 1.5, sigma_t: 0.01, x: 3.0, sigma_x: 0.05 },
];

// Gruppo 2: Sfera su piano orizzontale (velocità alta)
const positionsFitGroup2: MeasurementRow[] = [
    { id: 1, t: 0.2, sigma_t: 0.005, x: 0.8, sigma_x: 0.02 },
    { id: 2, t: 0.4, sigma_t: 0.005, x: 1.6, sigma_x: 0.02 },
    { id: 3, t: 0.6, sigma_t: 0.005, x: 2.4, sigma_x: 0.02 },
    { id: 4, t: 0.8, sigma_t: 0.005, x: 3.2, sigma_x: 0.02 },
    { id: 5, t: 1.0, sigma_t: 0.005, x: 4.0, sigma_x: 0.02 },
];

const positionsAverageGroup2: MeasurementRow[] = [
    { id: 1, t: 0.5, sigma_t: 0.005, x: 2.0, sigma_x: 0.02 },
    { id: 2, t: 0.5, sigma_t: 0.005, x: 1.98, sigma_x: 0.02 },
    { id: 3, t: 0.5, sigma_t: 0.005, x: 2.02, sigma_x: 0.02 },
];

const displacementsAverageGroup2: MeasurementRow[] = [
    { id: 1, t: 0.25, sigma_t: 0.005, x: 1.0, sigma_x: 0.02 },
    { id: 2, t: 0.5, sigma_t: 0.005, x: 2.0, sigma_x: 0.02 },
    { id: 3, t: 0.75, sigma_t: 0.005, x: 3.0, sigma_x: 0.02 },
];

// Gruppo 3: Oggetto su nastro trasportatore (velocità bassa)
const positionsFitGroup3: MeasurementRow[] = [
    { id: 1, t: 1.0, sigma_t: 0.02, x: 0.15, sigma_x: 0.01 },
    { id: 2, t: 2.0, sigma_t: 0.02, x: 0.30, sigma_x: 0.01 },
    { id: 3, t: 3.0, sigma_t: 0.02, x: 0.45, sigma_x: 0.01 },
    { id: 4, t: 4.0, sigma_t: 0.02, x: 0.60, sigma_x: 0.01 },
    { id: 5, t: 5.0, sigma_t: 0.02, x: 0.75, sigma_x: 0.01 },
];

const positionsAverageGroup3: MeasurementRow[] = [
    { id: 1, t: 2.0, sigma_t: 0.02, x: 0.30, sigma_x: 0.01 },
    { id: 2, t: 2.0, sigma_t: 0.02, x: 0.31, sigma_x: 0.01 },
    { id: 3, t: 2.0, sigma_t: 0.02, x: 0.29, sigma_x: 0.01 },
];

const displacementsAverageGroup3: MeasurementRow[] = [
    { id: 1, t: 1.0, sigma_t: 0.02, x: 0.15, sigma_x: 0.01 },
    { id: 2, t: 2.0, sigma_t: 0.02, x: 0.30, sigma_x: 0.01 },
    { id: 3, t: 3.0, sigma_t: 0.02, x: 0.45, sigma_x: 0.01 },
];

export const uniformMotionFixtures: { [key: string]: MeasurementRow[] } = {
    'uniform-motion-positions-fit-1': positionsFitGroup1,
    'uniform-motion-positions-fit-2': positionsFitGroup2,
    'uniform-motion-positions-fit-3': positionsFitGroup3,
    'uniform-motion-positions-average-1': positionsAverageGroup1,
    'uniform-motion-positions-average-2': positionsAverageGroup2,
    'uniform-motion-positions-average-3': positionsAverageGroup3,
    'uniform-motion-displacements-average-1': displacementsAverageGroup1,
    'uniform-motion-displacements-average-2': displacementsAverageGroup2,
    'uniform-motion-displacements-average-3': displacementsAverageGroup3,
    // Manteniamo compatibilità con il vecchio formato
    'uniform-motion-positions-fit': positionsFitGroup1,
    'uniform-motion-positions-average': positionsAverageGroup1,
    'uniform-motion-displacements-average': displacementsAverageGroup1,
};
