import React from 'react';
import { TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

export interface FloatingActionButtonProps {
  onPress?: () => void;
  onLongPress?: () => void;
  isDarkMode?: boolean;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  onLongPress,
  isDarkMode: customDarkMode,
}) => {
  const { isDarkMode, activeColors } = useTheme(customDarkMode);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  // On desktop, position near bottom of page (24px). On mobile, sit just above bottom nav bar / safe area.
  const bottomInset = isDesktop ? 24 : Math.max(insets.bottom + 40, 75);

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={250}
      activeOpacity={0.85}
      style={[
        styles.fab,
        {
          bottom: bottomInset,
          backgroundColor: activeColors.primary,
          boxShadow: isDarkMode
            ? '0px 6px 18px rgba(0, 0, 0, 0.5)'
            : '0px 6px 18px rgba(0, 95, 115, 0.35)',
        },
      ]}
      className="w-14 h-14 rounded-full items-center justify-center"
    >
      <Ionicons name="add" size={30} color={activeColors.primaryForeground} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    zIndex: 50,
    elevation: 6,
  },
});

export default FloatingActionButton;
