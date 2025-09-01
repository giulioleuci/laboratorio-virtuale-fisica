
import { weightedMean } from '@/lib/stats';
import type { Formula, ProcessedInput, MeasurementRow, ModeState } from '@/lib/types';
import { sum } from 'mathjs';

export const kirchhoffsCurrentLawFormula: Formula = {
    id: 'kirchhoffs-current-law',
    title: 'Legge dei nodi (1° legge di Kirchhoff)',
    description: "Verifica la prima legge di Kirchhoff misurando le correnti in un nodo di un circuito.",
    category: 'Elettricità',
    getInputs: (modes) => [
        { 
            id: 'i', 
            label: 'Corrente (I)', 
            unit: 'A',
            help: {
                title: "Corrente (I)",
                description: "L'intensità della corrente elettrica che fluisce in un ramo del circuito collegato al nodo. Misurala con un amperometro inserito in serie nel ramo."
            }
        },
        { 
            id: 'direction', 
            label: 'Verso', 
            unit: '', 
            isInteger: true,
            help: {
                title: "Verso della Corrente",
                description: "Indica se la corrente è 'entrante' nel nodo o 'uscente' dal nodo. Questa scelta è convenzionale ma deve essere coerente per tutte le misurazioni."
            }
        },
    ],
    calculation: (processedInputs: { [key: string]: ProcessedInput }, modes: ModeState, rawData: MeasurementRow[]) => {
        const incomingCurrents = rawData
            .filter(row => row.direction === 1)
            .map(row => ({ value: row.i ?? 0, sigma: row.sigma_i ?? 0 }));
            
        const outgoingCurrents = rawData
            .filter(row => row.direction === -1)
            .map(row => ({ value: row.i ?? 0, sigma: row.sigma_i ?? 0 }));

        const sumIncoming = sum(incomingCurrents.map(c => c.value));
        const sigmaSumIncoming = Math.sqrt(sum(incomingCurrents.map(c => c.sigma ** 2)));
        
        const sumOutgoing = sum(outgoingCurrents.map(c => c.value));
        const sigmaSumOutgoing = Math.sqrt(sum(outgoingCurrents.map(c => c.sigma ** 2)));
        
        const algebraicSum = sumIncoming - sumOutgoing;
        const sigmaAlgebraicSum = Math.sqrt(sigmaSumIncoming ** 2 + sigmaSumOutgoing ** 2);

        return {
            sum_incoming: { value: sumIncoming, sigma: sigmaSumIncoming },
            sum_outgoing: { value: sumOutgoing, sigma: sigmaSumOutgoing },
            algebraic_sum: { value: algebraicSum, sigma: sigmaAlgebraicSum },
            details: {
                method: "Somma diretta delle correnti",
                numCurrents: rawData.length,
            }
        };
    },
    result: {
        label: "Somma Algebrica (ΣI)",
        unit: 'A',
    },
    customResultRenderer: true, // Will use a custom renderer
};
