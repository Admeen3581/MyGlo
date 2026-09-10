import React, { useContext } from 'react';
import {
  View,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
  StyleProp,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import { Image } from 'expo-image';
import { images } from '@/constants/images';
import { ThemeContext } from '@/context/ThemeContext';

export type LogoType = 'standard' | 'icon' | 'subtext';
export type LogoColor = 'auto' | 'light' | 'dark' | 'black' | 'white';
export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
export type LogoAlign = 'left' | 'center' | 'right' | 'none';

export interface LogoProps {
  /** Variant style of the logo: standard (default), icon, or subtext */
  type?: LogoType;
  /** Color theme variant: auto (defaults to light/dark based on theme), light, dark, black, or white */
  color?: LogoColor;
  /** Size preset ('sm' | 'md' | 'lg' | 'xl') or exact height number */
  size?: LogoSize;
  /** Explicit custom width (overrides size preset width) */
  width?: number;
  /** Explicit custom height (overrides size preset height) */
  height?: number;
  /** Container alignment: 'left', 'center', 'right', or 'none' */
  align?: LogoAlign;
  /** Boolean override for dark mode (useful when parent controls dark state) */
  isDarkMode?: boolean;
  /** Optional press handler if logo should be interactive */
  onPress?: () => void;
  /** Additional container styling via NativeWind */
  className?: string;
  /** Style override for the container View */
  style?: StyleProp<ViewStyle>;
  /** Style override for the Image */
  imageStyle?: StyleProp<ImageStyle>;
  /** Accessibility label */
  accessibilityLabel?: string;
}

// Aspect ratios from original SVGs (width / height)
const ASPECT_RATIOS: Record<LogoType, number> = {
  standard: 410 / 140, // ~2.93
  icon: 160 / 140,     // ~1.14
  subtext: 450 / 140,  // ~3.21
};

// Preset heights for each size category across screen breakpoints
// Mobile (< 768px) keeps original baseline sizes
// Tablet (768px - 1023px) and Desktop (>= 1024px) scale presets inherently larger
const PRESET_HEIGHTS_BY_BREAKPOINT: Record<
  'mobile' | 'tablet' | 'desktop',
  Record<Extract<LogoSize, string>, number>
> = {
  mobile: {
    xs: 24,//should only be used for the icon
    sm: 32,
    md: 48,
    lg: 72,
    xl: 108,
  },
  tablet: {
    xs: 30,//should only be used for the icon
    sm: 40,
    md: 60,
    lg: 90,
    xl: 135,
  },
  desktop: {
    xs: 36,//should only be used for the icon
    sm: 48,
    md: 72,
    lg: 108,
    xl: 196,
  },
};

/**
 * Returns the height preset map based on current window width
 */
const getPresetHeights = (screenWidth: number): Record<Extract<LogoSize, string>, number> => {
  if (screenWidth >= 1024) {
    return PRESET_HEIGHTS_BY_BREAKPOINT.desktop;
  }
  if (screenWidth >= 768) {
    return PRESET_HEIGHTS_BY_BREAKPOINT.tablet;
  }
  return PRESET_HEIGHTS_BY_BREAKPOINT.mobile;
};

export const MyGloLogo: React.FC<LogoProps> = ({
  type = 'standard',
  color = 'auto',
  size = 'md',
  width: customWidth,
  height: customHeight,
  align = 'none',
  isDarkMode,
  onPress,
  className = '',
  style,
  imageStyle,
  accessibilityLabel = 'MyGlo Logo',
}) => {
  const systemColorScheme = useColorScheme();
  const { width: windowWidth } = useWindowDimensions();
  const context = useContext(ThemeContext);
  
  // Resolve dark mode state: explicit prop > ThemeContext > system preference
  const activeDarkMode = isDarkMode !== undefined 
    ? isDarkMode 
    : (context?.isDarkMode !== undefined ? context.isDarkMode : systemColorScheme === 'dark');

  // Resolve target color: auto -> light/dark, or explicit color selection
  let resolvedColor: 'light' | 'dark' | 'black' | 'white';
  if (color === 'auto') {
    resolvedColor = activeDarkMode ? 'dark' : 'light';
  } else {
    resolvedColor = color;
  }

  // Calculate dimensions based on type and size configuration
  const ratio = ASPECT_RATIOS[type];
  let calculatedHeight: number;
  let calculatedWidth: number;

  if (customHeight && customWidth) {
    calculatedHeight = customHeight;
    calculatedWidth = customWidth;
  } else if (customHeight) {
    calculatedHeight = customHeight;
    calculatedWidth = customHeight * ratio;
  } else if (customWidth) {
    calculatedWidth = customWidth;
    calculatedHeight = customWidth / ratio;
  } else if (typeof size === 'number') {
    calculatedHeight = size;
    calculatedWidth = size * ratio;
  } else {
    const presetHeights = getPresetHeights(windowWidth);
    calculatedHeight = presetHeights[size] || presetHeights.md;
    calculatedWidth = calculatedHeight * ratio;
  }

  // Determine alignment styling
  const alignClasses: Record<LogoAlign, string> = {
    left: 'self-start',
    center: 'self-center',
    right: 'self-end',
    none: '',
  };

  const containerClassName = `${alignClasses[align]} ${className}`.trim();
  const source = images.logos[resolvedColor][type];

  const content = (
    <Image
      source={source}
      style={[{ width: calculatedWidth, height: calculatedHeight }, imageStyle]}
      contentFit="contain"
      accessibilityLabel={accessibilityLabel}
    />
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        className={containerClassName}
        style={style}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View className={containerClassName} style={style}>
      {content}
    </View>
  );
};

export default MyGloLogo;
