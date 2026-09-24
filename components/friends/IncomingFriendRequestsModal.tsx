import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/expo';
import { useMutation } from 'convex/react';
import { api } from '@/database/_generated/api';
import { useTheme } from '@/hooks/useTheme';

export interface PendingFriendRequestUser {
  _id: string;
  clerkId?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  avatar?: string;
  email?: string;
}

export interface IncomingFriendRequestsModalProps {
  isVisible: boolean;
  onClose: () => void;
  pendingRequests?: PendingFriendRequestUser[];
  isDarkMode?: boolean;
}

//Load bound
const MAX_DISPLAY_REQUESTS = 30;

export const IncomingFriendRequestsModal: React.FC<IncomingFriendRequestsModalProps> = ({
  isVisible,
  onClose,
  pendingRequests = [],
  isDarkMode: customDarkMode,
}) => {
  const { user } = useUser();
  const { isDarkMode, activeColors } = useTheme(customDarkMode);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  // Mutations to accept or ignore friend requests in Convex
  const acceptFriendRequestMutation = useMutation(api.friends.acceptFriendRequest);
  const ignoreFriendRequestMutation = useMutation(api.friends.ignoreFriendRequest);

  const handleIgnore = async (requesterId: string) => {
    if (!user?.id) return;
    try {
      setLoadingUserId(requesterId);
      await ignoreFriendRequestMutation({
        clerkId: user.id,
        requesterUserId: requesterId as any,
      });
    } catch (err) {
      console.error('[IncomingFriendRequestsModal] Failed to ignore friend request:', err);
    } finally {
      setLoadingUserId(null);
    }
  };

  const handleAccept = async (requesterId: string) => {
    if (!user?.id) return;
    try {
      setLoadingUserId(requesterId);
      await acceptFriendRequestMutation({
        clerkId: user.id,
        requesterUserId: requesterId as any,
      });
    } catch (err) {
      console.error('[IncomingFriendRequestsModal] Failed to accept friend request:', err);
    } finally {
      setLoadingUserId(null);
    }
  };

  const displayedRequests = pendingRequests.slice(0, MAX_DISPLAY_REQUESTS);
  const hasMoreRequests = pendingRequests.length > MAX_DISPLAY_REQUESTS;

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
              backgroundColor: isDarkMode ? '#16222A' : '#FFFFFF',
              borderColor: activeColors.border,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
          className="w-[92%] md:w-96 rounded-3xl p-6 md:p-5 border shadow-xl max-h-[85%] md:max-h-[80%]"
        >
          {/* Modal Header */}
          <View className="flex-row items-center justify-between pb-3.5 md:pb-3 mb-3.5 md:mb-3 border-b border-gray-200 dark:border-gray-700">
            <View className="flex-row items-center">
              <Ionicons name="person-add-outline" size={isDesktop ? 22 : 26} color={activeColors.primary} />
              <Text style={{ color: activeColors.foreground }} className="text-xl md:text-lg font-fraunces-bold ml-2.5 md:ml-2">
                Friend Requests
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <Ionicons name="close" size={isDesktop ? 20 : 24} color={activeColors.mutedForeground} />
            </TouchableOpacity>
          </View>

          {/* Modal Content / Friend Requests List */}
          <ScrollView className="max-h-[65vh] md:max-h-96" showsVerticalScrollIndicator={false}>
            {pendingRequests.length === 0 ? (
              <View className="items-center justify-center py-10 md:py-8 px-2">
                <Ionicons name="checkmark-circle-outline" size={isDesktop ? 36 : 46} color={activeColors.mutedForeground} />
                <Text style={{ color: activeColors.mutedForeground }} className="text-base md:text-sm font-nunito mt-3 md:mt-2 text-center">
                  No new friend requests at this time.
                </Text>
              </View>
            ) : (
              <>
                {displayedRequests.map((item) => {
                  const fullName =
                    item.name ||
                    [item.firstName, item.lastName].filter(Boolean).join(' ') ||
                    'User';
                  const avatarUri = item.avatarUrl || item.avatar;
                  const isLoading = loadingUserId === item._id;

                  return (
                    <View
                      key={item._id}
                      style={{ backgroundColor: isDarkMode ? '#24343E' : '#F7F7F6', borderColor: activeColors.border }}
                      className="p-4 md:p-3.5 rounded-2xl mb-3.5 md:mb-3 border flex-row items-center justify-between"
                    >
                      <View className="flex-row items-center flex-1 mr-3">
                        <View
                          style={{ backgroundColor: activeColors.muted, borderColor: activeColors.border }}
                          className="w-11 h-11 rounded-full items-center justify-center overflow-hidden mr-3 border"
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
                              size={20}
                              color={activeColors.mutedForeground}
                            />
                          )}
                        </View>
                        <View className="flex-1 justify-center">
                          <Text style={{ color: activeColors.foreground }} className="text-base md:text-sm font-fraunces-bold" numberOfLines={1}>
                            {fullName}
                          </Text>
                          {Boolean(item.email) && (
                            <Text style={{ color: activeColors.mutedForeground }} className="text-xs font-nunito" numberOfLines={1}>
                              {item.email}
                            </Text>
                          )}
                        </View>
                      </View>

                      <View className="flex-row items-center gap-2">
                        {/* Ignore Button */}
                        <TouchableOpacity
                          disabled={isLoading}
                          onPress={() => handleIgnore(item._id)}
                          style={{ backgroundColor: isDarkMode ? '#334155' : '#E2E8F0' }}
                          className="px-3.5 py-1.5 md:px-3 md:py-1 rounded-full"
                        >
                          <Text style={{ color: activeColors.mutedForeground }} className="text-xs font-nunito-bold">
                            Ignore
                          </Text>
                        </TouchableOpacity>

                        {/* Accept Button */}
                        <TouchableOpacity
                          disabled={isLoading}
                          onPress={() => handleAccept(item._id)}
                          style={{ backgroundColor: activeColors.primary }}
                          className="px-4 py-1.5 md:px-3.5 md:py-1 rounded-full flex-row items-center justify-center"
                        >
                          {isLoading ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                          ) : (
                            <Text className="text-xs font-nunito-bold text-white">
                              Accept
                            </Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
                {hasMoreRequests && (
                  <View className="py-3 items-center">
                    <Text
                      style={{ color: activeColors.mutedForeground }}
                      className="text-xs font-nunito text-center"
                    >
                      Showing top {MAX_DISPLAY_REQUESTS} requests.
                    </Text>
                  </View>
                )}
              </>
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
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
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

export default IncomingFriendRequestsModal;
