import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/expo';
import { useMutation } from 'convex/react';
import { api } from '@/database/_generated/api';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';

export interface FriendUser {
  _id: string;
  clerkId?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  avatar?: string;
  email?: string;
}

export interface FriendOptionsMenuModalProps {
  isVisible: boolean;
  onClose: () => void;
  friend: FriendUser | null;
  isDarkMode?: boolean;
}

export const FriendOptionsMenuModal: React.FC<FriendOptionsMenuModalProps> = ({
  isVisible,
  onClose,
  friend,
  isDarkMode: customDarkMode,
}) => {
  const router = useRouter();
  const { user } = useUser();
  const { isDarkMode, activeColors } = useTheme(customDarkMode);
  const [isRemoving, setIsRemoving] = useState(false);

  const removeFriendMutation = useMutation(api.friends.removeFriend);

  if (!friend) return null;

  const fullName =
    friend.name ||
    [friend.firstName, friend.lastName].filter(Boolean).join(' ') ||
    'User';

  const avatarUri = friend.avatarUrl || friend.avatar;

  const handleViewWishlists = () => {
    onClose();
    router.push('/shared-lists' as any);
  };

  const handleRemoveFriend = async () => {
    if (!user?.id || !friend?._id) return;
    try {
      setIsRemoving(true);
      await removeFriendMutation({
        clerkId: user.id,
        friendUserId: friend._id as any,
      });
      onClose();
    } catch (err) {
      console.error('[FriendOptionsMenuModal] Failed to remove friend:', err);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={onClose}
      >
        <Pressable
          style={[
            styles.modalContent,
            {
              backgroundColor: isDarkMode ? '#141F27' : '#FFFFFF',
              borderColor: activeColors.border,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
          className="w-[90%] max-w-sm rounded-3xl p-5 border shadow-xl items-center"
        >
          {/* Friend Profile Header */}
          <View
            style={{
              borderColor: activeColors.primary,
              backgroundColor: activeColors.muted,
            }}
            className="w-16 h-16 rounded-full border-2 items-center justify-center overflow-hidden mb-3 shadow-sm"
          >
            {avatarUri ? (
              <Image
                source={{ uri: avatarUri }}
                style={styles.avatarImage}
                contentFit="cover"
              />
            ) : (
              <Ionicons
                name="person"
                size={30}
                color={activeColors.mutedForeground}
              />
            )}
          </View>

          <Text
            style={{ color: activeColors.foreground }}
            className="text-lg font-fraunces-bold text-center mb-1"
          >
            {fullName}
          </Text>

          {Boolean(friend.email) && (
            <Text
              style={{ color: activeColors.mutedForeground }}
              className="text-xs font-nunito text-center mb-5"
            >
              {friend.email}
            </Text>
          )}

          {/* Action Options */}
          <View className="w-full space-y-2 mb-2">
            {/* Option 1: View Shared Wishlists */}
            <TouchableOpacity
              onPress={handleViewWishlists}
              activeOpacity={0.7}
              style={{
                backgroundColor: isDarkMode ? '#1C2B36' : '#F0F4F6',
                borderColor: activeColors.border,
              }}
              className="w-full flex-row items-center justify-center py-3 px-4 rounded-xl border border-solid mb-2.5"
            >
              <Ionicons
                name="gift-outline"
                size={18}
                color={activeColors.primary}
                style={{ marginRight: 8 }}
              />
              <Text
                style={{ color: activeColors.foreground }}
                className="text-sm font-nunito-bold"
              >
                View Shared Wishlists
              </Text>
            </TouchableOpacity>

            {/* Option 2: Remove Friend */}
            <TouchableOpacity
              disabled={isRemoving}
              onPress={handleRemoveFriend}
              activeOpacity={0.7}
              style={{
                backgroundColor: isDarkMode ? 'rgba(224, 83, 67, 0.12)' : 'rgba(196, 61, 47, 0.08)',
                borderColor: activeColors.destructive,
              }}
              className="w-full flex-row items-center justify-center py-3 px-4 rounded-xl border border-solid mb-3"
            >
              {isRemoving ? (
                <ActivityIndicator size="small" color={activeColors.destructive} />
              ) : (
                <>
                  <Ionicons
                    name="person-remove-outline"
                    size={18}
                    color={activeColors.destructive}
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{ color: activeColors.destructive }}
                    className="text-sm font-nunito-bold"
                  >
                    Remove Friend
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Cancel Button */}
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            className="py-2 px-6"
          >
            <Text
              style={{ color: activeColors.mutedForeground }}
              className="text-sm font-nunito-semibold"
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    elevation: 10,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
});

export default FriendOptionsMenuModal;
