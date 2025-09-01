
import { polynomialRegression, G_CONST } from '@/lib/stats';
import type { Formula, ProcessedInput, MeasurementRow, ModeState } from '@/lib/types';
import { mean } from 'mathjs';

export const newtonsSecondLawFormula: Formula = {
    id: 'newtons-second-law',
    title: 'Secondo principio della dinamica (Legge di Newton)',
    description: "Verifica la relazione F=ma analizzando il moto di un carrello su rotaia trainato da una massa.",
    category: 'Dinamica',
    getInputs: () => [
        { 
            id: 'M', 
            label: 'Massa carrello (M)', 
            unit: 'kg',
            help: {
                title: "Massa del carrello (M)",
                description: "La massa del carrello che si muove sulla rotaia. Inserisci questo valore una sola volta per l'esperimento. Misurala con una bilancia."
            }
        },
        { 
            id: 'm', 
            label: 'Massa trainante (m)', 
            unit: 'kg',
            help: {
                title: "Massa trainante (m)",
                description: "La massa appesa che traina il carrello. La forza motrice è il suo peso (F=mg). Inserisci questo valore una sola volta. Misurala con una bilancia."
            }
        },
        { 
            id: 't', 
            label: 'Tempo (t)', 
            unit: 's',
            help: {
                title: "Tempo (t)",
                description: "L'istante di tempo in cui viene misurata la posizione del carrello. Misuralo con un cronometro oppure una o più fotocellule."
            }
        },
        { 
            id: 'x', 
            label: 'Posizione (x)', 
            unit: 'm',
            help: {
                title: "Posizione (x)",
                description: "La posizione del carrello lungo la rotaia all'istante t. Misurala con un metro o sensori di posizione."
            }
        },
    ],
    calculation: (processedInputs: { [key: string]: ProcessedInput }, modes: ModeState, rawData: MeasurementRow[]) => {
        // Use all M and m values from the table
        const M_values = rawData.map(r => r.M).filter(v => v !== null) as number[];
        const sigma_M_values = rawData.map(r => r.sigma_M).filter(v => v !== null) as number[];
        const m_values = rawData.map(r => r.m).filter(v => v !== null) as number[];
        const sigma_m_values = rawData.map(r => r.sigma_m).filter(v => v !== null) as number[];
        
        if (M_values.length === 0 || m_values.length === 0) {
            return { details: { error: "Massa del carrello (M) e massa trainante (m) devono essere definite." } };
        }
        
        const M_mean = mean(M_values);
        const sigma_M_mean = mean(sigma_M_values) || 0;
        const m_mean = mean(m_values);
        const sigma_m_mean = mean(sigma_m_values) || 0;

        // Theoretical acceleration: a_teo = (m*g) / (M+m)
        const a_teo_val = (m_mean * G_CONST) / (M_mean + m_mean);
        const d_a_d_M = - (m_mean * G_CONST) / (M_mean + m_mean)**2;
        const d_a_d_m = (M_mean * G_CONST) / (M_mean + m_mean)**2;
        const sigma_a_teo_sq = (d_a_d_M * sigma_M_mean)**2 + (d_a_d_m * sigma_m_mean)**2;
        const a_teo = { value: a_teo_val, sigma: Math.sqrt(sigma_a_teo_sq) };

        // Experimental acceleration from parabolic fit x(t)
        const tValues = rawData.map(r => r.t).filter(v => v !== null) as number[];
        const xValues = rawData.map(r => r.x).filter(v => v !== null) as number[];
        
        if (tValues.length < 3) {
            return { a_teo, a_exp: null, details: { error: "Dati di posizione insufficienti per il fit (min 3 punti)." } };
        }

        const fit = require('@/lib/stats').polynomialRegression(tValues, xValues, 2);

        if (!fit) {
            return { a_teo, a_exp: null, details: { error: "Fit parabolico fallito." } };
        }

        const a_exp_val = 2 * fit.coeffs[2];
        const a_exp_sigma = 2 * fit.sigma_coeffs[2];
        const a_exp = { value: a_exp_val, sigma: a_exp_sigma };

        return {
            a_teo,
            a_exp,
            details: {
                M: { mean: M_mean, sigma: sigma_M_mean },
                m: { mean: m_mean, sigma: sigma_m_mean },
                fit_details: {
                    a: { value: fit.coeffs[2], sigma: fit.sigma_coeffs[2] },
                    v0: { value: fit.coeffs[1], sigma: fit.sigma_coeffs[1] },
                    x0: { value: fit.coeffs[0], sigma: fit.sigma_coeffs[0] },
                    R2: fit.R2,
                },
                method: "Fit parabolico + Calcolo teorico"
            }
        };
    },
    result: {},
    customResultRenderer: true,
};
