
"use client";

import React from 'react';
import { TimeChartControls } from '@/components/chart-controls/time-chart-controls';
import { LengthChartControls } from '@/components/chart-controls/length-chart-controls';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface AcceleratedMotionChartControlsProps {
    customState: { 
        timeUnit: 's' | 'ms', 
        lengthUnit: 'm' | 'cm',
        showRegression?: boolean 
    };
    setCustomState: React.Dispatch<React.SetStateAction<any>>;
}

export const AcceleratedMotionChartControls: React.FC<AcceleratedMotionChartControlsProps> = ({ customState, setCustomState }) => (
    <>
        <TimeChartControls
            timeUnit={customState.timeUnit}
            setTimeUnit={(val) => setCustomState((s: any) => ({ ...s, timeUnit: val }))}
        />
        <LengthChartControls
            lengthUnit={customState.lengthUnit}
            setLengthUnit={(val) => setCustomState((s: any) => ({ ...s, lengthUnit: val }))}
        />
        <div className="flex items-center space-x-2">
            <Switch
                id="show-regression"
                checked={customState.showRegression ?? true}
                onCheckedChange={(checked) => setCustomState((s: any) => ({ ...s, showRegression: checked }))}
            />
            <Label htmlFor="show-regression" className="font-normal cursor-pointer">
                Mostra parabola di regressione
            </Label>
        </div>
    </>
);
