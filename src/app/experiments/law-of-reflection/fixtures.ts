
import type { MeasurementRow } from "@/lib/types";

// Gruppo 1: Specchio piano, errore 0.5°
const fitGroup1: MeasurementRow[] = [
    { id: 1, theta_i: 10, sigma_theta_i: 0.5, theta_r: 10.3, sigma_theta_r: 0.5 },
    { id: 2, theta_i: 20, sigma_theta_i: 0.5, theta_r: 19.7, sigma_theta_r: 0.5 },
    { id: 3, theta_i: 30, sigma_theta_i: 0.5, theta_r: 30.2, sigma_theta_r: 0.5 },
    { id: 4, theta_i: 40, sigma_theta_i: 0.5, theta_r: 39.8, sigma_theta_r: 0.5 },
    { id: 5, theta_i: 50, sigma_theta_i: 0.5, theta_r: 50.1, sigma_theta_r: 0.5 },
    { id: 6, theta_i: 60, sigma_theta_i: 0.5, theta_r: 59.7, sigma_theta_r: 0.5 },
];

const averageGroup1: MeasurementRow[] = [
    { id: 1, theta_i: 30, sigma_theta_i: 0.5, theta_r: 30.2, sigma_theta_r: 0.5 },
    { id: 2, theta_i: 30, sigma_theta_i: 0.5, theta_r: 29.8, sigma_theta_r: 0.5 },
    { id: 3, theta_i: 30, sigma_theta_i: 0.5, theta_r: 30.1, sigma_theta_r: 0.5 },
    { id: 4, theta_i: 45, sigma_theta_i: 0.5, theta_r: 44.7, sigma_theta_r: 0.5 },
    { id: 5, theta_i: 45, sigma_theta_i: 0.5, theta_r: 45.2, sigma_theta_r: 0.5 },
];

// Gruppo 2: Specchio piano, errore 1.0°
const fitGroup2: MeasurementRow[] = [
    { id: 1, theta_i: 15, sigma_theta_i: 1.0, theta_r: 14.5, sigma_theta_r: 1.0 },
    { id: 2, theta_i: 25, sigma_theta_i: 1.0, theta_r: 25.8, sigma_theta_r: 1.0 },
    { id: 3, theta_i: 35, sigma_theta_i: 1.0, theta_r: 34.6, sigma_theta_r: 1.0 },
    { id: 4, theta_i: 45, sigma_theta_i: 1.0, theta_r: 45.4, sigma_theta_r: 1.0 },
    { id: 5, theta_i: 55, sigma_theta_i: 1.0, theta_r: 54.7, sigma_theta_r: 1.0 },
];

const averageGroup2: MeasurementRow[] = [
    { id: 1, theta_i: 20, sigma_theta_i: 1.0, theta_r: 21.0, sigma_theta_r: 1.0 },
    { id: 2, theta_i: 20, sigma_theta_i: 1.0, theta_r: 19.5, sigma_theta_r: 1.0 },
    { id: 3, theta_i: 40, sigma_theta_i: 1.0, theta_r: 39.0, sigma_theta_r: 1.0 },
    { id: 4, theta_i: 40, sigma_theta_i: 1.0, theta_r: 40.5, sigma_theta_r: 1.0 },
];

// Gruppo 3: Specchio piano, errore 0.3°
const fitGroup3: MeasurementRow[] = [
    { id: 1, theta_i: 10, sigma_theta_i: 0.3, theta_r: 9.9, sigma_theta_r: 0.3 },
    { id: 2, theta_i: 20, sigma_theta_i: 0.3, theta_r: 20.1, sigma_theta_r: 0.3 },
    { id: 3, theta_i: 30, sigma_theta_i: 0.3, theta_r: 29.9, sigma_theta_r: 0.3 },
    { id: 4, theta_i: 40, sigma_theta_i: 0.3, theta_r: 40.2, sigma_theta_r: 0.3 },
    { id: 5, theta_i: 50, sigma_theta_i: 0.3, theta_r: 49.8, sigma_theta_r: 0.3 },
    { id: 6, theta_i: 60, sigma_theta_i: 0.3, theta_r: 60.1, sigma_theta_r: 0.3 },
];

const averageGroup3: MeasurementRow[] = [
    { id: 1, theta_i: 25, sigma_theta_i: 0.3, theta_r: 25.1, sigma_theta_r: 0.3 },
    { id: 2, theta_i: 25, sigma_theta_i: 0.3, theta_r: 24.9, sigma_theta_r: 0.3 },
    { id: 3, theta_i: 50, sigma_theta_i: 0.3, theta_r: 50.0, sigma_theta_r: 0.3 },
    { id: 4, theta_i: 50, sigma_theta_i: 0.3, theta_r: 49.8, sigma_theta_r: 0.3 },
];

export const lawOfReflectionFixtures: { [key: string]: MeasurementRow[] } = {
    'law-of-reflection-fit-1': fitGroup1,
    'law-of-reflection-fit-2': fitGroup2,
    'law-of-reflection-fit-3': fitGroup3,
    'law-of-reflection-average-1': averageGroup1,
    'law-of-reflection-average-2': averageGroup2,
    'law-of-reflection-average-3': averageGroup3,
    'law-of-reflection-fit': fitGroup1,
    'law-of-reflection-average': averageGroup1,
};
