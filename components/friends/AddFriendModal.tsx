import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/expo';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/database/_generated/api';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/core/Button';
import { Badge } from '@/components/core/Badge';

export interface AddFriendModalProps {
  isVisible: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
}

//Load Bound
const MAX_DISPLAY_USERS = 20;

export const AddFriendModal: React.FC<AddFriendModalProps> = ({
  isVisible,
  onClose,
  isDarkMode: customDarkMode,
}) => {
  const { user } = useUser();
  const { isDarkMode, activeColors } = useTheme(customDarkMode);

  const [searchQuery, setSearchQuery] = useState('');
  const [sendingUserId, setSendingUserId] = useState<string | null>(null);

  // Sync user record to Convex on open/mount
  const createUserMutation = useMutation(api.users.createUser);

  const userFirstName = user?.firstName;
  const userLastName = user?.lastName;
  const userFullName = user?.fullName;
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const userImageUrl = user?.imageUrl;

  useEffect(() => {
    if (user?.id && isVisible) {
      createUserMutation({
        clerkId: user.id,
        firstName: userFirstName ?? undefined,
        lastName: userLastName ?? undefined,
        name: userFullName ?? undefined,
        email: userEmail ?? undefined,
        avatarUrl: userImageUrl ?? undefined,
      }).catch((err) => console.error('[AddFriendModal] User sync error:', err));
    }
  }, [user?.id, isVisible, userFirstName, userLastName, userFullName, userEmail, userImageUrl, createUserMutation]);

  // Query available users for friend invitation
  const availableUsers = useQuery(
    api.friends.getUsersForFriendInvite,
    user?.id ? { currentClerkId: user.id } : {}
  );

  // Mutations for sending or accepting friend requests
  const sendFriendRequestMutation = useMutation(api.friends.sendFriendRequest);
  const acceptFriendRequestMutation = useMutation(api.friends.acceptFriendRequest);

  const handleSendInvite = async (targetUserId: string) => {
    if (!user?.id) return;
    try {
      setSendingUserId(targetUserId);
      await sendFriendRequestMutation({
        clerkId: user.id,
        targetUserId: targetUserId,
      });
    } catch (err) {
      console.error('[AddFriendModal] Failed to send friend request:', err);
    } finally {
      setSendingUserId(null);
    }
  };

  const handleAcceptRequest = async (targetUserId: string) => {
    if (!user?.id) return;
    try {
      setSendingUserId(targetUserId);
      await acceptFriendRequestMutation({
        clerkId: user.id,
        requesterUserId: targetUserId as any,
      });
    } catch (err) {
      console.error('[AddFriendModal] Failed to accept friend request:', err);
    } finally {
      setSendingUserId(null);
    }
  };

  const filteredUsers = availableUsers?.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const nameMatch =
      u.name?.toLowerCase().includes(q) ||
      u.firstName?.toLowerCase().includes(q) ||
      u.lastName?.toLowerCase().includes(q);
    const emailMatch = u.email?.toLowerCase().includes(q);
    return nameMatch || emailMatch;
  });

  const displayedUsers = filteredUsers?.slice(0, MAX_DISPLAY_USERS);
  const hasMoreUsers = (filteredUsers?.length ?? 0) > MAX_DISPLAY_USERS;

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
              <Ionicons name="person-add-outline" size={22} color={activeColors.primary} />
              <Text
                style={{ color: activeColors.cardForeground }}
                className="text-lg font-fraunces-bold ml-2 flex-1"
                numberOfLines={1}
              >
                Add Friends
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
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by name or email..."
              placeholderTextColor={activeColors.mutedForeground}
              style={[
                styles.searchInput,
                { color: activeColors.foreground },
              ]}
            />
            {Boolean(searchQuery) && (
              <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
                <Ionicons
                  name="close-circle"
                  size={16}
                  color={activeColors.mutedForeground}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Users List */}
          <ScrollView className="max-h-96 md:max-h-80" showsVerticalScrollIndicator={false}>
            {availableUsers === undefined ? (
              <View className="py-8 items-center">
                <ActivityIndicator size="small" color={activeColors.primary} />
              </View>
            ) : displayedUsers && displayedUsers.length > 0 ? (
              <>
                {displayedUsers.map((targetUser) => {
                  const nameStr =
                    targetUser.name ||
                    [targetUser.firstName, targetUser.lastName].filter(Boolean).join(' ') ||
                    'User';
                  const avatarUri = targetUser.avatarUrl || targetUser.avatar;
                  const isSending = sendingUserId === targetUser._id;

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
                          style={{ backgroundColor: activeColors.muted, borderColor: activeColors.border }}
                          className="w-10 h-10 rounded-full items-center justify-center overflow-hidden mr-3 border"
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
                              size={18}
                              color={activeColors.mutedForeground}
                            />
                          )}
                        </View>
                        <View className="flex-1 justify-center">
                          <Text
                            style={{ color: activeColors.cardForeground }}
                            className="text-sm font-fraunces-bold"
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
                        {targetUser.isFriend ? (
                          <Badge
                            label="Friends"
                            variant="success"
                            size="md"
                            icon={<Ionicons name="checkmark-circle" size={15} color={activeColors.success} />}
                            isDarkMode={isDarkMode}
                          />
                        ) : targetUser.isPendingOutgoing ? (
                          <Badge
                            label="Sent!"
                            variant="warning"
                            size="md"
                            icon={<Ionicons name="time-outline" size={15} color={activeColors.warning} />}
                            isDarkMode={isDarkMode}
                          />
                        ) : targetUser.isPendingIncoming ? (
                          <Button
                            title="Accept"
                            variant="primary"
                            size="xs"
                            loading={isSending}
                            isDarkMode={isDarkMode}
                            onPress={() => handleAcceptRequest(targetUser._id)}
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
                })}
                {hasMoreUsers && (
                  <View className="py-3 items-center">
                    <Text
                      style={{ color: activeColors.mutedForeground }}
                      className="text-xs font-nunito text-center"
                    >
                      Showing top {MAX_DISPLAY_USERS} results. Type to refine your search.
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <View className="py-8 items-center justify-center">
                <Ionicons name="people-outline" size={28} color={activeColors.mutedForeground} />
                <Text style={{ color: activeColors.mutedForeground }} className="text-xs font-nunito mt-2 text-center">
                  No users found to add.
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
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    paddingVertical: 0,
    outlineStyle: 'none',
  } as any,
});

export default AddFriendModal;
