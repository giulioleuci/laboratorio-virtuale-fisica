
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
        const x1 = processedInputs.x1?.value;
        const sigma_x1 = processedInputs.sigma_x1?.value;
        const x2 = processedInputs.x2?.value;
        const sigma_x2 = processedInputs.sigma_x2?.value;

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
            details: {}
        };
    },
    result: {},
    uiOptions: {
        chart: {
            isSupported: (modes, data, results) => !!results?.Compatibilità,
            getInfo: (data: MeasurementRow[]) => {

                const chartData = data.map((row, i) => ({
                    x: i === 0 ? row.x1 : row.x2,
                    y: i + 1,
                    sigma_x: i === 0 ? row.sigma_x1 : row.sigma_x2,
                    sigma_y: 0,
                }));

                return {
                    data: chartData,
                    xLabel: 'Valore misurato',
                    yLabel: '',
                    isErrorChart: true,
                } as ChartInfo;
            }
        }
    },
    customResultRenderer: true,
};
