
import type { Formula, ProcessedInput, MeasurementRow, ModeState } from '@/lib/types';
import { G_CONST } from '@/lib/stats';
import { mean } from 'mathjs';

export const mechanicalEnergyFormula: Formula = {
    id: 'mechanical-energy',
    title: "Conservazione dell'Energia Meccanica",
    description: "Verifica la conservazione dell'energia meccanica per un oggetto su una rotaia a cuscino d'aria trainato da una massa o da una forza, confrontando il lavoro compiuto con la variazione della sua energia cinetica.",
    category: 'Dinamica',
    getInputs: (modes: ModeState) => {
        const inputs = [
            { 
                id: 'M', 
                label: 'Massa carrello (M)', 
                unit: 'kg',
                help: {
                    title: "Massa del carrello (M)",
                    description: "La massa del carrello che si muove sulla rotaia. Misurala con una bilancia."
                }
            },
        ];

        if (modes.driving_force_type === 'mass') {
            inputs.push({ 
                id: 'm', 
                label: 'Massa trainante (m)', 
                unit: 'kg',
                help: {
                    title: "Massa trainante (m)",
                    description: "La massa appesa che traina il carrello tramite un filo e una carrucola. Misurala con una bilancia."
                }
            });
        } else { // 'force'
            inputs.push({ 
                id: 'F', 
                label: 'Forza trainante (F)', 
                unit: 'N',
                help: {
                    title: "Forza trainante (F)",
                    description: "La forza costante applicata per trainare il carrello. Misurala con un dinamometro."
                }
            });
        }
        
        inputs.push(
            { 
                id: 'd', 
                label: 'Spostamento (d)', 
                unit: 'm',
                help: {
                    title: "Spostamento (d)",
                    description: "La distanza percorsa dal carrello sulla rotaia durante la misurazione del tempo. Misurala con un metro."
                }
            },
            { 
                id: 't', 
                label: 'Tempo (t)', 
                unit: 's',
                help: {
                    title: "Tempo (t)",
                    description: "Il tempo impiegato dal carrello per percorrere la distanza 'd'. Misuralo con un cronometro oppure una o più fotocellule."
                }
            }
        );
        
        return inputs;
    },
    calculation: (processedInputs: { [key: string]: ProcessedInput }, modes: ModeState, rawData: MeasurementRow[]) => {
        if (rawData.length === 0) {
            return { details: { error: "Sono necessarie almeno una misurazione." } };
        }
        
        const row = rawData[0];
        const { M, sigma_M, d, sigma_d, t, sigma_t } = row;
        
        if (M == null || d == null || t == null) {
            return { details: { error: "Dati (M, d, t) incompleti." } };
        }
        if (sigma_M == null || sigma_d == null || sigma_t == null) {
            return { details: { error: "Incertezze (M, d, t) incomplete." } };
        }
        if (t === 0) {
            return { details: { error: "Il tempo non può essere zero." } };
        }

        // Calcolo Energia Cinetica Finale (ΔK)
        // K_i = 0. K_f = 0.5 * M * v_f^2. v_f = 2 * d / t (from d = 0.5 * a * t^2 and v = a*t)
        const v_f = 2 * d / t;
        const K_f = 0.5 * M * v_f**2;
        
        // Propagazione errore per K_f = 0.5 * M * (2d/t)^2 = 2 * M * d^2 / t^2
        const dK_dM = 2 * d**2 / t**2;
        const dK_dd = 4 * M * d / t**2;
        const dK_dt = -4 * M * d**2 / t**3;
        const sigma_K_f_sq = (dK_dM * sigma_M)**2 + (dK_dd * sigma_d)**2 + (dK_dt * sigma_t)**2;
        const delta_K = { value: K_f, sigma: Math.sqrt(sigma_K_f_sq) };

        let Work_value = 0;
        let sigma_Work_sq = 0;
        let details:any = {};

        if (modes.driving_force_type === 'mass') {
            const { m, sigma_m } = row;
             if (m == null || sigma_m == null) {
                return { details: { error: "Dati per la massa trainante (m) incompleti."}};
            }
            
            // Lavoro = Energia Potenziale persa dalla massa m: W = m*g*d
            Work_value = m * G_CONST * d;

            // sigma_W^2 = (dW/dm * sigma_m)^2 + (dW/dd * sigma_d)^2
            const dW_dm = G_CONST * d;
            const dW_dd = m * G_CONST;
            sigma_Work_sq = (dW_dm * sigma_m)**2 + (dW_dd * sigma_d)**2;
            
            details = { m: { value: m, sigma: sigma_m }};

        } else { // 'force'
            const { F, sigma_F } = row;
             if (F == null || sigma_F == null) {
                return { details: { error: "Dati per la forza trainante (F) incompleti."}};
            }
            
            // Lavoro = F * d
            Work_value = F * d;

            // sigma_W^2 = (dW/dF * sigma_F)^2 + (dW/dd * sigma_d)^2
            const dW_dF = d;
            const dW_dd = F;
            sigma_Work_sq = (dW_dF * sigma_F)**2 + (dW_dd * sigma_d)**2;

            details = { F: { value: F, sigma: sigma_F } };
        }

        const Work = { value: Work_value, sigma: Math.sqrt(sigma_Work_sq) };

        // Calcolo differenza
        const energy_diff_val = delta_K.value - Work.value;
        const sigma_energy_diff_sq = delta_K.sigma**2 + Work.sigma**2;
        const energy_difference = {value: energy_diff_val, sigma: Math.sqrt(sigma_energy_diff_sq)};

        return {
            delta_K,
            Work,
            energy_difference,
            details: {
                ...details,
                M: { value: M, sigma: sigma_M },
                v_final: { value: v_f, sigma: v_f * Math.sqrt((sigma_d/d)**2 + (sigma_t/t)**2)},
                method: "Teorema dell'energia cinetica (W = ΔK)"
            }
        };
    },
    result: {}, // Custom renderer will handle this
    customResultRenderer: true,
    uiOptions: {
        switches: [
            {
                id: 'driving_force_type',
                label: 'Tipo di azione trainante',
                options: [
                    { value: 'mass', label: 'Massa' },
                    { value: 'force', label: 'Forza' }
                ],
                defaultValue: 'mass'
            }
        ],
      getFixtureKey: (modes: ModeState) => `mechanical-energy-${modes.driving_force_type}`
    }
};
