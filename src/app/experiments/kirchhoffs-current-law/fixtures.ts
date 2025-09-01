
import type { MeasurementRow } from "@/lib/types";

// Gruppo 1: Nodo con 3 correnti (scenario base)
const group1: MeasurementRow[] = [
    { id: 1, i: 5.0, sigma_i: 0.1, direction: 1 },  // Entrante
    { id: 2, i: 3.0, sigma_i: 0.05, direction: -1 }, // Uscente
    { id: 3, i: 2.0, sigma_i: 0.05, direction: -1 }, // Uscente
];

// Gruppo 2: Nodo con 4 correnti (scenario complesso)
const group2: MeasurementRow[] = [
    { id: 1, i: 8.0, sigma_i: 0.15, direction: 1 },  // Entrante
    { id: 2, i: 2.5, sigma_i: 0.08, direction: 1 },  // Entrante
    { id: 3, i: 6.0, sigma_i: 0.12, direction: -1 }, // Uscente
    { id: 4, i: 4.5, sigma_i: 0.10, direction: -1 }, // Uscente
];

// Gruppo 3: Nodo con correnti piccole (alta precisione)
const group3: MeasurementRow[] = [
    { id: 1, i: 1.5, sigma_i: 0.02, direction: 1 },  // Entrante
    { id: 2, i: 0.8, sigma_i: 0.01, direction: -1 }, // Uscente
    { id: 3, i: 0.7, sigma_i: 0.01, direction: -1 }, // Uscente
];

export const kirchhoffsCurrentLawFixtures: { [key: string]: MeasurementRow[] } = {
    'kirchhoffs-current-law-1': group1,
    'kirchhoffs-current-law-2': group2,
    'kirchhoffs-current-law-3': group3,
    // Manteniamo compatibilità con il vecchio formato
    'kirchhoffs-current-law': group1,
};
