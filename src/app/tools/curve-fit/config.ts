
import { linearRegression, polynomialRegression, exponentialRegression, rationalRegression } from '@/lib/stats';
import type { Formula } from '@/lib/types';

export const curveFitFormula: Formula = {
    id: 'curve-fit',
    title: 'Fit di Curve',
    description: "Esegui un fit di una serie di dati sperimentali con un modello matematico a scelta.",
    category: 'Strumenti',
    getInputs: () => [
        {
            id: 'x',
            label: 'Variabile indipendente (x)',
            unit: '',
        },
        {
            id: 'y',
            label: 'Variabile dipendente (y)',
            unit: '',
        },
    ],
    calculation: (processedInputs, modes, rawData) => {
        const xValues = rawData.map(r => r.x).filter(v => v !== null) as number[];
        const yValues = rawData.map(r => r.y).filter(v => v !== null) as number[];
        const ySigmas = rawData.map(r => r.sigma_y).filter(v => v !== null) as (number | null | undefined)[];

        if (xValues.length < 2) {
            return { details: { error: "Dati insufficienti per il fit." } };
        }

        switch (modes.fit_model) {
            case 'linear':
                return { details: { fit: linearRegression(xValues, yValues, ySigmas) } };
            case 'polynomial':
                return { details: { fit: polynomialRegression(xValues, yValues, 2) } };
            case 'exponential':
                return { details: { fit: exponentialRegression(xValues, yValues, ySigmas) } };
            case 'rational':
                return { details: { fit: rationalRegression(xValues, yValues) } };
            default:
                return { details: { error: "Modello di fit non valido." } };
        }
    },
    result: {
        label: 'Risultato del Fit',
        unit: '',
    },
    uiOptions: {
        switches: [
            {
                id: 'fit_model',
                label: 'Modello di fit',
                options: [
                    { value: 'linear', label: 'Lineare (y = a + bx)' },
                    { value: 'polynomial', label: 'Polinomiale (y = a + bx + cx^2)' },
                    { value: 'exponential', label: 'Esponenziale (y = a * e^(bx))' },
                    { value: 'rational', label: 'Razionale (y = (ax + b) / (cx + d))' },
                ],
                defaultValue: 'linear'
            }
        ],
        getFixtureKey: () => 'curve-fit',
        chart: {
            isSupported: () => true,
            getInfo: (data, results) => {
                const chartData = data.map(p => ({
                    x: p.x ?? 0,
                    y: p.y ?? 0,
                    sigma_x: p.sigma_x ?? 0,
                    sigma_y: p.sigma_y ?? 0,
                }));

                return {
                    data: chartData,
                    xLabel: 'x',
                    yLabel: 'y',
                    fit: results?.details?.fit,
                };
            },
        }
    }
};
