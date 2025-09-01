
"use client";
import type { Formula } from "@/lib/types";
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { useSettings } from "@/contexts/settings-context";
import { Info } from "lucide-react";
import { DownloadAnalysisButton } from "./download-analysis-button";

interface ResultsDisplayProps {
  results: any;
  formula: Formula;
  isLoading: boolean;
  experimentName: string;
}

const ResultRow = ({ label, value, unit, htmlLabel }: { label?: string, value: string | React.ReactNode, unit?: string, htmlLabel?: string }) => (
    <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-b-0">
        <span className="text-muted-foreground flex items-center gap-2">
            {htmlLabel ? <span dangerouslySetInnerHTML={{ __html: htmlLabel }} /> : label}
        </span>
        <span className="font-mono text-lg">{value} {unit}</span>
    </div>
);

const CustomArchimedesRenderer = ({ results, formatValue }: { results: any, formatValue: (v?: number, s?: number) => string }) => {
  if (!results.B_exp || !results.B_teo) return null;
  const { B_exp, B_teo } = results;
  
  return (
    <div className="space-y-4">
      <ResultRow htmlLabel="Spinta sperimentale (B<sub>exp</sub>)" value={formatValue(B_exp.value, B_exp.sigma)} unit="N" />
      <ResultRow htmlLabel="Spinta teorica (B<sub>teo</sub>)" value={formatValue(B_teo.value, B_teo.sigma)} unit="N" />
    </div>
  );
};

const CustomNewtonsSecondLawRenderer = ({ results, formatValue }: { results: any, formatValue: (v?: number, s?: number) => string }) => {
  if (!results.a_teo || !results.a_exp) return null;
  const { a_teo, a_exp } = results;
  
  return (
    <div className="space-y-4">
      <ResultRow htmlLabel="Accelerazione teorica (a<sub>teo</sub>)" value={formatValue(a_teo.value, a_teo.sigma)} unit="m/s²" />
      <ResultRow htmlLabel="Accelerazione sperimentale (a<sub>exp</sub>)" value={formatValue(a_exp.value, a_exp.sigma)} unit="m/s²" />
    </div>
  );
};

const CustomMechanicalEnergyRenderer = ({ results, formatValue, modes }: { results: any, formatValue: (v?: number, s?: number) => string, modes: any }) => {
  if (!results.delta_K || !results.Work) return null;
  const { delta_K, Work, energy_difference } = results;
  
  const workLabel = modes.driving_force_type === 'mass' ? "Energia Potenziale persa (U)" : "Lavoro (W)";

  return (
    <div className="space-y-4">
      <ResultRow htmlLabel="Variazione Energia Cinetica (ΔK)" value={formatValue(delta_K.value, delta_K.sigma)} unit="J" />
      <ResultRow htmlLabel={workLabel} value={formatValue(Work.value, Work.sigma)} unit="J" />
      <ResultRow htmlLabel="Differenza (ΔK - U)" value={formatValue(energy_difference.value, energy_difference.sigma)} unit="J" />
    </div>
  );
};

const CustomKirchhoffsCurrentLawRenderer = ({ results, formatValue }: { results: any, formatValue: (v?: number, s?: number) => string }) => {
  if (!results.sum_incoming || !results.sum_outgoing || !results.algebraic_sum) return null;
  const { sum_incoming, sum_outgoing, algebraic_sum } = results;
  
  return (
    <div className="space-y-4">
      <ResultRow htmlLabel="Somma Correnti Entranti (ΣI<sub>in</sub>)" value={formatValue(sum_incoming.value, sum_incoming.sigma)} unit="A" />
      <ResultRow htmlLabel="Somma Correnti Uscenti (ΣI<sub>out</sub>)" value={formatValue(sum_outgoing.value, sum_outgoing.sigma)} unit="A" />
       <ResultRow htmlLabel="Somma Algebrica (ΣI<sub>in</sub> - ΣI<sub>out</sub>)" value={formatValue(algebraic_sum.value, algebraic_sum.sigma)} unit="A" />
    </div>
  );
};

const CustomSecondKindLeverRenderer = ({ results, formatValue }: { results: any, formatValue: (v?: number, s?: number) => string }) => {
  if (!results.M_motore || !results.M_resistente) return null;
  const { M_motore, M_resistente } = results;
  
  return (
    <div className="space-y-4">
      <ResultRow htmlLabel="Momento motore (Mₘ)" value={formatValue(M_motore.value, M_motore.sigma)} unit="N·m" />
      <ResultRow htmlLabel="Momento resistente (Mᵣ)" value={formatValue(M_resistente.value, M_resistente.sigma)} unit="N·m" />
    </div>
  );
};

const CustomOpticsResultRenderer = ({ results, formatValue, formula }: { results: any, formatValue: (v?: number, s?: number) => string, formula: Formula }) => {
    if (results.value === undefined || results.value === null) return null;
    const value_nm = results.value * 1e9;
    const sigma_nm = results.sigma * 1e9;
    return (
         <div className="space-y-4">
            <ResultRow 
                htmlLabel={`${formula.result.label || 'Valore Finale'}`}
                value={formatValue(value_nm, sigma_nm)}
                unit={formula.result.unit}
            />
         </div>
    );
};


