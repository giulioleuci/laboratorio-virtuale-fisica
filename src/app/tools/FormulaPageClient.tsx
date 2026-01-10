"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";

import { formulas } from "@/lib/formulas";
import { weightedMean, stdErrMean, G_CONST } from "@/lib/stats";
import type { Formula, MeasurementRow, ModeState, ProcessedInput } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MeasurementTable } from "@/components/measurement-table";
import { ResultsDisplay } from "@/components/results-display";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getSampleData } from "@/lib/fixtures";
import { Skeleton } from "@/components/ui/skeleton";
import { useSettings } from "@/contexts/settings-context";
import { ExperimentChart } from "@/components/experiment-chart";
import { getCategoryIcon } from "@/lib/utils";
import { DynamicThemeProvider } from "@/components/dynamic-theme-provider";

function processMeasurements(
  data: MeasurementRow[],
  formula: Formula,
  modes: ModeState
): { [key: string]: ProcessedInput } {
  const processed: { [key: string]: ProcessedInput } = {};
  if (data.length === 0) return processed;

  const getValidValues = (key: string) => data.map(row => row[key]).filter(v => v !== null && v !== undefined && !isNaN(v as number)) as number[];

  const inputs = formula.getInputs(modes);

  inputs.forEach(input => {
    if (input.isReadOnly) return; // Skip processing for read-only columns
    const values = getValidValues(input.id);
    const sigmas = getValidValues(`sigma_${input.id}`);

    if (values.length > 0) {
      if (sigmas.length === values.length && sigmas.every(s => s > 0)) {
        const { wMean, sigmaWMean } = weightedMean(values, sigmas);
        processed[input.id] = { mean: wMean, sigma: sigmaWMean, method: "Media pesata", values, sigmas, count: values.length };
      } else {
        const { wMean } = weightedMean(values, []); // use weightedMean with empty sigmas for simple mean
        const sigma = stdErrMean(values);
        processed[input.id] = { mean: wMean, sigma, method: "Media semplice", values, sigmas, count: values.length };
      }
    }
  });

  return processed;
}

const updateRowCalculations = (row: MeasurementRow, formulaId: string): MeasurementRow => {
  const newRow = { ...row };
  if (formulaId === 'hookes-law' && row.m !== null && row.m !== undefined) {
    newRow.F = (row.m / 1000) * G_CONST;
  }
  if (formulaId === 'pendulum' && row.t !== null && row.t !== undefined) {
      const n = (row.n && row.n >= 1) ? row.n : 1;
      newRow.T = row.t / n;
  }
  return newRow;
}

const FormulaPageSkeleton = () => (
     <div className="w-full space-y-8">
         <div className="flex items-center mb-6">
            <Skeleton className="h-6 w-32" />
        </div>

        <header className="mb-8">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2" />
        </header>

        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/4" />
            </CardHeader>
            <CardContent className="space-y-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-48 w-full" />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/4" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-32 w-full" />
            </CardContent>
        </Card>
      </div>
)

