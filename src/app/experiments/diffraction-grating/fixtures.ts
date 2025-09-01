
import type { MeasurementRow } from "@/lib/types";

// Gruppo 1: Laser He-Ne (632.8 nm) con reticolo 600 linee/mm
const doubleGroup1: MeasurementRow[] = [
    { id: 1, d: 1.667e-6, sigma_d: 1e-9, L: 1.0, sigma_L: 0.001, m: 1, y_2m: 0.82, sigma_y_2m: 0.002 },
];

const singleGroup1: MeasurementRow[] = [
    { id: 1, d: 1.667e-6, sigma_d: 1e-9, L: 1.0, sigma_L: 0.001, m: 1, y_m: 0.41, sigma_y_m: 0.001 },
];

// Gruppo 2: Laser verde (532 nm) con reticolo 300 linee/mm
const doubleGroup2: MeasurementRow[] = [
    { id: 1, d: 3.333e-6, sigma_d: 2e-9, L: 1.2, sigma_L: 0.002, m: 1, y_2m: 0.64, sigma_y_2m: 0.003 },
];

const singleGroup2: MeasurementRow[] = [
    { id: 1, d: 3.333e-6, sigma_d: 2e-9, L: 1.2, sigma_L: 0.002, m: 1, y_m: 0.32, sigma_y_m: 0.002 },
];

// Gruppo 3: Laser blu (450 nm) con reticolo 1000 linee/mm
const doubleGroup3: MeasurementRow[] = [
    { id: 1, d: 1.0e-6, sigma_d: 0.5e-9, L: 0.8, sigma_L: 0.001, m: 1, y_2m: 0.72, sigma_y_2m: 0.002 },
];

const singleGroup3: MeasurementRow[] = [
    { id: 1, d: 1.0e-6, sigma_d: 0.5e-9, L: 0.8, sigma_L: 0.001, m: 1, y_m: 0.36, sigma_y_m: 0.001 },
];

export const diffractionGratingFixtures: { [key: string]: MeasurementRow[] } = {
    'diffraction-grating-double-1': doubleGroup1,
    'diffraction-grating-double-2': doubleGroup2,
    'diffraction-grating-double-3': doubleGroup3,
    'diffraction-grating-single-1': singleGroup1,
    'diffraction-grating-single-2': singleGroup2,
    'diffraction-grating-single-3': singleGroup3,
    // Manteniamo compatibilità con il vecchio formato
    'diffraction-grating-double': doubleGroup1,
    'diffraction-grating-single': singleGroup1,
};
