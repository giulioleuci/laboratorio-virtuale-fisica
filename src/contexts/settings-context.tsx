
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { FormulaCategory } from '@/lib/types';
import { CATEGORIES } from '@/lib/formulas';

type PrecisionMode = "auto" | "fixed";

interface Settings {
  precisionMode: PrecisionMode;
  fixedDigits: number;
  primaryColor: string;
  categoryColors: Record<FormulaCategory, string>;
}

interface SettingsContextType {
  settings: Settings;
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  setCategoryColor: (category: FormulaCategory, color: string) => void;
  isLoaded: boolean;
}

const defaultCategoryColors: Record<FormulaCategory, string> = {
  "Strumenti": "270 60% 60%",       // A nice, welcoming violet
  "Esperienze introduttive": "210 70% 55%", // Blue
  "Statica": "120 40% 45%",       // Green
  "Cinematica": "30 80% 55%",     // Orange
  "Dinamica": "0 70% 50%",        // Red
  "Fluidi": "190 60% 50%",       // Cyan
  "Calorimetria": "350 70% 60%",  // Pink
  "Termodinamica": "50 75% 55%",    // Yellow
  "Ottica": "260 70% 65%",       // Purple
  "Elettricità": "220 80% 60%",  // Indigo
  "Magnetismo": "320 60% 60%",   // Magenta
  "Fisica Moderna": "240 50% 65%", // Violet
};

const defaultSettings: Settings = {
  precisionMode: 'fixed',
  fixedDigits: 3,
  primaryColor: '210 70% 55%', // A nice, welcoming blue
  categoryColors: defaultCategoryColors,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on the client side after mount
  useEffect(() => {
    // Set loading immediately to show skeleton faster
    const loadSettings = async () => {
      try {
        const item = window.localStorage.getItem('app-settings');
        if (item) {
          const savedSettings = JSON.parse(item);
          const mergedSettings = {
            ...defaultSettings,
            ...savedSettings,
            categoryColors: {
              ...defaultCategoryColors,
              ...(savedSettings.categoryColors || {}),
            }
          };
          setSettings(mergedSettings);
        }
      } catch (error) {
        console.error("Failed to parse settings from localStorage", error);
        setSettings(defaultSettings);
      } finally {
        setIsLoaded(true);
      }
    };
    
    // Use setTimeout to make loading async and show skeleton immediately
    setTimeout(loadSettings, 0);
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        window.localStorage.setItem('app-settings', JSON.stringify(settings));
      } catch (error) {
        console.error("Failed to save settings to localStorage", error);
      }
    }
  }, [settings, isLoaded]);
  
  const setSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const setCategoryColor = (category: FormulaCategory, color: string) => {
    setSettings(prev => ({
      ...prev,
      categoryColors: {
        ...prev.categoryColors,
        [category]: color,
      }
    }))
  }

  return (
    <SettingsContext.Provider value={{ settings, setSetting, setCategoryColor, isLoaded }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
