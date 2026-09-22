/**
 * THIS IS THE FINAL STYLE GUIDE. ANY STYLES NOT PRESENT IN HERE SHOULD NOT BE USED
 * WITHOUT EXTREME EXCEPTIONS.
 * @author Adam Long
 */

export const LightColors = {
  background: '#F7F7F6', // Bleached Driftwood
  foreground: '#222D35', // Abyssal Stone
  card: '#FFFFFF', // Pure White
  cardForeground: '#222D35', // Abyssal Stone
  primary: '#005F73', // Deep Indigo Seaweed
  primaryForeground: '#EDF2F4', // Salt Spray
  secondary: '#84D2BD', // Algae Bloom
  secondaryForeground: '#212930', // Abyss
  accent: '#207D85', // Weathered Teal
  accentForeground: '#FFFFFF', // Pure White
  muted: '#EFF0EC', // Smooth Slate
  mutedForeground: '#5C6B71', // Dusty Ocean Gray
  border: '#C7D1CF', // Pebble Gray
  destructive: '#C43D2F', // Crimson Clay
  destructiveForeground: '#FFFFFF', // Pure White
  success: '#38B26C', // Tidal Kelp
  successForeground: '#FFFFFF', // Pure White
  warning: '#E88B1A', // Sun-Baked Ochre
  warningForeground: '#FFFFFF', // Pure White
  overlay: '#102129', // Translucent Deep Ocean
  shadowTint: '#01377D', // Dark Azure

  // Badge Specific Variant Tokens
  badgePrimaryBg: 'rgba(0, 95, 115, 0.10)',
  badgePrimaryBorder: 'rgba(0, 95, 115, 0.20)',
  badgeSecondaryBg: 'rgba(132, 210, 189, 0.20)',
  badgeSecondaryBorder: 'rgba(132, 210, 189, 0.40)',
  badgeSuccessBg: 'rgba(56, 178, 108, 0.15)',
  badgeSuccessBorder: 'rgba(56, 178, 108, 0.30)',
  badgeWarningBg: 'rgba(232, 139, 26, 0.15)',
  badgeWarningBorder: 'rgba(232, 139, 26, 0.30)',
  badgeDestructiveBg: 'rgba(196, 61, 47, 0.15)',
  badgeDestructiveBorder: 'rgba(196, 61, 47, 0.30)',
} as const;

export const DarkColors = {
  background: '#0E151A', // Abyssal Trench
  foreground: '#E8EEF0', // Glacial Sea Spray
  card: '#141F27', // Sunken Abyssal Slate
  cardForeground: '#E8EEF0', // Glacial Sea Spray
  primary: '#20A4B5', // Bioluminescent Teal
  primaryForeground: '#07191D', // Deep Trench
  secondary: '#274A4B', // Sunken Verdigris
  secondaryForeground: '#A3E7D5', // Shallow Foam
  accent: '#183642', // Oceanic Shadow
  accentForeground: '#38BDC7', // Phosphor Lagoon
  muted: '#19252D', // Deep Reef Resin
  mutedForeground: '#8698A0', // Coastal Fog
  border: '#24343E', // Submerged Basalt
  destructive: '#E05343', // Bioluminescent Coral
  destructiveForeground: '#FFFFFF', // Pure White
  success: '#41C47A', // Phosphor Kelp
  successForeground: '#062111', // Abyssal Moss
  warning: '#F09A24', // Amber Flare
  warningForeground: '#201202', // Dark Umber
  overlay: '#070B0E', // Abyssal Veil
  shadowTint: '#020811', // Pitch Deep Navy

  // Badge Specific Variant Tokens
  badgePrimaryBg: 'rgba(32, 164, 181, 0.15)',
  badgePrimaryBorder: 'rgba(32, 164, 181, 0.30)',
  badgeSecondaryBg: 'rgba(39, 74, 75, 0.40)',
  badgeSecondaryBorder: 'rgba(163, 231, 213, 0.30)',
  badgeSuccessBg: 'rgba(65, 196, 122, 0.15)',
  badgeSuccessBorder: 'rgba(65, 196, 122, 0.30)',
  badgeWarningBg: 'rgba(240, 154, 36, 0.15)',
  badgeWarningBorder: 'rgba(240, 154, 36, 0.30)',
  badgeDestructiveBg: 'rgba(224, 83, 67, 0.15)',
  badgeDestructiveBorder: 'rgba(224, 83, 67, 0.30)',
} as const;

export const colors = {
  light: LightColors,
  dark: DarkColors,
};

export type ThemeColors = Record<keyof typeof LightColors, string>;
