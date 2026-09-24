import React from 'react';
import { View, Text, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { ModalWrapper } from '@/components/wrapper/ModalWrapper';
import { Button } from '@/components/core/Button';

export interface ConfirmModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  loading?: boolean;
  isDarkMode?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = true,
  loading = false,
  isDarkMode: customDarkMode,
  icon = 'trash-outline',
}) => {
  const { isDarkMode, activeColors } = useTheme(customDarkMode);

  return (
    <ModalWrapper visible={isVisible} onClose={onClose} isDarkMode={isDarkMode}>
      <Pressable
        style={[
          styles.modalCard,
          {
            backgroundColor: activeColors.card,
            borderColor: activeColors.border,
          },
        ]}
        onPress={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-3xl md:rounded-3xl pt-7 pb-6 px-6 border shadow-2xl overflow-hidden"
      >
        {/* Header with Icon */}
        <View className="flex-row items-center mb-4">
          <View
            style={{
              backgroundColor: isDestructive
                ? isDarkMode
                  ? 'rgba(239, 68, 68, 0.15)'
                  : 'rgba(239, 68, 68, 0.1)'
                : activeColors.muted,
            }}
            className="w-11 h-11 rounded-full items-center justify-center mr-3"
          >
            <Ionicons
              name={icon}
              size={22}
              color={isDestructive ? activeColors.destructive : activeColors.primary}
            />
          </View>
          <Text
            style={{ color: activeColors.cardForeground }}
            className="text-xl font-fraunces-bold flex-1"
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>

        {/* Message */}
        <Text
          style={{ color: activeColors.mutedForeground }}
          className="text-sm font-nunito leading-5 mb-6"
        >
          {message}
        </Text>

        {/* Action Buttons */}
        <View className="flex-row items-center justify-end gap-3 pt-2">
          <TouchableOpacity
            onPress={onClose}
            disabled={loading}
            className="px-5 py-3 rounded-full"
            activeOpacity={0.7}
          >
            <Text
              style={{ color: activeColors.mutedForeground }}
              className="text-sm font-nunito-bold"
            >
              {cancelText}
            </Text>
          </TouchableOpacity>

          <Button
            title={confirmText}
            variant={isDestructive ? 'destructive' : 'primary'}
            size="md"
            loading={loading}
            disabled={loading}
            isDarkMode={isDarkMode}
            onPress={onConfirm}
          />
        </View>
      </Pressable>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  modalCard: {
    elevation: 10,
  },
});

export default ConfirmModal;
