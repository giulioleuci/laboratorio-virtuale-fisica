import { linearRegression, weightedMean } from '@/lib/stats';
import type { Formula, ProcessedInput, MeasurementRow, ModeState, ChartInfo, CalculationResult, FormulaInput } from '@/lib/types';

export const springGravityFormula: Formula = {
    id: 'spring-gravity',
    title: 'Misura di g con una molla',
    description: "Determina l'accelerazione di gravità (g) bilanciando la forza peso di una massa nota con la forza elastica di una molla di costante k nota.",
    category: 'Statica',
    getInputs: () => [
         {
            id: 'k',
            label: 'Costante elastica (k)',
            unit: 'N/m',
            help: {
                title: "Costante elastica (k)",
                description: "La costante elastica della molla utilizzata per l'esperimento."
            }
         },
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
                description: "La lunghezza della molla quando è sottoposta alla massa. Misurala con un righello."
            }
         },
         {
            id: 'm',
            label: 'Massa (m)',
            unit: 'g',
            help: {
                title: "Massa (m)",
                description: "La massa appesa alla molla."
            }
        }
    ],
    calculation: (processedInputs: { [key: string]: ProcessedInput }, modes: ModeState, rawData: MeasurementRow[]) => {
        const k_processed = processedInputs.k;
        if (!k_processed || k_processed.count === 0) {
            return { details: { error: "La costante elastica (k) è richiesta." } };
        }

        const k_mean = k_processed.mean;
        const k_sigma = k_processed.sigma || 0;

        // Extract valid data
        const validData = rawData.filter(row => {
            return row.l_riposo !== null && row.l_riposo !== undefined &&
                   row.l_finale !== null && row.l_finale !== undefined &&
                   row.m !== null && row.m !== undefined;
        });

        if (modes.calculation_method === 'average') {
            const g_values: number[] = [];
            const g_sigmas: number[] = [];

            validData.forEach(row => {
                const l_riposo_cm = row.l_riposo!;
                const sigma_l_riposo_cm = row.sigma_l_riposo ?? 0;
                const l_finale_cm = row.l_finale!;
                const sigma_l_finale_cm = row.sigma_l_finale ?? 0;

                const deltaL_cm = l_finale_cm - l_riposo_cm;
                const deltaL_m = deltaL_cm / 100;

                const sigma_deltaL_cm = Math.sqrt(sigma_l_finale_cm**2 + sigma_l_riposo_cm**2);
                const sigma_deltaL_m = sigma_deltaL_cm / 100;

                const m_kg = row.m! / 1000;
                const sigma_m_kg = (row.sigma_m ?? 0) / 1000;

                if (m_kg > 0 && deltaL_m > 0) {
                    const g = (k_mean * deltaL_m) / m_kg;
                    g_values.push(g);

                    const rel_err_k = k_mean !== 0 ? k_sigma / k_mean : 0;
                    const rel_err_deltaL = deltaL_m !== 0 ? sigma_deltaL_m / deltaL_m : 0;
                    const rel_err_m = m_kg !== 0 ? sigma_m_kg / m_kg : 0;

                    const g_sigma = g * Math.sqrt(rel_err_k**2 + rel_err_deltaL**2 + rel_err_m**2);
                    g_sigmas.push(g_sigma);
                }
            });

            if(g_values.length === 0) return { details: { error: "Dati insufficienti o invalidi."}};

            const wMeanResult = weightedMean(g_values, g_sigmas);

            return {
                value: wMeanResult.wMean,
                sigma: wMeanResult.sigmaWMean,
                details: {
                    k_mean,
                    method: "Media dei valori di g calcolati"
                }
            }
        }

        // mode 'fit'
        if (validData.length < 2) {
            return { details: { error: "Dati insufficienti per il fit lineare." } };
        }

        const m_values_kg = validData.map(row => row.m! / 1000);
        const m_sigmas_kg = validData.map(row => row.sigma_m ? row.sigma_m / 1000 : null);

        const F_elastica_N: number[] = [];
        const F_elastica_sigmas_N: number[] = [];

        validData.forEach(row => {
            const deltaL_cm = row.l_finale! - row.l_riposo!;
            const deltaL_m = deltaL_cm / 100;
            const F = k_mean * deltaL_m;
            F_elastica_N.push(F);

            const sigma_l_finale = row.sigma_l_finale ?? 0;
            const sigma_l_riposo = row.sigma_l_riposo ?? 0;
            const sigma_deltaL_cm = Math.sqrt(sigma_l_finale**2 + sigma_l_riposo**2);
            const sigma_deltaL_m = sigma_deltaL_cm / 100;

            const rel_err_k = k_mean !== 0 ? k_sigma / k_mean : 0;
            const rel_err_deltaL = deltaL_m !== 0 ? sigma_deltaL_m / deltaL_m : 0;
            const F_sigma = Math.abs(F) * Math.sqrt(rel_err_k**2 + rel_err_deltaL**2);
            F_elastica_sigmas_N.push(F_sigma);
        });

        // Fit F_elastica = g * m
        const fit = linearRegression(m_values_kg, F_elastica_N, F_elastica_sigmas_N, true);

        if (!fit) {
            return { details: { error: "Fit lineare fallito." } };
        }

        const g = { value: fit.slope, sigma: fit.sigma_slope };

        return {
            value: g.value,
            sigma: g.sigma,
            details: {
                k_mean,
                g,
                R2: fit.R2,
                chi2_reduced: fit.chi2_reduced,
                method: "Fit lineare F_elastica vs Massa (passante per l'origine)",
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
        getFixtureKey: (modes: ModeState) => `spring-gravity-${modes.calculation_method}`,
        chart: {
            isSupported: (modes: ModeState, data: MeasurementRow[]) => {
                return data.length >= 2 && modes.calculation_method === 'fit';
            },
            getInfo: (data, results) => {
                const k_mean = results?.details?.k_mean || 1;

                const chartData = data.map(p => {
                    const m_kg = (p.m ?? 0) / 1000;
                    const sigma_m_kg = (p.sigma_m ?? 0) / 1000;

                    const deltaL_cm = (p.l_finale ?? 0) - (p.l_riposo ?? 0);
                    const sigma_deltaL_cm = Math.sqrt(((p.sigma_l_finale ?? 0) ** 2) + ((p.sigma_l_riposo ?? 0) ** 2));
                    const deltaL_m = deltaL_cm / 100;
                    const sigma_deltaL_m = sigma_deltaL_cm / 100;

                    return {
                        x: m_kg,
                        y: k_mean * deltaL_m,
                        sigma_x: sigma_m_kg,
                        sigma_y: k_mean * sigma_deltaL_m,
                    };
                });

                let fit;
                if (results?.details?.fit) {
                    fit = {
                        slope: results.details.fit.slope,
                        intercept: results.details.fit.intercept
                    };
                }

                return {
                    data: chartData,
                    xLabel: 'Massa (kg)',
                    yLabel: 'Forza Elastica (N)',
                    fit
                };
            }
        }
    }
};
