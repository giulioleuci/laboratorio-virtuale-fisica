
import { linearRegression, weightedMean } from '@/lib/stats';
import type { Formula, ProcessedInput, MeasurementRow, ModeState } from '@/lib/types';
import { sum } from 'mathjs';

const n1 = 1.00029; // Indice di rifrazione dell'aria

export const snellsLawFormula: Formula = {
    id: 'snells-law',
    title: 'Legge di Snell',
    description: "Verifica la legge della rifrazione e determina l'indice di rifrazione di un materiale.",
    category: 'Ottica',
    getInputs: () => [
        { 
            id: 'theta_i', 
            label: 'Angolo di incidenza (θ₁)', 
            unit: '°',
            help: {
                title: "Angolo di incidenza (θ₁)",
                description: "L'angolo tra il raggio di luce in arrivo e la normale (la perpendicolare) alla superficie del materiale. Misuralo con un goniometro."
            }
        },
        { 
            id: 'theta_r', 
            label: 'Angolo di rifrazione (θ₂)', 
            unit: '°',
            help: {
                title: "Angolo di rifrazione (θ₂)",
                description: "L'angolo tra il raggio di luce rifratto (che attraversa il materiale) e la normale alla superficie. Misuralo con un goniometro."
            }
        },
    ],
    calculation: (processedInputs: { [key: string]: ProcessedInput }, modes: ModeState, rawData: MeasurementRow[]) => {
        const toRadians = (deg: number) => deg * (Math.PI / 180);

        if (modes.calculation_method === 'average') {
            const n2_values: number[] = [];
            const sigmas: number[] = [];
            const n = rawData.length;

            for (let i = 0; i < n; i++) {
                const row = rawData[i];
                const { theta_i, sigma_theta_i, theta_r, sigma_theta_r } = row;

                if (theta_i != null && theta_r != null && theta_r !== 0 && sigma_theta_i != null && sigma_theta_r != null) {
                    const rad_i = toRadians(theta_i);
                    const rad_r = toRadians(theta_r);
                    const sin_i = Math.sin(rad_i);
                    const sin_r = Math.sin(rad_r);
                    const cos_i = Math.cos(rad_i);
                    const cos_r = Math.cos(rad_r);

                    n2_values.push(n1 * sin_i / sin_r);

                    const d_n2_d_theta_i = n1 * cos_i / sin_r;
                    const d_n2_d_theta_r = -n1 * sin_i * cos_r / (sin_r * sin_r);

                    const sigma_n2_sq = (d_n2_d_theta_i * toRadians(sigma_theta_i))**2 + (d_n2_d_theta_r * toRadians(sigma_theta_r))**2;
                    sigmas.push(Math.sqrt(sigma_n2_sq));
                }
            }

            if (n2_values.length === 0) return { details: { error: "Dati insufficienti." } };

            const { wMean, sigmaWMean } = weightedMean(n2_values, sigmas);

            return { value: wMean, sigma: sigmaWMean, details: { method: "Media dei rapporti" } };
        }

        // mode 'fit'
        const sin_theta_i: number[] = [];
        const sin_theta_r: number[] = [];
        const sigma_sin_theta_r: number[] = [];
        const n_fit = rawData.length;

        for (let i = 0; i < n_fit; i++) {
            const row = rawData[i];
            const { theta_i, theta_r, sigma_theta_r } = row;

            if (theta_i != null && theta_r != null && sigma_theta_r != null) {
                sin_theta_i.push(Math.sin(toRadians(theta_i)));
                const rad_r = toRadians(theta_r);
                sin_theta_r.push(Math.sin(rad_r));
                sigma_sin_theta_r.push(Math.abs(Math.cos(rad_r)) * toRadians(sigma_theta_r));
            }
        }

        if (sin_theta_i.length < 2 || sin_theta_r.length < 2) {
            return { details: { error: "Dati insufficienti per il fit lineare." } };
        }
        
        // Fit sin(theta_i) = n2/n1 * sin(theta_r)
        // y = sin(theta_i), x = sin(theta_r), slope = n2/n1
        const fit = linearRegression(sin_theta_r, sin_theta_i, sigma_sin_theta_r, true);
        if (!fit) return { details: { error: "Fit lineare fallito." } };

        const n2_over_n1 = { value: fit.slope, sigma: fit.sigma_slope };
        const n2 = { value: n2_over_n1.value * n1, sigma: n2_over_n1.sigma * n1 };

        return {
            value: n2.value,
            sigma: n2.sigma,
            details: {
                n2_over_n1,
                R2: fit.R2,
                chi2_reduced: fit.chi2_reduced,
                method: "Fit lineare sin(θ₁) vs sin(θ₂)"
            }
        };
    },
    result: {
        label: "Indice di rifrazione (n₂)",
        unit: '',
    },
    uiOptions: {
        switches: [
            {
                id: 'calculation_method',
                label: 'Metodo di calcolo',
                options: [ { value: 'fit', label: 'Fit' }, { value: 'average', label: 'Media' } ],
                defaultValue: 'fit'
            }
        ],
        getFixtureKey: (modes: ModeState) => `snells-law-${modes.calculation_method}`
    }
};
