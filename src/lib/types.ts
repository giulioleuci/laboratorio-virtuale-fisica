

import type React from "react";

export type MeasurementRow = {
  id: number;
  [key: string]: number | null | undefined;
};

export type FormulaInput = {
  id: string;
  label: string; // Can be HTML string
  unit: string;
  isInteger?: boolean;
  isReadOnly?: boolean;
  help?: {
    title: string;
    description: string;
  };
};

export type ProcessedInput = {
  mean: number;
  sigma: number;
  method: string;
  values: number[];
  sigmas: (number | null | undefined)[];
  count: number;
};

export type CalculationResult = {
  [key: string]: any;
  value?: number;
  sigma?: number;
  details?: {
    [key: string]: any;
  };
};

export type Partials = {
  [key: string]: (vars: { [key: string]: number }) => number;
};

export type FormulaCategory = "Esperienze introduttive" | "Statica" | "Cinematica" | "Dinamica" | "Fluidi" | "Calorimetria" | "Termodinamica" | "Ottica" | "Elettricità" | "Magnetismo" | "Fisica Moderna";

export type ChartDataPoint = {
    x: number;
    y: number;
    sigma_x?: number;
    sigma_y?: number;
};

export type ChartInfo = {
    data: ChartDataPoint[];
    xLabel: string;
    yLabel: string;
    fit?: {
        slope: number;
        intercept: number;
    };
    customControls?: React.ComponentType<any>;
    customControlsProps?: any;
};

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<"light" | "dark", string> }
  )
}

export type ChartOptions = {
    isSupported: (modes: ModeState, data: MeasurementRow[]) => boolean;
    getInfo: (data: MeasurementRow[], results: CalculationResult | null, customState?: any, modes?: ModeState) => Omit<ChartInfo, 'customControls' | 'customControlsProps'>;
    getCustomControls?: (modes: ModeState) => React.ComponentType<any> | undefined;
}

export interface Formula {
  id: string;
  title: string;
  description: string;
  category: FormulaCategory;
  getInputs: (modes: ModeState) => FormulaInput[];
  calculation: (
    processedInputs: { [key: string]: ProcessedInput },
    modes: ModeState,
    rawData: MeasurementRow[]
  ) => Promise<CalculationResult> | CalculationResult;
  result: {
    label?: string;
    unit?: string;
  };
  customResultRenderer?: boolean;
  uiOptions?: {
    switches?: {
      id: string;
      label: string;
      options: { value: string; label: string }[];
      defaultValue: string;
      disabled?: (modes: ModeState) => boolean;
    }[];
    getFixtureKey?: (modes: ModeState) => string;
    getInitialModes?: (modes: ModeState) => ModeState;
    chart?: ChartOptions;
  };
}

export type ModeState = {
  [key: string]: string;
};
