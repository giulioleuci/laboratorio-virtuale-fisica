import type { MeasurementRow } from "@/lib/types";

// Gruppo 1: Fit lineare. k = 10 N/m, L₀ = 15 cm.
// Se m = 50g (0.05kg), P = 0.05 * 9.81 = 0.4905 N
// ΔL = P / k = 0.4905 / 10 = 0.04905 m = 4.905 cm => L = 19.905 cm
const fitGroup: MeasurementRow[] = [
    { id: 1, k: 10, sigma_k: 0.1, m: 50, sigma_m: 1, l_riposo: 15.0, sigma_l_riposo: 0.1, l_finale: 19.9, sigma_l_finale: 0.2 },
    { id: 2, k: 10, sigma_k: 0.1, m: 100, sigma_m: 1, l_riposo: 15.0, sigma_l_riposo: 0.1, l_finale: 24.8, sigma_l_finale: 0.2 },
    { id: 3, k: 10, sigma_k: 0.1, m: 150, sigma_m: 1, l_riposo: 15.0, sigma_l_riposo: 0.1, l_finale: 29.7, sigma_l_finale: 0.2 },
    { id: 4, k: 10, sigma_k: 0.1, m: 200, sigma_m: 1, l_riposo: 15.0, sigma_l_riposo: 0.1, l_finale: 34.6, sigma_l_finale: 0.2 },
    { id: 5, k: 10, sigma_k: 0.1, m: 250, sigma_m: 1, l_riposo: 15.0, sigma_l_riposo: 0.1, l_finale: 39.5, sigma_l_finale: 0.2 },
];

// Gruppo 2: Media
const averageGroup: MeasurementRow[] = [
    { id: 1, k: 10, sigma_k: 0.1, m: 100, sigma_m: 1, l_riposo: 15.0, sigma_l_riposo: 0.1, l_finale: 24.8, sigma_l_finale: 0.2 },
    { id: 2, k: 10, sigma_k: 0.1, m: 100, sigma_m: 1, l_riposo: 15.0, sigma_l_riposo: 0.1, l_finale: 24.9, sigma_l_finale: 0.2 },
    { id: 3, k: 10, sigma_k: 0.1, m: 100, sigma_m: 1, l_riposo: 15.0, sigma_l_riposo: 0.1, l_finale: 24.7, sigma_l_finale: 0.2 },
];

export const springGravityFixtures: { [key: string]: MeasurementRow[] } = {
    'spring-gravity-fit': fitGroup,
    'spring-gravity-average': averageGroup,
};
