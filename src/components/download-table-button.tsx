
"use client";

import React from 'react';
import { Download, Table as TableIcon } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { MeasurementRow, FormulaInput } from '@/lib/types';
import { generateDownloadFilename } from '@/lib/utils';

interface DownloadTableButtonProps {
  data: MeasurementRow[];
  columns: FormulaInput[];
  experimentName: string;
}

const formatValueForExport = (value: number | null | undefined): string | number => {
    if (value === null || value === undefined) return '';
    return value;
};

const getExportColumns = (columns: FormulaInput[]): { id: string, label: string }[] => {
    const exportCols: { id: string, label: string }[] = [];
    columns.forEach(col => {
        const cleanLabel = col.label.replace(/<[^>]*>?/gm, '');
        
        if (col.id === 'direction') {
             exportCols.push({ id: col.id, label: cleanLabel });
             return;
        }

        if (col.isReadOnly) {
            exportCols.push({ id: col.id, label: `${cleanLabel} (Calcolato)` });
            return;
        }

        exportCols.push({ id: col.id, label: cleanLabel });
        if (!col.isInteger) {
            exportCols.push({ id: `sigma_${col.id}`, label: `σ (${cleanLabel})` });
        }
    });
    return exportCols;
};


// Prepare data for export, using labels as keys
const prepareDataForSheet = (data: MeasurementRow[], columns: FormulaInput[]) => {
    const exportColumns = getExportColumns(columns);
    return data.map(row => {
        const newRow: { [key: string]: string | number } = {};
        exportColumns.forEach(col => {
            newRow[col.label] = formatValueForExport(row[col.id]);
        });
        return newRow;
    });
};


const downloadFile = (content: string, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const DownloadTableButton: React.FC<DownloadTableButtonProps> = ({
  data,
  columns,
  experimentName,
}) => {
  const handleDownload = (format: 'xlsx' | 'ods') => {
    const baseFilename = generateDownloadFilename('DATI', experimentName);
    
    if (format === 'xlsx' || format === 'ods') {
      const dataForSheet = prepareDataForSheet(data, columns);
      const worksheet = XLSX.utils.json_to_sheet(dataForSheet);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Dati");
      XLSX.writeFile(workbook, `${baseFilename}.${format}`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default">
          <Download className="mr-2 h-4 w-4" />
          Scarica dati
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleDownload('xlsx')}>
          <TableIcon className="mr-2 h-4 w-4" />
          <span>Excel (.xlsx)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDownload('ods')}>
          <TableIcon className="mr-2 h-4 w-4" />
          <span>OpenDocument (.ods)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
