"use client";

import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface LengthChartControlsProps {
    lengthUnit: 'm' | 'cm';
    setLengthUnit: (value: 'm' | 'cm') => void;
}

export const LengthChartControls: React.FC<LengthChartControlsProps> = ({ lengthUnit, setLengthUnit }) => {
    return (
        <div>
            <Label className="font-semibold">Unità Lunghezza</Label>
            <RadioGroup
                value={lengthUnit}
                onValueChange={(val: any) => setLengthUnit(val)}
                className="flex items-center gap-4 mt-2"
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cm" id="len-cm" />
                    <Label htmlFor="len-cm" className="font-normal cursor-pointer">Centimetri (cm)</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="m" id="len-m" />
                    <Label htmlFor="len-m" className="font-normal cursor-pointer">Metri (m)</Label>
                </div>
            </RadioGroup>
        </div>
    );
};
