
import type { MeasurementRow } from "@/lib/types";

// Gruppo 1: Molla rigida (k alta) - L₀ = 15 cm
const massFitGroup1: MeasurementRow[] = [
    { id: 1, m: 50, sigma_m: 1, l_riposo: 15.0, sigma_l_riposo: 0.05, l_finale: 17.5, sigma_l_finale: 0.1 },
    { id: 2, m: 100, sigma_m: 1, l_riposo: 15.0, sigma_l_riposo: 0.05, l_finale: 20.1, sigma_l_finale: 0.1 },
    { id: 3, m: 150, sigma_m: 1, l_riposo: 15.0, sigma_l_riposo: 0.05, l_finale: 22.4, sigma_l_finale: 0.1 },
    { id: 4, m: 200, sigma_m: 1, l_riposo: 15.0, sigma_l_riposo: 0.05, l_finale: 25.2, sigma_l_finale: 0.1 },
    { id: 5, m: 250, sigma_m: 1, l_riposo: 15.0, sigma_l_riposo: 0.05, l_finale: 27.6, sigma_l_finale: 0.1 },
];

const massAverageGroup1: MeasurementRow[] = [
    { id: 1, m: 100, sigma_m: 1, l_riposo: 15.0, sigma_l_riposo: 0.05, l_finale: 20.1, sigma_l_finale: 0.1 },
    { id: 2, m: 100, sigma_m: 1, l_riposo: 15.0, sigma_l_riposo: 0.05, l_finale: 20.0, sigma_l_finale: 0.1 },
    { id: 3, m: 100, sigma_m: 1, l_riposo: 15.0, sigma_l_riposo: 0.05, l_finale: 20.2, sigma_l_finale: 0.1 },
];

const forceFitGroup1: MeasurementRow[] = [
    { id: 1, F: 0.49, sigma_F: 0.01, l_riposo: 15.0, sigma_l_riposo: 0.05, l_finale: 17.5, sigma_l_finale: 0.1 },
    { id: 2, F: 0.98, sigma_F: 0.01, l_riposo: 15.0, sigma_l_riposo: 0.05, l_finale: 20.1, sigma_l_finale: 0.1 },
    { id: 3, F: 1.47, sigma_F: 0.01, l_riposo: 15.0, sigma_l_riposo: 0.05, l_finale: 22.4, sigma_l_finale: 0.1 },
    { id: 4, F: 1.96, sigma_F: 0.01, l_riposo: 15.0, sigma_l_riposo: 0.05, l_finale: 25.2, sigma_l_finale: 0.1 },
    { id: 5, F: 2.45, sigma_F: 0.01, l_riposo: 15.0, sigma_l_riposo: 0.05, l_finale: 27.6, sigma_l_finale: 0.1 },
];

const forceAverageGroup1: MeasurementRow[] = [
    { id: 1, F: 0.98, sigma_F: 0.01, l_riposo: 15.0, sigma_l_riposo: 0.05, l_finale: 20.1, sigma_l_finale: 0.1 },
    { id: 2, F: 0.98, sigma_F: 0.01, l_riposo: 15.0, sigma_l_riposo: 0.05, l_finale: 20.0, sigma_l_finale: 0.1 },
    { id: 3, F: 0.98, sigma_F: 0.01, l_riposo: 15.0, sigma_l_riposo: 0.05, l_finale: 20.2, sigma_l_finale: 0.1 },
];

// Gruppo 2: Molla morbida (k bassa) - L₀ = 12 cm
const massFitGroup2: MeasurementRow[] = [
    { id: 1, m: 20, sigma_m: 0.5, l_riposo: 12.0, sigma_l_riposo: 0.03, l_finale: 15.2, sigma_l_finale: 0.05 },
    { id: 2, m: 40, sigma_m: 0.5, l_riposo: 12.0, sigma_l_riposo: 0.03, l_finale: 18.4, sigma_l_finale: 0.05 },
    { id: 3, m: 60, sigma_m: 0.5, l_riposo: 12.0, sigma_l_riposo: 0.03, l_finale: 21.6, sigma_l_finale: 0.05 },
    { id: 4, m: 80, sigma_m: 0.5, l_riposo: 12.0, sigma_l_riposo: 0.03, l_finale: 24.8, sigma_l_finale: 0.05 },
    { id: 5, m: 100, sigma_m: 0.5, l_riposo: 12.0, sigma_l_riposo: 0.03, l_finale: 28.0, sigma_l_finale: 0.05 },
];

const massAverageGroup2: MeasurementRow[] = [
    { id: 1, m: 60, sigma_m: 0.5, l_riposo: 12.0, sigma_l_riposo: 0.03, l_finale: 21.6, sigma_l_finale: 0.05 },
    { id: 2, m: 60, sigma_m: 0.5, l_riposo: 12.0, sigma_l_riposo: 0.03, l_finale: 21.5, sigma_l_finale: 0.05 },
    { id: 3, m: 60, sigma_m: 0.5, l_riposo: 12.0, sigma_l_riposo: 0.03, l_finale: 21.7, sigma_l_finale: 0.05 },
];

const forceFitGroup2: MeasurementRow[] = [
    { id: 1, F: 0.196, sigma_F: 0.005, l_riposo: 12.0, sigma_l_riposo: 0.03, l_finale: 15.2, sigma_l_finale: 0.05 },
    { id: 2, F: 0.392, sigma_F: 0.005, l_riposo: 12.0, sigma_l_riposo: 0.03, l_finale: 18.4, sigma_l_finale: 0.05 },
    { id: 3, F: 0.588, sigma_F: 0.005, l_riposo: 12.0, sigma_l_riposo: 0.03, l_finale: 21.6, sigma_l_finale: 0.05 },
    { id: 4, F: 0.784, sigma_F: 0.005, l_riposo: 12.0, sigma_l_riposo: 0.03, l_finale: 24.8, sigma_l_finale: 0.05 },
    { id: 5, F: 0.980, sigma_F: 0.005, l_riposo: 12.0, sigma_l_riposo: 0.03, l_finale: 28.0, sigma_l_finale: 0.05 },
];

