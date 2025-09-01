
import { linearRegression, G_CONST, weightedMean } from '@/lib/stats';
import type { Formula, ProcessedInput, MeasurementRow, ModeState, ChartInfo, CalculationResult } from '@/lib/types';
import { PendulumChartControls } from './pendulum-chart-controls';

// Function to transform data for the chart
const getPendulumChartInfo = (
    data: MeasurementRow[],
    results: CalculationResult | null,
    xAxisUnit: 'm' | 'cm'
): Omit<ChartInfo, 'customControls'> => {

    // Calculate Period T and its uncertainty from raw data (t, sigma_t, n)
    const getPeriodData = (row: MeasurementRow) => {
        const t = row.t ?? 0;
        const sigma_t = row.sigma_t ?? 0;
        const n = (row.n && row.n >= 1) ? row.n : 1;
        const T = t / n;
        const sigma_T = sigma_t / n;
        return { ...row, T, sigma_T };
    }
    const dataWithPeriod = data.map(getPeriodData);
    
    const chartData = dataWithPeriod.map(p => ({
        x: xAxisUnit === 'cm' ? (p.l ?? 0) * 100 : (p.l ?? 0),
        y: p.T ? p.T**2 : 0,
        sigma_x: xAxisUnit === 'cm' ? (p.sigma_l ?? 0) * 100 : (p.sigma_l ?? 0),
        sigma_y: p.T && p.sigma_T ? 2 * p.T * p.sigma_T : 0,
    }));

    let fit;
    if (results?.details?.fit) {
        let slope = results.details.fit.slope; // Original fit is T^2 vs L(m), slope is s^2/m
        let intercept = results.details.fit.intercept;
        if (xAxisUnit === 'cm') {
            slope = slope / 100; // s^2/m -> s^2/cm
        }
        fit = { slope, intercept };
    }
    
    const xLabel = `Lunghezza (${xAxisUnit})`;
    const yLabel = 'Periodo al quadrato (s²)';

    return {
        data: chartData,
        xLabel,
        yLabel,
        fit,
    };
};


export const pendulumFormula: Formula = {
    id: 'pendulum',
    title: 'Misura di g con il pendolo semplice',
    description: "Misura il periodo di oscillazione di un pendolo semplice per determinare l'accelerazione di gravità (g).",
    category: 'Dinamica',
    getInputs: () => [
        { 
            id: 'l', 
            label: 'Lunghezza (l)', 
            unit: 'm',
            help: {
                title: "Lunghezza (l)",
                description: "La lunghezza del filo del pendolo, misurata dal punto di sospensione al centro di massa dell'oggetto appeso. Usa un metro."
            }
        },
        { 
            id: 't', 
            label: 'Tempo misurato (t)', 
            unit: 's',
            help: {
                title: "Tempo misurato (t)",
                description: "Il tempo totale misurato per un certo numero 'N' di oscillazioni complete. Misuralo con un cronometro oppure una o più fotocellule."
            }
        },
        { 
            id: 'n', 
            label: 'N. oscillazioni (N)', 
            unit: '#', 
            isInteger: true,
            help: {
                title: "Numero di oscillazioni (N)",
                description: "Il numero di oscillazioni complete (avanti e indietro) contate durante la misurazione del tempo 't'."
            }
        },
    ],
    calculation: (processedInputs: { [key: string]: ProcessedInput }, modes: ModeState, rawData: MeasurementRow[]) => {
        
        // Calculate Period T and its uncertainty from raw data (t, sigma_t, n)
        const getPeriodData = (row: MeasurementRow) => {
            const t = row.t ?? 0;
            const sigma_t = row.sigma_t ?? 0;
            const n = (row.n && row.n >= 1) ? row.n : 1;
            const T = t / n;
            const sigma_T = sigma_t / n;
            return { ...row, T, sigma_T };
        }
        const dataWithPeriod = rawData.map(getPeriodData);
        
        if (modes.calculation_method === 'average') {
             // Process T values for the average calculation
            const T_values = dataWithPeriod.map(r => r.T);
            const sigma_T_values = dataWithPeriod.map(r => r.sigma_T);
            const { wMean: T_mean, sigmaWMean: T_sigma } = weightedMean(T_values, sigma_T_values);

            const { l: l_processed } = processedInputs;
             if (!l_processed || T_values.length < 1) {
                return { details: { error: "Dati insufficienti per il calcolo della media." } };
            }
            const L = l_processed.mean;
            
            if (T_mean === 0) return { details: { error: "Il periodo non può essere zero."}};
            
            const g_value = (4 * Math.PI**2 * L) / (T_mean**2);

            // Error propagation: g = 4pi^2 * L / T^2
            // Assuming sigma_L is from processed inputs
            const sigma_L = l_processed.sigma;
            const rel_err_L = L > 0 ? sigma_L / L : 0;
            const rel_err_T = T_mean > 0 ? T_sigma / T_mean : 0;
            const g_sigma = Math.abs(g_value * Math.sqrt(rel_err_L**2 + (2 * rel_err_T)**2));
            
            return {
                value: g_value,
                sigma: g_sigma,
                details: {
                    L_medio: { value: L, sigma: sigma_L },
                    T_medio: { value: T_mean, sigma: T_sigma },
                    method: "Media (g = 4π²L/T²)"
                }
            };
        }

        // mode 'fit'
        const lValues = dataWithPeriod.map(r => r.l).filter(v => v !== null) as number[];
        const T_values = dataWithPeriod.map(r => r.T).filter(v => v !== null) as number[];
        const tSquaredValues = T_values.map(t => t * t);
        
        const T_sigmas = dataWithPeriod.map(r => r.sigma_T).filter(v => v !== null) as number[];
        // Propagate error from T to T^2: sigma(T^2) = 2 * T * sigma(T)
        const tSquaredSigmas = T_values.map((t, i) => T_sigmas[i] ? 2 * t * T_sigmas[i] : null);

        if (lValues.length < 2 || tSquaredValues.length < 2) {
            return { details: { error: "Dati insufficienti per il fit lineare." } };
        }

        const fit = linearRegression(lValues, tSquaredValues, tSquaredSigmas, true);

        if (!fit) {
            return { details: { error: "Fit lineare fallito." } };
        }

        const k = { value: fit.slope, sigma: fit.sigma_slope }; // k = 4pi^2/g
        const g_value = 4 * Math.PI * Math.PI / k.value;
        // Propagation for g = 4pi^2 / k
        const g_sigma = Math.abs(g_value * (k.sigma / k.value));

        return {
            value: g_value,
            sigma: g_sigma,
            details: {
                k,
                R2: fit.R2,
                chi2_reduced: fit.chi2_reduced,
                method: "Fit lineare T² vs L",
                fit,
            }
        };
    },
    result: {
        label: 'Accelerazione di gravità (g)',
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
        getFixtureKey: (modes: ModeState) => `pendulum-${modes.calculation_method}`,
        chart: {
            isSupported: (modes, data) => data.length >= 2 && modes.calculation_method === 'fit',
            getCustomControls: (modes: ModeState) => {
                 return PendulumChartControls;
            },
            getInfo: (data, results, customState) => {
                const { lengthUnit = 'cm' } = customState ?? {};
                return getPendulumChartInfo(data, results, lengthUnit);
            }
        }
    }
};