export default function FormulaPageClient({ id }: { id: string }) {
  const { settings, isLoaded } = useSettings();

  const formula = useMemo(() => formulas.find((f) => f.id === id), [id]);

  const initialModes = useMemo(() => {
    const modes: ModeState = {};
    formula?.uiOptions?.switches?.forEach(s => {
      modes[s.id] = s.defaultValue;
    });
    if (formula?.uiOptions?.getInitialModes) {
        return formula.uiOptions.getInitialModes(modes);
    }
    return modes;
  }, [formula]);

  const [measurements, setMeasurements] = useState<MeasurementRow[]>([]);
  const [modes, setModes] = useState<ModeState>(initialModes);
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // State for chart custom options
  const [chartCustomState, setChartCustomState] = useState<{[key: string]: any}>({});

  useEffect(() => {
    // Reset state when formula changes
    setMeasurements([]);
    setModes(initialModes);
    setResults(null);
    setChartCustomState({});
  }, [formula, initialModes]);

  const handleModeChange = (switchId: string, value: string) => {
    setModes(prev => {
        let newModes: ModeState = { ...prev, [switchId]: value };

        // Let formula hook into mode changes
        if (formula?.uiOptions?.getInitialModes) {
            newModes = formula.uiOptions.getInitialModes(newModes);
        }

        // Reset dependent options if necessary
        formula?.uiOptions?.switches?.forEach(s => {
            if (s.disabled && s.disabled(newModes)) {
                 // If a switch becomes disabled, reset it to its default value
                newModes[s.id] = s.defaultValue;
            }
        });

        // Clear data to avoid inconsistent state
        setMeasurements([]);
        setResults(null);
        setChartCustomState({});
        return newModes;
    });
  };

  const handleGenerateSampleData = () => {
    if (!formula) return;
    const sampleData = getSampleData(formula, modes);
    if (sampleData) {
      const updatedData = sampleData.map(row => updateRowCalculations(row, formula.id));
      setMeasurements(updatedData);
    }
  };

  const handleSetMeasurements = (updater: React.SetStateAction<MeasurementRow[]>) => {
    if (!formula) return;
    setMeasurements(prev => {
        const newData = typeof updater === 'function' ? updater(prev) : updater;
        return newData.map(row => updateRowCalculations(row, formula!.id));
    });
  };

  const runCalculation = useCallback(async () => {
    if (!formula || measurements.length === 0) {
      setResults(null);
      return;
    };

    setIsLoading(true);

    // Use requestAnimationFrame + setTimeout to ensure UI updates immediately
    requestAnimationFrame(() => {
      setTimeout(async () => {
        try {
          const processed = processMeasurements(measurements, formula, modes);
          const res = await Promise.resolve(formula.calculation(processed, modes, measurements));
          setResults(res);
        } catch (e) {
          console.error("Calculation failed:", e);
          setResults({ details: { error: `Il calcolo è fallito: ${e instanceof Error ? e.message : String(e)}` } });
        } finally {
          setIsLoading(false);
        }
      }, 10);
    });
  }, [formula, measurements, modes]);

  useEffect(() => {
    runCalculation();
  }, [measurements, runCalculation]);

  const isChartSupported = formula?.uiOptions?.chart?.isSupported(modes, measurements);
  const chartInfo = useMemo(() => {
    if (!isChartSupported || !formula?.uiOptions?.chart) return null;
    return formula.uiOptions.chart.getInfo(measurements, results, chartCustomState, modes);
  }, [isChartSupported, formula, measurements, results, chartCustomState, modes]);

  const CustomChartControls = useMemo(() => {
     if (!isChartSupported || !formula?.uiOptions?.chart) return undefined;
     return formula.uiOptions.chart.getCustomControls?.(modes);
  }, [isChartSupported, formula, modes]);

  if (!isLoaded) {
    return <FormulaPageSkeleton />;
  }

  if (!formula) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2-xl font-bold">Esperimento non trovato</h2>
        <p className="text-muted-foreground">L'esperimento con ID "{id}" non esiste.</p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/">Torna alla lista</Link>
        </Button>
      </div>
    );
  }

  const chartCustomControlsProps = {
    customState: chartCustomState,
    setCustomState: setChartCustomState,
  };

  const CategoryIcon = getCategoryIcon(formula.category);

  return (
    <DynamicThemeProvider category={formula.category}>
        <div className="w-full">
        <Button asChild variant="ghost" className="mb-6 pl-0">
            <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Torna all'elenco
            </Link>
        </Button>

        <header className="mb-8">
            <div className="flex items-center gap-3 mb-2">
                <CategoryIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                <span className="text-primary font-semibold text-sm sm:text-base">{formula.category}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-headline">{formula.title}</h1>
            <p className="text-base sm:text-lg text-muted-foreground mt-2">{formula.description}</p>
        </header>

        <div className="space-y-8">
            <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Dati Sperimentali</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {formula.uiOptions?.switches && (
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-x-8 sm:gap-y-4 rounded-lg border bg-card/50 p-4">
                    {formula.uiOptions.switches.map(s => {
                    const isDisabled = s.disabled ? s.disabled(modes) : false;
                    const value = isDisabled ? s.defaultValue : modes[s.id];
                    return (
                        <div key={s.id}>
                        <Label className="font-semibold">{s.label}</Label>
                        <RadioGroup
                            value={value}
                            onValueChange={(val) => handleModeChange(s.id, val)}
                            className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mt-2"
                            disabled={isDisabled}
                        >
                            {s.options.map(opt => (
                            <div key={opt.value} className="flex items-center space-x-2">
                                <RadioGroupItem value={opt.value} id={`${s.id}-${opt.value}`} />
                                <Label htmlFor={`${s.id}-${opt.value}`} className="font-normal cursor-pointer">{opt.label}</Label>
                            </div>
                            ))}
                        </RadioGroup>
                        </div>
                    );
                    })}
                </div>
                )}
                <MeasurementTable
                columns={formula.getInputs(modes)}
                data={measurements}
                setData={handleSetMeasurements}
                onGenerateSampleData={handleGenerateSampleData}
                experimentName={formula.title}
                />
            </CardContent>
            </Card>

            {isChartSupported && chartInfo && (
            <Card>
                <CardHeader>
                <CardTitle className="font-headline text-2xl">Grafico dei Dati</CardTitle>
                </CardHeader>
                <CardContent>
                    <ExperimentChart
                        data={chartInfo.data}
                        xLabel={chartInfo.xLabel}
                        yLabel={chartInfo.yLabel}
                        fit={chartInfo.fit}
                        CustomControls={CustomChartControls}
                        customControlsProps={chartCustomControlsProps}
                        experimentName={formula.title}
                    />
                </CardContent>
            </Card>
            )}

            <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Risultati</CardTitle>
            </CardHeader>
            <CardContent>
                {settings.precisionMode === 'fixed' && (
                <Alert variant="warning" className="mb-6">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Attenzione!</AlertTitle>
                    <AlertDescription>
                        I risultati qui mostrati necessitano ancora di qualche raffinamento prima di essere presentati al professore.
                    </AlertDescription>
                </Alert>
                )}
                {results?.details?.error ? (
                <Alert variant="destructive">
                    <AlertTitle>Errore nel calcolo</AlertTitle>
                    <AlertDescription>{results.details.error}</AlertDescription>
                </Alert>
                ) : (
                <ResultsDisplay
                    results={results}
                    formula={formula}
                    isLoading={isLoading}
                    experimentName={formula.title}
                />
                )}
            </CardContent>
            </Card>
        </div>
        </div>
    </DynamicThemeProvider>
  );
}
