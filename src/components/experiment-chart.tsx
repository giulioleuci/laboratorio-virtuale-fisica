
"use client";

import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import html2canvas from 'html2canvas';
import {
  Scatter,
  ErrorBar,
  Line,
  CartesianGrid,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Label,
  ResponsiveContainer
} from 'recharts';
import type { ChartInfo } from '@/lib/types';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label as UiLabel } from './ui/label';
import { Switch } from './ui/switch';
import { Download } from 'lucide-react';
import { generateDownloadFilename } from '@/lib/utils';
import { Separator } from './ui/separator';

interface ExperimentChartProps extends Omit<ChartInfo, 'customOptions'> {
    CustomControls?: React.ComponentType<any>;
    customControlsProps?: any;
    experimentName: string;
}

const ChartComponent = ({
    fit,
    chartState,
    transformedData,
    xDomain,
    yDomain,
    tickFormatter,
}: any) => (
    <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
            margin={{ top: 20, right: 20, bottom: 40, left: 30 }}
            data={transformedData}
        >
            <CartesianGrid stroke="hsl(0 0% 9% / 0.2)" />
            <XAxis
                type="number"
                dataKey="x"
                domain={xDomain}
                tickFormatter={tickFormatter(chartState.xPrecision)}
                tickCount={chartState.xTicks === 'auto' ? undefined : chartState.xTicks}
                stroke="#000000"
            >
                <Label value={chartState.xLabel} position="insideBottom" offset={-20} fill="#000000" />
            </XAxis>
            <YAxis
                type="number"
                dataKey="y"
                domain={yDomain}
                tickFormatter={tickFormatter(chartState.yPrecision)}
                tickCount={chartState.yTicks === 'auto' ? undefined : chartState.yTicks}
                stroke="#000000"
            >
                 <Label value={chartState.yLabel} angle={-90} position="insideLeft" offset={-25} fill="#000000" />
            </YAxis>
            <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                if (active && payload && payload.length) {
                    const dataPoint = payload[0].payload;
                    return (
                        <div className="bg-white/80 backdrop-blur-sm p-2 border rounded shadow-md text-gray-800">
                            <p>{`${chartState.xLabel}: ${dataPoint.x?.toFixed(3)} ± ${dataPoint.sigma_x?.toFixed(3) ?? 'N/A'}`}</p>
                            <p>{`${chartState.yLabel}: ${dataPoint.y?.toFixed(3) ?? 'N/A'} ± ${dataPoint.sigma_y?.toFixed(3) ?? 'N/A'}`}</p>
                        </div>
                    );
                }
                return null;
                }}
            />
            
            <Scatter 
                dataKey="y" 
                fill="#000000" 
                isAnimationActive={false}
                shape={(props) => {
                    const { cx, cy } = props;
                    const radius = chartState.pointSize / 10;
                    return <circle cx={cx} cy={cy} r={radius} fill="#000000" />;
                }}
            >
                <ErrorBar dataKey="sigma_y" width={4} strokeWidth={1.5} stroke="#000000" direction="y" />
                <ErrorBar dataKey="sigma_x" width={4} strokeWidth={1.5} stroke="#000000" direction="x" />
            </Scatter>
            
            {fit && (
                <Line
                    type="linear"
                    dataKey="y_fit"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    isAnimationActive={false}
                    connectNulls={true}
                />
            )}
        </ComposedChart>
    </ResponsiveContainer>
);

