
import { polynomialRegression } from '@/lib/stats';
import type { Formula, ProcessedInput, MeasurementRow, ModeState, ChartInfo, CalculationResult } from '@/lib/types';
import { AcceleratedMotionChartControls } from './accelerated-motion-chart-controls';

// Function to transform data for the chart
const getAcceleratedMotionChartInfo = (
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

    const xLabel = `Tempo (${xAxisUnit})`;
    const yLabel = `Posizione (${yAxisUnit})`;

    return {
        data: chartData,
        xLabel,
        yLabel,
        // Fit is not easily transformable for polynomial, so we don't display it if units are changed
        fit: undefined,
    };
};

export const acceleratedMotionFormula: Formula = {
    id: 'accelerated-motion',
    title: 'Moto rettilineo uniformemente accelerato',
    description: "Analizza il moto di un oggetto per determinarne l'accelerazione.",
    category: 'Cinematica',
    getInputs: (modes: ModeState) => {
        if (modes.calculation_method === 'average') {
            return [
                { 
                    id: 't', 
                    label: 'Δt (s)', 
                    unit: 's',
                    help: {
                        title: "Intervallo di tempo (t)",
                        description: "Il tempo impiegato dall'oggetto per percorrere la distanza misurata, partendo da fermo. Misuralo con un cronometro oppure una o più fotocellule."
                    }
                },
                { 
                    id: 's', 
                    label: 'Δs (m)', 
                    unit: 'm',
                    help: {
                        title: "Distanza (s)",
                        description: "La distanza percorsa dall'oggetto partendo da fermo. Misurala con un metro."
                    }
                }
            ];
        }
        // mode 'fit'
        return [
            { 
                id: 't', 
                label: 'Tempo (t)', 
                unit: 's',
                help: {
                    title: "Tempo (t)",
                    description: "L'istante di tempo in cui viene misurata la posizione. Misuralo con un cronometro oppure una o più fotocellule."
                }
            },
            { 
                id: 'x', 
                label: 'Posizione (x)', 
                unit: 'm',
                help: {
                    title: "Posizione (x)",
                    description: "La posizione dell'oggetto lungo la sua traiettoria. Misurala con un metro o sensori di posizione."
                }
            }
        ];
    },
    calculation: (processedInputs: { [key: string]: ProcessedInput }, modes: ModeState, rawData: MeasurementRow[]) => {
        if (modes.calculation_method === 'average') {
            const { s: s_processed, t: t_processed } = processedInputs;
            if (!s_processed || !t_processed || s_processed.count < 1 || t_processed.count < 1) {
                return { details: { error: "Dati insufficienti per il calcolo della media." } };
            }

            // Per il moto uniformemente accelerato partendo da fermo: s = (1/2) * a * t²
            // Quindi: a = 2s / t²
            const s_mean = s_processed.mean;
            const t_mean = t_processed.mean;

            if (t_mean === 0) {
                return { details: { error: "Il tempo non può essere zero." } };
            }

            const a_val = (2 * s_mean) / (t_mean * t_mean);
            
            // Calcolo dell'incertezza usando propagazione degli errori
            // σ_a = a * sqrt((σ_s/s)² + (2*σ_t/t)²)
            let a_sigma = NaN;
            if (s_processed.sigma && t_processed.sigma && s_mean !== 0) {
                const rel_sigma_s = s_processed.sigma / s_mean;
                const rel_sigma_t = t_processed.sigma / t_mean;
                a_sigma = a_val * Math.sqrt(rel_sigma_s * rel_sigma_s + 4 * rel_sigma_t * rel_sigma_t);
            }
            
            return {
                value: a_val,
                sigma: a_sigma,
                details: {
                    method: "Formula cinematica a = 2s/t² (partendo da fermo)",
                    distance_mean: s_mean,
                    time_mean: t_mean
                }
            };
        }
        
        // mode 'fit'
        const tValues = rawData.map(r => r.t).filter(v => v !== null) as number[];
        const xValues = rawData.map(r => r.x).filter(v => v !== null) as number[];
        
        if (tValues.length < 3) {
            return { details: { error: "Dati insufficienti per il fit parabolico (min 3 punti)." } };
        }

        const fit = polynomialRegression(tValues, xValues, 2);

        if (!fit) {
            return { details: { error: "Fit parabolico fallito." } };
        }

        const a_val = 2 * fit.coeffs[2];
        const a_sigma = 2 * fit.sigma_coeffs[2];
        
        const a = { value: a_val, sigma: a_sigma };
        const v0 = { value: fit.coeffs[1], sigma: fit.sigma_coeffs[1] };
        const x0 = { value: fit.coeffs[0], sigma: fit.sigma_coeffs[0] };

        return {
            value: a.value,
            sigma: a.sigma,
            details: {
                a,
                v0,
                x0,
                R2: fit.R2,
                method: "Fit parabolico x(t)"
            }
        };
    },
    result: {
        label: 'Accelerazione (a)',
        unit: 'm/s²',
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
        getFixtureKey: (modes: ModeState) => `accelerated-motion-${modes.calculation_method}`,
        chart: {
            isSupported: (modes: ModeState, data: MeasurementRow[]) => {
                return data.length >= 3 && modes.calculation_method === 'fit';
            },
            getCustomControls: (modes: ModeState) => {
                return AcceleratedMotionChartControls;
            },
            getInfo: (data, results, customState) => {
                const { timeUnit = 's', lengthUnit = 'cm' } = customState ?? {};
                return getAcceleratedMotionChartInfo(data, results, timeUnit, lengthUnit);
            }
        }
    }
};
