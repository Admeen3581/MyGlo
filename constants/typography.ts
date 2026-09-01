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

export type FontFamily = typeof fontFamilies;
