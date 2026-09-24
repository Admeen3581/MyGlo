import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { api } from '@/database/_generated/api';
import { useTheme } from '@/hooks/useTheme';
import { ModalWrapper } from '@/components/wrapper/ModalWrapper';
import { Input } from '@/components/core/Input';
import { Button } from '@/components/core/Button';

export interface RenameWishlistModalProps {
  isVisible: boolean;
  onClose: () => void;
  wishlistId?: string;
  currentTitle?: string;
  isDarkMode?: boolean;
  onSuccess?: () => void;
}

export const RenameWishlistModal: React.FC<RenameWishlistModalProps> = ({
  isVisible,
  onClose,
  wishlistId,
  currentTitle = '',
  isDarkMode: customDarkMode,
  onSuccess,
}) => {
  const { isDarkMode, activeColors } = useTheme(customDarkMode);

  const [title, setTitle] = useState(currentTitle);
  const [prevTitle, setPrevTitle] = useState(currentTitle);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state when currentTitle changes while modal is opening
  if (currentTitle !== prevTitle && isVisible) {
    setPrevTitle(currentTitle);
    setTitle(currentTitle);
    setError(null);
  }

  const renameMutation = useMutation(api.wishlists.renameWishlist);

  const handleClose = () => {
    setError(null);
    setLoading(false);
    onClose();
  };

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Please enter a wishlist name');
      return;
    }

    if (!wishlistId) {
      setError('Invalid wishlist selected');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await renameMutation({
        wishlistId: wishlistId as any,
        title: trimmedTitle,
      });

      onSuccess?.();
      handleClose();
    } catch (err: any) {
      console.error('[RenameWishlistModal] Error renaming wishlist:', err);
      setError(err?.message || 'Failed to rename wishlist. Please try again.');
      setLoading(false);
    }
  };

  return (
    <ModalWrapper visible={isVisible} onClose={handleClose} isDarkMode={isDarkMode}>
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
        {/* Header */}
        <View
          style={{ borderBottomColor: activeColors.border }}
          className="flex-row items-center justify-between pb-4 mb-5 border-b"
        >
          <View className="flex-row items-center flex-1 mr-2">
            <View
              style={{ backgroundColor: activeColors.muted }}
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
            >
              <Ionicons
                name="pencil-outline"
                size={20}
                color={activeColors.primary}
              />
            </View>
            <Text
              style={{ color: activeColors.cardForeground }}
              className="text-xl font-fraunces-bold flex-1"
              numberOfLines={1}
            >
              Rename Wishlist
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons
              name="close"
              size={22}
              color={activeColors.mutedForeground}
            />
          </TouchableOpacity>
        </View>

        {/* Input: Wishlist Name */}
        <Input
          label="Wishlist Name *"
          placeholder="Enter new name..."
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            if (error) setError(null);
          }}
          isDarkMode={isDarkMode}
          error={error || undefined}
        />

        {/* Action Buttons */}
        <View className="flex-row items-center justify-end gap-3 pt-2">
          <TouchableOpacity
            onPress={handleClose}
            disabled={loading}
            className="px-5 py-3 rounded-full"
            activeOpacity={0.7}
          >
            <Text
              style={{ color: activeColors.mutedForeground }}
              className="text-sm font-nunito-bold"
            >
              Cancel
            </Text>
          </TouchableOpacity>

          <Button
            title="Save"
            variant="primary"
            size="md"
            loading={loading}
            disabled={loading}
            isDarkMode={isDarkMode}
            onPress={handleSave}
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

export default RenameWishlistModal;
