"use client";

/**
 * Reads a CSS custom property so 3D scenes automatically pick up the
 * client theme from globals.css — re-skin once, everything follows.
 */
export function getCssColor(variable: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
  return value || fallback;
}

export const themeColors = {
  accent: () => getCssColor("--accent", "#ff4d00"),
  foreground: () => getCssColor("--foreground", "#e9e7e2"),
  background: () => getCssColor("--background", "#0a0a0b"),
};
