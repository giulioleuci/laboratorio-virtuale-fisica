
import { weightedMean } from '@/lib/stats';
import type { Formula, ProcessedInput, MeasurementRow, ModeState } from '@/lib/types';
import { sum } from 'mathjs';

export const resistorsFormula: Formula = {
    id: 'resistors',
    title: 'Resistenze in serie e parallelo',
    description: "Misura la resistenza equivalente di un gruppo di resistori collegati in serie o in parallelo.",
    category: 'Elettricità',
    getInputs: () => [
        { 
            id: 'r', 
            label: 'Resistenza (R)', 
            unit: 'Ω',
            help: {
                title: "Resistenza (R)",
                description: "Il valore della resistenza di un singolo resistore. Misuralo con un multimetro in modalità ohmetro."
            }
        },
    ],
    calculation: (processedInputs: { [key: string]: ProcessedInput }, modes: ModeState, rawData: MeasurementRow[]) => {
        const rValues = rawData.map(row => row.r).filter(v => v !== null) as number[];
        const sigmaRValues = rawData.map(row => row.sigma_r).filter(v => v !== null) as number[];

        if (rValues.length === 0) {
            return { details: { error: "Nessun resistore inserito." } };
        }

        let req = 0;
        let sigma_req_sq = 0;

        if (modes.mode === 'series') {
            req = sum(rValues);
            sigma_req_sq = sum(sigmaRValues.map(s => s**2));
        } else { // mode 'parallel'
            if (rValues.some(r => r === 0)) return { details: { error: "La resistenza non può essere zero in un collegamento in parallelo."}};
            const invRValues = rValues.map(r => 1/r);
            const invReq = sum(invRValues);
            req = 1 / invReq;
            
            // Error propagation for 1/Req = sum(1/Ri)
            // sigma_Req^2 = Req^4 * sum( (sigma_Ri / Ri^2)^2 )
            sigma_req_sq = req**4 * sum(rValues.map((r, i) => (sigmaRValues[i] / r**2)**2));
        }
        
        const sigma_req = Math.sqrt(sigma_req_sq);

        return {
            value: req,
            sigma: sigma_req,
            details: {
                method: modes.mode === 'series' ? "Somma resistenze in serie" : "Combinazione resistenze in parallelo",
                numResistors: rValues.length
            }
        };
    },
    result: {
        label: 'Resistenza Equivalente (Rₑ)',
        unit: 'Ω',
    },
    uiOptions: {
        switches: [
            {
                id: 'mode',
                label: 'Collegamento',
                options: [
                    { value: 'series', label: 'Serie' },
                    { value: 'parallel', label: 'Parallelo' }
                ],
                defaultValue: 'series'
            }
        ],
        getFixtureKey: (modes: ModeState) => `resistors-${modes.mode}`
    }
};
