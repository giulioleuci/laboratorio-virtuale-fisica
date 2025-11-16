
import type { Formula, MeasurementRow } from '@/lib/types';
import { sampleStdDev, weightedMean } from '@/lib/stats';

export const uncertaintyMeasurementFormula: Formula = {
    id: 'uncertainty-measurement',
    title: 'Misure di incertezze',
    description: "Confronta la deviazione standard e la semidispersione massima come stime dell'incertezza.",
    category: 'Strumenti',
    getInputs: () => [
        {
            id: 'x',
            label: 'Misura (x)',
            unit: 'qualsiasi',
            help: {
                title: "Misura (x)",
                description: "Inserisci una serie di misure della stessa grandezza per calcolare le incertezze."
            }
        },
    ],
    calculation: (processedInputs, modes, rawData) => {
        const values = rawData.map(row => row.x).filter(v => v !== null) as number[];
        const sigmas = rawData.map(row => row.sigma_x).filter(v => v !== null) as number[];

        if (values.length < 2) {
            return { details: { error: "Inserisci almeno due misure." } };
        }

        const { wMean, sigmaWMean } = weightedMean(values, sigmas);
        const standardDeviation = sampleStdDev(values);
        const semiDispersion = (Math.max(...values) - Math.min(...values)) / 2;

        return {
            "Media ponderata": { value: wMean, sigma: sigmaWMean, unit: '' },
            "Deviazione standard": { value: standardDeviation, sigma: null, unit: '' },
            "Semidispersione massima": { value: semiDispersion, sigma: null, unit: '' },
            details: {}
        };
    },
    result: {},
    customResultRenderer: true,
    uiOptions: {
        switches: [],
        getFixtureKey: () => 'uncertainty-measurement',
    }
};
