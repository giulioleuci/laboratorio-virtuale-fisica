"use client";

import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface TimeChartControlsProps {
    timeUnit: 's' | 'ms';
    setTimeUnit: (value: 's' | 'ms') => void;
}

export const TimeChartControls: React.FC<TimeChartControlsProps> = ({ timeUnit, setTimeUnit }) => {
    return (
        <div>
            <Label className="font-semibold">Unità Tempo</Label>
            <RadioGroup
                value={timeUnit}
                onValueChange={(val: any) => setTimeUnit(val)}
                className="flex items-center gap-4 mt-2"
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="s" id="time-s" />
                    <Label htmlFor="time-s" className="font-normal cursor-pointer">Secondi (s)</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ms" id="time-ms" />
                    <Label htmlFor="time-ms" className="font-normal cursor-pointer">Millisecondi (ms)</Label>
                </div>
            </RadioGroup>
        </div>
    );
};
