
import type { Formula } from '@/lib/types';

export const absoluteRelativeErrorsFormula: Formula = {
    id: 'absolute-relative-errors',
    title: 'Errori assoluti e relativi',
    description: "Comprendi la differenza tra errore assoluto e relativo e come vengono calcolati.",
    category: 'Strumenti',
    getInputs: () => [
        {
            id: 'x',
            label: 'Misura (x)',
            unit: 'qualsiasi',
            help: {
                title: "Misura (x)",
                description: "Il valore misurato di una grandezza."
            }
        },
        {
            id: 'sigma_x',
            label: 'Incertezza (σₓ)',
            unit: 'qualsiasi',
            help: {
                title: "Incertezza (σₓ)",
                description: "L'incertezza associata alla misura, nota anche come errore assoluto."
            }
        },
    ],
    calculation: (processedInputs) => {
        const x = processedInputs.x?.value;
        const sigma_x = processedInputs.sigma_x?.value;

        if (x === undefined || sigma_x === undefined) {
            return { details: { error: "Inserisci i dati." } };
        }

        if (x === 0) {
            return { details: { error: "La misura non può essere zero per calcolare l'errore relativo." } };
        }

        const relativeError = sigma_x / Math.abs(x);
        const percentageError = relativeError * 100;

        return {
            "Errore assoluto": { value: sigma_x, sigma: null, unit: '' },
            "Errore relativo": { value: relativeError, sigma: null, unit: '' },
            "Errore percentuale": { value: percentageError, sigma: null, unit: '%' },
            details: {}
        };
    },
    result: {},
    customResultRenderer: true,
};
