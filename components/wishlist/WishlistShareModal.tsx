import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/expo';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/database/_generated/api';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/core/Button';
import { Badge } from '@/components/core/Badge';

export interface WishlistShareModalProps {
  isVisible: boolean;
  onClose: () => void;
  wishlistId: string;
  isDarkMode?: boolean;
}

export const WishlistShareModal: React.FC<WishlistShareModalProps> = ({
  isVisible,
  onClose,
  wishlistId,
  isDarkMode: customDarkMode,
}) => {
  const { user } = useUser();
  const { isDarkMode, activeColors } = useTheme(customDarkMode);

  const [shareSearch, setShareSearch] = useState('');
  const [sentUserIds, setSentUserIds] = useState<string[]>([]);
  const [sharingUserId, setSharingUserId] = useState<string | null>(null);

  // Query registered users available to receive invitations
  const availableUsers = useQuery(
    api.users.getAllUsers,
    user?.id ? { currentClerkId: user.id } : 'skip'
  );

  // Mutation to share wishlist with target user
  const shareWishlistMutation = useMutation(api.users.shareWishlistWithUser);

  const handleSendInvite = async (targetUserId: string) => {
    try {
      setSharingUserId(targetUserId);
      await shareWishlistMutation({
        wishlistId: wishlistId as any,
        targetUserId: targetUserId as any,
      });
      setSentUserIds((prev) => [...prev, targetUserId]);
    } catch (err) {
      console.error('[WishlistShareModal] Failed to share wishlist:', err);
    } finally {
      setSharingUserId(null);
    }
  };

  const filteredUsers = availableUsers?.filter((u) => {
    const q = shareSearch.toLowerCase().trim();
    if (!q) return true;
    const nameMatch = u.name?.toLowerCase().includes(q) || u.firstName?.toLowerCase().includes(q) || u.lastName?.toLowerCase().includes(q);
    const emailMatch = u.email?.toLowerCase().includes(q);
    return nameMatch || emailMatch;
  });

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={[
          styles.modalOverlay,
          {
            backgroundColor: isDarkMode ? 'rgba(7, 11, 14, 0.6)' : 'rgba(16, 33, 41, 0.5)',
          },
        ]}
        onPress={onClose}
      >
        <Pressable
          style={[
            styles.menuContainer,
            {
              backgroundColor: activeColors.card,
              borderColor: activeColors.border,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
          className="w-full max-w-md md:w-96 rounded-3xl p-5 border shadow-xl max-h-[85%] md:max-h-[80%]"
        >
          {/* Header */}
          <View
            style={{ borderBottomColor: activeColors.border }}
            className="flex-row items-center justify-between pb-3 mb-3 border-b"
          >
            <View className="flex-row items-center flex-1 mr-2">
              <Ionicons name="share-social-outline" size={22} color={activeColors.primary} />
              <Text
                style={{ color: activeColors.cardForeground }}
                className="text-lg font-fraunces-bold ml-2 flex-1"
                numberOfLines={1}
              >
                Share Wishlist
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="close"
                size={20}
                color={activeColors.mutedForeground}
              />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View
            style={{
              backgroundColor: activeColors.muted,
              borderColor: activeColors.border,
            }}
            className="flex-row items-center rounded-xl h-10 px-3 border border-solid mb-4"
          >
            <Ionicons
              name="search-outline"
              size={16}
              color={activeColors.mutedForeground}
              style={{ marginRight: 6 }}
            />
            <TextInput
              value={shareSearch}
              onChangeText={setShareSearch}
              placeholder="Search friends by name..."
              placeholderTextColor={activeColors.mutedForeground}
              style={{
                flex: 1,
                fontFamily: 'Nunito-Regular',
                fontSize: 14,
                color: activeColors.foreground,
                paddingVertical: 0,
                outlineStyle: 'none',
              } as any}
            />
          </View>

          {/* Users List */}
          <ScrollView className="max-h-96 md:max-h-80" showsVerticalScrollIndicator={false}>
            {availableUsers === undefined ? (
              <View className="py-8 items-center">
                <ActivityIndicator size="small" color={activeColors.primary} />
              </View>
            ) : filteredUsers && filteredUsers.length > 0 ? (
              filteredUsers.map((targetUser) => {
                const hasAccepted = Boolean(targetUser.sharedLists?.includes(wishlistId as any));
                const isPending = Boolean(targetUser.pendingSharedLists?.includes(wishlistId as any));
                const isSent = isPending || sentUserIds.includes(targetUser._id);
                const isSending = sharingUserId === targetUser._id;
                const nameStr = targetUser.name || [targetUser.firstName, targetUser.lastName].filter(Boolean).join(' ') || 'User';
                const avatarUri = targetUser.avatarUrl || targetUser.avatar;

                return (
                  <View
                    key={targetUser._id}
                    style={{
                      backgroundColor: activeColors.card,
                      borderColor: activeColors.border,
                    }}
                    className="flex-row items-center justify-between p-3 rounded-2xl mb-2 border"
                  >
                    <View className="flex-row items-center flex-1 mr-2">
                      <View
                        style={{ backgroundColor: activeColors.muted }}
                        className="w-9 h-9 rounded-full items-center justify-center overflow-hidden mr-3"
                      >
                        {avatarUri ? (
                          <Image
                            source={{ uri: avatarUri }}
                            style={{ width: '100%', height: '100%' }}
                          />
                        ) : (
                          <Ionicons
                            name="person"
                            size={18}
                            color={activeColors.mutedForeground}
                          />
                        )}
                      </View>
                      <View className="flex-1 justify-center">
                        <Text
                          style={{ color: activeColors.cardForeground }}
                          className="text-sm font-nunito-bold"
                          numberOfLines={1}
                        >
                          {nameStr}
                        </Text>
                        {Boolean(targetUser.email) && (
                          <Text
                            style={{ color: activeColors.mutedForeground }}
                            className="text-xs font-nunito"
                            numberOfLines={1}
                          >
                            {targetUser.email}
                          </Text>
                        )}
                      </View>
                    </View>

                    <View className="items-center justify-center">
                      {hasAccepted ? (
                        <Badge
                          label="Accepted"
                          variant="success"
                          size="md"
                          icon={<Ionicons name="checkmark-circle" size={15} color={activeColors.success} />}
                          isDarkMode={isDarkMode}
                        />
                      ) : isSent ? (
                        <Badge
                          label="Sent!"
                          variant="warning"
                          size="md"
                          icon={<Ionicons name="checkmark-circle" size={15} color={activeColors.warning} />}
                          isDarkMode={isDarkMode}
                        />
                      ) : (
                        <Button
                          title="Invite"
                          variant="primary"
                          size="xs"
                          loading={isSending}
                          isDarkMode={isDarkMode}
                          onPress={() => handleSendInvite(targetUser._id)}
                        />
                      )}
                    </View>
                  </View>
                );
              })
            ) : (
              <View className="py-8 items-center justify-center">
                <Ionicons name="people-outline" size={28} color={activeColors.mutedForeground} />
                <Text style={{ color: activeColors.mutedForeground }} className="text-xs font-nunito mt-2 text-center">
                  No users found to share with.
                </Text>
              </View>
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  menuContainer: {
    elevation: 10,
  },
});

export default WishlistShareModal;
