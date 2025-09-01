
import type { MeasurementRow } from "@/lib/types";

// Gruppo 1: Resistori di precisione (tolleranza 1%)
const seriesGroup1: MeasurementRow[] = [
    { id: 1, r: 100, sigma_r: 1 },
    { id: 2, r: 220, sigma_r: 2 },
    { id: 3, r: 470, sigma_r: 5 },
];

const parallelGroup1: MeasurementRow[] = [
    { id: 1, r: 100, sigma_r: 1 },
    { id: 2, r: 220, sigma_r: 2 },
    { id: 3, r: 470, sigma_r: 5 },
];

// Gruppo 2: Resistori standard (tolleranza 5%)
const seriesGroup2: MeasurementRow[] = [
    { id: 1, r: 150, sigma_r: 8 },
    { id: 2, r: 330, sigma_r: 16 },
    { id: 3, r: 680, sigma_r: 34 },
];

const parallelGroup2: MeasurementRow[] = [
    { id: 1, r: 150, sigma_r: 8 },
    { id: 2, r: 330, sigma_r: 16 },
    { id: 3, r: 680, sigma_r: 34 },
];

// Gruppo 3: Resistori di potenza (valori alti)
const seriesGroup3: MeasurementRow[] = [
    { id: 1, r: 1000, sigma_r: 50 },
    { id: 2, r: 2200, sigma_r: 110 },
    { id: 3, r: 4700, sigma_r: 235 },
];

const parallelGroup3: MeasurementRow[] = [
    { id: 1, r: 1000, sigma_r: 50 },
    { id: 2, r: 2200, sigma_r: 110 },
    { id: 3, r: 4700, sigma_r: 235 },
];

export const resistorsFixtures: { [key: string]: MeasurementRow[] } = {
    'resistors-series-1': seriesGroup1,
    'resistors-series-2': seriesGroup2,
    'resistors-series-3': seriesGroup3,
    'resistors-parallel-1': parallelGroup1,
    'resistors-parallel-2': parallelGroup2,
    'resistors-parallel-3': parallelGroup3,
    // Manteniamo compatibilità con il vecchio formato
    'resistors-series': seriesGroup1,
    'resistors-parallel': parallelGroup1,
};
