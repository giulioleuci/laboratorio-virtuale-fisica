
import type { MeasurementRow } from "@/lib/types";

// Gruppo 1: Leva con rapporto 2:1 (vantaggio meccanico 2)
const group1: MeasurementRow[] = [
    { id: 1, F_m: 10.0, sigma_F_m: 0.1, b_m: 1.0, sigma_b_m: 0.01, F_r: 20.0, sigma_F_r: 0.2, b_r: 0.5, sigma_b_r: 0.005 },
    { id: 2, F_m: 10.1, sigma_F_m: 0.1, b_m: 1.0, sigma_b_m: 0.01, F_r: 20.1, sigma_F_r: 0.2, b_r: 0.5, sigma_b_r: 0.005 },
    { id: 3, F_m: 9.9, sigma_F_m: 0.1, b_m: 1.0, sigma_b_m: 0.01, F_r: 19.9, sigma_F_r: 0.2, b_r: 0.5, sigma_b_r: 0.005 },
];

// Gruppo 2: Leva con rapporto 3:1 (vantaggio meccanico 3)
const group2: MeasurementRow[] = [
    { id: 1, F_m: 8.0, sigma_F_m: 0.08, b_m: 1.5, sigma_b_m: 0.015, F_r: 24.0, sigma_F_r: 0.24, b_r: 0.5, sigma_b_r: 0.005 },
    { id: 2, F_m: 8.1, sigma_F_m: 0.08, b_m: 1.5, sigma_b_m: 0.015, F_r: 24.2, sigma_F_r: 0.24, b_r: 0.5, sigma_b_r: 0.005 },
    { id: 3, F_m: 7.9, sigma_F_m: 0.08, b_m: 1.5, sigma_b_m: 0.015, F_r: 23.8, sigma_F_r: 0.24, b_r: 0.5, sigma_b_r: 0.005 },
];

// Gruppo 3: Leva con rapporto 4:1 (vantaggio meccanico 4)
const group3: MeasurementRow[] = [
    { id: 1, F_m: 6.0, sigma_F_m: 0.06, b_m: 2.0, sigma_b_m: 0.02, F_r: 24.0, sigma_F_r: 0.24, b_r: 0.5, sigma_b_r: 0.005 },
    { id: 2, F_m: 6.1, sigma_F_m: 0.06, b_m: 2.0, sigma_b_m: 0.02, F_r: 24.3, sigma_F_r: 0.24, b_r: 0.5, sigma_b_r: 0.005 },
    { id: 3, F_m: 5.9, sigma_F_m: 0.06, b_m: 2.0, sigma_b_m: 0.02, F_r: 23.7, sigma_F_r: 0.24, b_r: 0.5, sigma_b_r: 0.005 },
];

export const secondKindLeverFixtures: { [key: string]: MeasurementRow[] } = {
    'second-kind-lever-1': group1,
    'second-kind-lever-2': group2,
    'second-kind-lever-3': group3,
    // Manteniamo compatibilità con il vecchio formato
    'second-kind-lever': group1,
};
