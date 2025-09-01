
import type { MeasurementRow } from "@/lib/types";

// Gruppo 1: Aria-Vetro (n≈1.5)
const fitGroup1: MeasurementRow[] = [
    { id: 1, theta_i: 10, sigma_theta_i: 0.5, theta_r: 6.7, sigma_theta_r: 0.5 },
    { id: 2, theta_i: 20, sigma_theta_i: 0.5, theta_r: 13.3, sigma_theta_r: 0.5 },
    { id: 3, theta_i: 30, sigma_theta_i: 0.5, theta_r: 19.6, sigma_theta_r: 0.5 },
    { id: 4, theta_i: 40, sigma_theta_i: 0.5, theta_r: 25.4, sigma_theta_r: 0.5 },
    { id: 5, theta_i: 50, sigma_theta_i: 0.5, theta_r: 30.7, sigma_theta_r: 0.5 },
];

const averageGroup1: MeasurementRow[] = [
    { id: 1, theta_i: 30, sigma_theta_i: 0.5, theta_r: 19.6, sigma_theta_r: 0.5 },
    { id: 2, theta_i: 30, sigma_theta_i: 0.5, theta_r: 19.5, sigma_theta_r: 0.5 },
    { id: 3, theta_i: 30, sigma_theta_i: 0.5, theta_r: 19.7, sigma_theta_r: 0.5 },
];

// Gruppo 2: Aria-Acqua (n≈1.33)
const fitGroup2: MeasurementRow[] = [
    { id: 1, theta_i: 10, sigma_theta_i: 0.3, theta_r: 7.5, sigma_theta_r: 0.3 },
    { id: 2, theta_i: 20, sigma_theta_i: 0.3, theta_r: 14.9, sigma_theta_r: 0.3 },
    { id: 3, theta_i: 30, sigma_theta_i: 0.3, theta_r: 22.1, sigma_theta_r: 0.3 },
    { id: 4, theta_i: 40, sigma_theta_i: 0.3, theta_r: 28.9, sigma_theta_r: 0.3 },
    { id: 5, theta_i: 50, sigma_theta_i: 0.3, theta_r: 35.2, sigma_theta_r: 0.3 },
];

const averageGroup2: MeasurementRow[] = [
    { id: 1, theta_i: 25, sigma_theta_i: 0.3, theta_r: 18.6, sigma_theta_r: 0.3 },
    { id: 2, theta_i: 25, sigma_theta_i: 0.3, theta_r: 18.4, sigma_theta_r: 0.3 },
    { id: 3, theta_i: 25, sigma_theta_i: 0.3, theta_r: 18.8, sigma_theta_r: 0.3 },
];

// Gruppo 3: Aria-Plexiglass (n≈1.49)
const fitGroup3: MeasurementRow[] = [
    { id: 1, theta_i: 15, sigma_theta_i: 1.0, theta_r: 10.0, sigma_theta_r: 1.0 },
    { id: 2, theta_i: 25, sigma_theta_i: 1.0, theta_r: 16.6, sigma_theta_r: 1.0 },
    { id: 3, theta_i: 35, sigma_theta_i: 1.0, theta_r: 22.8, sigma_theta_r: 1.0 },
    { id: 4, theta_i: 45, sigma_theta_i: 1.0, theta_r: 28.1, sigma_theta_r: 1.0 },
    { id: 5, theta_i: 55, sigma_theta_i: 1.0, theta_r: 32.7, sigma_theta_r: 1.0 },
];

const averageGroup3: MeasurementRow[] = [
    { id: 1, theta_i: 35, sigma_theta_i: 1.0, theta_r: 22.8, sigma_theta_r: 1.0 },
    { id: 2, theta_i: 35, sigma_theta_i: 1.0, theta_r: 22.6, sigma_theta_r: 1.0 },
    { id: 3, theta_i: 35, sigma_theta_i: 1.0, theta_r: 23.0, sigma_theta_r: 1.0 },
];

export const snellsLawFixtures: { [key: string]: MeasurementRow[] } = {
    'snells-law-fit-1': fitGroup1,
    'snells-law-fit-2': fitGroup2,
    'snells-law-fit-3': fitGroup3,
    'snells-law-average-1': averageGroup1,
    'snells-law-average-2': averageGroup2,
    'snells-law-average-3': averageGroup3,
    // Manteniamo compatibilità con il vecchio formato
    'snells-law-fit': fitGroup1,
    'snells-law-average': averageGroup1,
};
