
import type { Formula, ChartInfo, MeasurementRow } from '@/lib/types';

export const compatibilityEvaluationFormula: Formula = {
    id: 'compatibility-evaluation',
    title: 'Valutazione della compatibilità',
    description: "Valuta se due misure della stessa grandezza sono compatibili tra loro.",
    category: 'Strumenti',
    getInputs: () => [
        {
            id: 'x1',
            label: 'Misura 1 (x₁)',
            unit: 'qualsiasi',
            help: {
                title: "Misura 1 (x₁)",
                description: "La prima misura."
            }
        },
        {
            id: 'sigma_x1',
            label: 'Incertezza 1 (σ₁)',
            unit: 'qualsiasi',
            help: {
                title: "Incertezza 1 (σ₁)",
                description: "L'incertezza associata alla prima misura."
            }
        },
        {
            id: 'x2',
            label: 'Misura 2 (x₂)',
            unit: 'qualsiasi',
            help: {
                title: "Misura 2 (x₂)",
                description: "La seconda misura."
            }
        },
        {
            id: 'sigma_x2',
            label: 'Incertezza 2 (σ₂)',
            unit: 'qualsiasi',
            help: {
                title: "Incertezza 2 (σ₂)",
                description: "L'incertezza associata alla seconda misura."
            }
        },
    ],
    calculation: (processedInputs) => {
        const x1 = processedInputs.x1?.mean;
        const sigma_x1 = processedInputs.sigma_x1?.mean;
        const x2 = processedInputs.x2?.mean;
        const sigma_x2 = processedInputs.sigma_x2?.mean;

        if (x1 === undefined || sigma_x1 === undefined || x2 === undefined || sigma_x2 === undefined) {
            return { details: { error: "Inserisci tutti i dati." } };
        }

        const diff = Math.abs(x1 - x2);
        const sigma_diff = Math.sqrt(sigma_x1**2 + sigma_x2**2);
        const compatibility = diff / sigma_diff;

        const areCompatible = diff <= sigma_diff;

        return {
            "Differenza |x₁ - x₂|": { value: diff, sigma: sigma_diff, unit: '' },
            "Compatibilità": { value: compatibility, sigma: null, unit: 'σ' },
            "Esito": { value: areCompatible ? "Compatibili" : "Non compatibili", sigma: null, unit: '' },
            details: { x1, sigma_x1, x2, sigma_x2 }
        };
    },
    result: {},
    uiOptions: {
        chart: {
            isSupported: (modes, data) => data.length > 0,
            getInfo: (data: MeasurementRow[], results: any) => {
                const x1 = results?.details?.x1;
                const sigma_x1 = results?.details?.sigma_x1;
                const x2 = results?.details?.x2;
                const sigma_x2 = results?.details?.sigma_x2;

                if (x1 === undefined || x2 === undefined) {
                     return {
                        data: [],
                        xLabel: 'Valore misurato',
                        yLabel: '',
                    };
                }

                const chartData = [
                    { x: 1, y: x1, sigma_y: sigma_x1, sigma_x: 0 },
                    { x: 2, y: x2, sigma_y: sigma_x2, sigma_x: 0 }
                ];

                return {
                    data: chartData,
                    xLabel: 'Misura',
                    yLabel: 'Valore',
                } as ChartInfo;
            }
        }
    },
    customResultRenderer: true,
};
