
import type { MeasurementRow } from "@/lib/types";

// Gruppo 1: Misure di lunghezza con righello (alta precisione)
const group1: MeasurementRow[] = [
    { id: 1, x: 15.2, sigma_x: 0.05 },
    { id: 2, x: 15.3, sigma_x: 0.05 },
    { id: 3, x: 15.1, sigma_x: 0.05 },
    { id: 4, x: 15.4, sigma_x: 0.05 },
    { id: 5, x: 15.2, sigma_x: 0.05 },
    { id: 6, x: 15.3, sigma_x: 0.05 },
];

// Gruppo 2: Misure di tempo con cronometro (media precisione)
const group2: MeasurementRow[] = [
    { id: 1, x: 2.34, sigma_x: 0.02 },
    { id: 2, x: 2.38, sigma_x: 0.02 },
    { id: 3, x: 2.31, sigma_x: 0.02 },
    { id: 4, x: 2.36, sigma_x: 0.02 },
    { id: 5, x: 2.35, sigma_x: 0.02 },
    { id: 6, x: 2.33, sigma_x: 0.02 },
    { id: 7, x: 2.37, sigma_x: 0.02 },
];

// Gruppo 3: Misure di massa con bilancia (alta precisione, poche misure)
const group3: MeasurementRow[] = [
    { id: 1, x: 125.42, sigma_x: 0.01 },
    { id: 2, x: 125.44, sigma_x: 0.01 },
    { id: 3, x: 125.41, sigma_x: 0.01 },
    { id: 4, x: 125.43, sigma_x: 0.01 },
];

export const uncertaintyMeasurementFixtures: { [key: string]: MeasurementRow[] } = {
    'uncertainty-measurement-1': group1,
    'uncertainty-measurement-2': group2,
    'uncertainty-measurement-3': group3,
    'uncertainty-measurement': group1,
};
