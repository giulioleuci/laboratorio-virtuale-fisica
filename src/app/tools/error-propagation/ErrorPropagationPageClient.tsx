
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";

import { formulas } from "@/lib/formulas";
import type { CalculationResult, ModeState } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ResultsDisplay } from "@/components/results-display";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useSettings } from "@/contexts/settings-context";
import { getCategoryIcon } from "@/lib/utils";
import { DynamicThemeProvider } from "@/components/dynamic-theme-provider";
import { Input } from "@/components/ui/input";

type Variables = { [key: string]: { value: string; sigma: string } };

const FormulaPageSkeleton = () => (
     <div className="w-full space-y-8">
         <div className="flex items-center mb-6">
            <Skeleton className="h-6 w-32" />
        </div>

        <header className="mb-8">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-12 w-3-4 mb-4" />
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

export default function ErrorPropagationPageClient({ id }: { id: string }) {
  const { settings, isLoaded } = useSettings();

  const formula = useMemo(() => formulas.find((f) => f.id === id), [id]);

  const [formulaString, setFormulaString] = useState("");
  const [variables, setVariables] = useState<Variables>({});
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (formula) {
      document.title = formula.title;
    }
  }, [formula]);

  const handleFormulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormulaString(e.target.value);
    const newVariables = (e.target.value.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [])
      .filter((v, i, a) => a.indexOf(v) === i)
      .reduce((acc, v) => ({ ...acc, [v]: { value: "", sigma: "" } }), {});
    setVariables(newVariables);
  };

  const handleVariableChange = (name: string, field: "value" | "sigma", value: string) => {
    setVariables(prev => ({ ...prev, [name]: { ...prev[name], [field]: value } }));
  };

  const runCalculation = useCallback(async () => {
    if (!formula) return;

    setIsLoading(true);

    requestAnimationFrame(() => {
      setTimeout(async () => {
        try {
            const modes = { formulaString, variables } as unknown as ModeState;
            const res = await Promise.resolve(formula.calculation({}, modes, []));
            setResults(res);
        } catch (e) {
          console.error("Calculation failed:", e);
          setResults({ details: { error: `Il calcolo è fallito: ${e instanceof Error ? e.message : String(e)}` } });
        } finally {
          setIsLoading(false);
        }
      }, 10);
    });
  }, [formula, formulaString, variables]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
        runCalculation();
    }, 500); // Debounce calculation by 500ms

    return () => clearTimeout(debounceTimeout);
  }, [variables, runCalculation]);

  if (!isLoaded) {
    return <FormulaPageSkeleton />;
  }

  if (!formula) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold">Tool non trovato</h2>
        <p className="text-muted-foreground">Il tool con ID &quot;{id}&quot; non esiste.</p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/">Torna alla home</Link>
        </Button>
      </div>
    );
  }

  const CategoryIcon = getCategoryIcon(formula.category);

  return (
    <DynamicThemeProvider category={formula.category}>
        <div className="w-full">
        <Button asChild variant="ghost" className="mb-6 pl-0">
            <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Torna all&apos;elenco
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
                <CardTitle className="font-headline text-2xl">Dati</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Label htmlFor="formula-input" className="font-semibold">Formula</Label>
                    <Input id="formula-input" value={formulaString} onChange={handleFormulaChange} placeholder="Es: x + y / z" />
                </div>
                {Object.keys(variables).length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.keys(variables).map(name => (
                            <div key={name} className="space-y-2">
                                <Label className="font-semibold">{name}</Label>
                                <div className="flex gap-2">
                                    <Input value={variables[name].value} onChange={e => handleVariableChange(name, "value", e.target.value)} placeholder="Valore" />
                                    <Input value={variables[name].sigma} onChange={e => handleVariableChange(name, "sigma", e.target.value)} placeholder="Incertezza" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
            </Card>

            <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Risultati</CardTitle>
            </CardHeader>
            <CardContent>
                {settings.precisionMode === 'fixed' && (
                <Alert variant="default" className="mb-6">
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
