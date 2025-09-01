
"use client";

import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { MeasurementRow, FormulaInput } from '@/lib/types';

interface ImportDataButtonProps {
    columns: FormulaInput[];
    setData: React.Dispatch<React.SetStateAction<MeasurementRow[]>>;
}

export const ImportDataButton: React.FC<ImportDataButtonProps> = ({ columns, setData }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const findColumnId = (header: string): string | null => {
        const cleanHeader = header.trim().toLowerCase();
        
        // Try exact label match (e.g., "Massa (m)")
        let found = columns.find(c => c.label.replace(/<[^>]*>?/gm, '').trim().toLowerCase() === cleanHeader);
        if (found) return found.id;
        
        // Try matching sigma labels like "σ (Massa (m))"
        const sigmaMatch = cleanHeader.match(/^(σ|sigma)\s*\((.+)\)$/);
        if (sigmaMatch) {
            const potentialLabel = sigmaMatch[2].trim();
            found = columns.find(c => c.label.replace(/<[^>]*>?/gm, '').trim().toLowerCase() === potentialLabel);
            if (found) return `sigma_${found.id}`;
        }
        
        // Try matching ID (e.g., "m" or "sigma_m")
        found = columns.find(c => c.id.toLowerCase() === cleanHeader);
        if (found) return found.id;
        
        if (cleanHeader.startsWith('sigma_')) {
            const potentialId = cleanHeader.substring(6);
            found = columns.find(c => c.id.toLowerCase() === potentialId);
            if (found) return `sigma_${found.id}`;
        }

        return null;
    };


    const processData = (data: any[][]) => {
        if (data.length < 2) {
            toast({
                variant: 'destructive',
                title: 'Errore nel file',
                description: 'Il file deve contenere almeno una riga di intestazione e una riga di dati.',
            });
            return;
        }

        const headers: string[] = data[0].map(h => String(h));
        const rows = data.slice(1);
        
        const columnMapping: { [key: string]: string | null } = {};
        headers.forEach(header => {
            columnMapping[header] = findColumnId(header);
        });
        
        const unmappedHeaders = headers.filter(h => !columnMapping[h]);
        if (unmappedHeaders.length > 0) {
             toast({
                title: 'Avviso: Colonne non mappate',
                description: `Le seguenti colonne non sono state riconosciute e verranno ignorate: ${unmappedHeaders.join(', ')}`,
            });
        }
        
        const newMeasurementRows: MeasurementRow[] = rows.map((row, index) => {
            const newRow: MeasurementRow = { id: index + 1 };
            headers.forEach((header, colIndex) => {
                const columnId = columnMapping[header];
                if (columnId) {
                    const value = row[colIndex];
                     if (typeof value === 'string') {
                        const parsedValue = parseFloat(value.replace(',', '.'));
                        newRow[columnId] = isNaN(parsedValue) ? null : parsedValue;
                    } else if (typeof value === 'number') {
                        newRow[columnId] = value;
                    } else {
                        newRow[columnId] = null;
                    }
                }
            });
            return newRow;
        }).filter(row => Object.keys(row).length > 1); // Filter out empty rows

        if (newMeasurementRows.length === 0) {
             toast({
                variant: 'destructive',
                title: 'Nessun dato importato',
                description: 'Non è stato possibile mappare nessuna riga di dati valida dal file.',
            });
            return;
        }

        setData(newMeasurementRows);
        toast({
            title: 'Importazione completata',
            description: `${newMeasurementRows.length} righe di dati sono state importate con successo.`,
        });
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                if (!data) throw new Error("Failed to read file.");

                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                
                processData(jsonData as any[][]);
            } catch (error) {
                console.error("Error processing file:", error);
                toast({
                    variant: 'destructive',
                    title: 'Errore di importazione',
                    description: `Non è stato possibile leggere il file. Assicurati che sia un formato valido.`,
                });
            }
        };
        reader.onerror = () => {
             toast({
                variant: 'destructive',
                title: 'Errore di lettura',
                description: 'Impossibile leggere il file selezionato.',
            });
        }
        reader.readAsBinaryString(file);
        
        // Reset file input to allow re-uploading the same file
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".xlsx, .ods, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.oasis.opendocument.spreadsheet"
            />
            <Button onClick={handleButtonClick} variant="default">
                <Upload className="mr-2 h-4 w-4" />
                Importa dati
            </Button>
        </>
    );
};
