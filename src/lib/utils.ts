
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
// Lucide React icons
import { 
  Beaker, Atom, Scale, Wind, Thermometer, Waves,
  BookOpen, Droplets, Unplug, Magnet, Timer, ArrowDown,
  Eye, Compass, Calculator, Target, Orbit, Activity,
  TrendingUp, Zap, Lightbulb, Network, Layers, Grid3x3,
  Gauge, FlaskConical, Move3d
} from 'lucide-react';

// React Icons (Font Awesome, Material Design, etc.)
import { 
  FaFlask, FaWeight, FaClock, FaArrowDown, FaRunning,
  FaTachometerAlt, FaCalculator, FaBullseye, FaAtom,
  FaWater, FaBolt, FaLightbulb, FaProjectDiagram,
  FaEye, FaLayerGroup, FaCompass, FaBalanceScale
} from 'react-icons/fa';

// Tabler Icons
import { 
  IconFlask, IconScale, IconClock, IconArrowDown, IconActivity,
  IconGauge, IconCalculator, IconTarget, IconAtom, IconDroplet,
  IconBolt, IconBulb, IconNetwork, IconEye, IconCompass
} from '@tabler/icons-react';

// Additional icons from working libraries only
import type { FormulaCategory } from "./types";
import React from "react";
import { hexToHsl as hexToHslUtil, hslToHex as hslToHexUtil, stripHtml as stripHtmlUtil } from "./color-utils";

export { hexToHslUtil as hexToHsl, hslToHexUtil as hslToHex, stripHtmlUtil as stripHtml };

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const categoryIcons: Record<FormulaCategory, React.ElementType> = {
  "Strumenti": Calculator,
  "Esperienze introduttive": BookOpen,
  "Statica": Scale,
  "Cinematica": Gauge,
  "Dinamica": Orbit,
  "Fluidi": Droplets,
  "Calorimetria": Thermometer,
  "Termodinamica": Wind,
  "Ottica": Waves,
  "Elettricità": Unplug,
  "Magnetismo": Magnet,
  "Fisica Moderna": Atom,
};

// All icons will be rendered with consistent 24x24 dimensions via CSS classes

export const formulaIcons: Record<string, React.ElementType> = {
  // Strumenti
  'curve-fit': TrendingUp,
  'error-propagation': FaCalculator,

  // Statica - Using different libraries for variety
  'density-measurement': FaFlask,           // Font Awesome
  'second-kind-lever': FaBalanceScale,     // Font Awesome
  
  // Cinematica - Mix of libraries
  'pendulum': IconClock,                   // Tabler
  'free-fall': IconArrowDown,              // Tabler
  'uniform-motion': FaRunning,             // Font Awesome
  'accelerated-motion': IconGauge,         // Tabler
  
  // Dinamica - Physics-focused icons
  'mechanical-energy': Orbit,              // Lucide
  'momentum-conservation': FaBullseye,     // Font Awesome
  'newtons-second-law': IconCalculator,    // Tabler
  
  // Fluidi
  'archimedes': IconDroplet,               // Tabler
  
  // Statica (Meccanica)
  'hookes-law': Move3d,                    // Lucide
  
  // Elettricità - Electric/electronic icons
  'ohms-law': IconBolt,                    // Tabler
  'resistors': IconBulb,                   // Tabler
  'kirchhoffs-current-law': FaProjectDiagram, // Font Awesome
  
  // Ottica - Vision/light related
  'snells-law': IconEye,                   // Tabler
  'youngs-double-slit': FaLayerGroup,      // Font Awesome
  'diffraction-grating': Grid3x3,         // Lucide
  
  // Magnetismo
  'earth-magnetic-field': IconCompass,     // Tabler
};

export function getCategoryIcon(category: FormulaCategory) {
  return categoryIcons[category] || Beaker;
}

export function getFormulaIcon(formulaId: string) {
  return formulaIcons[formulaId] || Beaker;
}

const formatForFilename = (str: string) => {
    return str
        .toUpperCase()
        .replace(/\s+/g, '_') // Replace spaces with _
        .replace(/[^\w-]/g, ''); // Remove all non-word chars except dash
};

export const generateDownloadFilename = (prefix: string, name: string) => {
    const now = new Date();
    const timestamp = now.getFullYear().toString() +
        (now.getMonth() + 1).toString().padStart(2, '0') +
        now.getDate().toString().padStart(2, '0') +
        '_' +
        now.getHours().toString().padStart(2, '0') +
        now.getMinutes().toString().padStart(2, '0') +
        now.getSeconds().toString().padStart(2, '0');
    
    return `${prefix}_${formatForFilename(name)}_${timestamp}`;
};

