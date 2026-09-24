import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

export interface FabHoldMenuModalProps {
  isVisible: boolean;
  onClose: () => void;
  onNewList: () => void;
  onNewItem: () => void;
  isDarkMode?: boolean;
}

export const FabHoldMenuModal: React.FC<FabHoldMenuModalProps> = ({
  isVisible,
  onClose,
  onNewList,
  onNewItem,
  isDarkMode: customDarkMode,
}) => {
  const { isDarkMode, activeColors } = useTheme(customDarkMode);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  // Position popup directly above the floating action button (FAB) at bottom-right
  const bottomInset = isDesktop ? 24 : Math.max(insets.bottom + 40, 75);
  const menuBottom = bottomInset + 68; // 12px spacing above the 56px FAB button

  const handleNewListPress = () => {
    onClose();
    onNewList();
  };

  const handleNewItemPress = () => {
    onClose();
    onNewItem();
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[
            styles.menuCard,
            {
              bottom: menuBottom,
              backgroundColor: activeColors.card,
              borderColor: activeColors.border,
              boxShadow: isDarkMode
                ? '0px 12px 28px rgba(2, 8, 17, 0.55)'
                : '0px 12px 28px rgba(1, 55, 125, 0.18)',
            },
          ]}
          onPress={(e) => e.stopPropagation()}
          className="w-52 rounded-2xl p-2 border absolute"
        >
          {/* New List Option */}
          <TouchableOpacity
            onPress={handleNewListPress}
            activeOpacity={0.7}
            className="flex-row items-center py-3 px-3 rounded-xl active:opacity-70"
          >
            <Ionicons
              name="library-outline"
              size={22}
              color={activeColors.primary}
            />
            <Text
              style={{ color: activeColors.cardForeground }}
              className="text-base font-nunito-bold ml-3"
            >
              New List
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View
            style={{ backgroundColor: activeColors.border }}
            className="h-[1px] my-1 mx-2"
          />

          {/* New Item Option */}
          <TouchableOpacity
            onPress={handleNewItemPress}
            activeOpacity={0.7}
            className="flex-row items-center py-3 px-3 rounded-xl active:opacity-70"
          >
            <Ionicons
              name="gift-outline"
              size={22}
              color={activeColors.primary}
            />
            <Text
              style={{ color: activeColors.cardForeground }}
              className="text-base font-nunito-bold ml-3"
            >
              New Item
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  menuCard: {
    right: 20,
    elevation: 8,
  },
});

export default FabHoldMenuModal;
