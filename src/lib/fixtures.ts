
import type { Formula, MeasurementRow, ModeState } from "./types";
import { pendulumFixtures } from "@/app/experiments/pendulum/fixtures";
import { freeFallFixtures } from "@/app/experiments/free-fall/fixtures";
import { archimedesFixtures } from "@/app/experiments/archimedes/fixtures";
import { hookesLawFixtures } from "@/app/experiments/hookes-law/fixtures";
import { uniformMotionFixtures } from "@/app/experiments/uniform-motion/fixtures";
import { acceleratedMotionFixtures } from "@/app/experiments/accelerated-motion/fixtures";
import { ohmsLawFixtures } from "@/app/experiments/ohms-law/fixtures";
import { resistorsFixtures } from "@/app/experiments/resistors/fixtures";
import { snellsLawFixtures } from "@/app/experiments/snells-law/fixtures";
import { mechanicalEnergyFixtures } from "@/app/experiments/mechanical-energy/fixtures";
import { momentumConservationFixtures } from "@/app/experiments/momentum-conservation/fixtures";
import { newtonsSecondLawFixtures } from "@/app/experiments/newtons-second-law/fixtures";
import { kirchhoffsCurrentLawFixtures } from "@/app/experiments/kirchhoffs-current-law/fixtures";
import { secondKindLeverFixtures } from "@/app/experiments/second-kind-lever/fixtures";
import { densityMeasurementFixtures } from "@/app/experiments/density-measurement/fixtures";
import { earthMagneticFieldFixtures } from "@/app/experiments/earth-magnetic-field/fixtures";
import { youngsDoubleSlitFixtures } from "@/app/experiments/youngs-double-slit/fixtures";
import { diffractionGratingFixtures } from "@/app/experiments/diffraction-grating/fixtures";
import { curveFitFixtures } from "@/app/tools/curve-fit/fixtures";

const allFixtures: { [key: string]: MeasurementRow[] } = {
    ...pendulumFixtures,
    ...freeFallFixtures,
    ...archimedesFixtures,
    ...hookesLawFixtures,
    ...uniformMotionFixtures,
    ...acceleratedMotionFixtures,
    ...ohmsLawFixtures,
    ...resistorsFixtures,
    ...snellsLawFixtures,
    ...mechanicalEnergyFixtures,
    ...momentumConservationFixtures,
    ...newtonsSecondLawFixtures,
    ...kirchhoffsCurrentLawFixtures,
    ...secondKindLeverFixtures,
    ...densityMeasurementFixtures,
    ...earthMagneticFieldFixtures,
    ...youngsDoubleSlitFixtures,
    ...diffractionGratingFixtures,
    ...curveFitFixtures,
};

export function getSampleData(formula: Formula, modes: ModeState): MeasurementRow[] | undefined {
    let effectiveModes = { ...modes };

    // Set default modes for formulas that might not have all modes defined initially
    formula.uiOptions?.switches?.forEach(s => {
        if (!effectiveModes[s.id]) {
            effectiveModes[s.id] = s.defaultValue;
        }
    });
    
    if (formula.uiOptions?.getInitialModes) {
        effectiveModes = formula.uiOptions.getInitialModes(effectiveModes);
    }

    const baseFixtureKey = formula.uiOptions?.getFixtureKey?.(effectiveModes) ?? formula.id;
    
    // Cerca gruppi di fixture multipli (con suffisso -1, -2, -3)
    const availableGroups: string[] = [];
    for (let i = 1; i <= 3; i++) {
        const groupKey = `${baseFixtureKey}-${i}`;
        if (allFixtures[groupKey]) {
            availableGroups.push(groupKey);
        }
    }
    
    // Se ci sono gruppi multipli, scegline uno casualmente
    if (availableGroups.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableGroups.length);
        return allFixtures[availableGroups[randomIndex]];
    }
    
    // Altrimenti usa la chiave base (compatibilità con il vecchio formato)
    return allFixtures[baseFixtureKey];
}
