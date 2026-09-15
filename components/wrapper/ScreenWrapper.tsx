import React from 'react';
import { View, ViewProps, useWindowDimensions } from 'react-native';

export type ScreenWrapperVariant = 'default' | 'auth' | 'full';

export interface ScreenWrapperProps extends ViewProps {
  children: React.ReactNode;
  variant?: ScreenWrapperVariant;
  className?: string;
}

/**
 * ScreenWrapper
 * A single unified component that wraps screens and dynamically manages layout sizing,
 * providing maximum expansive room for screen content while keeping mobile screens (< 640px) 100% untouched.
 */
export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  variant = 'default',
  className = '',
  style,
  ...props
}) => {
  const { width } = useWindowDimensions();

  const getDynamicStyles = () => {
    if (width < 640) {
      // Mobile screen size: no extra desktop margins/padding (100% untouched)
      return {};
    }

    if (variant === 'auth') {
      // Zero outer padding override on desktop to allow max width room
      return {
        paddingHorizontal: 0,
        paddingVertical: 0,
      };
    }

    // Minimal dynamic desktop padding for standard pages
    const desktopHorizontalPadding = Math.min(Math.max(8, Math.floor(width * 0.01)), 16);
    const desktopVerticalPadding = Math.min(Math.max(4, Math.floor(width * 0.005)), 12);

    return {
      paddingHorizontal: desktopHorizontalPadding,
      paddingVertical: desktopVerticalPadding,
    };
  };

  const getVariantClasses = (): string => {
    switch (variant) {
      case 'auth':
        // Auth & Onboarding screens: expansive 768px (3xl) desktop container for maximum card room
        return 'w-full max-w-3xl self-center mx-auto my-auto';
      case 'full':
        return 'w-full max-w-full self-center mx-auto';
      case 'default':
      default:
        // Standard screens: widescreen container (1400px / 7xl) for maximum content room
        return 'w-full max-w-7xl self-center mx-auto';
    }
  };

  return (
    <View
      style={[getDynamicStyles(), style]}
      className={`${getVariantClasses()} ${className}`.trim()}
      {...props}
    >
      {children}
    </View>
  );
};

export default ScreenWrapper;
