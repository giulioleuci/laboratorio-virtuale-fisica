import type { MeasurementRow } from "@/lib/types";

// Gruppo 1: Oggetto di alluminio (densità ~2.7 g/cm³)
const group1: MeasurementRow[] = [
    { id: 1, p_aria: 1.96, sigma_p_aria: 0.001, p_acqua: 1.715, sigma_p_acqua: 0.001, vol_iniziale: 50, sigma_vol_iniziale: 0.5, vol_finale: 75, sigma_vol_finale: 0.5 },
    { id: 2, p_aria: 1.961, sigma_p_aria: 0.001, p_acqua: 1.717, sigma_p_acqua: 0.001, vol_iniziale: 50.1, sigma_vol_iniziale: 0.5, vol_finale: 75.2, sigma_vol_finale: 0.5 },
    { id: 3, p_aria: 1.959, sigma_p_aria: 0.001, p_acqua: 1.714, sigma_p_acqua: 0.001, vol_iniziale: 49.9, sigma_vol_iniziale: 0.5, vol_finale: 74.9, sigma_vol_finale: 0.5 },
];

// Gruppo 2: Oggetto di ottone (densità ~8.5 g/cm³)
const group2: MeasurementRow[] = [
    { id: 1, p_aria: 3.332, sigma_p_aria: 0.002, p_acqua: 2.940, sigma_p_acqua: 0.002, vol_iniziale: 60, sigma_vol_iniziale: 0.3, vol_finale: 100, sigma_vol_finale: 0.3 },
    { id: 2, p_aria: 3.334, sigma_p_aria: 0.002, p_acqua: 2.941, sigma_p_acqua: 0.002, vol_iniziale: 60.1, sigma_vol_iniziale: 0.3, vol_finale: 100.2, sigma_vol_finale: 0.3 },
    { id: 3, p_aria: 3.330, sigma_p_aria: 0.002, p_acqua: 2.939, sigma_p_acqua: 0.002, vol_iniziale: 59.9, sigma_vol_iniziale: 0.3, vol_finale: 99.8, sigma_vol_finale: 0.3 },
];

// Gruppo 3: Oggetto di ferro (densità ~7.8 g/cm³)
const group3: MeasurementRow[] = [
    { id: 1, p_aria: 1.529, sigma_p_aria: 0.0005, p_acqua: 1.333, sigma_p_acqua: 0.0005, vol_iniziale: 40, sigma_vol_iniziale: 0.2, vol_finale: 60, sigma_vol_finale: 0.2 },
    { id: 2, p_aria: 1.530, sigma_p_aria: 0.0005, p_acqua: 1.335, sigma_p_acqua: 0.0005, vol_iniziale: 40.1, sigma_vol_iniziale: 0.2, vol_finale: 60.1, sigma_vol_finale: 0.2 },
    { id: 3, p_aria: 1.528, sigma_p_aria: 0.0005, p_acqua: 1.331, sigma_p_acqua: 0.0005, vol_iniziale: 39.9, sigma_vol_iniziale: 0.2, vol_finale: 59.9, sigma_vol_finale: 0.2 },
];

export const archimedesFixtures: { [key: string]: MeasurementRow[] } = {
    'archimedes-1': group1,
    'archimedes-2': group2,
    'archimedes-3': group3,
    // Manteniamo compatibilità con il vecchio formato
    'archimedes': group1,
};
