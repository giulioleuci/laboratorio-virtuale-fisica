
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
            const n2_values = rawData.map(row => {
                const theta_i = row.theta_i ?? null;
                const theta_r = row.theta_r ?? null;
                if (theta_i === null || theta_r === null || theta_r === 0) return null;
                return n1 * Math.sin(toRadians(theta_i)) / Math.sin(toRadians(theta_r));
            }).filter(n => n !== null) as number[];

            if (n2_values.length === 0) return { details: { error: "Dati insufficienti." } };
            
            const sigmas = rawData.map(row => {
                const { theta_i, sigma_theta_i, theta_r, sigma_theta_r } = row;
                if (!theta_i || !theta_r || !sigma_theta_i || !sigma_theta_r) return 0;
                const n2 = n1 * Math.sin(toRadians(theta_i)) / Math.sin(toRadians(theta_r));
                const d_n2_d_theta_i = n1 * Math.cos(toRadians(theta_i)) / Math.sin(toRadians(theta_r));
                const d_n2_d_theta_r = -n1 * Math.sin(toRadians(theta_i)) * Math.cos(toRadians(theta_r)) / Math.sin(toRadians(theta_r))**2;
                
                const sigma_n2_sq = (d_n2_d_theta_i * toRadians(sigma_theta_i))**2 + (d_n2_d_theta_r * toRadians(sigma_theta_r))**2;
                return Math.sqrt(sigma_n2_sq);
            });

            const { wMean, sigmaWMean } = weightedMean(n2_values, sigmas);

            return { value: wMean, sigma: sigmaWMean, details: { method: "Media dei rapporti" } };
        }

        // mode 'fit'
        const sin_theta_i = rawData.map(r => r.theta_i !== null ? Math.sin(toRadians(r.theta_i)) : null).filter(v => v !== null) as number[];
        const sin_theta_r = rawData.map(r => r.theta_r !== null ? Math.sin(toRadians(r.theta_r)) : null).filter(v => v !== null) as number[];
        
        // Propagate error: sigma(sin(theta)) = |cos(theta)| * sigma(theta) in radians
        const sigma_sin_theta_r = rawData.map(r => {
            if (r.theta_r === null || r.sigma_theta_r === null) return null;
            return Math.abs(Math.cos(toRadians(r.theta_r))) * toRadians(r.sigma_theta_r);
        }).filter(v => v !== null) as (number | null | undefined)[];

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
