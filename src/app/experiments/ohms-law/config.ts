

import { linearRegression, weightedMean } from '@/lib/stats';
import type { Formula, ProcessedInput, MeasurementRow, ModeState, ChartInfo, CalculationResult, ChartOptions } from '@/lib/types';

export const ohmsLawFormula: Formula = {
    id: 'ohms-law',
    title: 'Prima legge di Ohm',
    description: "Verifica la relazione tra tensione e corrente in un resistore, e determinane la resistenza.",
    category: 'Elettricità',
    getInputs: () => [
        { 
            id: 'v', 
            label: 'Tensione (V)', 
            unit: 'V',
            help: {
                title: "Tensione (V)",
                description: "La differenza di potenziale ai capi del resistore. Misurala con un voltmetro collegato in parallelo al resistore."
            }
        },
        { 
            id: 'i', 
            label: 'Corrente (I)', 
            unit: 'A',
            help: {
                title: "Corrente (I)",
                description: "La corrente che attraversa il resistore. Misurala con un amperometro collegato in serie al resistore."
            }
        },
    ],
    calculation: (processedInputs: { [key: string]: ProcessedInput }, modes: ModeState, rawData: MeasurementRow[]) => {
        if (modes.calculation_method === 'average') {
            const R_values = rawData.map(row => {
                const V = row.v ?? 0;
                const I = row.i ?? 0;
                if (I === 0) return null;
                return V / I;
            }).filter(R => R !== null) as number[];

            if(R_values.length === 0) return { details: { error: "Dati insufficienti."}};
            
            const sigmas = rawData.map(row => {
                 if (!row.v || !row.i || !row.sigma_v || !row.sigma_i) return 0;
                 const R = row.v/row.i;
                 return Math.abs(R) * Math.sqrt((row.sigma_v/row.v)**2 + (row.sigma_i/row.i)**2);
            })

            const { wMean, sigmaWMean } = weightedMean(R_values, sigmas);
            
            return {
                value: wMean,
                sigma: sigmaWMean,
                details: {
                    method: "Media dei rapporti V/I"
                }
            }
        }
        
        // mode 'fit'
        const vValues = rawData.map(r => r.v).filter(v => v !== null) as number[];
        const iValues = rawData.map(r => r.i).filter(v => v !== null) as number[];
        const vSigmas = rawData.map(r => r.sigma_v).filter(v => v !== null) as (number | null | undefined)[];

        if (iValues.length < 2 || vValues.length < 2) {
            return { details: { error: "Dati insufficienti per il fit lineare." } };
        }

        // Fit V = R*I, so V is y-axis, I is x-axis
        const fit = linearRegression(iValues, vValues, vSigmas, true);

        if (!fit) {
            return { details: { error: "Fit lineare fallito." } };
        }
        
        const R = { value: fit.slope, sigma: fit.sigma_slope };

        return {
            value: R.value,
            sigma: R.sigma,
            details: {
                R,
                R2: fit.R2,
                chi2_reduced: fit.chi2_reduced,
                method: "Fit lineare V vs I (passante per l'origine)",
                fit,
            }
        };
    },
    result: {
        label: 'Resistenza (R)',
        unit: 'Ω',
    },
    uiOptions: {
        switches: [
            {
                id: 'calculation_method',
                label: 'Metodo di calcolo',
                options: [
                    { value: 'fit', label: 'Fit' },
                    { value: 'average', label: 'Media' }
                ],
                defaultValue: 'fit'
            }
        ],
        getFixtureKey: (modes: ModeState) => `ohms-law-${modes.calculation_method}`,
        chart: {
            isSupported: (modes: ModeState, data: MeasurementRow[]) => {
                return data.length >= 2 && modes.calculation_method === 'fit';
            },
            getInfo: (data, results, customState) => {
                const chartData = data.map(p => ({
                    x: p.i ?? 0,
                    y: p.v ?? 0,
                    sigma_x: p.sigma_i ?? 0,
                    sigma_y: p.sigma_v ?? 0
                }));

                let fit;
                if (results?.details?.fit) {
                    fit = {
                        slope: results.details.fit.slope,
                        intercept: results.details.fit.intercept
                    };
                }

                return {
                    data: chartData,
                    xLabel: 'Corrente (A)',
                    yLabel: 'Tensione (V)',
                    fit
                };
            }
        }
    }
};
