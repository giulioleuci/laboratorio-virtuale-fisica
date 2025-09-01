
import type { MeasurementRow } from "@/lib/types";

// Gruppo 1: Pendolo semplice in laboratorio (condizioni standard)
const fitGroup1: MeasurementRow[] = [
    { id: 1, l: 0.20, sigma_l: 0.001, t: 17.8, sigma_t: 0.2, n: 20 },
    { id: 2, l: 0.30, sigma_l: 0.001, t: 22.0, sigma_t: 0.2, n: 20 },
    { id: 3, l: 0.40, sigma_l: 0.001, t: 25.2, sigma_t: 0.2, n: 20 },
    { id: 4, l: 0.50, sigma_l: 0.001, t: 28.4, sigma_t: 0.2, n: 20 },
    { id: 5, l: 0.60, sigma_l: 0.001, t: 31.0, sigma_t: 0.2, n: 20 },
    { id: 6, l: 0.70, sigma_l: 0.001, t: 33.6, sigma_t: 0.2, n: 20 },
];

const averageGroup1: MeasurementRow[] = [
    { id: 1, l: 0.50, sigma_l: 0.001, t: 28.4, sigma_t: 0.2, n: 20 },
    { id: 2, l: 0.50, sigma_l: 0.001, t: 28.2, sigma_t: 0.2, n: 20 },
    { id: 3, l: 0.50, sigma_l: 0.001, t: 28.6, sigma_t: 0.2, n: 20 },
];

// Gruppo 2: Pendolo con massa maggiore (misure più precise)
const fitGroup2: MeasurementRow[] = [
    { id: 1, l: 0.15, sigma_l: 0.0005, t: 15.5, sigma_t: 0.1, n: 25 },
    { id: 2, l: 0.25, sigma_l: 0.0005, t: 20.0, sigma_t: 0.1, n: 25 },
    { id: 3, l: 0.35, sigma_l: 0.0005, t: 23.7, sigma_t: 0.1, n: 25 },
    { id: 4, l: 0.45, sigma_l: 0.0005, t: 26.9, sigma_t: 0.1, n: 25 },
    { id: 5, l: 0.55, sigma_l: 0.0005, t: 29.7, sigma_t: 0.1, n: 25 },
    { id: 6, l: 0.65, sigma_l: 0.0005, t: 32.3, sigma_t: 0.1, n: 25 },
];

const averageGroup2: MeasurementRow[] = [
    { id: 1, l: 0.40, sigma_l: 0.0005, t: 25.3, sigma_t: 0.1, n: 25 },
    { id: 2, l: 0.40, sigma_l: 0.0005, t: 25.1, sigma_t: 0.1, n: 25 },
    { id: 3, l: 0.40, sigma_l: 0.0005, t: 25.5, sigma_t: 0.1, n: 25 },
];

// Gruppo 3: Pendolo con filo più lungo (oscillazioni ampie)
const fitGroup3: MeasurementRow[] = [
    { id: 1, l: 0.80, sigma_l: 0.002, t: 35.8, sigma_t: 0.3, n: 15 },
    { id: 2, l: 0.90, sigma_l: 0.002, t: 38.0, sigma_t: 0.3, n: 15 },
    { id: 3, l: 1.00, sigma_l: 0.002, t: 40.1, sigma_t: 0.3, n: 15 },
    { id: 4, l: 1.10, sigma_l: 0.002, t: 42.0, sigma_t: 0.3, n: 15 },
    { id: 5, l: 1.20, sigma_l: 0.002, t: 43.9, sigma_t: 0.3, n: 15 },
    { id: 6, l: 1.30, sigma_l: 0.002, t: 45.7, sigma_t: 0.3, n: 15 },
];

const averageGroup3: MeasurementRow[] = [
    { id: 1, l: 1.00, sigma_l: 0.002, t: 40.1, sigma_t: 0.3, n: 15 },
    { id: 2, l: 1.00, sigma_l: 0.002, t: 39.8, sigma_t: 0.3, n: 15 },
    { id: 3, l: 1.00, sigma_l: 0.002, t: 40.4, sigma_t: 0.3, n: 15 },
];

export const pendulumFixtures: { [key: string]: MeasurementRow[] } = {
    'pendulum-fit-1': fitGroup1,
    'pendulum-fit-2': fitGroup2,
    'pendulum-fit-3': fitGroup3,
    'pendulum-average-1': averageGroup1,
    'pendulum-average-2': averageGroup2,
    'pendulum-average-3': averageGroup3,
    // Manteniamo compatibilità con il vecchio formato
    'pendulum-fit': fitGroup1,
    'pendulum-average': averageGroup1,
};
