
import { polynomialRegression, linearRegression } from '@/lib/stats';
import type { Formula, ProcessedInput, MeasurementRow, ModeState, ChartInfo, CalculationResult, ChartDataPoint } from '@/lib/types';
import { AcceleratedMotionChartControls } from './accelerated-motion-chart-controls';

// Function to transform data for the chart
const getAcceleratedMotionChartInfo = (
    data: MeasurementRow[],
    results: CalculationResult | null,
    xAxisUnit: 's' | 'ms',
    yAxisUnit: 'm' | 'cm',
    showRegression: boolean = true,
    calculationMethod: string = 'fit_polynomial'
): Omit<ChartInfo, 'customControls'> => {
    
    // For linear fit, we want T² vs X chart
    const isLinearFit = calculationMethod === 'fit_linear';
    
    const chartData: ChartDataPoint[] = data.map(p => {
        const t = p.t ?? 0;
        const x = p.x ?? 0;
        const sigma_t = p.sigma_t ?? 0;
        const sigma_x = p.sigma_x ?? 0;
        
        if (isLinearFit) {
            // For linear fit: x-axis = T², y-axis = X
            const tSquared = t * t;
            const sigma_tSquared = 2 * t * sigma_t; // Error propagation for T²
            
            return {
                x: xAxisUnit === 'ms' ? tSquared * 1000000 : tSquared, // T² in s² or ms²
                y: yAxisUnit === 'cm' ? x * 100 : x,
                sigma_x: xAxisUnit === 'ms' ? sigma_tSquared * 1000000 : sigma_tSquared,
                sigma_y: yAxisUnit === 'cm' ? sigma_x * 100 : sigma_x,
            };
        } else {
            // For polynomial fit: x-axis = T, y-axis = X
            return {
                x: xAxisUnit === 'ms' ? t * 1000 : t,
                y: yAxisUnit === 'cm' ? x * 100 : x,
                sigma_x: xAxisUnit === 'ms' ? sigma_t * 1000 : sigma_t,
                sigma_y: yAxisUnit === 'cm' ? sigma_x * 100 : sigma_x,
            };
        }
    });

    const xLabel = isLinearFit 
        ? `Tempo² (${xAxisUnit === 'ms' ? 'ms²' : 's²'})`
        : `Tempo (${xAxisUnit})`;
    const yLabel = `Posizione (${yAxisUnit})`;

    // Add fit data if available and units are not transformed
    let fit = undefined;
    
    // Handle polynomial fit (fit_polynomial method)
    if (results?.details?.x0 && results?.details?.v0 && results?.details?.a && 
        xAxisUnit === 's' && yAxisUnit === 'm' && showRegression) {
        
        const { x0, v0, a } = results.details;
        console.log('Polynomial fit calculation:', { x0: x0.value, v0: v0.value, a: a.value });
        
        // Calculate y_fit for each data point using the parabola: x(t) = x0 + v0*t + (1/2)*a*t²
        chartData.forEach(point => {
            const t = point.x; // time
            point.y_fit = x0.value + v0.value * t + 0.5 * a.value * t * t;
            console.log(`Point t=${t}, y=${point.y}, y_fit=${point.y_fit}`);
        });
        
        // Provide a dummy fit object so the chart component renders the regression line
        fit = { slope: 0, intercept: 0 };
        console.log('Polynomial fit enabled, dummy fit object created');
    }
    // Handle linear fit (fit_linear method)
    else if (results?.details?.fit && xAxisUnit === 's' && yAxisUnit === 'm' && showRegression && isLinearFit) {
        
        const linearFit = results.details.fit;
        console.log('Linear fit calculation:', { slope: linearFit.slope, intercept: linearFit.intercept });
        
        // For linear fit, the chart component can handle it directly
        // The fit is already in T² vs X format from the calculation
        fit = {
            slope: linearFit.slope,
            intercept: linearFit.intercept
        };
        console.log('Linear fit enabled');
    }
    else {
        console.log('Fit not enabled:', {
            hasResults: !!results?.details,
            hasPolyCoeffs: !!(results?.details?.x0 && results?.details?.v0 && results?.details?.a),
            hasLinearFit: !!results?.details?.fit,
            isLinearFit,
            calculationMethod,
            xAxisUnit,
            yAxisUnit,
            showRegression
        });
    }

    console.log('Chart data generated:', chartData.length, 'points');
    console.log('Final fit object:', fit);
    console.log('Chart info:', { xLabel, yLabel, hasData: chartData.length > 0, hasFit: !!fit });

    return {
        data: chartData,
        xLabel,
        yLabel,
        fit,
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
        
        // mode 'fit_polynomial' or 'fit_linear'
        const tValues = rawData.map(r => r.t).filter(v => v !== null) as number[];
        const xValues = rawData.map(r => r.x).filter(v => v !== null) as number[];
        
        if (tValues.length < 3 && modes.calculation_method === 'fit_polynomial') {
            return { details: { error: "Dati insufficienti per il fit parabolico (min 3 punti)." } };
        }
        
        if (tValues.length < 2 && modes.calculation_method === 'fit_linear') {
            return { details: { error: "Dati insufficienti per il fit lineare (min 2 punti)." } };
        }

        if (modes.calculation_method === 'fit_polynomial') {
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
        } else if (modes.calculation_method === 'fit_linear') {
            // Linear fit: X vs T² 
            // For uniformly accelerated motion: x = x₀ + v₀t + ½at²
            // This is NOT linear in t² unless v₀ = 0
            // We'll use a different approach: fit x vs t with linear regression to get v₀ and a
            
            const xSigmas = rawData.map(r => r.sigma_x).filter(v => v !== null) as (number | null | undefined)[];
            
            // For comparison, let's also do the t² fit as originally intended
            const tSquaredValues = tValues.map(t => t * t);
            const fit = linearRegression(tSquaredValues, xValues, xSigmas, false);

            if (!fit) {
                return { details: { error: "Fit lineare x vs t² fallito." } };
            }

            // From x vs t²: x = intercept + slope * t²
            // If we assume x = x₀ + ½at², then:
            // slope = ½a → a = 2 * slope
            // intercept = x₀ (only valid if v₀ = 0)
            const a_val = 2 * fit.slope;
            const a_sigma = 2 * fit.sigma_slope;
            
            const a = { value: a_val, sigma: a_sigma };
            const x0 = { value: fit.intercept, sigma: fit.sigma_intercept };

            return {
                value: a.value,
                sigma: a.sigma,
                details: {
                    a,
                    x0,
                    R2: fit.R2,
                    chi2_reduced: fit.chi2_reduced,
                    method: "Fit lineare x vs t² (approssimazione per v₀≈0)",
                    fit,
                    warning: "Questo metodo assume velocità iniziale nulla. Per dati con v₀≠0, usare fit parabolico."
                }
            };
        }
        
        // Should not reach here, but return error for safety
        return { details: { error: "Metodo di calcolo non riconosciuto." } };
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
                    { value: 'fit_polynomial', label: 'Fit parabolico' },
                    { value: 'fit_linear', label: 'Fit lineare (X vs T²)' },
                    { value: 'average', label: 'Media' }
                ],
                defaultValue: 'fit_linear'
            }
        ],
        getFixtureKey: (modes: ModeState) => `accelerated-motion-${modes.calculation_method}`,
        chart: {
            isSupported: (modes: ModeState, data: MeasurementRow[]) => {
                return data.length >= 3 && (modes.calculation_method === 'fit_polynomial' || modes.calculation_method === 'fit_linear');
            },
            getCustomControls: (modes: ModeState) => {
                return AcceleratedMotionChartControls;
            },
            getInfo: (data, results, customState, modes) => {
                const { timeUnit = 's', lengthUnit = 'cm', showRegression = true } = customState ?? {};
                return getAcceleratedMotionChartInfo(data, results, timeUnit, lengthUnit, showRegression, modes?.calculation_method);
            }
        }
    }
};
