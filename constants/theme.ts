export const blobShapes = {
  blob1: { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
  blob2: { borderRadius: '40% 60% 70% 30% / 50% 60% 30% 50%' },
  blob3: { borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' },
  organicImage: { borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' },
  cardAsymmetric1: { borderTopLeftRadius: 64, borderTopRightRadius: 32, borderBottomRightRadius: 32, borderBottomLeftRadius: 32 },
  cardAsymmetric2: { borderTopLeftRadius: 32, borderTopRightRadius: 80, borderBottomRightRadius: 32, borderBottomLeftRadius: 32 },
  cardAsymmetric3: { borderTopLeftRadius: 32, borderTopRightRadius: 32, borderBottomRightRadius: 64, borderBottomLeftRadius: 32 },
  cardAsymmetric4: { borderTopLeftRadius: 32, borderTopRightRadius: 32, borderBottomRightRadius: 32, borderBottomLeftRadius: 64 },
} as const;

export const shadows = {
  soft: {
    shadowColor: '#01377D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  glow: {
    shadowColor: '#005F73',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  full: 9999,
} as const;
