
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

export function hexToHsl(hex: string): string | null {
  if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)) {
    return null;
  }

  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  const h_deg = Math.round(h * 360);
  const s_pct = Math.round(s * 100);
  const l_pct = Math.round(l * 100);

  return `${h_deg} ${s_pct}% ${l_pct}%`;
}


export function hslToHex(hsl: string): string {
    const hslMatch = hsl.match(/(\d+)\s*(\d+)%\s*(\d+)%/);
    if (!hslMatch) return '#000000';
    
    const [h, s, l] = hslMatch.slice(1).map(Number);
    
    const s_norm = s / 100;
    const l_norm = l / 100;
    
    const c = (1 - Math.abs(2 * l_norm - 1)) * s_norm;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l_norm - c / 2;
    let r = 0, g = 0, b = 0;
    
    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }
    
    const toHex = (c: number) => {
        const hex = Math.round((c + m) * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
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
