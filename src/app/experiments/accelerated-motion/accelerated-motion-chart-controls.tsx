
"use client";

import React from 'react';
import { TimeChartControls } from '@/components/chart-controls/time-chart-controls';
import { LengthChartControls } from '@/components/chart-controls/length-chart-controls';

interface AcceleratedMotionChartControlsProps {
    customState: { timeUnit: 's' | 'ms', lengthUnit: 'm' | 'cm' };
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
    </>
);
