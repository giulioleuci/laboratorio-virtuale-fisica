
"use client";

import { useSettings } from "@/contexts/settings-context";
import { useEffect } from "react";

function parseHsl(hsl: string): [number, number, number] | null {
    const match = hsl.match(/(\d+)\s*(\d+)%\s*(\d+)%/);
    if (!match) return null;
    return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { settings } = useSettings();

    useEffect(() => {
        const root = document.documentElement;
        const primaryColorHsl = parseHsl(settings.primaryColor);

        if (primaryColorHsl) {
            const [h, s, l] = primaryColorHsl;
            
            // Set Primary color
            root.style.setProperty('--primary-hsl', `${h} ${s}% ${l}%`);
            root.style.setProperty('--primary-foreground-hsl', `${h} ${s}% ${Math.max(10, l - 40)}%`);

            // Derive and set adaptive dark theme colors
            const backgroundL = Math.max(5, Math.min(17, l / 5));
            const cardL = Math.max(8, Math.min(13, l / 4));
            const borderL = Math.max(12, Math.min(22, l / 3));
            const mutedL = borderL;
            const mutedFgL = Math.min(98, backgroundL + 48);

            root.style.setProperty('--background-hsl', `${h} ${Math.round(s*0.2)}% ${backgroundL}%`);
            root.style.setProperty('--foreground-hsl', `210 40% 98%`);
            
            root.style.setProperty('--card-hsl', `${h} ${Math.round(s*0.25)}% ${cardL}%`);
            root.style.setProperty('--card-foreground-hsl', `210 40% 98%`);

            root.style.setProperty('--popover-hsl', `${h} ${Math.round(s*0.25)}% ${cardL}%`);
            root.style.setProperty('--popover-foreground-hsl', `210 40% 98%`);

            root.style.setProperty('--secondary-hsl', `${h} ${Math.round(s*0.3)}% ${borderL}%`);
            root.style.setProperty('--secondary-foreground-hsl', `210 40% 98%`);

            root.style.setProperty('--muted-hsl', `${h} ${Math.round(s*0.3)}% ${mutedL}%`);
            root.style.setProperty('--muted-foreground-hsl', `${h} ${Math.round(s*0.15)}% ${mutedFgL}%`);

            root.style.setProperty('--accent-hsl', `${h} ${Math.round(s*0.3)}% ${borderL}%`);
            root.style.setProperty('--accent-foreground-hsl', `210 40% 98%`);

            root.style.setProperty('--border-hsl', `${h} ${Math.round(s*0.25)}% ${borderL}%`);
            root.style.setProperty('--input-hsl', `${h} ${Math.round(s*0.25)}% ${borderL}%`);
            root.style.setProperty('--ring-hsl', `${h} ${s}% ${l}%`);

        }
    }, [settings.primaryColor]);

    return <>{children}</>;
}
