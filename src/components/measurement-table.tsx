
"use client";

import type { Dispatch, SetStateAction } from "react";
import React from "react";
import { PlusCircle, TestTube, Trash2, XCircle, Info } from "lucide-react";

import type { FormulaInput, MeasurementRow } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { stripHtml } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { DownloadTableButton } from "./download-table-button";
import { ImportDataButton } from "./import-data-button";
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";

interface MeasurementTableProps {
  columns: FormulaInput[];
  data: MeasurementRow[];
  setData: Dispatch<SetStateAction<MeasurementRow[]>>;
  onGenerateSampleData: () => void;
  experimentName: string;
}

export function MeasurementTable({ columns, data, setData, onGenerateSampleData, experimentName }: MeasurementTableProps) {
  const addRow = () => {
    const newId = data.length > 0 ? Math.max(...data.map((r) => r.id)) + 1 : 1;
    const newRow: MeasurementRow = { id: newId };
    columns.forEach((col) => {
      newRow[col.id] = null;
      if (!col.isReadOnly && !col.isInteger) {
        newRow[`sigma_${col.id}`] = null;
      }
      if (col.id === 'direction') {
          newRow[col.id] = 1; // Default to 'entrante'
      }
    });
    setData((prevData) => [...prevData, newRow]);
  };

  const removeRow = (id: number) => {
    setData((prevData) => prevData.filter((row) => row.id !== id));
  };

  const updateCell = (id: number, column: string, value: string | number) => {
    const numericValue = typeof value === 'string' && value === "" ? null : parseFloat(String(value));
    setData((prevData) =>
      prevData.map((row) =>
        row.id === id ? { ...row, [column]: numericValue } : row
      )
    );
  };

  const clearTable = () => {
    setData([]);
  };

  const renderLabel = (label: string, help?: {title: string, description: string}) => {
    return (
        <div className="flex items-center justify-center gap-2">
             <span dangerouslySetInnerHTML={{ __html: label }} />
             {help && (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-4 w-4 text-muted-foreground hover:text-primary">
                            <Info className="h-4 w-4" />
                            <span className="sr-only">Info su {help.title}</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{help.title}</DialogTitle>
                            <DialogDescription className="pt-4 text-base">
                                {help.description}
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
             )}
        </div>
    );
  }
  
  const formatReadOnlyValue = (value: any) => {
    if (value === null || value === undefined || isNaN(value)) return "-";
    return Number(value).toFixed(3);
  }
  
  const DirectionControl = ({rowId, value, onChange}: {rowId: number, value: number | null | undefined, onChange: (id: number, column: string, value: string | number) => void}) => {
      return (
        <RadioGroup
            value={String(value)}
            onValueChange={(val) => onChange(rowId, 'direction', Number(val))}
            className="flex items-center justify-center gap-4"
        >
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id={`dir-in-${rowId}`} />
                <Label htmlFor={`dir-in-${rowId}`} className="font-normal cursor-pointer">Entrante</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="-1" id={`dir-out-${rowId}`} />
                <Label htmlFor={`dir-out-${rowId}`} className="font-normal cursor-pointer">Uscente</Label>
            </div>
        </RadioGroup>
      )
  }

  return (
    <div className="space-y-4">
      <div className="w-full overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.id} colSpan={!col.isReadOnly && !col.isInteger ? 2 : 1} className="text-center whitespace-nowrap">
                  {renderLabel(col.label, col.help)}
                   {col.unit && <span className="font-normal text-muted-foreground text-xs ml-1">({col.unit})</span>}
                </TableHead>
              ))}
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
             <TableRow>
              {columns.map((col) => {
                if(col.id === 'direction') return <TableHead key={col.id}></TableHead>; // Empty header for direction
                return (
                    <React.Fragment key={col.id}>
                      <TableHead className="text-center">{col.isReadOnly ? 'Calcolato' : 'Valore'}</TableHead>
                      {!col.isReadOnly && !col.isInteger && <TableHead className="text-center">σ (incert.)</TableHead>}
                    </React.Fragment>
                )
              })}
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                {columns.map((col) => (
                  <React.Fragment key={`${row.id}-${col.id}`}>
                    {col.id === 'direction' ? (
                        <TableCell colSpan={2}>
                           <DirectionControl rowId={row.id} value={row.direction} onChange={updateCell} />
                        </TableCell>
                    ) : col.isReadOnly ? (
                       <TableCell className="text-center text-muted-foreground font-mono">
                         {formatReadOnlyValue(row[col.id])}
                       </TableCell>
                    ) : (
                      <>
                        <TableCell>
                          <Input
                            type="number"
                            step="any"
                            value={row[col.id] ?? ""}
                            onChange={(e) => updateCell(row.id, col.id, e.target.value)}
                            className="min-w-[100px] text-center"
                            placeholder="valore"
                            aria-label={`Valore per ${stripHtml(col.label)} (riga ${row.id})`}
                          />
                        </TableCell>
                        {!col.isInteger && (
                          <TableCell>
                            <Input
                              type="number"
                              step="any"
                              value={row[`sigma_${col.id}`] ?? ""}
                              onChange={(e) => updateCell(row.id, `sigma_${col.id}`, e.target.value)}
                              className="min-w-[100px] text-center"
                              placeholder="incertezza"
                              aria-label={`Incertezza per ${stripHtml(col.label)} (riga ${row.id})`}
                            />
                          </TableCell>
                        )}
                      </>
                    )}
                  </React.Fragment>
                ))}
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRow(row.id)}
                          className="text-muted-foreground hover:text-destructive"
                          aria-label="Rimuovi riga"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Rimuovi riga</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
             {data.length === 0 && (
                <TableRow>
                    <TableCell colSpan={columns.reduce((acc, col) => acc + (!col.isReadOnly && !col.isInteger ? 2 : 1), 0) + 1} className="text-center text-muted-foreground py-10">
                        La tabella è vuota. Aggiungi una riga per iniziare.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
            <Button onClick={addRow} className="font-bold">
                <PlusCircle className="mr-2 h-4 w-4" />
                <span className="hidden xs:inline">Aggiungi riga</span>
                <span className="xs:hidden">Aggiungi</span>
            </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
            <Button onClick={onGenerateSampleData} variant="outline" className="text-xs sm:text-sm">
              <TestTube className="mr-1 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Crea dati di esempio</span>
              <span className="sm:hidden">Esempio</span>
            </Button>
            <ImportDataButton columns={columns} setData={setData} />
            {data.length > 0 &&
                <DownloadTableButton data={data} columns={columns} experimentName={experimentName} />
            }
            {data.length > 0 &&
              <Button onClick={clearTable} variant="destructive" className="text-xs sm:text-sm">
                <XCircle className="mr-1 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Pulisci tabella</span>
                <span className="sm:hidden">Pulisci</span>
              </Button>
            }
        </div>
      </div>
    </div>
  );
}