const forceAverageGroup2: MeasurementRow[] = [
    { id: 1, F: 0.588, sigma_F: 0.005, l_riposo: 12.0, sigma_l_riposo: 0.03, l_finale: 21.6, sigma_l_finale: 0.05 },
    { id: 2, F: 0.588, sigma_F: 0.005, l_riposo: 12.0, sigma_l_riposo: 0.03, l_finale: 21.5, sigma_l_finale: 0.05 },
    { id: 3, F: 0.588, sigma_F: 0.005, l_riposo: 12.0, sigma_l_riposo: 0.03, l_finale: 21.7, sigma_l_finale: 0.05 },
];

// Gruppo 3: Molla molto rigida (k molto alta) - L₀ = 8 cm
const massFitGroup3: MeasurementRow[] = [
    { id: 1, m: 100, sigma_m: 2, l_riposo: 8.0, sigma_l_riposo: 0.1, l_finale: 9.2, sigma_l_finale: 0.2 },
    { id: 2, m: 200, sigma_m: 2, l_riposo: 8.0, sigma_l_riposo: 0.1, l_finale: 10.4, sigma_l_finale: 0.2 },
    { id: 3, m: 300, sigma_m: 2, l_riposo: 8.0, sigma_l_riposo: 0.1, l_finale: 11.6, sigma_l_finale: 0.2 },
    { id: 4, m: 400, sigma_m: 2, l_riposo: 8.0, sigma_l_riposo: 0.1, l_finale: 12.8, sigma_l_finale: 0.2 },
    { id: 5, m: 500, sigma_m: 2, l_riposo: 8.0, sigma_l_riposo: 0.1, l_finale: 14.0, sigma_l_finale: 0.2 },
];

const massAverageGroup3: MeasurementRow[] = [
    { id: 1, m: 200, sigma_m: 2, l_riposo: 8.0, sigma_l_riposo: 0.1, l_finale: 10.4, sigma_l_finale: 0.2 },
    { id: 2, m: 200, sigma_m: 2, l_riposo: 8.0, sigma_l_riposo: 0.1, l_finale: 10.3, sigma_l_finale: 0.2 },
    { id: 3, m: 200, sigma_m: 2, l_riposo: 8.0, sigma_l_riposo: 0.1, l_finale: 10.5, sigma_l_finale: 0.2 },
];

const forceFitGroup3: MeasurementRow[] = [
    { id: 1, F: 0.98, sigma_F: 0.02, l_riposo: 8.0, sigma_l_riposo: 0.1, l_finale: 9.2, sigma_l_finale: 0.2 },
    { id: 2, F: 1.96, sigma_F: 0.02, l_riposo: 8.0, sigma_l_riposo: 0.1, l_finale: 10.4, sigma_l_finale: 0.2 },
    { id: 3, F: 2.94, sigma_F: 0.02, l_riposo: 8.0, sigma_l_riposo: 0.1, l_finale: 11.6, sigma_l_finale: 0.2 },
    { id: 4, F: 3.92, sigma_F: 0.02, l_riposo: 8.0, sigma_l_riposo: 0.1, l_finale: 12.8, sigma_l_finale: 0.2 },
    { id: 5, F: 4.90, sigma_F: 0.02, l_riposo: 8.0, sigma_l_riposo: 0.1, l_finale: 14.0, sigma_l_finale: 0.2 },
];

const forceAverageGroup3: MeasurementRow[] = [
    { id: 1, F: 1.96, sigma_F: 0.02, l_riposo: 8.0, sigma_l_riposo: 0.1, l_finale: 10.4, sigma_l_finale: 0.2 },
    { id: 2, F: 1.96, sigma_F: 0.02, l_riposo: 8.0, sigma_l_riposo: 0.1, l_finale: 10.3, sigma_l_finale: 0.2 },
    { id: 3, F: 1.96, sigma_F: 0.02, l_riposo: 8.0, sigma_l_riposo: 0.1, l_finale: 10.5, sigma_l_finale: 0.2 },
];

export const hookesLawFixtures: { [key: string]: MeasurementRow[] } = {
    'hookes-law-mass-fit-1': massFitGroup1,
    'hookes-law-mass-fit-2': massFitGroup2,
    'hookes-law-mass-fit-3': massFitGroup3,
    'hookes-law-mass-average-1': massAverageGroup1,
    'hookes-law-mass-average-2': massAverageGroup2,
    'hookes-law-mass-average-3': massAverageGroup3,
    'hookes-law-force-fit-1': forceFitGroup1,
    'hookes-law-force-fit-2': forceFitGroup2,
    'hookes-law-force-fit-3': forceFitGroup3,
    'hookes-law-force-average-1': forceAverageGroup1,
    'hookes-law-force-average-2': forceAverageGroup2,
    'hookes-law-force-average-3': forceAverageGroup3,
    // Manteniamo compatibilità con il vecchio formato
    'hookes-law-mass-fit': massFitGroup1,
    'hookes-law-mass-average': massAverageGroup1,
    'hookes-law-force-fit': forceFitGroup1,
    'hookes-law-force-average': forceAverageGroup1,
};
