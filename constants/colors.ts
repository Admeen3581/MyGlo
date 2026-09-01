export const LightColors = {
  background: '#F7F7F6', // Bleached Driftwood
  foreground: '#222D35', // Abyssal Stone
  primary: '#005F73', // Deep Indigo Seaweed
  primaryForeground: '#EDF2F4', // Salt Spray
  secondary: '#84D2BD', // Algae Bloom
  secondaryForeground: '#212930', // Abyss
  accent: '#207D85', // Weathered Teal
  accentForeground: '#FFFFFF', // Pure White
  muted: '#EAEBE7', // Smooth Slate
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
  mossGreen: '#5D7052', // Moss Green
} as const;

export const DarkColors = {
  background: '#0E151A', // Abyssal Trench
  foreground: '#E8EEF0', // Glacial Sea Spray
  primary: '#20A4B5', // Bioluminescent Teal
  primaryForeground: '#07191D', // Deep Trench
  secondary: '#274A4B', // Sunken Verdigris
  secondaryForeground: '#A3E7D5', // Shallow Foam
  accent: '#183642', // Oceanic Shadow
  accentForeground: '#38BDC7', // Phosphor Lagoon
  muted: '#16222A', // Deep Reef Resin
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
  mossGreen: '#41C47A',
} as const;

export const colors = {
  light: LightColors,
  dark: DarkColors,
};

export type ThemeColors = typeof LightColors;
