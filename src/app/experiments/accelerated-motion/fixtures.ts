
import type { MeasurementRow } from "@/lib/types";

// Gruppo 1: Carrello su piano inclinato (a = 10 m/s², v₀ = 1.0 m/s, x₀ = 0.5 m)
const fitGroup1: MeasurementRow[] = [
    { id: 1, t: 0.0, sigma_t: 0.02, x: 0.5, sigma_x: 0.05 },
    { id: 2, t: 0.5, sigma_t: 0.02, x: 2.25, sigma_x: 0.05 },
    { id: 3, t: 1.0, sigma_t: 0.02, x: 6.5, sigma_x: 0.05 },
    { id: 4, t: 1.5, sigma_t: 0.02, x: 13.25, sigma_x: 0.05 },
    { id: 5, t: 2.0, sigma_t: 0.02, x: 22.5, sigma_x: 0.05 },
];

// Gruppo 1 per fit lineare: moto che parte da fermo (a = 10 m/s², v₀ = 0, x₀ = 0)
const fitGroup1Linear: MeasurementRow[] = [
    { id: 1, t: 0.0, sigma_t: 0.02, x: 0.0, sigma_x: 0.05 },
    { id: 2, t: 0.5, sigma_t: 0.02, x: 1.25, sigma_x: 0.05 },
    { id: 3, t: 1.0, sigma_t: 0.02, x: 5.0, sigma_x: 0.05 },
    { id: 4, t: 1.5, sigma_t: 0.02, x: 11.25, sigma_x: 0.05 },
    { id: 5, t: 2.0, sigma_t: 0.02, x: 20.0, sigma_x: 0.05 },
];

const averageGroup1: MeasurementRow[] = [
    { id: 1, t: 0.5, sigma_t: 0.02, s: 1.75, sigma_s: 0.03 },
    { id: 2, t: 1.0, sigma_t: 0.02, s: 6.0, sigma_s: 0.05 },
    { id: 3, t: 1.5, sigma_t: 0.02, s: 10.25, sigma_s: 0.08 },
    { id: 4, t: 2.0, sigma_t: 0.02, s: 14.5, sigma_s: 0.1 },
];

// Gruppo 2: Sfera su rotaia (a = 10 m/s², v₀ = 2.0 m/s, x₀ = 0.2 m)
const fitGroup2: MeasurementRow[] = [
    { id: 1, t: 0.0, sigma_t: 0.01, x: 0.2, sigma_x: 0.03 },
    { id: 2, t: 0.3, sigma_t: 0.01, x: 1.25, sigma_x: 0.03 },
    { id: 3, t: 0.6, sigma_t: 0.01, x: 3.2, sigma_x: 0.03 },
    { id: 4, t: 0.9, sigma_t: 0.01, x: 6.05, sigma_x: 0.03 },
    { id: 5, t: 1.2, sigma_t: 0.01, x: 9.8, sigma_x: 0.03 },
];

const averageGroup2: MeasurementRow[] = [
    { id: 1, t: 0.3, sigma_t: 0.01, s: 1.05, sigma_s: 0.02 },
    { id: 2, t: 0.6, sigma_t: 0.01, s: 1.95, sigma_s: 0.03 },
    { id: 3, t: 0.9, sigma_t: 0.01, s: 2.85, sigma_s: 0.05 },
    { id: 4, t: 1.2, sigma_t: 0.01, s: 3.75, sigma_s: 0.07 },
];

// Gruppo 3: Carrello su piano poco inclinato (a = 10 m/s², v₀ = 0.5 m/s, x₀ = 0.1 m)
const fitGroup3: MeasurementRow[] = [
    { id: 1, t: 0.0, sigma_t: 0.05, x: 0.1, sigma_x: 0.02 },
    { id: 2, t: 1.0, sigma_t: 0.05, x: 5.6, sigma_x: 0.02 },
    { id: 3, t: 2.0, sigma_t: 0.05, x: 21.1, sigma_x: 0.02 },
    { id: 4, t: 3.0, sigma_t: 0.05, x: 46.6, sigma_x: 0.02 },
    { id: 5, t: 4.0, sigma_t: 0.05, x: 82.1, sigma_x: 0.02 },
];

const averageGroup3: MeasurementRow[] = [
    { id: 1, t: 1.0, sigma_t: 0.05, s: 5.5, sigma_s: 0.01 },
    { id: 2, t: 2.0, sigma_t: 0.05, s: 15.5, sigma_s: 0.02 },
    { id: 3, t: 3.0, sigma_t: 0.05, s: 25.5, sigma_s: 0.03 },
    { id: 4, t: 4.0, sigma_t: 0.05, s: 35.5, sigma_s: 0.04 },
];

export const acceleratedMotionFixtures: { [key: string]: MeasurementRow[] } = {
    // Nuovi formati per i metodi aggiornati
    'accelerated-motion-fit_polynomial-1': fitGroup1,
    'accelerated-motion-fit_polynomial-2': fitGroup2,
    'accelerated-motion-fit_polynomial-3': fitGroup3,
    'accelerated-motion-fit_linear-1': fitGroup1Linear,
    'accelerated-motion-fit_linear-2': fitGroup2,
    'accelerated-motion-fit_linear-3': fitGroup3,
    'accelerated-motion-average-1': averageGroup1,
    'accelerated-motion-average-2': averageGroup2,
    'accelerated-motion-average-3': averageGroup3,
    // Manteniamo compatibilità con il vecchio formato
    'accelerated-motion-fit-1': fitGroup1,
    'accelerated-motion-fit-2': fitGroup2,
    'accelerated-motion-fit-3': fitGroup3,
    'accelerated-motion-fit': fitGroup1,
    'accelerated-motion-average': averageGroup1,
    'accelerated-motion-fit_polynomial': fitGroup1,
    'accelerated-motion-fit_linear': fitGroup1Linear,
};
