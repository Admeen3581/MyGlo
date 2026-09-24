import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Switch,
  Platform,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { api } from '@/database/_generated/api';
import { useTheme } from '@/hooks/useTheme';
import { ModalWrapper } from '@/components/wrapper/ModalWrapper';
import { Input } from '@/components/core/Input';
import { Button } from '@/components/core/Button';

export interface CreateNewItemProps {
  isVisible: boolean;
  onClose: () => void;
  wishlistId: string;
  onSuccess?: (itemId: string) => void;
  isDarkMode?: boolean;
}

export const CreateNewItem: React.FC<CreateNewItemProps> = ({
  isVisible,
  onClose,
  wishlistId,
  onSuccess,
  isDarkMode: customDarkMode,
}) => {
  const { isDarkMode, activeColors } = useTheme(customDarkMode);
  const insets = useSafeAreaInsets();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [url, setUrl] = useState('');
  const [externalImageUrl, setExternalImageUrl] = useState('');
  const [priority, setPriority] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addItemMutation = useMutation(api.wishlists.addItemToWishlist);

  const resetForm = () => {
    setTitle('');
    setPrice('');
    setNotes('');
    setUrl('');
    setExternalImageUrl('');
    setPriority(false);
    setError(null);
    setLoading(false);
  };

  const handleClose = () => {
    Keyboard.dismiss();
    resetForm();
    onClose();
  };

  const handleCreate = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Please enter an item name');
      return;
    }

    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, '')) || 0;

    if (!wishlistId) {
      setError('Wishlist ID is missing');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const newItemId = await addItemMutation({
        wishlistId: wishlistId as any,
        title: trimmedTitle,
        price: numericPrice,
        notes: notes.trim() || undefined,
        url: url.trim() || undefined,
        priority,
        externalImageUrl: externalImageUrl.trim() || undefined,
      });

      Keyboard.dismiss();
      onSuccess?.(newItemId as string);
      handleClose();
    } catch (err: any) {
      console.error('[CreateNewItem] Error adding item:', err);
      setError(err?.message || 'Failed to add gift item. Please try again.');
      setLoading(false);
    }
  };

  // Ensure ample top padding on newer phones with notches/islands and drag pill
  const computedTopPadding = Math.max(insets.top > 0 ? insets.top * 0.5 + 24 : 32, 32);

  return (
    <ModalWrapper visible={isVisible} onClose={handleClose} isDarkMode={isDarkMode}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
      >
        <Pressable
          onPress={Keyboard.dismiss}
          accessible={false}
          style={styles.pressableContainer}
        >
          <Pressable
            style={[
              styles.modalCard,
              {
                backgroundColor: activeColors.card,
                borderColor: activeColors.border,
                paddingTop: computedTopPadding,
              },
            ]}
            onPress={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-3xl md:rounded-3xl pb-6 px-6 border shadow-2xl overflow-hidden max-h-[90vh]"
          >
            {/* Header */}
            <View
              style={{ borderBottomColor: activeColors.border }}
              className="flex-row items-center justify-between pb-4 mb-3 border-b"
            >
              <View className="flex-row items-center flex-1 mr-2">
                <View
                  style={{ backgroundColor: activeColors.muted }}
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                >
                  <Ionicons
                    name="gift-outline"
                    size={20}
                    color={activeColors.primary}
                  />
                </View>
                <Text
                  style={{ color: activeColors.cardForeground }}
                  className="text-xl font-fraunces-bold flex-1"
                  numberOfLines={1}
                >
                  Add a Gift
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

            {/* Scrollable Form Body with Keyboard Awareness */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
              automaticallyAdjustKeyboardInsets={true}
              contentContainerStyle={styles.scrollContent}
              className="max-h-[55vh]"
            >
              {/* Input: Item Name */}
              <Input
                label="Gift / Item Name *"
                placeholder="e.g. Wireless Headphones, Board Game..."
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (error) setError(null);
                }}
                isDarkMode={isDarkMode}
                error={error || undefined}
              />

              {/* Input: Price */}
              <Input
                label="Price ($)"
                placeholder="0.00"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                isDarkMode={isDarkMode}
              />

              {/* Input: Description / Notes */}
              <Input
                label="Description / Notes (Optional)"
                placeholder="Size, color, preference, etc."
                value={notes}
                onChangeText={setNotes}
                isDarkMode={isDarkMode}
              />

              {/* Input: Product URL */}
              <Input
                label="Product Link (Optional)"
                placeholder="https://..."
                value={url}
                onChangeText={setUrl}
                autoCapitalize="none"
                isDarkMode={isDarkMode}
              />

              {/* Input: Image Link */}
              <Input
                label="Image URL (Optional)"
                placeholder="https://.../image.jpg"
                value={externalImageUrl}
                onChangeText={setExternalImageUrl}
                autoCapitalize="none"
                isDarkMode={isDarkMode}
              />

              {/* Priority Toggle */}
              <View
                style={{
                  backgroundColor: isDarkMode
                    ? 'rgba(25, 37, 45, 0.7)'
                    : 'rgba(239, 240, 236, 0.7)',
                  borderColor: activeColors.border,
                }}
                className="p-4 rounded-2xl border mb-4 flex-row items-center justify-between"
              >
                <View className="flex-1 mr-3">
                  <View className="flex-row items-center mb-1">
                    <Ionicons
                      name="star"
                      size={16}
                      color={
                        priority
                          ? activeColors.warning
                          : activeColors.mutedForeground
                      }
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={{ color: activeColors.cardForeground }}
                      className="text-sm font-nunito-bold"
                    >
                      High Priority / Most Wanted
                    </Text>
                  </View>
                  <Text
                    style={{ color: activeColors.mutedForeground }}
                    className="text-xs font-nunito leading-4"
                  >
                    Highlight this gift with a priority badge for family and friends.
                  </Text>
                </View>

                <Switch
                  value={priority}
                  onValueChange={setPriority}
                  trackColor={{
                    false: activeColors.border,
                    true: activeColors.warning,
                  }}
                  thumbColor={Platform.OS === 'android' ? activeColors.card : '#FFFFFF'}
                />
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View
              className="flex-row items-center justify-end gap-3 pt-4 border-t"
              style={{ borderTopColor: activeColors.border }}
            >
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
                title="Add Gift"
                variant="primary"
                size="md"
                loading={loading}
                disabled={loading}
                isDarkMode={isDarkMode}
                onPress={handleCreate}
              />
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressableContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    elevation: 10,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});

export default CreateNewItem;
