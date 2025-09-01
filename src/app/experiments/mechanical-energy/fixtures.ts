
import type { MeasurementRow } from "@/lib/types";

// Gruppo 1: Carrello leggero con massa piccola
const massGroup1: MeasurementRow[] = [
    // a = (m*g) / (M+m) = (0.05 * 9.81) / 1.05 = 0.467 m/s^2
    // t = sqrt(2*d/a) = sqrt(2*1/0.467) = 2.07s
    { id: 1, M: 1.0, sigma_M: 0.001, m: 0.05, sigma_m: 0.0001, d: 1.0, sigma_d: 0.005, t: 2.07, sigma_t: 0.02 },
];

const forceGroup1: MeasurementRow[] = [
    // a = F/M = 0.49 / 1.0 = 0.49 m/s^2
    // t = sqrt(2*d/a) = sqrt(2*1/0.49) = 2.02s
    { id: 1, M: 1.0, sigma_M: 0.001, F: 0.49, sigma_F: 0.01, d: 1.0, sigma_d: 0.005, t: 2.02, sigma_t: 0.02 },
];

// Gruppo 2: Carrello pesante con massa maggiore
const massGroup2: MeasurementRow[] = [
    // a = (m*g) / (M+m) = (0.1 * 9.81) / 2.1 = 0.467 m/s^2
    // t = sqrt(2*d/a) = sqrt(2*1.5/0.467) = 2.54s
    { id: 1, M: 2.0, sigma_M: 0.002, m: 0.1, sigma_m: 0.0002, d: 1.5, sigma_d: 0.01, t: 2.54, sigma_t: 0.03 },
];

const forceGroup2: MeasurementRow[] = [
    // a = F/M = 0.98 / 2.0 = 0.49 m/s^2
    // t = sqrt(2*d/a) = sqrt(2*1.5/0.49) = 2.47s
    { id: 1, M: 2.0, sigma_M: 0.002, F: 0.98, sigma_F: 0.02, d: 1.5, sigma_d: 0.01, t: 2.47, sigma_t: 0.03 },
];

// Gruppo 3: Sistema con distanza maggiore
const massGroup3: MeasurementRow[] = [
    // a = (m*g) / (M+m) = (0.08 * 9.81) / 1.58 = 0.497 m/s^2
    // t = sqrt(2*d/a) = sqrt(2*2.0/0.497) = 2.84s
    { id: 1, M: 1.5, sigma_M: 0.0015, m: 0.08, sigma_m: 0.00015, d: 2.0, sigma_d: 0.01, t: 2.84, sigma_t: 0.04 },
];

const forceGroup3: MeasurementRow[] = [
    // a = F/M = 0.785 / 1.5 = 0.523 m/s^2
    // t = sqrt(2*d/a) = sqrt(2*2.0/0.523) = 2.77s
    { id: 1, M: 1.5, sigma_M: 0.0015, F: 0.785, sigma_F: 0.015, d: 2.0, sigma_d: 0.01, t: 2.77, sigma_t: 0.04 },
];

export const mechanicalEnergyFixtures: { [key: string]: MeasurementRow[] } = {
    'mechanical-energy-mass-1': massGroup1,
    'mechanical-energy-mass-2': massGroup2,
    'mechanical-energy-mass-3': massGroup3,
    'mechanical-energy-force-1': forceGroup1,
    'mechanical-energy-force-2': forceGroup2,
    'mechanical-energy-force-3': forceGroup3,
    // Manteniamo compatibilità con il vecchio formato
    'mechanical-energy-mass': massGroup1,
    'mechanical-energy-force': forceGroup1,
};