export function ExperimentChart({ data: initialData, xLabel: initialXLabel, yLabel: initialYLabel, fit, CustomControls, customControlsProps, experimentName }: ExperimentChartProps) {
    const printRef = useRef<HTMLDivElement>(null);
    
    const getInitialChartState = useCallback(() => ({
        title: `Grafico ${initialYLabel} vs ${initialXLabel}`,
        xLabel: initialXLabel,
        yLabel: initialYLabel,
        swapped: false,
        xPrecision: 2,
        yPrecision: 2,
        xMin: 'auto' as number | 'auto',
        xMax: 'auto' as number | 'auto',
        xTicks: 'auto' as number | 'auto',
        yMin: 'auto' as number | 'auto',
        yMax: 'auto' as number | 'auto',
        yTicks: 'auto' as number | 'auto',
        pointSize: 40,
    }), [initialYLabel, initialXLabel]);

    const [chartState, setChartState] = useState(getInitialChartState());
    
    useEffect(() => {
        setChartState(getInitialChartState());
    }, [initialXLabel, initialYLabel, getInitialChartState]);

    const handleDownload = () => {
        if (printRef.current) {
            const filename = generateDownloadFilename('GRAFICO', experimentName);
            html2canvas(printRef.current, {
                scale: 2,
            }).then((canvas) => {
                const link = document.createElement('a');
                link.download = `${filename}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name.endsWith('Precision') || name === 'pointSize') {
             const numValue = parseInt(value, 10);
            if (!isNaN(numValue) && numValue >= 0 && numValue <= 1000) {
                 setChartState(prev => ({ ...prev, [name]: numValue }));
            }
        } else if (name.endsWith('Min') || name.endsWith('Max') || name.endsWith('Ticks')) {
            if (value.toLowerCase() === 'auto' || value === '') {
                setChartState(prev => ({ ...prev, [name]: 'auto' }));
            } else {
                 const numValue = parseFloat(value);
                 if (!isNaN(numValue)) {
                    setChartState(prev => ({ ...prev, [name]: numValue }));
                 }
            }
        }
        else {
            setChartState(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSwapAxes = (checked: boolean) => {
        setChartState(prev => ({
            ...prev,
            swapped: checked,
            xLabel: checked ? initialYLabel : initialXLabel,
            yLabel: checked ? initialXLabel : initialYLabel,
            title: `Grafico ${checked ? initialXLabel : initialYLabel} vs ${checked ? initialYLabel : initialXLabel}`,
        }));
    };
    
    const currentFit = useMemo(() => {
        if (!fit) return null;
        if (chartState.swapped) {
            if (Math.abs(fit.slope) < 1e-10) return { slope: 0, intercept: 0 }; // Handle near-zero slope
            return { slope: 1 / fit.slope, intercept: -fit.intercept / fit.slope };
        }
        return fit;
    }, [fit, chartState.swapped]);

    const transformedData = useMemo(() => {
        const baseData = chartState.swapped 
            ? initialData.map(p => ({ ...p, x: p.y, y: p.x, sigma_x: p.sigma_y, sigma_y: p.sigma_x }))
            : initialData;
            
        return baseData.map(p => ({
            ...p,
            y_fit: currentFit ? currentFit.slope * p.x + currentFit.intercept : undefined,
            size: chartState.pointSize,
        }));
    }, [initialData, chartState.swapped, currentFit, chartState.pointSize]);

    const dataXDomain = useMemo(() => {
        if (transformedData.length === 0) return [0, 1];
        const xValues = transformedData.map(p => p.x).filter(x => x != null && isFinite(x));
        if (xValues.length === 0) return [0, 1];
        const min = Math.min(...xValues);
        const max = Math.max(...xValues);
        const buffer = (max - min) * 0.05 || 0.1;
        return [min - buffer, max + buffer];
    }, [transformedData]);

    const xDomain = [
        chartState.xMin === 'auto' ? dataXDomain[0] : chartState.xMin,
        chartState.xMax === 'auto' ? dataXDomain[1] : chartState.xMax
    ];
    
    const dataYDomain = useMemo(() => {
        if (transformedData.length === 0) return [0, 1];
        const yValues = transformedData.map(p => p.y).filter(y => y != null && isFinite(y));
        const yFitValues = currentFit ? transformedData.map(p => p.y_fit).filter(y => y != null && isFinite(y)) as number[] : [];
        const allYValues = [...yValues, ...yFitValues];
        if (allYValues.length === 0) return [0, 1];
        const min = Math.min(...allYValues);
        const max = Math.max(...allYValues);
        const buffer = (max - min) * 0.05 || 0.1;
        return [min - buffer, max + buffer];
    }, [transformedData, currentFit]);
    
    const yDomain = [
        chartState.yMin === 'auto' ? dataYDomain[0] : chartState.yMin,
        chartState.yMax === 'auto' ? dataYDomain[1] : chartState.yMax
    ];
    
    const tickFormatter = (precision: number) => (value: any) => {
        if (typeof value === 'number' && isFinite(value)) {
            return value.toFixed(precision);
        }
        return value;
    };
    
    const chartProps = {
        data: transformedData,
        fit: currentFit,
        chartState,
        transformedData,
        xDomain,
        yDomain,
        tickFormatter,
    };

    return (
        <div className="space-y-4">
            <div className="space-y-6 p-4 border rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                    {/* General Settings */}
                    <div className="lg:col-span-3">
                        <h4 className="font-semibold text-lg mb-2">Generali</h4>
                        <Separator />
                    </div>
                    <div className="lg:col-span-2">
                        <UiLabel htmlFor="title">Titolo Grafico</UiLabel>
                        <Input id="title" name="title" value={chartState.title} onChange={handleInputChange} />
                    </div>
                    <div>
                        <UiLabel htmlFor="pointSize">Dimensione Punti</UiLabel>
                        <Input id="pointSize" name="pointSize" type="number" value={chartState.pointSize} onChange={handleInputChange} min="0" max="1000" />
                    </div>
                     <div className="flex items-center space-x-2 pt-6">
                        <Switch id="swap-axes" onCheckedChange={handleSwapAxes} checked={chartState.swapped} />
                        <UiLabel htmlFor="swap-axes">Inverti Assi</UiLabel>
                    </div>

                    {/* X-Axis Settings */}
                    <div className="lg:col-span-3 mt-4">
                        <h4 className="font-semibold text-lg mb-2">Asse X</h4>
                        <Separator />
                    </div>
                    <div>
                        <UiLabel htmlFor="xLabel">Etichetta</UiLabel>
                        <Input id="xLabel" name="xLabel" value={chartState.xLabel} onChange={handleInputChange} />
                    </div>
                    <div className="flex gap-4">
                        <div>
                            <UiLabel htmlFor="xMin">Minimo</UiLabel>
                            <Input id="xMin" name="xMin" value={chartState.xMin} onChange={handleInputChange} placeholder="auto" />
                        </div>
                        <div>
                            <UiLabel htmlFor="xMax">Massimo</UiLabel>
                            <Input id="xMax" name="xMax" value={chartState.xMax} onChange={handleInputChange} placeholder="auto" />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div>
                            <UiLabel htmlFor="xTicks">Divisioni</UiLabel>
                            <Input id="xTicks" name="xTicks" value={chartState.xTicks} onChange={handleInputChange} placeholder="auto" />
                        </div>
                        <div>
                            <UiLabel htmlFor="xPrecision">Decimali</UiLabel>
                            <Input id="xPrecision" name="xPrecision" type="number" value={chartState.xPrecision} onChange={handleInputChange} min="0" max="10" />
                        </div>
                    </div>
                    
                    {/* Y-Axis Settings */}
                    <div className="lg:col-span-3 mt-4">
                        <h4 className="font-semibold text-lg mb-2">Asse Y</h4>
                        <Separator />
                    </div>
                     <div>
                        <UiLabel htmlFor="yLabel">Etichetta</UiLabel>
                        <Input id="yLabel" name="yLabel" value={chartState.yLabel} onChange={handleInputChange} />
                    </div>
                    <div className="flex gap-4">
                         <div>
                            <UiLabel htmlFor="yMin">Minimo</UiLabel>
                            <Input id="yMin" name="yMin" value={chartState.yMin} onChange={handleInputChange} placeholder="auto" />
                        </div>
                         <div>
                            <UiLabel htmlFor="yMax">Massimo</UiLabel>
                            <Input id="yMax" name="yMax" value={chartState.yMax} onChange={handleInputChange} placeholder="auto" />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div>
                            <UiLabel htmlFor="yTicks">Divisioni</UiLabel>
                            <Input id="yTicks" name="yTicks" value={chartState.yTicks} onChange={handleInputChange} placeholder="auto" />
                        </div>
                         <div>
                            <UiLabel htmlFor="yPrecision">Decimali</UiLabel>
                            <Input id="yPrecision" name="yPrecision" type="number" value={chartState.yPrecision} onChange={handleInputChange} min="0" max="10" />
                        </div>
                    </div>
                </div>

                {CustomControls && (
                    <div className="pt-4 mt-4 border-t">
                         <h4 className="font-semibold text-lg mb-4">Controlli Specifici Esperimento</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <CustomControls {...customControlsProps} />
                        </div>
                    </div>
                )}
            </div>

            <div ref={printRef} className="light-theme-print-area p-4">
                <h3 className="font-bold text-lg text-center mb-4">{chartState.title}</h3>
                <ChartComponent {...chartProps} />
            </div>
            
            <div className="flex justify-end">
                <Button onClick={handleDownload} variant="default" className="font-bold">
                    <Download className="mr-2 h-4 w-4" />
                    Scarica PNG
                </Button>
            </div>
        </div>
    );
}

    