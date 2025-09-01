
"use client";

import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface HookesLawChartControlsProps {
    customState: { yAxisType: 'mass' | 'force', xAxisUnit: 'cm' | 'm' };
    setCustomState: React.Dispatch<React.SetStateAction<any>>;
}

export const HookesLawChartControls: React.FC<HookesLawChartControlsProps> = ({
    customState,
    setCustomState,
}) => (
    <>
        <div>
            <Label className="font-semibold">Asse Y (Dati)</Label>
            <RadioGroup
                value={customState.yAxisType}
                onValueChange={(val: any) => setCustomState((s: any) => ({ ...s, yAxisType: val }))}
                className="flex items-center gap-4 mt-2"
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mass" id="h-mass" />
                    <Label htmlFor="h-mass" className="font-normal cursor-pointer">Massa</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="force" id="h-force" />
                    <Label htmlFor="h-force" className="font-normal cursor-pointer">Forza</Label>
                </div>
            </RadioGroup>
        </div>
        <div>
            <Label className="font-semibold">Asse X (Unità)</Label>
            <RadioGroup
                value={customState.xAxisUnit}
                onValueChange={(val: any) => setCustomState((s: any) => ({ ...s, xAxisUnit: val }))}
                className="flex items-center gap-4 mt-2"
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cm" id="h-cm" />
                    <Label htmlFor="h-cm" className="font-normal cursor-pointer">Centimetri (cm)</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="m" id="h-m" />
                    <Label htmlFor="h-m" className="font-normal cursor-pointer">Metri (m)</Label>
                </div>
            </RadioGroup>
        </div>
    </>
);
