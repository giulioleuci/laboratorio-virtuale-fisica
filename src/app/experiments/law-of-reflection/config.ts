
import { linearRegression, weightedMean } from '@/lib/stats';
import type { Formula, ProcessedInput, MeasurementRow, ModeState } from '@/lib/types';

export const lawOfReflectionFormula: Formula = {
    id: 'law-of-reflection',
    title: 'Legge della Riflessione',
    description: "Verifica la legge della riflessione confrontando l'angolo di incidenza e l'angolo di riflessione su una superficie speculare.",
    category: 'Ottica',
    customResultRenderer: true,
    getInputs: () => [
        {
            id: 'theta_i',
            label: 'Angolo di incidenza (θᵢ)',
            unit: '°',
            help: {
                title: "Angolo di incidenza (θᵢ)",
                description: "L'angolo tra il raggio di luce incidente e la normale alla superficie riflettente. Misuralo con un goniometro."
            }
        },
        {
            id: 'theta_r',
            label: 'Angolo di riflessione (θᵣ)',
            unit: '°',
            help: {
                title: "Angolo di riflessione (θᵣ)",
                description: "L'angolo tra il raggio di luce riflesso e la normale alla superficie riflettente. Misuralo con un goniometro."
            }
        },
    ],
    calculation: (processedInputs: { [key: string]: ProcessedInput }, modes: ModeState, rawData: MeasurementRow[]) => {
        const toRadians = (deg: number) => deg * (Math.PI / 180);

        if (modes.calculation_method === 'average') {
            const diff_values: number[] = [];
            const diff_sigmas: number[] = [];

            for (const row of rawData) {
                const { theta_i, sigma_theta_i, theta_r, sigma_theta_r } = row;
                if (theta_i != null && theta_r != null && sigma_theta_i != null && sigma_theta_r != null) {
                    diff_values.push(theta_i - theta_r);
                    diff_sigmas.push(Math.sqrt(sigma_theta_i ** 2 + sigma_theta_r ** 2));
                }
            }

            if (diff_values.length === 0) return { details: { error: "Dati insufficienti." } };

            const { wMean, sigmaWMean } = weightedMean(diff_values, diff_sigmas);
            return {
                value: wMean,
                sigma: sigmaWMean,
                details: { method: "Media delle differenze (θᵢ − θᵣ)" }
            };
        }

        // mode 'fit'
        const theta_i_vals: number[] = [];
        const theta_r_vals: number[] = [];
        const sigma_theta_r_vals: number[] = [];

        for (const row of rawData) {
            const { theta_i, theta_r, sigma_theta_r } = row;
            if (theta_i != null && theta_r != null && sigma_theta_r != null) {
                theta_i_vals.push(theta_i);
                theta_r_vals.push(theta_r);
                sigma_theta_r_vals.push(sigma_theta_r);
            }
        }

        if (theta_i_vals.length < 2) {
            return { details: { error: "Dati insufficienti per il fit lineare." } };
        }

        // Fit θ_r = m * θ_i (forced through origin, since θ_i=0 ⟹ θ_r=0)
        const fit = linearRegression(theta_i_vals, theta_r_vals, sigma_theta_r_vals, true);
        if (!fit) return { details: { error: "Fit lineare fallito." } };

        return {
            value: fit.slope,
            sigma: fit.sigma_slope,
            details: {
                R2: fit.R2,
                chi2_reduced: fit.chi2_reduced,
                method: "Fit lineare θᵣ vs θᵢ"
            }
        };
    },
    result: {
        label: 'Risultato',
        unit: '',
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
        getFixtureKey: (modes: ModeState) => `law-of-reflection-${modes.calculation_method}`
    }
};
