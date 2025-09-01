
"use client";

import React from 'react';
import { LengthChartControls } from '@/components/chart-controls/length-chart-controls';

interface PendulumChartControlsProps {
    customState: { lengthUnit: 'm' | 'cm' };
    setCustomState: React.Dispatch<React.SetStateAction<any>>;
}

export const PendulumChartControls: React.FC<PendulumChartControlsProps> = ({ customState, setCustomState }) => (
    <LengthChartControls
        lengthUnit={customState.lengthUnit}
        setLengthUnit={(val) => setCustomState((s: any) => ({ ...s, lengthUnit: val }))}
    />
);
