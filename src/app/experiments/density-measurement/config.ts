
import { linearRegression, weightedMean } from '@/lib/stats';
import type { Formula, ProcessedInput, MeasurementRow, ModeState, ChartInfo, CalculationResult } from '@/lib/types';

export const densityMeasurementFormula: Formula = {
    id: 'density-measurement',
    title: 'Misure di densità',
    description: "Misura la densità di una sostanza tramite la definizione.",
    category: 'Esperienze introduttive',
    getInputs: (modes: ModeState) => {
        const isDirect = modes.volume_measurement_method === 'direct';
        const massInput = {
            id: 'm', 
            label: 'Massa (m)', 
            unit: 'g',
            help: {
                title: "Massa (m)",
                description: "La massa del campione di sostanza. Misurala con una bilancia di precisione."
            }
        };

        if (isDirect) {
            return [
                massInput,
                {
                    id: 'v',
                    label: 'Volume (V)',
                    unit: 'cm³',
                    help: {
                        title: "Volume (V)",
                        description: "Il volume del campione di sostanza. Per un liquido, usa un cilindro graduato. Per un solido, puoi usare il metodo dell'immersione in acqua."
                    }
                },
            ];
        } else {
            return [
                massInput,
                {
                    id: 'v_i',
                    label: 'Volume iniziale (Vᵢ)',
                    unit: 'cm³',
                    help: {
                        title: 'Volume iniziale (Vᵢ)',
                        description: 'Il volume del liquido prima di immergere il campione. Misuralo con un cilindro graduato.'
                    }
                },
                {
                    id: 'v_f',
                    label: 'Volume finale (Vƒ)',
                    unit: 'cm³',
                    help: {
                        title: 'Volume finale (Vƒ)',
                        description: 'Il volume del liquido dopo aver immerso il campione. Misuralo con un cilindro graduato.'
                    }
                }
            ];
        }
    },
    calculation: (processedInputs: { [key: string]: ProcessedInput }, modes: ModeState, rawData: MeasurementRow[]) => {
        const isDirect = modes.volume_measurement_method === 'direct';

        const processedData = rawData.map(row => {
            if (isDirect) {
                return { ...row };
            } else {
                const v_i = row.v_i ?? 0;
                const v_f = row.v_f ?? 0;
                const sigma_v_i = row.sigma_v_i ?? 0;
                const sigma_v_f = row.sigma_v_f ?? 0;

                const v = v_f - v_i;
                const sigma_v = Math.sqrt(sigma_v_i**2 + sigma_v_f**2);

                return { ...row, v, sigma_v };
            }
        });

        if (modes.calculation_method === 'average') {
            const rho_values = processedData.map(row => {
                const m = row.m ?? 0;
                const v = row.v ?? 0;
                if (v === 0) return null;
                return m / v;
            }).filter(rho => rho !== null) as number[];

            if (rho_values.length === 0) return { details: { error: "Dati insufficienti." } };
            
            const sigmas = processedData.map(row => {
                 if (!row.v || !row.m || !row.sigma_v || !row.sigma_m) return 0;
                 const rho = row.m / row.v;
                 return Math.abs(rho) * Math.sqrt((row.sigma_m / row.m) ** 2 + (row.sigma_v / row.v) ** 2);
            });

            const { wMean, sigmaWMean } = weightedMean(rho_values, sigmas);
            
            return {
                value: wMean,
                sigma: sigmaWMean,
                details: {
                    method: "Media dei rapporti m/V"
                }
            };
        }

        // mode 'fit'
        const vValues = processedData.map(r => r.v).filter(val => val !== null) as number[];
        const mValues = processedData.map(r => r.m).filter(val => val !== null) as number[];
        const mSigmas = processedData.map(r => r.sigma_m).filter(val => val !== null) as (number | null | undefined)[];

        if (vValues.length < 2) {
            return { details: { error: "Dati insufficienti per il fit lineare." } };
        }

        // Fit m = rho * V, so m is y-axis, V is x-axis, slope is rho
        const fit = linearRegression(vValues, mValues, mSigmas, true);

        if (!fit) {
            return { details: { error: "Fit lineare fallito." } };
        }
        
        const rho = { value: fit.slope, sigma: fit.sigma_slope };

        return {
            value: rho.value,
            sigma: rho.sigma,
            details: {
                rho,
                R2: fit.R2,
                chi2_reduced: fit.chi2_reduced,
                method: "Fit lineare m vs V (passante per l'origine)",
                fit,
            }
        };
    },
    result: {
        label: 'Densità (ρ)',
        unit: 'g/cm³',
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
            },
            {
                id: 'volume_measurement_method',
                label: 'Misura del volume',
                options: [
                    { value: 'direct', label: 'Diretta' },
                    { value: 'indirect', label: 'Indiretta' }
                ],
                defaultValue: 'direct'
            }
        ],
        getFixtureKey: (modes: ModeState) => `density-measurement-${modes.calculation_method}`,
        chart: {
            isSupported: (modes, data) => data.length >= 2 && modes.calculation_method === 'fit',
            getInfo: (data, results, modes) => {
                const processedData = data.map(row => {
                    if (modes.volume_measurement_method === 'direct') {
                        return { ...row };
                    } else {
                        const v_i = row.v_i ?? 0;
                        const v_f = row.v_f ?? 0;
                        const sigma_v_i = row.sigma_v_i ?? 0;
                        const sigma_v_f = row.sigma_v_f ?? 0;

                        const v = v_f - v_i;
                        const sigma_v = Math.sqrt(sigma_v_i**2 + sigma_v_f**2);

                        return { ...row, v, sigma_v };
                    }
                });

                const chartData = processedData.map(p => ({
                    x: p.v ?? 0,
                    y: p.m ?? 0,
                    sigma_x: p.sigma_v ?? 0,
                    sigma_y: p.sigma_m ?? 0
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
                    xLabel: 'Volume (cm³)',
                    yLabel: 'Massa (g)',
                    fit
                };
            }
        }
    }
};
