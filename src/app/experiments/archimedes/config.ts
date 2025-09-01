import type { Formula, ProcessedInput, ModeState, MeasurementRow } from '@/lib/types';
import { propagateError } from '@/lib/propagate';
import { G_CONST } from '@/lib/stats';

const rho_acqua = 997; // kg/m^3
const rho_aria = 1.225; // kg/m^3

export const archimedesFormula: Formula = {
    id: 'archimedes',
    title: 'Principio di Archimede',
    description: "Verifica il principio di Archimede confrontando la spinta ricevuta da un corpo immerso in un fluido con il peso del fluido spostato.",
    category: 'Fluidi',
    getInputs: () => [
        { 
            id: 'p_aria', 
            label: 'Peso in aria (P<sub>aria</sub>)', 
            unit: 'N',
            help: {
                title: "Peso in aria (Pₐᵣᵢₐ)",
                description: "Il peso dell'oggetto misurato quando è sospeso in aria. Utilizza un dinamometro di precisione."
            }
        },
        { 
            id: 'p_acqua', 
            label: 'Peso in acqua (P<sub>acqua</sub>)', 
            unit: 'N',
            help: {
                title: "Peso in acqua (Pₐ𝘤𝑞ᵤₐ)",
                description: "Il peso apparente dell'oggetto misurato mentre è completamente immerso in acqua. Utilizza un dinamometro, appendendo l'oggetto al gancio."
            }
        },
        { 
            id: 'vol_iniziale', 
            label: 'Volume iniziale (V<sub>i</sub>)', 
            unit: 'ml',
            help: {
                title: "Volume iniziale (Vᵢ)",
                description: "Il volume dell'acqua in un cilindro graduato prima di immergere l'oggetto. Leggi il menisco inferiore."
            }
        },
        { 
            id: 'vol_finale', 
            label: 'Volume finale (V<sub>f</sub>)', 
            unit: 'ml',
            help: {
                title: "Volume finale (Vբ)",
                description: "Il volume totale nel cilindro graduato dopo aver immerso completamente l'oggetto. La differenza Vբ - Vᵢ è il volume dell'oggetto."
            }
        },
    ],
    calculation: (processedInputs: { [key: string]: ProcessedInput }) => {
        const { p_aria, p_acqua, vol_iniziale, vol_finale } = processedInputs;

        if (!p_aria || !p_acqua || !vol_iniziale || !vol_finale) {
            return { B_exp: null, B_teo: null, details: {} };
        }

        // Convert ml to m^3 (pesi già in Newton)
        const vol_i_m3 = { value: vol_iniziale.mean / 1e6, sigma: vol_iniziale.sigma / 1e6 };
        const vol_f_m3 = { value: vol_finale.mean / 1e6, sigma: vol_finale.sigma / 1e6 };

        // 1. Experimental Thrust (B_exp) - differenza tra peso in aria e peso in acqua
        const B_exp_value = p_aria.mean - p_acqua.mean;
        const B_exp_sigma = Math.sqrt(p_aria.sigma ** 2 + p_acqua.sigma ** 2);
        const B_exp = { value: B_exp_value, sigma: B_exp_sigma };

        // 2. Theoretic Thrust (B_teo)
        const V_oggetto_value = vol_f_m3.value - vol_i_m3.value;
        const V_oggetto_sigma = Math.sqrt(vol_f_m3.sigma ** 2 + vol_i_m3.sigma ** 2);
        const V_oggetto = { value: V_oggetto_value, sigma: V_oggetto_sigma };

        const B_teo_value = V_oggetto.value * rho_acqua * G_CONST;
        // Propagation for B_teo = V * rho_acqua * g. Assuming rho_acqua and g are constants with no error.
        const B_teo_sigma = V_oggetto.sigma * rho_acqua * G_CONST;
        const B_teo = { value: B_teo_value, sigma: B_teo_sigma };

        return {
            B_exp,
            B_teo,
            details: {
                p_aria: processedInputs.p_aria,
                p_acqua: processedInputs.p_acqua,
                vol_iniziale: processedInputs.vol_iniziale,
                vol_finale: processedInputs.vol_finale,
            }
        };
    },
    result: {},
    customResultRenderer: true,
};
