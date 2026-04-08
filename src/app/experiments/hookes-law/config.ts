
import { linearRegression, weightedMean } from '@/lib/stats';
import { G_CONST } from '@/lib/constants';
import type { Formula, ProcessedInput, MeasurementRow, ModeState, ChartInfo, CalculationResult, ChartDataPoint, FormulaInput } from '@/lib/types';
import { HookesLawChartControls } from './hookes-law-chart-controls';

// Function to transform data and calculate fit for the chart
const getHookesLawChartInfo = (
    data: MeasurementRow[],
    results: CalculationResult | null,
    yAxisType: 'mass' | 'force',
    xAxisUnit: 'cm' | 'm'
): Omit<ChartInfo, 'customControls'> => {

    const chartData = data.map(p => {
        let xValue: number, sigmaX: number, yValue: number, sigmaY: number;

        // Calculate elongation: ΔL = L_finale - L_riposo
        const deltaL_cm = (p.l_finale ?? 0) - (p.l_riposo ?? 0);
        const sigma_deltaL_cm = Math.sqrt(((p.sigma_l_finale ?? 0) ** 2) + ((p.sigma_l_riposo ?? 0) ** 2));

        // X-axis transformation
        if (xAxisUnit === 'm') {
            xValue = deltaL_cm / 100;
            sigmaX = sigma_deltaL_cm / 100;
        } else { // cm
            xValue = deltaL_cm;
            sigmaX = sigma_deltaL_cm;
        }

        // Y-axis transformation
        if (yAxisType === 'force') {
            yValue = p.F !== null && p.F !== undefined ? p.F : ((p.m ?? 0) / 1000) * G_CONST;
            sigmaY = p.sigma_F !== null && p.sigma_F !== undefined ? p.sigma_F : ((p.sigma_m ?? 0) / 1000) * G_CONST;
        } else { // mass
            yValue = p.m ?? 0;
            sigmaY = p.sigma_m ?? 0;
        }
        
        return {
            x: xValue,
            y: yValue,
            sigma_x: sigmaX,
            sigma_y: sigmaY,
        };
    });
    
    let fit;
    if (results?.details?.fit) {
        let slope = (results.details.fit as { slope: number }).slope; // Original fit is F vs L(m), so slope is k
        let intercept = (results.details.fit as { intercept: number }).intercept;

        // Adjust slope for different plot units
        if (yAxisType === 'mass') { // y-axis is mass (g)
            slope = (slope * 1000) / G_CONST; // Convert k (N/m) to g/m
            intercept = (intercept * 1000) / G_CONST; // Convert N-intercept to g
        }
        
        if (xAxisUnit === 'cm') { // x-axis is length (cm)
            slope = slope / 100; // Convert slope from (unit/m) to (unit/cm)
        }

        fit = { slope, intercept };
    }
    
    const yLabel = yAxisType === 'force' ? 'Forza (N)' : 'Massa (g)';
    const xLabel = xAxisUnit === 'cm' ? 'Allungamento (cm)' : 'Allungamento (m)';

    return {
        data: chartData,
        xLabel,
        yLabel,
        fit,
    };
};

