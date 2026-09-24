import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Switch,
  Platform,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/expo';
import { useMutation } from 'convex/react';
import { api } from '@/database/_generated/api';
import { useTheme } from '@/hooks/useTheme';
import { ModalWrapper } from '@/components/wrapper/ModalWrapper';
import { Input } from '@/components/core/Input';
import { Button } from '@/components/core/Button';

export interface CreateNewWishlistProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess?: (wishlistId: string) => void;
  isDarkMode?: boolean;
}

export const CreateNewWishlist: React.FC<CreateNewWishlistProps> = ({
  isVisible,
  onClose,
  onSuccess,
  isDarkMode: customDarkMode,
}) => {
  const { user } = useUser();
  const { isDarkMode, activeColors } = useTheme(customDarkMode);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keepPurchasesSecret, setKeepPurchasesSecret] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createWishlistMutation = useMutation(api.wishlists.createWishlist);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setKeepPurchasesSecret(true);
    setError(null);
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCreate = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Please enter a wishlist name');
      return;
    }

    if (!user?.id) {
      setError('You must be signed in to create a wishlist');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const wishlistId = await createWishlistMutation({
        clerkId: user.id,
        title: trimmedTitle,
        description: description.trim() || undefined,
        keepPurchasesSecret,
      });

      onSuccess?.(wishlistId as string);
      handleClose();
    } catch (err: any) {
      console.error('[CreateNewWishlist] Error creating wishlist:', err);
      setError(err?.message || 'Failed to create wishlist. Please try again.');
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
                name="library-outline"
                size={20}
                color={activeColors.primary}
              />
            </View>
            <Text
              style={{ color: activeColors.cardForeground }}
              className="text-xl font-fraunces-bold flex-1"
              numberOfLines={1}
            >
              Create New Wishlist
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
          placeholder="e.g. Birthday Wishlist, Christmas 2026..."
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            if (error) setError(null);
          }}
          isDarkMode={isDarkMode}
          error={error || undefined}
        />

        {/* Input: Description */}
        <Input
          label="Description (Optional)"
          placeholder="Add a short note or description..."
          value={description}
          onChangeText={setDescription}
          isDarkMode={isDarkMode}
        />

        {/* Surprise Protection Card & Toggle */}
        <View
          style={{
            backgroundColor: isDarkMode
              ? 'rgba(25, 37, 45, 0.7)'
              : 'rgba(239, 240, 236, 0.7)',
            borderColor: activeColors.border,
          }}
          className="p-4 rounded-2xl border mb-6 flex-row items-center justify-between"
        >
          <View className="flex-1 mr-3">
            <View className="flex-row items-center mb-1">
              <Ionicons
                name={'sparkles'}
                size={18}
                color={
                  keepPurchasesSecret
                    ? activeColors.primary
                    : activeColors.mutedForeground
                }
                style={{ marginRight: 6 }}
              />
              <Text
                style={{ color: activeColors.cardForeground }}
                className="text-sm font-nunito-bold"
              >
                Surprise Protection
              </Text>
            </View>
            <Text
              style={{ color: activeColors.mutedForeground }}
              className="text-xs font-nunito leading-4"
            >
              {keepPurchasesSecret
                ? "Purchased items stay hidden from you so gift surprises aren't spoiled."
                : 'Purchases will be visible to you as soon as someone buys an item.'}
            </Text>
          </View>

          <Switch
            value={keepPurchasesSecret}
            onValueChange={setKeepPurchasesSecret}
            trackColor={{
              false: activeColors.border,
              true: activeColors.primary,
            }}
            thumbColor={Platform.OS === 'android' ? activeColors.card : '#FFFFFF'}
          />
        </View>

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
            title="Create List"
            variant="primary"
            size="md"
            loading={loading}
            disabled={loading}
            isDarkMode={isDarkMode}
            onPress={handleCreate}
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

export default CreateNewWishlist;
