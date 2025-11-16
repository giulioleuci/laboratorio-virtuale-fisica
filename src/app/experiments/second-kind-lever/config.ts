
import type { Formula, ProcessedInput, MeasurementRow, ModeState } from '@/lib/types';
import { weightedMean } from '@/lib/stats';

const G = 9.80665; // m/s^2

export const secondKindLeverFormula: Formula = {
    id: 'second-kind-lever',
    title: 'Leve di secondo genere',
    description: "Verifica l'equilibrio dei momenti della forza motrice e resistente rispetto al fulcro.",
    category: 'Statica',
    getInputs: (modes: ModeState) => {
        const isForce = modes.measurement_type === 'force';
        return [
            {
                id: isForce ? 'F_m' : 'm_m',
                label: isForce ? 'Forza motrice (Fₘ)' : 'Massa motrice (mₘ)',
                unit: isForce ? 'N' : 'kg',
                help: {
                    title: isForce ? "Forza motrice (Fₘ)" : "Massa motrice (mₘ)",
                    description: isForce
                        ? "La forza applicata per equilibrare la leva. Misurala con un dinamometro."
                        : "La massa applicata per equilibrare la leva. Misurala con una bilancia."
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
                id: isForce ? 'F_r' : 'm_r',
                label: isForce ? 'Forza resistente (Fᵣ)' : 'Massa resistente (mᵣ)',
                unit: isForce ? 'N' : 'kg',
                help: {
                    title: isForce ? "Forza resistente (Fᵣ)" : "Massa resistente (mᵣ)",
                    description: isForce
                        ? "La forza che la leva deve vincere (es. il peso di un oggetto). Misurala con un dinamometro o calcolala dalla massa."
                        : "La massa che genera la forza resistente. Misurala con una bilancia."
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
        ];
    },
    calculation: (processedInputs: { [key: string]: ProcessedInput }, modes: ModeState, rawData: MeasurementRow[]) => {
        if (rawData.length === 0) {
            return { details: { error: "Dati insufficienti." } };
        }
        
        const M_m_values: number[] = [];
        const sigma_M_m_values: number[] = [];
        const M_r_values: number[] = [];
        const sigma_M_r_values: number[] = [];
        
        const isForce = modes.measurement_type === 'force';

        rawData.forEach(row => {
            const { b_m, sigma_b_m, b_r, sigma_b_r } = row;
            let F_m: number | null, sigma_F_m: number | null, F_r: number | null, sigma_F_r: number | null;

            if (isForce) {
                F_m = row.F_m;
                sigma_F_m = row.sigma_F_m;
                F_r = row.F_r;
                sigma_F_r = row.sigma_F_r;
            } else {
                F_m = (row.m_m ?? 0) * G;
                sigma_F_m = (row.sigma_m_m ?? 0) * G;
                F_r = (row.m_r ?? 0) * G;
                sigma_F_r = (row.sigma_m_r ?? 0) * G;
            }

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

        const diff = Math.abs(M_m_mean - M_r_mean);
        const sigma_diff = Math.sqrt(sigma_M_m_mean**2 + sigma_M_r_mean**2);

        return {
            M_motore: { value: M_m_mean, sigma: sigma_M_m_mean, unit: 'N·m' },
            M_resistente: { value: M_r_mean, sigma: sigma_M_r_mean, unit: 'N·m' },
            "Differenza |Mₘ - Mᵣ|": { value: diff, sigma: sigma_diff, unit: 'N·m' },
            details: {}
        };
    },
    result: {},
    uiOptions: {
        switches: [
            {
                id: 'measurement_type',
                label: 'Misura con',
                options: [
                    { value: 'force', label: 'Forza' },
                    { value: 'mass', label: 'Massa' }
                ],
                defaultValue: 'force'
            }
        ],
        getFixtureKey: (modes: ModeState) => `second-kind-lever-${modes.measurement_type}`
    },
    customResultRenderer: true,
};