const FitDetailsRenderer = ({ details, formatValue }: { details: any, formatValue: (v?: number, s?: number) => string }) => (
    <div className="mt-6">
        <h4 className="font-semibold mb-2 text-md">Dettagli del Calcolo</h4>
        <div className="text-sm space-y-2 text-muted-foreground p-4 rounded-md bg-background/50">
            {details.rho && <ResultRow htmlLabel="Densità da fit (ρ)" value={formatValue(details.rho.value, details.rho.sigma)} unit="g/cm³" />}
            {details.k && <ResultRow htmlLabel="Pendenza (k)" value={formatValue(details.k.value, details.k.sigma)} />}
            {details.R && <ResultRow htmlLabel="Resistenza (R)" value={formatValue(details.R.value, details.R.sigma)} unit="Ω" />}
            {details.n2_over_n1 && <ResultRow htmlLabel="Rapporto n₂/n₁" value={formatValue(details.n2_over_n1.value, details.n2_over_n1.sigma)} />}
            {details.v && <ResultRow htmlLabel="Velocità (v)" value={formatValue(details.v.value, details.v.sigma)} unit="m/s" />}
            {details.a && <ResultRow htmlLabel="Termine quadratico (a)" value={formatValue(details.a.value, details.a.sigma)} />}
            {details.v0 && <ResultRow htmlLabel="Velocità iniziale (v<sub>0</sub>)" value={formatValue(details.v0.value, details.v0.sigma)} unit="m/s" />}
            {details.x0 && <ResultRow htmlLabel="Posizione iniziale (x<sub>0</sub>)" value={formatValue(details.x0.value, details.x0.sigma)} unit="m" />}
            {details.L_medio && <ResultRow htmlLabel="Lunghezza media (L)" value={formatValue(details.L_medio.value, details.L_medio.sigma)} unit="m" />}
            {details.T_medio && <ResultRow htmlLabel="Periodo medio (T)" value={formatValue(details.T_medio.value, details.T_medio.sigma)} unit="s" />}
            {details.R2 !== undefined && <ResultRow htmlLabel="Coefficiente R²" value={details.R2.toFixed(4)} />}
            {details.chi2_reduced && <ResultRow htmlLabel="Chi-quadro ridotto (χ²/dof)" value={details.chi2_reduced.toFixed(3)} />}
        </div>
    </div>
);

const VariableProcessingRenderer = ({ details, formatValue }: { details: any, formatValue: (v?: number, s?: number) => string }) => {
    const detailEntries = Object.entries(details).filter(([, detail]: [string, any]) => detail && typeof detail === 'object' && 'mean' in detail);
    if(detailEntries.length === 0) return null;

    return (
        <div className="mt-6">
            <h4 className="font-semibold mb-2 text-md">Elaborazione Variabili</h4>
            <div className="text-sm space-y-2 text-muted-foreground p-4 rounded-md bg-background/50">
            {detailEntries.map(([key, detail]: [string, any]) => (
                <div key={key} className="flex justify-between items-center">
                    <span>Variabile <strong>{key}</strong>: {formatValue(detail.mean, detail.sigma)}</span>
                    <span className="flex items-center gap-1">{detail.method} </span>
                </div>
            ))}
            </div>
        </div>
    )
};


const ExtraDetailsRenderer = ({ details, formatValue }: { details: any, formatValue: (v?: number, s?: number) => string }) => {
    const detailEntries = Object.entries(details).filter(([key]) => ['E_initial', 'E_final', 'p_initial', 'p_final', 'v1_i', 'v_f', 'v_final'].includes(key));
    if(detailEntries.length === 0) return null;

    const labelMap: {[key: string]: string} = {
        E_initial: "Energia Iniziale (Eᵢ)",
        E_final: "Energia Finale (E<sub>f</sub>)",
        p_initial: "Quantità di Moto Iniziale (pᵢ)",
        p_final: "Quantità di Moto Finale (p<sub>f</sub>)",
        v1_i: "Velocità iniziale 1 (v₁,ᵢ)",
        v_f: "Velocità finale (urto) (v<sub>f</sub>)",
        v_final: "Velocità finale (v<sub>f</sub>)",
    };

    const unitMap: {[key: string]: string} = {
        E_initial: "J",
        E_final: "J",
        p_initial: "kg·m/s",
        p_final: "kg·m/s",
        v1_i: "m/s",
        v_f: "m/s",
        v_final: "m/s",
    };

    return (
        <div className="mt-6">
            <h4 className="font-semibold mb-2 text-md">Dettagli Aggiuntivi</h4>
            <div className="text-sm space-y-2 text-muted-foreground p-4 rounded-md bg-background/50">
                {detailEntries.map(([key, detail]: [string, any]) => (
                    <ResultRow 
                        key={key}
                        htmlLabel={labelMap[key]} 
                        value={formatValue(detail.value, detail.sigma)} 
                        unit={unitMap[key]}
                    />
                ))}
            </div>
        </div>
    )
};


