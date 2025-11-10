
import { calculateAndPropagate } from '@/lib/propagate';
import type { Formula, CalculationResult } from '@/lib/types';

export const errorPropagationFormula: Formula = {
    id: 'error-propagation',
    title: 'Propagazione degli Errori',
    description: "Calcola il valore e l'incertezza di una grandezza derivata a partire dalle grandezze di base.",
    category: 'Strumenti',
    getInputs: () => [],
    calculation: (processedInputs, modes): CalculationResult => {
        const { formulaString, variables } = modes as unknown as { formulaString: string, variables: { [key: string]: { value: string, sigma: string } } };
        if (!formulaString) {
            return { details: { error: "Nessuna formula inserita." } };
        }
        const parsedVariables = Object.entries(variables).reduce((acc, [k, v]) => ({
            ...acc,
            [k]: {
                value: parseFloat(v.value),
                sigma: parseFloat(v.sigma) || 0,
            }
        }), {});
        const result = calculateAndPropagate(formulaString, parsedVariables);
        if (!result) {
            return { details: { error: "Errore nel calcolo." } };
        }
        return result;
    },
    result: {
        label: 'Risultato',
        unit: '',
    },
    uiOptions: {
        switches: [],
        getFixtureKey: () => 'error-propagation',
    }
};
