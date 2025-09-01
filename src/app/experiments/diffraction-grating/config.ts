
import type { Formula, ProcessedInput, MeasurementRow, ModeState } from '@/lib/types';
import { weightedMean } from '@/lib/stats';
import { mean } from 'mathjs';

const toRadians = (deg: number) => deg * (Math.PI / 180);

export const diffractionGratingFormula: Formula = {
    id: 'diffraction-grating',
    title: 'Reticolo di Diffrazione',
    description: "Misura la lunghezza d’onda di un raggio luminoso monocromatico usando un reticolo di diffrazione.",
    category: 'Ottica',
    getInputs: (modes) => {
        const inputs = [
            { 
                id: 'd', 
                label: 'Passo del reticolo (d)', 
                unit: 'm',
                help: {
                    title: "Passo del reticolo (d)",
                    description: "La distanza tra due fenditure adiacenti del reticolo. Solitamente è un valore noto fornito dal costruttore (es. 1/numero di linee per mm)."
                }
            },
            { 
                id: 'L', 
                label: 'Distanza reticolo-schermo (L)', 
                unit: 'm',
                help: {
                    title: "Distanza reticolo-schermo (L)",
                    description: "La distanza perpendicolare tra il reticolo di diffrazione e lo schermo su cui si proietta la figura. Misurala con un metro."
                }
            },
            { 
                id: 'm', 
                label: 'Ordine del massimo (m)', 
                unit: '#', 
                isInteger: true,
                help: {
                    title: "Ordine del massimo (m)",
                    description: "Un numero intero (1, 2, 3, ...) che identifica il massimo di interferenza costruttiva che stai misurando, rispetto al massimo centrale (ordine 0)."
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
                    description: "La distanza sullo schermo tra il centro del massimo centrale e il centro del massimo di ordine 'm'. Misurala con un righello."
                }
            });
        } else {
            inputs.push({ 
                id: 'y_2m', 
                label: 'Distanza tra i due massimi di ordine m (y₂ₘ)', 
                unit: 'm',
                help: {
                    title: "Distanza y₂ₘ",
                    description: "La distanza totale sullo schermo tra i due massimi di ordine 'm', uno a destra e uno a sinistra del centro. Questa misura riduce l'errore di posizionamento del centro."
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
                if (row.y_m === null || row.sigma_y_m === null) return;
                y_m = row.y_m;
                sigma_y_m = row.sigma_y_m;
            } else { // 'double'
                if (row.y_2m === null || row.sigma_y_2m === null) return;
                y_m = row.y_2m / 2;
                sigma_y_m = row.sigma_y_2m / 2;
            }

            const theta = Math.atan(y_m / L);
            // lambda = (d * sin(theta)) / m
            const lambda = (d * Math.sin(theta)) / m;
            lambda_values.push(lambda);
            
            // Error propagation
            const d_lambda_d_d = Math.sin(theta) / m;
            const d_lambda_d_L = - (d * y_m * Math.cos(theta)) / (m * L*L);
            const d_lambda_d_y = (d * Math.cos(theta)) / (m * L);
            
            const sigma_lambda_sq = (d_lambda_d_d * sigma_d)**2 + (d_lambda_d_L * sigma_L)**2 + (d_lambda_d_y * sigma_y_m)**2;
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
        getFixtureKey: (modes: ModeState) => `diffraction-grating-${modes.measurement_mode}`,
    }
};
