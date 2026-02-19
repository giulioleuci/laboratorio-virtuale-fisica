
import type { Formula, FormulaCategory } from './types';
import { archimedesFormula } from '@/app/experiments/archimedes/config';
import { freeFallFormula } from '@/app/experiments/free-fall/config';
import { pendulumFormula } from '@/app/experiments/pendulum/config';
import { hookesLawFormula } from '@/app/experiments/hookes-law/config';
import { uniformMotionFormula } from '@/app/experiments/uniform-motion/config';
import { acceleratedMotionFormula } from '@/app/experiments/accelerated-motion/config';
import { ohmsLawFormula } from '@/app/experiments/ohms-law/config';
import { resistorsFormula } from '@/app/experiments/resistors/config';
import { snellsLawFormula } from '@/app/experiments/snells-law/config';
import { mechanicalEnergyFormula } from '@/app/experiments/mechanical-energy/config';
import { momentumConservationFormula } from '@/app/experiments/momentum-conservation/config';
import { newtonsSecondLawFormula } from '@/app/experiments/newtons-second-law/config';
import { kirchhoffsCurrentLawFormula } from '@/app/experiments/kirchhoffs-current-law/config';
import { secondKindLeverFormula } from '@/app/experiments/second-kind-lever/config';
import { densityMeasurementFormula } from '@/app/experiments/density-measurement/config';
import { earthMagneticFieldFormula } from '@/app/experiments/earth-magnetic-field/config';
import { youngsDoubleSlitFormula } from '@/app/experiments/youngs-double-slit/config';
import { diffractionGratingFormula } from '@/app/experiments/diffraction-grating/config';
import { curveFitFormula } from '@/app/tools/curve-fit/config';
import { errorPropagationFormula } from '@/app/tools/error-propagation/config';
import { uncertaintyMeasurementFormula } from '@/app/tools/uncertainty-measurement/config';
import { absoluteRelativeErrorsFormula } from '@/app/tools/absolute-relative-errors/config';
import { compatibilityEvaluationFormula } from '@/app/tools/compatibility-evaluation/config';


export const formulas: Formula[] = [
    compatibilityEvaluationFormula,
    absoluteRelativeErrorsFormula,
    uncertaintyMeasurementFormula,
    errorPropagationFormula,
    curveFitFormula,
    densityMeasurementFormula,
    secondKindLeverFormula,
    pendulumFormula,
    freeFallFormula,
    archimedesFormula,
    hookesLawFormula,
    uniformMotionFormula,
    acceleratedMotionFormula,
    ohmsLawFormula,
    resistorsFormula,
    kirchhoffsCurrentLawFormula,
    snellsLawFormula,
    youngsDoubleSlitFormula,
    diffractionGratingFormula,
    mechanicalEnergyFormula,
    momentumConservationFormula,
    newtonsSecondLawFormula,
    earthMagneticFieldFormula,
];

export const CATEGORIES: FormulaCategory[] = [
    "Esperienze introduttive",
    "Statica",
    "Cinematica",
    "Dinamica",
    "Fluidi",
    "Calorimetria",
    "Termodinamica",
    "Ottica",
    "Elettricità",
    "Magnetismo",
    "Fisica Moderna",
    "Strumenti"
  ];
