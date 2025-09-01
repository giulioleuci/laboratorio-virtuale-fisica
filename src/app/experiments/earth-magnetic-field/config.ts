
import type { Formula, ProcessedInput, MeasurementRow, ModeState } from '@/lib/types';
import { weightedMean } from '@/lib/stats';
import { mean } from 'mathjs';

const MU0 = 4 * Math.PI * 1e-7; // Permeabilità magnetica del vuoto

export const earthMagneticFieldFormula: Formula = {
    id: 'earth-magnetic-field',
    title: 'Campo magnetico terrestre',
    description: "Misura il valore locale del modulo dell'intensità del campo magnetico terrestre.",
    category: 'Magnetismo',
    getInputs: () => [
        { 
            id: 'N', 
            label: 'Numero di spire (N)', 
            unit: '#', 
            isInteger: true,
            help: {
                title: "Numero di spire (N)",
                description: "Il numero totale di avvolgimenti del solenoide."
            }
        },
        { 
            id: 'L', 
            label: 'Lunghezza solenoide (L)', 
            unit: 'm',
            help: {
                title: "Lunghezza solenoide (L)",
                description: "La lunghezza totale dell'avvolgimento del solenoide. Misurala con un metro."
            }
        },
        { 
            id: 'R', 
            label: 'Resistenza (R)', 
            unit: 'Ω',
            help: {
                title: "Resistenza (R)",
                description: "La resistenza elettrica del circuito, usata per calcolare la corrente (I=V/R). Misurala con un multimetro."
            }
        },
        { 
            id: 'V', 
            label: 'Tensione (V)', 
            unit: 'V',
            help: {
                title: "Tensione (V)",
                description: "La tensione applicata al solenoide per generare un campo magnetico che annulla la componente orizzontale del campo terrestre (l'ago della bussola si orienta a 45°). Misurala con un multimetro."
            }
        },
    ],
    calculation: (processedInputs: { [key: string]: ProcessedInput }, modes: ModeState, rawData: MeasurementRow[]) => {
        if (rawData.length === 0) {
            return { details: { error: "Dati insufficienti." } };
        }

        const B_values: number[] = [];
        const sigma_B_values: number[] = [];

        rawData.forEach(row => {
            const { N, sigma_N, L, sigma_L, R, sigma_R, V, sigma_V } = row;
            if (N === null || L === null || R === null || V === null || L === 0 || R === 0) return;
            if (sigma_N === null || sigma_L === null || sigma_R === null || sigma_V === null) return;
            
            // B_solenoide = (mu0 * N * I) / L
            // I = V / R
            // B_solenoide = (mu0 * N * V) / (L * R)
            // A 45°, B_solenoide = B_terra
            const B_terra = (MU0 * N * V) / (L * R);
            B_values.push(B_terra);
            
            // Propagazione dell'errore
            const d_B_d_N = (MU0 * V) / (L * R);
            const d_B_d_V = (MU0 * N) / (L * R);
            const d_B_d_L = - (MU0 * N * V) / (L*L * R);
            const d_B_d_R = - (MU0 * N * V) / (L * R*R);
            
            const sigma_B_sq = (d_B_d_N * sigma_N)**2 + (d_B_d_V * sigma_V)**2 + (d_B_d_L * sigma_L)**2 + (d_B_d_R * sigma_R)**2;
            sigma_B_values.push(Math.sqrt(sigma_B_sq));
        });

        if (B_values.length === 0) {
            return { details: { error: "Nessuna misurazione valida." } };
        }

        const { wMean, sigmaWMean } = weightedMean(B_values, sigma_B_values);

        return {
            value: wMean,
            sigma: sigmaWMean,
            details: {
                method: "Media pesata delle misure"
            }
        };
    },
    result: {
        label: 'Campo Magnetico Terrestre (Bₑ)',
        unit: 'T',
    },
};
