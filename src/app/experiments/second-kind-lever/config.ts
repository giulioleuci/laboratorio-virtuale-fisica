
import type { Formula, ProcessedInput, MeasurementRow } from '@/lib/types';
import { weightedMean } from '@/lib/stats';

export const secondKindLeverFormula: Formula = {
    id: 'second-kind-lever',
    title: 'Leve di secondo genere',
    description: "Verifica l'equilibrio dei momenti della forza motrice e resistente rispetto al fulcro.",
    category: 'Statica',
    getInputs: () => [
        { 
            id: 'F_m', 
            label: 'Forza motrice (Fₘ)', 
            unit: 'N',
            help: {
                title: "Forza motrice (Fₘ)",
                description: "La forza applicata per equilibrare la leva. Misurala con un dinamometro."
            }
        },
        { 
            id: 'b_m', 
            label: 'Braccio motrice (bₘ)', 
            unit: 'm',
            help: {
                title: "Braccio motrice (bₘ)",
                description: "La distanza perpendicolare tra il fulcro e la linea d'azione della forza motrice. Misurala con un metro."
            }
        },
        { 
            id: 'F_r', 
            label: 'Forza resistente (Fᵣ)', 
            unit: 'N',
            help: {
                title: "Forza resistente (Fᵣ)",
                description: "La forza che la leva deve vincere (es. il peso di un oggetto). Misurala con un dinamometro o calcolala dalla massa."
            }
        },
        { 
            id: 'b_r', 
            label: 'Braccio resistente (bᵣ)', 
            unit: 'm',
            help: {
                title: "Braccio resistente (bᵣ)",
                description: "La distanza perpendicolare tra il fulcro e la linea d'azione della forza resistente. Misurala con un metro."
            }
        },
    ],
    calculation: (processedInputs: { [key: string]: ProcessedInput }, modes, rawData: MeasurementRow[]) => {
        if (rawData.length === 0) {
            return { details: { error: "Dati insufficienti." } };
        }
        
        const M_m_values: number[] = [];
        const sigma_M_m_values: number[] = [];
        const M_r_values: number[] = [];
        const sigma_M_r_values: number[] = [];
        
        rawData.forEach(row => {
            const { F_m, sigma_F_m, b_m, sigma_b_m, F_r, sigma_F_r, b_r, sigma_b_r } = row;
            if (F_m === null || b_m === null || F_r === null || b_r === null) return;
            if (sigma_F_m === null || sigma_b_m === null || sigma_F_r === null || sigma_b_r === null) return;
            
            // Calcolo momento motore
            const M_m = F_m * b_m;
            M_m_values.push(M_m);
            const sigma_M_m = Math.abs(M_m) * Math.sqrt((sigma_F_m / F_m)**2 + (sigma_b_m / b_m)**2);
            sigma_M_m_values.push(sigma_M_m);
            
            // Calcolo momento resistente
            const M_r = F_r * b_r;
            M_r_values.push(M_r);
            const sigma_M_r = Math.abs(M_r) * Math.sqrt((sigma_F_r / F_r)**2 + (sigma_b_r / b_r)**2);
            sigma_M_r_values.push(sigma_M_r);
        });

        if (M_m_values.length === 0) {
            return { details: { error: "Nessuna misurazione valida." } };
        }

        const { wMean: M_m_mean, sigmaWMean: sigma_M_m_mean } = weightedMean(M_m_values, sigma_M_m_values);
        const { wMean: M_r_mean, sigmaWMean: sigma_M_r_mean } = weightedMean(M_r_values, sigma_M_r_values);

        return {
            M_motore: { value: M_m_mean, sigma: sigma_M_m_mean },
            M_resistente: { value: M_r_mean, sigma: sigma_M_r_mean },
            details: {}
        };
    },
    result: {},
    customResultRenderer: true,
};
