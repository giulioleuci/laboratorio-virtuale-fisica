
import type { MeasurementRow } from "@/lib/types";

// Gruppo 1: Urto tra sfere di metallo (scenario classico)
const group1: MeasurementRow[] = [
    { id: 1, m1: 2.0, sigma_m1: 0.01, x1_i: 1.0, sigma_x1_i: 0.01, t1_i: 0.5, sigma_t1_i: 0.01, m2: 3.0, sigma_m2: 0.01, x_f: 0.8, sigma_x_f: 0.01, t_f: 1.0, sigma_t_f: 0.01 },
];

// Gruppo 2: Urto tra carrelli su rotaia ad aria (masse diverse)
const group2: MeasurementRow[] = [
    { id: 1, m1: 0.5, sigma_m1: 0.005, x1_i: 1.5, sigma_x1_i: 0.02, t1_i: 0.8, sigma_t1_i: 0.02, m2: 1.2, sigma_m2: 0.005, x_f: 1.1, sigma_x_f: 0.02, t_f: 1.3, sigma_t_f: 0.02 },
];

// Gruppo 3: Urto tra palle da biliardo (masse simili)
const group3: MeasurementRow[] = [
    { id: 1, m1: 0.16, sigma_m1: 0.002, x1_i: 0.8, sigma_x1_i: 0.01, t1_i: 0.4, sigma_t1_i: 0.01, m2: 0.17, sigma_m2: 0.002, x_f: 0.9, sigma_x_f: 0.01, t_f: 1.1, sigma_t_f: 0.01 },
];

export const momentumConservationFixtures: { [key: string]: MeasurementRow[] } = {
    'momentum-conservation-1': group1,
    'momentum-conservation-2': group2,
    'momentum-conservation-3': group3,
    // Manteniamo compatibilità con il vecchio formato
    'momentum-conservation': group1,
};