export const hookesLawFormula: Formula = {
    id: 'hookes-law',
    title: 'Legge di Hooke',
    description: "Verifica la relazione tra la forza applicata a una molla e la sua elongazione per determinare la costante elastica (k).",
    category: 'Statica',
    getInputs: (modes: ModeState) => {
        const inputs: FormulaInput[] = [
             { 
                id: 'l_riposo', 
                label: 'Lunghezza a riposo (L₀)', 
                unit: 'cm',
                help: {
                    title: "Lunghezza a riposo (L₀)",
                    description: "La lunghezza della molla quando non è sottoposta ad alcuna forza. Misurala con un righello."
                }
             },
             { 
                id: 'l_finale', 
                label: 'Lunghezza finale (L)', 
                unit: 'cm',
                help: {
                    title: "Lunghezza finale (L)",
                    description: "La lunghezza della molla quando è sottoposta alla forza/massa. Misurala con un righello."
                }
             },
        ];

        if (modes.input_type === 'force') {
            inputs.unshift({ 
                id: 'F', 
                label: 'Forza (F)', 
                unit: 'N',
                help: {
                    title: "Forza (F)",
                    description: "La forza applicata alla molla per causare l'allungamento. Misurala con un dinamometro."
                }
            });
        } else { // mass
            inputs.unshift({ 
                id: 'm', 
                label: 'Massa (m)', 
                unit: 'g',
                help: {
                    title: "Massa (m)",
                    description: "La massa appesa alla molla. La forza peso (m*g) causa l'allungamento. Misurala con una bilancia."
                }
            });
             if (modes.calculation_method === 'average') {
                inputs.push({
                    id: 'F', 
                    label: 'Forza (F)', 
                    unit: 'N', 
                    isReadOnly: true,
                    help: {
                        title: "Forza (F) - Calcolata",
                        description: "La forza peso calcolata dalla massa (F = m * g). Questo valore viene aggiornato automaticamente."
                    }
                });
            }
        }
        
        return inputs;
    },
    calculation: (processedInputs: { [key: string]: ProcessedInput }, modes: ModeState, rawData: MeasurementRow[]) => {
        if (modes.calculation_method === 'average') {
            const k_values = rawData.map(row => {
                // Calcola l'allungamento: ΔL = L - L₀
                const l_riposo_cm = row.l_riposo ?? 0;
                const l_finale_cm = row.l_finale ?? 0;
                const deltaL_cm = l_finale_cm - l_riposo_cm;
                const deltaL_m = deltaL_cm / 100;
                
                if (deltaL_m === 0) return null;

                let F = 0;
                if (modes.input_type === 'force') {
                    F = row.F ?? 0;
                } else { // mass
                    const m_kg = (row.m ?? 0) / 1000;
                    F = m_kg * G_CONST;
                }
                return F / deltaL_m;
            }).filter(k => k !== null) as number[];

            if(k_values.length === 0) return { details: { error: "Dati insufficienti."}};
            
            const wMeanResult = weightedMean(k_values, []); // No sigma for individual k
            
            return {
                value: wMeanResult.wMean,
                sigma: wMeanResult.sigmaWMean,
                details: {
                    method: "Media dei rapporti F/ΔL"
                }
            }
        }
        
        // mode 'fit'
        // Filtra i dati validi: devono esserci sia le lunghezze che l'input (forza o massa)
        const validData = rawData.filter(row => {
            const hasL = row.l_riposo !== null && row.l_riposo !== undefined &&
                         row.l_finale !== null && row.l_finale !== undefined;
            const hasInput = modes.input_type === 'force'
                ? row.F !== null && row.F !== undefined
                : row.m !== null && row.m !== undefined;
            return hasL && hasInput;
        });

        if (validData.length < 2) {
            return { details: { error: "Dati insufficienti per il fit lineare." } };
        }

        // Calcola gli allungamenti e le loro incertezze
        const deltaL_values_cm = validData.map(row => row.l_finale! - row.l_riposo!);
        const deltaL_sigmas_cm = validData.map(row => {
            if (row.sigma_l_riposo !== null && row.sigma_l_riposo !== undefined &&
                row.sigma_l_finale !== null && row.sigma_l_finale !== undefined) {
                return Math.sqrt(row.sigma_l_finale ** 2 + row.sigma_l_riposo ** 2);
            }
            return null;
        });
        
        let F_values_N: number[];
        let F_sigmas_N: (number | null | undefined)[];
        if (modes.input_type === 'force') {
            F_values_N = validData.map(r => r.F!);
            F_sigmas_N = validData.map(r => r.sigma_F);
        } else { // mass
            F_values_N = validData.map(r => (r.m! / 1000) * G_CONST);
            F_sigmas_N = validData.map(r => r.sigma_m !== null && r.sigma_m !== undefined ? (r.sigma_m / 1000) * G_CONST : null);
        }

        const deltaL_values_m = deltaL_values_cm.map(l => l / 100);
        const deltaL_sigmas_m = deltaL_sigmas_cm.map(s => s ? s / 100 : null);

        // Fit F = k * L, so F is y-axis, L is x-axis
        const fit = linearRegression(deltaL_values_m, F_values_N, F_sigmas_N, true);

        if (!fit) {
            return { details: { error: "Fit lineare fallito." } };
        }
        
        const k = { value: fit.slope, sigma: fit.sigma_slope };

        return {
            value: k.value,
            sigma: k.sigma,
            details: {
                k,
                R2: fit.R2,
                chi2_reduced: fit.chi2_reduced,
                method: "Fit lineare F vs ΔL (passante per l'origine)",
                fit,
            }
        };
    },
    result: {
        label: 'Costante elastica (k)',
        unit: 'N/m',
    },
    uiOptions: {
        switches: [
             {
                id: 'input_type',
                label: 'Dati di input',
                options: [
                    { value: 'mass', label: 'Massa' },
                    { value: 'force', label: 'Forza' }
                ],
                defaultValue: 'mass'
            },
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
        getFixtureKey: (modes: ModeState) => `hookes-law-${modes.input_type}-${modes.calculation_method}`,
        chart: {
            isSupported: (modes: ModeState, data: MeasurementRow[]) => {
                return data.length >= 2 && modes.calculation_method === 'fit';
            },
            getCustomControls: (modes: ModeState) => {
                return HookesLawChartControls;
            },
            getInfo: (data, results, customState, modes) => {
                const yAxisDefault = modes?.input_type === 'force' ? 'force' : 'mass';
                const { yAxisType = yAxisDefault, xAxisUnit = 'cm' } = customState ?? {};
                return getHookesLawChartInfo(data, results, yAxisType, xAxisUnit);
            }
        }
    }
};
