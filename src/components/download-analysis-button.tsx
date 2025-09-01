
"use client";

import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Formula } from '@/lib/types';
import { generateDownloadFilename } from '@/lib/utils';
import { useSettings } from '@/contexts/settings-context';

interface DownloadAnalysisButtonProps {
  results: any;
  formula: Formula;
  experimentName: string;
  formatValue: (value?: number, sigma?: number) => string;
}

const downloadFile = (content: string, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const generateMarkdownContent = (results: any, formula: Formula, formatValue: (v?: number, s?: number) => string, precisionMode: 'auto' | 'fixed'): string => {
    let content = `# Analisi: ${formula.title}\n\n`;
    content += `**Esperimento:** ${formula.description}\n`;
    content += `**Categoria:** ${formula.category}\n`;
    content += `**Data Analisi:** ${new Date().toLocaleString('it-IT')}\n\n`;
    
    if (precisionMode === 'fixed') {
        content += `> **Attenzione!** I risultati qui proposti necessitano ancora di qualche raffinamento prima di essere presentati al professore.\n\n`;
    }
    
    content += `## Risultati Finali\n\n`;

    if (formula.customResultRenderer) {
        // Custom renderers
        switch(formula.id) {
            case 'archimedes':
                content += `* **Spinta sperimentale (B_exp):** ${formatValue(results.B_exp?.value, results.B_exp?.sigma)} N\n`;
                content += `* **Spinta teorica (B_teo):** ${formatValue(results.B_teo?.value, results.B_teo?.sigma)} N\n`;
                break;
            case 'newtons-second-law':
                content += `* **Accelerazione teorica (a_teo):** ${formatValue(results.a_teo?.value, results.a_teo?.sigma)} m/s²\n`;
                content += `* **Accelerazione sperimentale (a_exp):** ${formatValue(results.a_exp?.value, results.a_exp?.sigma)} m/s²\n`;
                break;
            case 'mechanical-energy':
                content += `* **Variazione Energia Cinetica (ΔK):** ${formatValue(results.delta_K?.value, results.delta_K?.sigma)} J\n`;
                content += `* **Lavoro/Energia Potenziale (W/U):** ${formatValue(results.Work?.value, results.Work?.sigma)} J\n`;
                break;
             case 'kirchhoffs-current-law':
                content += `* **Somma Correnti Entranti (ΣI_in):** ${formatValue(results.sum_incoming?.value, results.sum_incoming?.sigma)} A\n`;
                content += `* **Somma Correnti Uscenti (ΣI_out):** ${formatValue(results.sum_outgoing?.value, results.sum_outgoing?.sigma)} A\n`;
                content += `* **Somma Algebrica (ΣI_in - ΣI_out):** ${formatValue(results.algebraic_sum?.value, results.algebraic_sum?.sigma)} A\n`;
                break;
            case 'second-kind-lever':
                 content += `* **Momento motore (Mₘ):** ${formatValue(results.M_motore?.value, results.M_motore?.sigma)} N·m\n`;
                 content += `* **Momento resistente (Mᵣ):** ${formatValue(results.M_resistente?.value, results.M_resistente?.sigma)} N·m\n`;
                 break;
            case 'youngs-double-slit':
            case 'diffraction-grating':
                 const value_nm = results.value * 1e9;
                 const sigma_nm = results.sigma * 1e9;
                 content += `* **${formula.result.label}:** ${formatValue(value_nm, sigma_nm)} ${formula.result.unit}\n`;
                 break;
        }
    } else {
        const { value, sigma } = results;
        const relativeUncertainty = value && sigma && value !== 0 ? (Math.abs(sigma / value) * 100).toFixed(1) : "N/A";
        content += `* **${formula.result.label}:** ${formatValue(value, sigma)} ${formula.result.unit}\n`;
        content += `* **Incertezza relativa:** ${relativeUncertainty} %\n`;
    }

    if (results.details) {
        content += `\n## Dettagli del Calcolo\n\n`;
        content += `* **Metodo di calcolo:** ${results.details.method || 'Non specificato'}\n`;
        
        const fitDetails = results.details.fit_details || results.details;

        if (fitDetails.R2 !== undefined) content += `* **Coefficiente R²:** ${fitDetails.R2.toFixed(4)}\n`;
        if (fitDetails.chi2_reduced) content += `* **Chi-quadro ridotto (χ²/dof):** ${fitDetails.chi2_reduced.toFixed(3)}\n`;
        if (fitDetails.k) content += `* **Pendenza (k):** ${formatValue(fitDetails.k.value, fitDetails.k.sigma)}\n`;
        if (fitDetails.v) content += `* **Velocità (v):** ${formatValue(fitDetails.v.value, fitDetails.v.sigma)} m/s\n`;
        if (fitDetails.x0) content += `* **Posizione iniziale (x₀):** ${formatValue(fitDetails.x0.value, fitDetails.x0.sigma)} m\n`;
    }
    
    return content;
};


export const DownloadAnalysisButton: React.FC<DownloadAnalysisButtonProps> = ({
  results,
  formula,
  experimentName,
  formatValue
}) => {
  const { settings } = useSettings();
  const [isGenerating, setIsGenerating] = React.useState(false);
  
  const handleDownload = async () => {
    setIsGenerating(true);
    
    // Use requestAnimationFrame to ensure UI updates before heavy computation
    requestAnimationFrame(() => {
      setTimeout(() => {
        try {
          const content = generateMarkdownContent(results, formula, formatValue, settings.precisionMode);
          const filename = generateDownloadFilename('ANALISI', experimentName);
          downloadFile(content, `${filename}.md`, 'text/markdown;charset=utf-8;');
        } finally {
          setIsGenerating(false);
        }
      }, 10);
    });
  };

  return (
    <Button onClick={handleDownload} variant="default" className="text-xs sm:text-sm" disabled={isGenerating}>
      {isGenerating ? (
        <div className="mr-1 sm:mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
      ) : (
        <Download className="mr-1 sm:mr-2 h-4 w-4" />
      )}
      <span className="hidden sm:inline">{isGenerating ? 'Generazione...' : 'Scarica analisi'}</span>
      <span className="sm:hidden">{isGenerating ? 'Generazione...' : 'Analisi'}</span>
    </Button>
  );
};