export function ResultsDisplay({ results, formula, isLoading, experimentName }: ResultsDisplayProps) {
  const { settings } = useSettings();

  const formatValue = (value?: number, sigma?: number): string => {
    if (value === undefined || value === null || !isFinite(value)) return "N/D";
    
    // Auto precision mode (scientific)
    if (settings.precisionMode === 'auto') {
        if (sigma === undefined || sigma === null || !isFinite(sigma) || sigma === 0) {
            return value.toPrecision(4); // Fallback for values without sigma
        }
        
        const sigmaString = sigma.toExponential();
        const firstDigit = parseInt(sigmaString[0]);
        let sigFigs = (firstDigit === 1) ? 2 : 1;

        const roundedSigma = Number(sigma.toPrecision(sigFigs));
        
        const sigmaStr = roundedSigma.toString();
        const decimalPlaces = sigmaStr.includes('.') ? sigmaStr.split('.')[1].length : 0;
        
        const roundedValue = value.toFixed(decimalPlaces);
        
        return `${roundedValue} ± ${roundedSigma}`;
    }

    // Fixed precision mode (didactic)
    const N = settings.fixedDigits;
    if (sigma === undefined || sigma === null || !isFinite(sigma) || sigma === 0) {
        return value.toFixed(N);
    }
    
    const roundedSigma = Number(sigma.toPrecision(N));
    
    const sigmaStr = roundedSigma.toString();
    const sigmaDecimalPlaces = sigmaStr.includes('.') ? sigmaStr.split('.')[1].length : 0;
    
    const valueDecimalPlaces = sigmaDecimalPlaces + 1;
    const roundedValue = value.toFixed(valueDecimalPlaces);

    return `${roundedValue} ± ${roundedSigma}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4 pt-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-8 w-2/3" />
      </div>
    );
  }
  
  const hasResults = results && (results.value !== undefined || formula.customResultRenderer);

  if (!hasResults) {
    return <p className="text-muted-foreground text-center py-8">In attesa di dati sufficienti per il calcolo...</p>;
  }

  const { value, sigma, details, modes } = results; // modes from calculation result if available
  const relativeUncertainty = value && sigma && value !== 0 ? (Math.abs(sigma / value) * 100).toFixed(1) : "N/D";
  
  const renderCustom = () => {
    switch(formula.id) {
        case 'archimedes':
            return <CustomArchimedesRenderer results={results} formatValue={formatValue} />;
        case 'newtons-second-law':
            return <CustomNewtonsSecondLawRenderer results={results} formatValue={formatValue} />;
        case 'mechanical-energy':
            return <CustomMechanicalEnergyRenderer results={results} formatValue={formatValue} modes={details.driving_force_type ? {driving_force_type: details.driving_force_type} : {driving_force_type: 'mass'}} />;
        case 'kirchhoffs-current-law':
            return <CustomKirchhoffsCurrentLawRenderer results={results} formatValue={formatValue} />;
        case 'second-kind-lever':
            return <CustomSecondKindLeverRenderer results={results} formatValue={formatValue} />;
        case 'youngs-double-slit':
        case 'diffraction-grating':
            return <CustomOpticsResultRenderer results={results} formatValue={formatValue} formula={formula} />;
        default:
            return null;
    }
  }

  if (formula.customResultRenderer) {
    return (
      <div className="space-y-4">
        {renderCustom()}
        {details?.v_final && <ExtraDetailsRenderer details={details} formatValue={formatValue}/>}
        {details?.fit_details && <FitDetailsRenderer details={details.fit_details} formatValue={formatValue} />}
         {details?.method && (
            <div className="flex justify-between items-center pt-4">
                <span className="text-sm text-muted-foreground flex items-center gap-2">Metodo di calcolo: {details.method}</span>
            </div>
         )}
         <div className="flex justify-end pt-4">
            <DownloadAnalysisButton results={results} formula={formula} experimentName={experimentName} formatValue={formatValue} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ResultRow 
        htmlLabel={`${formula.result.label || 'Valore Finale'}`}
        value={formatValue(value, sigma)}
        unit={formula.result.unit}
      />
      <ResultRow label="Incertezza relativa" value={relativeUncertainty !== "N/D" ? `${relativeUncertainty} %` : "N/D"} />

      {details && details.method && (
        <div className="flex justify-between items-center pt-4">
          <span className="text-sm text-muted-foreground flex items-center gap-2">Metodo di calcolo: {details.method}
          </span>
        </div>
      )}

      {details && (details.R2 !== undefined || details.a || details.v || details.k || details.x0 || details.L_medio || details.T_medio || details.R || details.n2_over_n1 || details.rho) && <FitDetailsRenderer details={details} formatValue={formatValue} />}
      
      {details && <VariableProcessingRenderer details={details} formatValue={formatValue}/>}
      {details && <ExtraDetailsRenderer details={details} formatValue={formatValue} />}
      
       <div className="flex justify-end pt-4">
            <DownloadAnalysisButton results={results} formula={formula} experimentName={experimentName} formatValue={formatValue} />
        </div>
    </div>
  );
}
