
"use client";

import React from 'react';
import { TimeChartControls } from '@/components/chart-controls/time-chart-controls';
import { LengthChartControls } from '@/components/chart-controls/length-chart-controls';

interface FreeFallChartControlsProps {
    customState: { timeUnit: 's' | 'ms', lengthUnit: 'm' | 'cm' };
    setCustomState: React.Dispatch<React.SetStateAction<any>>;
    mode: 'space-time' | 'speed-time';
}

export const FreeFallChartControls: React.FC<FreeFallChartControlsProps> = ({ customState, setCustomState, mode }) => {
    if (mode === 'space-time') {
        return (
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
    }
    if (mode === 'speed-time') {
        return (
            <TimeChartControls
                timeUnit={customState.timeUnit}
                setTimeUnit={(val) => setCustomState((s: any) => ({ ...s, timeUnit: val }))}
            />
        );
    }
    return null;
};
