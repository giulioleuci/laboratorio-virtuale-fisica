
import type { Formula, ProcessedInput, MeasurementRow, ModeState } from '@/lib/types';
import { weightedMean } from '@/lib/stats';
import { mean } from 'mathjs';

export const youngsDoubleSlitFormula: Formula = {
    id: 'youngs-double-slit',
    title: 'Esperimento di Young (doppia fenditura)',
    description: "Misura la lunghezza d’onda di un raggio luminoso monocromatico usando l'interferenza da una doppia fenditura.",
    category: 'Ottica',
    getInputs: (modes) => {
        const inputs = [
            { 
                id: 'd', 
                label: 'Distanza tra le fenditure (d)', 
                unit: 'm',
                help: {
                    title: "Distanza tra le fenditure (d)",
                    description: "La distanza tra i centri delle due fenditure. Solitamente è un valore noto fornito dal costruttore."
                }
            },
            { 
                id: 'L', 
                label: 'Distanza fenditure-schermo (L)', 
                unit: 'm',
                help: {
                    title: "Distanza fenditure-schermo (L)",
                    description: "La distanza perpendicolare tra il piano delle fenditure e lo schermo su cui si proietta la figura di interferenza. Misurala con un metro."
                }
            },
            { 
                id: 'm', 
                label: 'Ordine del massimo (m)', 
                unit: '#', 
                isInteger: true,
                help: {
                    title: "Ordine del massimo (m)",
                    description: "Un numero intero (1, 2, 3, ...) che identifica la frangia luminosa (massimo) che stai misurando, rispetto alla frangia centrale (ordine 0)."
                }
            },
        ];
        if (modes.measurement_mode === 'single') {
            inputs.push({ 
                id: 'y_m', 
                label: 'Distanza max centrale-max ordine m (yₘ)', 
                unit: 'm',
                help: {
                    title: "Distanza yₘ",
                    description: "La distanza sullo schermo tra il centro della frangia luminosa centrale e il centro della frangia di ordine 'm'. Misurala con un righello."
                }
            });
        } else {
            inputs.push({ 
                id: 'y_2m', 
                label: 'Distanza tra i due massimi di ordine m (y₂ₘ)', 
                unit: 'm',
                help: {
                    title: "Distanza y₂ₘ",
                    description: "La distanza totale sullo schermo tra le due frange luminose di ordine 'm', una a destra e una a sinistra del centro."
                }
            });
        }
        return inputs;
    },
    calculation: (processedInputs: { [key: string]: ProcessedInput }, modes: ModeState, rawData: MeasurementRow[]) => {
        if (rawData.length === 0) {
            return { details: { error: "Dati insufficienti." } };
        }
        
        // Use mean values for fixed parameters
        const L = processedInputs.L?.mean ?? 0;
        const sigma_L = processedInputs.L?.sigma ?? 0;
        const d = processedInputs.d?.mean ?? 0;
        const sigma_d = processedInputs.d?.sigma ?? 0;
        const m = processedInputs.m?.mean ?? 0; // Assuming m is constant for the experiment
        
        if (d === 0 || L === 0 || m === 0) return { details: { error: "Parametri (d, L, m) non possono essere zero." } };

        let lambda_values: number[] = [];
        let sigma_lambda_values: number[] = [];
        
        rawData.forEach(row => {
            let y_m = 0, sigma_y_m = 0;

            if (modes.measurement_mode === 'single') {
                const { y_m: val, sigma_y_m: sig } = row;
                if (val == null || sig == null) return;
                y_m = val;
                sigma_y_m = sig;
            } else { // 'double'
                const { y_2m: val, sigma_y_2m: sig } = row;
                if (val == null || sig == null) return;
                y_m = val / 2;
                sigma_y_m = sig / 2;
            }

            // For small angles, sin(theta) ~ tan(theta) = y_m / L
            // m * lambda = d * sin(theta) => lambda = (d * y_m) / (m * L)
            const lambda = (d * y_m) / (m * L);
            lambda_values.push(lambda);
            
            // Error propagation
            const d_lambda_d_d = y_m / (m * L);
            const d_lambda_d_y = d / (m * L);
            const d_lambda_d_L = - (d * y_m) / (m * L*L);
            
            const sigma_lambda_sq = (d_lambda_d_d * sigma_d)**2 + (d_lambda_d_y * sigma_y_m)**2 + (d_lambda_d_L * sigma_L)**2;
            sigma_lambda_values.push(Math.sqrt(sigma_lambda_sq));
        });

        if (lambda_values.length === 0) {
            return { details: { error: "Nessuna misurazione valida trovata." } };
        }

        const { wMean, sigmaWMean } = weightedMean(lambda_values, sigma_lambda_values);

        return {
            value: wMean,
            sigma: sigmaWMean,
            details: {
                method: modes.measurement_mode === 'single' ? "Misura singola" : "Misura doppia",
            }
        };
    },
    result: {
        label: 'Lunghezza d’onda (λ)',
        unit: 'nm',
    },
    // We want to render in nm, but calculations are in m
    customResultRenderer: true,
    uiOptions: {
        switches: [
            {
                id: 'measurement_mode',
                label: 'Modalità di misura',
                options: [
                    { value: 'double', label: 'Distanza tra due massimi' },
                    { value: 'single', label: 'Distanza dal massimo centrale' },
                ],
                defaultValue: 'double'
            }
        ],
        getFixtureKey: (modes: ModeState) => `youngs-double-slit-${modes.measurement_mode}`,
    }
};
