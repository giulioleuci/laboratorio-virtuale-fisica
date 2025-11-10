
import type { MeasurementRow } from "@/lib/types";

export const curveFitFixtures: { [key: string]: MeasurementRow[] } = {
    'curve-fit': [
        { id: 1, x: 1, y: 2.1, sigma_y: 0.1 },
        { id: 2, x: 2, y: 3.9, sigma_y: 0.1 },
        { id: 3, x: 3, y: 6.2, sigma_y: 0.1 },
        { id: 4, x: 4, y: 8.1, sigma_y: 0.1 },
        { id: 5, x: 5, y: 10.0, sigma_y: 0.1 },
    ]
};
