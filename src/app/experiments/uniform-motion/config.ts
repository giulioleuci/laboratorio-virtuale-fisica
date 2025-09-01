
import { linearRegression, weightedMean } from '@/lib/stats';
import type { Formula, ProcessedInput, MeasurementRow, ModeState, ChartInfo, CalculationResult, ChartOptions } from '@/lib/types';
import { UniformMotionChartControls } from './uniform-motion-chart-controls';

// Function to transform data and calculate fit for the chart
const getUniformMotionChartInfo = (
    data: MeasurementRow[],
    results: CalculationResult | null,
    xAxisUnit: 's' | 'ms',
    yAxisUnit: 'm' | 'cm'
): Omit<ChartInfo, 'customControls'> => {
    
    const chartData = data.map(p => ({
        x: xAxisUnit === 'ms' ? (p.t ?? 0) * 1000 : (p.t ?? 0),
        y: yAxisUnit === 'cm' ? (p.x ?? 0) * 100 : (p.x ?? 0),
        sigma_x: xAxisUnit === 'ms' ? (p.sigma_t ?? 0) * 1000 : (p.sigma_t ?? 0),
        sigma_y: yAxisUnit === 'cm' ? (p.sigma_x ?? 0) * 100 : (p.sigma_x ?? 0),
    }));

    let fit;
    if (results?.details?.fit) {
        let slope = results.details.fit.slope; // Original fit is x(m) vs t(s), so slope is v(m/s)
        let intercept = results.details.fit.intercept;

        if (xAxisUnit === 'ms') {
            slope = slope / 1000; // m/s -> m/ms
        }
        if (yAxisUnit === 'cm') {
            slope = slope * 100; // (m/...s) -> (cm/...s)
            intercept = intercept * 100; // m -> cm
        }
        fit = { slope, intercept };
    }
    
    const xLabel = `Tempo (${xAxisUnit})`;
    const yLabel = `Posizione (${yAxisUnit})`;

    return {
        data: chartData,
        xLabel,
        yLabel,
        fit,
    };
};

export const uniformMotionFormula: Formula = {
    id: 'uniform-motion',
    title: 'Moto rettilineo uniforme',
    description: "Analizza la relazione tra posizione e tempo per un oggetto in moto rettilineo uniforme per determinarne la velocità.",
    category: 'Cinematica',
    getInputs: (modes: ModeState) => {
        if (modes.data_type === 'displacements') {
             return [
                { 
                    id: 't', 
                    label: 'Intervallo di tempo (Δt)', 
                    unit: 's',
                    help: {
                        title: "Intervallo di tempo (Δt)",
                        description: "La durata dell'intervallo in cui avviene lo spostamento. Misuralo con un cronometro oppure una o più fotocellule."
                    }
                },
                { 
                    id: 'x', 
                    label: 'Spostamento (Δx)', 
                    unit: 'm',
                    help: {
                        title: "Spostamento (Δx)",
                        description: "La distanza percorsa dall'oggetto durante l'intervallo di tempo Δt. Misuralo con un metro."
                    }
                }
            ];
        }
        // mode 'positions'
        return [
            { 
                id: 't', 
                label: 'Tempo (t)', 
                unit: 's',
                help: {
                    title: "Tempo (t)",
                    description: "L'istante di tempo in cui viene registrata la posizione dell'oggetto. Misuralo con un cronometro oppure una o più fotocellule."
                }
            },
            { 
                id: 'x', 
                label: 'Posizione (x)', 
                unit: 'm',
                help: {
                    title: "Posizione (x)",
                    description: "La posizione dell'oggetto lungo la sua traiettoria a un dato istante di tempo. Misurala con un metro."
                }
            }
        ];
    },
    calculation: (processedInputs: { [key: string]: ProcessedInput }, modes: ModeState, rawData: MeasurementRow[]) => {
        if (modes.calculation_method === 'average') {
            const v_values = rawData.map(row => {
                const dt = row.t ?? 0;
                const dx = row.x ?? 0;
                if (dt === 0) return null;
                return dx / dt;
            }).filter(v => v !== null) as number[];

            if(v_values.length === 0) return { details: { error: "Dati insufficienti."}};

            const sigmas = rawData.map(row => {
                 if (!row.t || !row.x || !row.sigma_t || !row.sigma_x) return 0;
                 // v = x/t => sigma_v = v * sqrt((sigma_x/x)^2 + (sigma_t/t)^2)
                 const v = row.x/row.t;
                 return Math.abs(v) * Math.sqrt((row.sigma_x/row.x)**2 + (row.sigma_t/row.t)**2);
            })

            const { wMean, sigmaWMean } = weightedMean(v_values, sigmas);
            
            return {
                value: wMean,
                sigma: sigmaWMean,
                details: {
                    method: "Media delle velocità (Δx/Δt)"
                }
            }
        }

        // mode 'fit'
        const tValues = rawData.map(r => r.t).filter(v => v !== null) as number[];
        const xValues = rawData.map(r => r.x).filter(v => v !== null) as number[];
        const xSigmas = rawData.map(r => r.sigma_x).filter(v => v !== null) as (number | null | undefined)[];

        if (tValues.length < 2 || xValues.length < 2) {
            return { details: { error: "Dati insufficienti per il fit lineare." } };
        }

        const fit = linearRegression(tValues, xValues, xSigmas, false);

        if (!fit) {
            return { details: { error: "Fit lineare fallito." } };
        }

        const v = { value: fit.slope, sigma: fit.sigma_slope };
        const x0 = { value: fit.intercept, sigma: fit.sigma_intercept };

        return {
            value: v.value,
            sigma: v.sigma,
            details: {
                v,
                x0,
                R2: fit.R2,
                chi2_reduced: fit.chi2_reduced,
                method: "Fit lineare x(t)",
                fit,
            }
        };
    },
    result: {
        label: 'Velocità (v)',
        unit: 'm/s',
    },
    uiOptions: {
        switches: [
            {
                id: 'data_type',
                label: 'Tipo di dati',
                options: [
                    { value: 'positions', label: 'Posizioni' },
                    { value: 'displacements', label: 'Spostamenti' }
                ],
                defaultValue: 'positions'
            },
            {
                id: 'calculation_method',
                label: 'Metodo di calcolo',
                options: [
                    { value: 'fit', label: 'Fit' },
                    { value: 'average', label: 'Media' }
                ],
                defaultValue: 'fit',
                disabled: (modes: ModeState) => modes.data_type === 'displacements',
            }
        ],
        getFixtureKey: (modes: ModeState) => {
            if (modes.data_type === 'displacements') return 'uniform-motion-displacements-average';
            return `uniform-motion-positions-${modes.calculation_method}`;
        },
        getInitialModes: (modes: ModeState) => {
            if (modes.data_type === 'displacements') {
                return { ...modes, calculation_method: 'average' };
            }
            return modes;
        },
        chart: {
            isSupported: (modes, data) => {
                return modes.data_type === 'positions' && data.length >= 2 && modes.calculation_method === 'fit';
            },
             getCustomControls: (modes: ModeState) => {
                return UniformMotionChartControls;
            },
            getInfo: (data, results, customState) => {
                 const { timeUnit = 's', lengthUnit = 'cm' } = customState ?? {};
                return getUniformMotionChartInfo(data, results, timeUnit, lengthUnit);
            }
        }
    }
};
