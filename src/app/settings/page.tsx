
"use client";

import Link from "next/link";
import { ArrowLeft, Cog, Palette, Type } from "lucide-react";

import { useSettings } from "@/contexts/settings-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { hexToHsl, hslToHex, getCategoryIcon } from "@/lib/utils";
import { CATEGORIES } from "@/lib/formulas";
import type { FormulaCategory } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

const SettingsPageSkeleton = () => (
    <div className="w-full max-w-2xl mx-auto space-y-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <header className="mb-8">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-6 w-full" />
        </header>
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-2/3 mt-2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-12 w-full" />
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-2/3 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
                 {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-2/3 mt-2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-24 w-full" />
            </CardContent>
        </Card>
    </div>
);


export default function SettingsPage() {
  const { settings, setSetting, setCategoryColor, isLoaded } = useSettings();

  const handlePrecisionChange = (value: "auto" | "fixed") => {
    setSetting("precisionMode", value);
  };

  const handleFixedDigitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0 && value < 20) {
      setSetting("fixedDigits", value);
    }
  };

  const handlePrimaryColorChange = (hexColor: string) => {
    const hslColor = hexToHsl(hexColor);
    if (hslColor) {
      setSetting("primaryColor", hslColor);
    }
  };

  const handleCategoryColorChange = (category: FormulaCategory, hexColor: string) => {
    const hslColor = hexToHsl(hexColor);
    if (hslColor) {
      setCategoryColor(category, hslColor);
    }
  };
  
  if (!isLoaded) {
    return <SettingsPageSkeleton />;
  }

  const primaryHexColor = hslToHex(settings.primaryColor);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <Button asChild variant="ghost" className="mb-6 pl-0">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna alla home
        </Link>
      </Button>

      <header className="mb-8">
        <h1 className="text-4xl font-bold font-headline flex items-center gap-3">
            <Cog className="w-9 h-9" />
            Impostazioni
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
            Personalizza il comportamento e l'aspetto dell'applicazione.
        </p>
      </header>
      
      <Card>
        <CardHeader>
          <CardTitle>Tema Globale</CardTitle>
          <CardDescription>
            Personalizza il colore principale dell'interfaccia (usato nella home, impostazioni, etc.).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
             <div className="flex items-center justify-between p-2 rounded-md">
                    <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary text-primary-foreground"
                          style={{
                            backgroundColor: primaryHexColor,
                          }}
                        >
                            <Palette className="w-5 h-5" />
                        </div>
                        <Label htmlFor="color-primary" className="text-base">Colore Primario</Label>
                    </div>
                    <Input
                        type="color"
                        id="color-primary"
                        value={primaryHexColor}
                        onChange={(e) => handlePrimaryColorChange(e.target.value)}
                        className="w-16 h-10 p-1 bg-transparent border-border"
                    />
                </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Colori Categorie</CardTitle>
            <CardDescription>
                Assegna un colore primario diverso per ogni categoria di esperimenti.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {CATEGORIES.map(category => {
                const CategoryIcon = getCategoryIcon(category);
                const hexColor = hslToHex(settings.categoryColors[category]);
                return (
                    <div key={category} className="flex items-center justify-between p-2 rounded-md">
                        <div className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{
                                backgroundColor: hexColor,
                                color: 'hsl(var(--primary-foreground-hsl))'
                              }}
                            >
                                <CategoryIcon className="w-5 h-5" />
                            </div>
                            <Label htmlFor={`color-${category}`} className="text-base">{category}</Label>
                        </div>
                        <Input
                            type="color"
                            id={`color-${category}`}
                            value={hexColor}
                            onChange={(e) => handleCategoryColorChange(category, e.target.value)}
                            className="w-16 h-10 p-1 bg-transparent border-border"
                        />
                    </div>
                )
            })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Formato Risultati</CardTitle>
          <CardDescription>
            Scegli come visualizzare le cifre significative nei risultati dei calcoli.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <RadioGroup 
                value={settings.precisionMode}
                onValueChange={handlePrecisionChange}
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <Label htmlFor="fixed" className="font-normal cursor-pointer">
                        Numero fisso di cifre significative
                    </Label>
                </div>
                 <p className="text-sm text-muted-foreground pl-6">
                    Mostra un numero predefinito di cifre significative per tutti i risultati e le incertezze.
                </p>
                <div className="pl-6 pt-2">
                    <Input
                        type="number"
                        id="fixed-digits"
                        value={settings.fixedDigits}
                        onChange={handleFixedDigitsChange}
                        disabled={settings.precisionMode !== 'fixed'}
                        className="w-24"
                        min="1"
                        max="20"
                    />
                </div>

                <div className="flex items-center space-x-2 pt-4">
                    <RadioGroupItem value="auto" id="auto" />
                    <Label htmlFor="auto" className="font-normal cursor-pointer">
                        Adattamento automatico cifre significative (consigliato)
                    </Label>
                </div>
                <p className="text-sm text-muted-foreground pl-6">
                    Il numero di decimali viene adattato in base all'incertezza calcolata, seguendo le convenzioni scientifiche.
                </p>

            </RadioGroup>

            {settings.precisionMode === 'fixed' && (
              <Alert variant="default">
                  <AlertTitle>Scopo Didattico</AlertTitle>
                  <AlertDescription>
                      L'opzione "Numero fisso" formatta anche l'incertezza con lo stesso numero di cifre del valore. Questo approccio non è scientificamente corretto (l'incertezza andrebbe espressa con 1 o 2 cifre significative), ma è fornito come strumento didattico semplificato.
                  </AlertDescription>
              </Alert>
            )}

        </CardContent>
      </Card>
    </div>
  );
}
