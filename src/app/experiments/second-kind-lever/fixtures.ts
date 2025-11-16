
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

// Misure con massa (m_m e m_r in kg)
// Gruppo 1: Leva con rapporto 2:1
const massGroup1: MeasurementRow[] = [
    { id: 1, m_m: 1.02, sigma_m_m: 0.01, b_m: 1.0, sigma_b_m: 0.01, m_r: 2.04, sigma_m_r: 0.02, b_r: 0.5, sigma_b_r: 0.005 },
    { id: 2, m_m: 1.03, sigma_m_m: 0.01, b_m: 1.0, sigma_b_m: 0.01, m_r: 2.05, sigma_m_r: 0.02, b_r: 0.5, sigma_b_r: 0.005 },
    { id: 3, m_m: 1.01, sigma_m_m: 0.01, b_m: 1.0, sigma_b_m: 0.01, m_r: 2.03, sigma_m_r: 0.02, b_r: 0.5, sigma_b_r: 0.005 },
];

// Gruppo 2: Leva con rapporto 3:1
const massGroup2: MeasurementRow[] = [
    { id: 1, m_m: 0.82, sigma_m_m: 0.008, b_m: 1.5, sigma_b_m: 0.015, m_r: 2.45, sigma_m_r: 0.025, b_r: 0.5, sigma_b_r: 0.005 },
    { id: 2, m_m: 0.83, sigma_m_m: 0.008, b_m: 1.5, sigma_b_m: 0.015, m_r: 2.47, sigma_m_r: 0.025, b_r: 0.5, sigma_b_r: 0.005 },
    { id: 3, m_m: 0.81, sigma_m_m: 0.008, b_m: 1.5, sigma_b_m: 0.015, m_r: 2.43, sigma_m_r: 0.025, b_r: 0.5, sigma_b_r: 0.005 },
];

// Gruppo 3: Leva con rapporto 4:1
const massGroup3: MeasurementRow[] = [
    { id: 1, m_m: 0.61, sigma_m_m: 0.006, b_m: 2.0, sigma_b_m: 0.02, m_r: 2.45, sigma_m_r: 0.025, b_r: 0.5, sigma_b_r: 0.005 },
    { id: 2, m_m: 0.62, sigma_m_m: 0.006, b_m: 2.0, sigma_b_m: 0.02, m_r: 2.48, sigma_m_r: 0.025, b_r: 0.5, sigma_b_r: 0.005 },
    { id: 3, m_m: 0.60, sigma_m_m: 0.006, b_m: 2.0, sigma_b_m: 0.02, m_r: 2.42, sigma_m_r: 0.025, b_r: 0.5, sigma_b_r: 0.005 },
];

export const secondKindLeverFixtures: { [key: string]: MeasurementRow[] } = {
    // Misure con forza
    'second-kind-lever-force-1': group1,
    'second-kind-lever-force-2': group2,
    'second-kind-lever-force-3': group3,
    // Misure con massa
    'second-kind-lever-mass-1': massGroup1,
    'second-kind-lever-mass-2': massGroup2,
    'second-kind-lever-mass-3': massGroup3,
    // Manteniamo compatibilità con il vecchio formato
    'second-kind-lever': group1,
};
