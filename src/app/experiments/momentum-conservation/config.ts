
import type { Formula, ProcessedInput, MeasurementRow, ModeState } from '@/lib/types';
import { G_CONST } from '@/lib/stats';
import { mean } from 'mathjs';

export const momentumConservationFormula: Formula = {
    id: 'momentum-conservation',
    title: "Conservazione della quantità di moto",
    description: "Verifica la conservazione della quantità di moto in un urto completamente anelastico.",
    category: 'Dinamica',
    getInputs: () => [
        { 
            id: 'm1', 
            label: 'Massa 1 (m₁)', 
            unit: 'kg',
            help: {
                title: "Massa 1 (m₁)",
                description: "La massa del primo oggetto (quello in movimento prima dell'urto). Misurala con una bilancia."
            }
        },
        { 
            id: 'x1_i', 
            label: 'Spostamento iniziale 1 (Δx₁,ᵢ)', 
            unit: 'm',
            help: {
                title: "Spostamento iniziale 1 (Δx₁,ᵢ)",
                description: "La distanza percorsa dall'oggetto 1 in un intervallo di tempo prima dell'urto, per calcolarne la velocità iniziale."
            }
        },
        { 
            id: 't1_i', 
            label: 'Tempo iniziale 1 (Δt₁,ᵢ)', 
            unit: 's',
            help: {
                title: "Tempo iniziale 1 (Δt₁,ᵢ)",
                description: "L'intervallo di tempo impiegato dall'oggetto 1 per percorrere lo spostamento Δx₁,ᵢ prima dell'urto. Misuralo con un cronometro oppure una o più fotocellule."
            }
        },
        { 
            id: 'm2', 
            label: 'Massa 2 (m₂)', 
            unit: 'kg',
            help: {
                title: "Massa 2 (m₂)",
                description: "La massa del secondo oggetto (quello fermo prima dell'urto). Misurala con una bilancia."
            }
        },
        { 
            id: 'x_f', 
            label: 'Spostamento finale (Δx<sub>f</sub>)', 
            unit: 'm',
            help: {
                title: "Spostamento finale (Δxբ)",
                description: "La distanza percorsa dai due oggetti uniti dopo l'urto, per calcolarne la velocità finale."
            }
        },
        { 
            id: 't_f', 
            label: 'Tempo finale (Δt<sub>f</sub>)', 
            unit: 's',
            help: {
                title: "Tempo finale (Δtբ)",
                description: "L'intervallo di tempo impiegato dai due oggetti uniti per percorrere lo spostamento Δxբ dopo l'urto. Misuralo con un cronometro oppure una o più fotocellule."
            }
        },
    ],
    calculation: (processedInputs: { [key: string]: ProcessedInput }, modes: ModeState, rawData: MeasurementRow[]) => {
        if (rawData.length < 1) {
            return { details: { error: "Sono necessarie almeno una misurazione." } };
        }
        
        const row = rawData[0];
        const { m1, sigma_m1, x1_i, sigma_x1_i, t1_i, sigma_t1_i, m2, sigma_m2, x_f, sigma_x_f, t_f, sigma_t_f } = row;

        if (m1 === null || x1_i === null || t1_i === null || m2 === null || x_f === null || t_f === null) {
            return { details: { error: "Dati incompleti." } };
        }
        if (sigma_m1 === null || sigma_x1_i === null || sigma_t1_i === null || sigma_m2 === null || sigma_x_f === null || sigma_t_f === null) {
            return { details: { error: "Incertezze incomplete." } };
        }
        if (t1_i === 0 || t_f === 0) {
            return { details: { error: "L'intervallo di tempo non può essere zero." } };
        }

        // Calcolo velocità e incertezze
        const v1_i = x1_i / t1_i;
        const sigma_v1_i = Math.abs(v1_i) * Math.sqrt((sigma_x1_i / x1_i)**2 + (sigma_t1_i / t1_i)**2);
        
        const v_f = x_f / t_f;
        const sigma_v_f = Math.abs(v_f) * Math.sqrt((sigma_x_f / x_f)**2 + (sigma_t_f / t_f)**2);

        const v2_i = 0; // Seconda massa ferma
        const sigma_v2_i = 0;

        // P_initial = m1*v1_i + m2*v2_i = m1*v1_i
        const p_initial = m1 * v1_i;
        const sigma_p_initial_sq = (v1_i * sigma_m1)**2 + (m1 * sigma_v1_i)**2;
        
        // P_final = (m1+m2)*v_f
        const p_final = (m1 + m2) * v_f;
        const sigma_p_final_sq = (v_f * sigma_m1)**2 + (v_f * sigma_m2)**2 + ((m1 + m2) * sigma_v_f)**2;

        const delta_p = p_final - p_initial;
        const sigma_delta_p = Math.sqrt(sigma_p_initial_sq + sigma_p_final_sq);

        return {
            value: delta_p,
            sigma: sigma_delta_p,
            details: {
                p_initial: { value: p_initial, sigma: Math.sqrt(sigma_p_initial_sq) },
                p_final: { value: p_final, sigma: Math.sqrt(sigma_p_final_sq) },
                v1_i: {value: v1_i, sigma: sigma_v1_i},
                v_f: {value: v_f, sigma: sigma_v_f},
                method: "Confronto quantità di moto"
            }
        };
    },
    result: {
        label: 'Variazione Quantità di Moto (Δp)',
        unit: 'kg·m/s',
    },
    uiOptions: {
      getFixtureKey: () => 'momentum-conservation'
    }
};
