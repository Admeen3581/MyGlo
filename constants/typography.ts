export const fontFamilies = {
  serif: {
    regular: 'Fraunces-Regular',
    medium: 'Fraunces-Medium',
    semibold: 'Fraunces-SemiBold',
    bold: 'Fraunces-Bold',
    black: 'Fraunces-Black',
  },
  sans: {
    regular: 'Nunito-Regular',
    medium: 'Nunito-Medium',
    semibold: 'Nunito-SemiBold',
    bold: 'Nunito-Bold',
    extrabold: 'Nunito-ExtraBold',
  },
  quicksand: {
    regular: 'Quicksand-Regular',
    medium: 'Quicksand-Medium',
    semibold: 'Quicksand-SemiBold',
    bold: 'Quicksand-Bold',
  },
} as const;

export const fontSizeScale = {
  xs: { fontSize: 12, lineHeight: 16 },
  sm: { fontSize: 14, lineHeight: 20 },
  base: { fontSize: 16, lineHeight: 24 },
  lg: { fontSize: 18, lineHeight: 28 },
  xl: { fontSize: 20, lineHeight: 28 },
  '2xl': { fontSize: 24, lineHeight: 32 },
  '3xl': { fontSize: 30, lineHeight: 36 },
  '4xl': { fontSize: 36, lineHeight: 40 },
  '5xl': { fontSize: 48, lineHeight: 52 },
  '6xl': { fontSize: 60, lineHeight: 64 },
} as const;

/**
 * Typography Presets matching global.css utility classes
 * Can be used with React Native StyleSheet or inline styles when NativeWind is not applicable.
 */
export const typographyPresets = {
  titleDisplay: {
    fontFamily: fontFamilies.serif.black,
    fontSize: 36,
    lineHeight: 44,
    color: '#222D35',
  },
  titlePrimary: {
    fontFamily: fontFamilies.serif.bold,
    fontSize: 28,
    lineHeight: 34,
    color: '#222D35',
  },
  titleSecondary: {
    fontFamily: fontFamilies.serif.semibold,
    fontSize: 22,
    lineHeight: 28,
    color: '#005F73',
  },
  titleTertiary: {
    fontFamily: fontFamilies.serif.medium,
    fontSize: 18,
    lineHeight: 24,
    color: '#222D35',
  },
  subheadingPrimary: {
    fontFamily: fontFamilies.sans.semibold,
    fontSize: 16,
    lineHeight: 24,
    color: '#5C6B71',
  },
  subheadingSecondary: {
    fontFamily: fontFamilies.sans.medium,
    fontSize: 14,
    lineHeight: 20,
    color: '#5C6B71',
  },
  bodyLg: {
    fontFamily: fontFamilies.sans.regular,
    fontSize: 18,
    lineHeight: 28,
    color: '#222D35',
  },
  bodyBase: {
    fontFamily: fontFamilies.sans.regular,
    fontSize: 16,
    lineHeight: 24,
    color: '#222D35',
  },
  bodySm: {
    fontFamily: fontFamilies.sans.regular,
    fontSize: 14,
    lineHeight: 20,
    color: '#5C6B71',
  },
  metadata: {
    fontFamily: fontFamilies.quicksand.semibold,
    fontSize: 12,
    lineHeight: 16,
    color: '#5C6B71',
  },
  metadataOverline: {
    fontFamily: fontFamilies.quicksand.bold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
    color: '#5C6B71',
  },
  titleAccent: {
    fontFamily: fontFamilies.quicksand.bold,
    fontSize: 18,
    lineHeight: 24,
    color: '#207D85',
  },
  footnote: {
    fontFamily: fontFamilies.quicksand.medium,
    fontSize: 11,
    lineHeight: 14,
    color: '#5C6B71',
  },
} as const;

export type FontFamily = typeof fontFamilies;
export type TypographyPreset = keyof typeof typographyPresets;
