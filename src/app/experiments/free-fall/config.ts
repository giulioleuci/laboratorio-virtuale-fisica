
import { linearRegression, polynomialRegression, G_CONST } from '@/lib/stats';
import type { Formula, ProcessedInput, ModeState, MeasurementRow, ChartInfo, CalculationResult } from '@/lib/types';
import { FreeFallChartControls } from './free-fall-chart-controls';

// Function to transform data for the chart
const getFreeFallChartInfo = (
    data: MeasurementRow[],
    results: CalculationResult | null,
    xAxisUnit: 's' | 'ms',
    yAxisUnit: 'm' | 'cm'
): Omit<ChartInfo, 'customControls'> => {
    
    const chartData = data.map(p => ({
        x: xAxisUnit === 'ms' ? (p.t ?? 0) * 1000 : (p.t ?? 0),
        y: yAxisUnit === 'cm' ? (p.h ?? 0) * 100 : (p.h ?? 0),
        sigma_x: xAxisUnit === 'ms' ? (p.sigma_t ?? 0) * 1000 : (p.sigma_t ?? 0),
        sigma_y: yAxisUnit === 'cm' ? (p.sigma_h ?? 0) * 100 : (p.sigma_h ?? 0),
    }));

    const xLabel = `Tempo (${xAxisUnit})`;
    const yLabel = `Altezza (${yAxisUnit})`;

    return {
        data: chartData,
        xLabel,
        yLabel,
        fit: undefined, // Polynomial fit not easily transformable
    };
};

const getFreeFallSpeedTimeChartInfo = (
    data: MeasurementRow[],
    results: CalculationResult | null,
    xAxisUnit: 's' | 'ms'
): Omit<ChartInfo, 'customControls'> => {
    const chartData = data.map(p => ({
        x: xAxisUnit === 'ms' ? (p.t ?? 0) * 1000 : (p.t ?? 0),
        y: p.v ?? 0,
        sigma_x: xAxisUnit === 'ms' ? (p.sigma_t ?? 0) * 1000 : (p.sigma_t ?? 0),
        sigma_y: p.sigma_v ?? 0,
    }));
    
    let fit;
    if (results?.details?.fit) {
        let slope = results.details.fit.slope; // Original fit is v(m/s) vs t(s), so slope is g
        let intercept = results.details.fit.intercept;
        if (xAxisUnit === 'ms') {
            slope = slope / 1000; // m/s^2 -> m/ms^2
        }
        fit = { slope, intercept };
    }

    const xLabel = `Tempo (${xAxisUnit})`;
    const yLabel = 'Velocità (m/s)';

    return { data: chartData, xLabel, yLabel, fit };
};


export const freeFallFormula: Formula = {
    id: 'free-fall',
    title: 'Caduta libera',
    description: "Analizza il moto di un oggetto in caduta libera per determinare l'accelerazione di gravità (g).",
    category: 'Cinematica',
    getInputs: (modes: ModeState) => {
        const inputs = [
            { 
                id: 't', 
                label: 'Tempo (t)', 
                unit: 's',
                help: {
                    title: "Tempo (t)",
                    description: "Il tempo impiegato dall'oggetto a raggiungere (o cadere da) una certa altezza. Misuralo con un cronometro oppure una o più fotocellule."
                }
            }
        ];
        if (modes.mode === 'space-time') {
            inputs.unshift({ 
                id: 'h', 
                label: 'Altezza (h)', 
                unit: 'm',
                help: {
                    title: "Altezza (h)",
                    description: "L'altezza da cui l'oggetto viene lasciato cadere o la sua posizione in un dato istante. Misurala con un metro."
                }
            });
        } else { // mode === 'speed-time'
            inputs.unshift({ 
                id: 'v', 
                label: 'Velocità (v)', 
                unit: 'm/s',
                help: {
                    title: "Velocità (v)",
                    description: "La velocità istantanea dell'oggetto in caduta. Misurala con sensori di velocità (es. fotocellule)."
                }
            });
        }
        return inputs;
    },
    calculation: (processedInputs: { [key: string]: ProcessedInput }, modes: ModeState, rawData: MeasurementRow[]) => {
        const tValues = rawData.map(r => r.t).filter(v => v !== null) as number[];
        
        if (modes.mode === 'space-time') {
            const hValues = rawData.map(r => r.h).filter(v => v !== null) as number[];
            if (hValues.length < 3) return { details: { error: "Dati insufficienti per il fit parabolico." } };
            const fit = polynomialRegression(tValues, hValues, 2);

            if (!fit) return { details: { error: "Fit parabolico fallito." } };

            const g_value = -2 * fit.coeffs[2];
            const g_sigma = 2 * fit.sigma_coeffs[2];
            return {
                value: g_value,
                sigma: g_sigma,
                details: {
                    method: 'Fit Parabolico h(t)',
                    a: { value: fit.coeffs[2], sigma: fit.sigma_coeffs[2] },
                    v0: { value: fit.coeffs[1], sigma: fit.sigma_coeffs[1] },
                    x0: { value: fit.coeffs[0], sigma: fit.sigma_coeffs[0] },
                    R2: fit.R2
                }
            };

        } else { // mode === 'speed-time'
            const vValues = rawData.map(r => r.v).filter(v => v !== null) as number[];
            const vSigmas = rawData.map(r => r.sigma_v).filter(v => v !== null) as (number | null | undefined)[];
            if (vValues.length < 2) return { details: { error: "Dati insufficienti per il fit lineare." } };

            const fit = linearRegression(tValues, vValues, vSigmas, false);

            if (!fit) return { details: { error: "Fit lineare fallito." } };

            const g_value = -fit.slope; // assuming velocity is negative
            const g_sigma = fit.sigma_slope;
            return {
                value: g_value,
                sigma: g_sigma,
                details: {
                    method: 'Fit Lineare v(t)',
                    a: { value: fit.slope, sigma: fit.sigma_slope },
                    v0: { value: fit.intercept, sigma: fit.sigma_intercept },
                    R2: fit.R2,
                    chi2_reduced: fit.chi2_reduced,
                    fit,
                }
            };
        }
    },
    result: {
        label: 'Accelerazione di gravità (g)',
        unit: 'm/s²',
    },
    uiOptions: {
        switches: [
            {
                id: 'mode',
                label: 'Dati misurati',
                options: [
                    { value: 'space-time', label: 'Spazio-Tempo' },
                    { value: 'speed-time', label: 'Velocità-Tempo' }
                ],
                defaultValue: 'space-time'
            }
        ],
        getFixtureKey: (modes: ModeState) => `free-fall-${modes.mode}`,
        chart: {
            isSupported: (modes, data) => data.length >= 2,
            getCustomControls: (modes: ModeState) => {
                // Pass mode to the controls component so it can render conditionally
                return (props: any) => FreeFallChartControls({ ...props, mode: modes.mode as 'space-time' | 'speed-time' });
            },
            getInfo: (data, results, customState, modes) => {
                const { timeUnit = 's', lengthUnit = 'cm' } = customState ?? {};
                if (modes?.mode === 'space-time') {
                    return getFreeFallChartInfo(data, results, timeUnit, lengthUnit);
                }
                // speed-time
                return getFreeFallSpeedTimeChartInfo(data, results, timeUnit);
            }
        }
    }
};
