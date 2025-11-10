
"use client";

import Link from 'next/link';
import { formulas } from '@/lib/formulas';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { 
  Cog
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Formula, FormulaCategory } from '@/lib/types';
import React, { useMemo } from 'react';
import { useSettings } from '@/contexts/settings-context';
import { getCategoryIcon, getFormulaIcon, hslToHex } from '@/lib/utils';
import { DynamicThemeProvider } from '@/components/dynamic-theme-provider';
import { Skeleton } from '@/components/ui/skeleton';

const HomePageSkeleton = () => (
  <div className="container mx-auto py-8">
    <header className="text-center mb-16 relative">
      <Skeleton className="h-16 w-3/4 mx-auto mb-6" />
      <Skeleton className="h-6 w-1/2 mx-auto" />
    </header>
    <div className="space-y-16">
      {[...Array(3)].map((_, i) => (
        <section key={i}>
          <Skeleton className="h-10 w-1/4 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, j) => (
              <Card key={j}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <Skeleton className="h-6 w-3/4" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  </div>
);

export default function HomePage() {
  const { settings, isLoaded } = useSettings();

  const categories: FormulaCategory[] = [
    "Strumenti",
    "Esperienze introduttive",
    "Statica",
    "Cinematica",
    "Dinamica",
    "Fluidi",
    "Calorimetria",
    "Termodinamica",
    "Ottica",
    "Elettricità",
    "Magnetismo",
    "Fisica Moderna"
  ];

  const groupedFormulas = useMemo(() => {
    return formulas.reduce((acc, formula) => {
      const category = formula.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(formula);
      return acc;
    }, {} as Record<FormulaCategory, Formula[]>);
  }, []);
  
  if (!isLoaded) {
    return <HomePageSkeleton />;
  }

  return (
    <DynamicThemeProvider>
      <div className="container mx-auto py-8">
        <header className="text-center mb-16 relative">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl font-headline">
            Laboratorio Virtuale di Fisica
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Esplora, misura e analizza. Inizia subito la tua avventura scegliendo un esperimento!
          </p>
        </header>
        
        <div className="space-y-16">
          {categories.map(category => {
            const categoryFormulas = groupedFormulas[category];
            if (!categoryFormulas || categoryFormulas.length === 0) {
              return null;
            }
            const CategoryIcon = getCategoryIcon(category);
            const categoryColor = hslToHex(settings.categoryColors[category]);
            
            return (
              <section key={category}>
                <h2 
                  className="text-3xl font-bold font-headline mb-6 border-b-2 pb-3 flex items-center gap-3"
                  style={{ color: categoryColor, borderColor: categoryColor }}
                >
                  <CategoryIcon className="w-8 h-8" />
                  {category}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {categoryFormulas.map((formula) => {
                     const FormulaIcon = getFormulaIcon(formula.id);
                     const href = formula.category === 'Strumenti' ? `/tools/${formula.id}` : `/formula/${formula.id}`;
                     return (
                        <Link href={href} key={formula.id} passHref>
                          <Card 
                            className="h-full flex flex-col hover:border-primary/80 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:-translate-y-2 bg-card/50 hover:bg-card group"
                            style={{'--card-border-color': categoryColor} as React.CSSProperties}
                          >
                            <CardHeader>
                              <CardTitle 
                                className="font-headline text-xl flex items-center gap-3"
                              >
                                <div 
                                  className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300 group-hover:text-primary-foreground flex-shrink-0"
                                  style={{ 
                                      backgroundColor: categoryColor,
                                      color: 'hsl(var(--primary-foreground-hsl))'
                                    }}
                                >
                                  <FormulaIcon 
                                    className="w-6 h-6" 
                                    style={{ 
                                      width: '20px', 
                                      height: '20px', 
                                      minWidth: '20px', 
                                      minHeight: '20px',
                                      strokeWidth: '1.5'
                                    }}
                                  />
                                </div>
                                <span className="flex-1 leading-tight">{formula.title}</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                              <CardDescription>
                                {formula.description}
                              </CardDescription>
                            </CardContent>
                          </Card>
                        </Link>
                     )
                  })}
                </div>
              </section>
            );
          })}
        </div>
        
        <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50">
            <Button asChild variant="secondary" size="icon" className="h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg hover:scale-110 transition-transform duration-200">
              <Link href="/settings">
                <Cog className="h-6 w-6 sm:h-7 sm:w-7" />
                <span className="sr-only">Impostazioni</span>
              </Link>
            </Button>
          </div>

        {/* Footer con informazioni autore */}
        <footer className="mt-24 pt-8 border-t border-border/50 text-center">
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Autore:</strong> Giulio Leuci</p>
            <p><strong>Scuola:</strong> Istituto P. Aldi di Grosseto</p>
            <p><strong>Contatto:</strong> leuci.giulio AT pietroaldi.com</p>
            <p><strong>Licenza:</strong> GNU GPL</p>
            <p><strong>Codice:</strong> <a href="https://github.com/giulioleuci/laboratorio-virtuale-fisica" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">https://github.com/giulioleuci/laboratorio-virtuale-fisica</a></p>
          </div>
        </footer>
      </div>
    </DynamicThemeProvider>
  );
}
