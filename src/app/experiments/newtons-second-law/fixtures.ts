
import type { MeasurementRow } from "@/lib/types";

// Gruppo 1: Sistema leggero (M=1kg, m=0.1kg)
const group1: MeasurementRow[] = [
    { id: 1, M: 1.0, sigma_M: 0.001, m: 0.1, sigma_m: 0.0001, t: 0.0, sigma_t: 0.02, x: 0.0, sigma_x: 0.01 },
    { id: 2, M: 1.0, sigma_M: 0.001, m: 0.1, sigma_m: 0.0001, t: 0.5, sigma_t: 0.02, x: 0.11, sigma_x: 0.01 },
    { id: 3, M: 1.0, sigma_M: 0.001, m: 0.1, sigma_m: 0.0001, t: 1.0, sigma_t: 0.02, x: 0.45, sigma_x: 0.01 },
    { id: 4, M: 1.0, sigma_M: 0.001, m: 0.1, sigma_m: 0.0001, t: 1.5, sigma_t: 0.02, x: 1.01, sigma_x: 0.01 },
    { id: 5, M: 1.0, sigma_M: 0.001, m: 0.1, sigma_m: 0.0001, t: 2.0, sigma_t: 0.02, x: 1.79, sigma_x: 0.01 },
];

// Gruppo 2: Sistema pesante (M=2kg, m=0.2kg)
const group2: MeasurementRow[] = [
    { id: 1, M: 2.0, sigma_M: 0.002, m: 0.2, sigma_m: 0.0002, t: 0.0, sigma_t: 0.02, x: 0.0, sigma_x: 0.01 },
    { id: 2, M: 2.0, sigma_M: 0.002, m: 0.2, sigma_m: 0.0002, t: 0.5, sigma_t: 0.02, x: 0.11, sigma_x: 0.01 },
    { id: 3, M: 2.0, sigma_M: 0.002, m: 0.2, sigma_m: 0.0002, t: 1.0, sigma_t: 0.02, x: 0.45, sigma_x: 0.01 },
    { id: 4, M: 2.0, sigma_M: 0.002, m: 0.2, sigma_m: 0.0002, t: 1.5, sigma_t: 0.02, x: 1.01, sigma_x: 0.01 },
    { id: 5, M: 2.0, sigma_M: 0.002, m: 0.2, sigma_m: 0.0002, t: 2.0, sigma_t: 0.02, x: 1.79, sigma_x: 0.01 },
];

// Gruppo 3: Sistema con massa trainante maggiore (M=0.5kg, m=0.15kg)
const group3: MeasurementRow[] = [
    { id: 1, M: 0.5, sigma_M: 0.0005, m: 0.15, sigma_m: 0.00015, t: 0.0, sigma_t: 0.01, x: 0.0, sigma_x: 0.005 },
    { id: 2, M: 0.5, sigma_M: 0.0005, m: 0.15, sigma_m: 0.00015, t: 0.5, sigma_t: 0.01, x: 0.18, sigma_x: 0.005 },
    { id: 3, M: 0.5, sigma_M: 0.0005, m: 0.15, sigma_m: 0.00015, t: 1.0, sigma_t: 0.01, x: 0.73, sigma_x: 0.005 },
    { id: 4, M: 0.5, sigma_M: 0.0005, m: 0.15, sigma_m: 0.00015, t: 1.5, sigma_t: 0.01, x: 1.64, sigma_x: 0.005 },
    { id: 5, M: 0.5, sigma_M: 0.0005, m: 0.15, sigma_m: 0.00015, t: 2.0, sigma_t: 0.01, x: 2.91, sigma_x: 0.005 },
];

export const newtonsSecondLawFixtures: { [key: string]: MeasurementRow[] } = {
    'newtons-second-law-1': group1,
    'newtons-second-law-2': group2,
    'newtons-second-law-3': group3,
    // Manteniamo compatibilità con il vecchio formato
    'newtons-second-law': group1,
};
