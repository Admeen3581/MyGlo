import React from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/expo';
import { useMutation } from 'convex/react';
import { api } from '@/database/_generated/api';
import { useTheme } from '@/hooks/useTheme';

export interface IncomingWishlistItem {
  _id: string;
  title: string;
  ownerName?: string;
  itemCount?: number;
}

export interface IncomingListsModalProps {
  isVisible: boolean;
  onClose: () => void;
  pendingLists?: IncomingWishlistItem[];
  isDarkMode?: boolean;
}

export const IncomingListsModal: React.FC<IncomingListsModalProps> = ({
  isVisible,
  onClose,
  pendingLists = [],
  isDarkMode: customDarkMode,
}) => {
  const { user } = useUser();
  const { isDarkMode, activeColors } = useTheme(customDarkMode);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  // Mutations to accept or ignore shared list invitations in Convex
  const acceptSharedListMutation = useMutation(api.users.acceptSharedList);
  const ignoreSharedListMutation = useMutation(api.users.ignoreSharedList);

  const handleIgnore = async (wishlistId: string) => {
    if (!user?.id) return;
    try {
      await ignoreSharedListMutation({
        clerkId: user.id,
        wishlistId: wishlistId as any,
      });
    } catch (err) {
      console.error('[IncomingListsModal] Failed to ignore wishlist:', err);
    }
  };

  const handleAccept = async (wishlistId: string) => {
    if (!user?.id) return;
    try {
      await acceptSharedListMutation({
        clerkId: user.id,
        wishlistId: wishlistId as any,
      });
    } catch (err) {
      console.error('[IncomingListsModal] Failed to accept wishlist:', err);
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
              <Ionicons name="cloud-download-outline" size={isDesktop ? 22 : 26} color={activeColors.primary} />
              <Text style={{ color: activeColors.foreground }} className="text-xl md:text-lg font-fraunces-bold ml-2.5 md:ml-2">
                Incoming Lists
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <Ionicons name="close" size={isDesktop ? 20 : 24} color={activeColors.mutedForeground} />
            </TouchableOpacity>
          </View>

          {/* Modal Content / Invites List */}
          <ScrollView className="max-h-[65vh] md:max-h-96" showsVerticalScrollIndicator={false}>
            {pendingLists.length === 0 ? (
              <View className="items-center justify-center py-10 md:py-8 px-2">
                <Ionicons name="checkmark-circle-outline" size={isDesktop ? 36 : 46} color={activeColors.mutedForeground} />
                <Text style={{ color: activeColors.mutedForeground }} className="text-base md:text-sm font-nunito mt-3 md:mt-2 text-center">
                  No new list invitations at this time.
                </Text>
              </View>
            ) : (
              pendingLists.map((item) => (
                <View
                  key={item._id}
                  style={{ backgroundColor: isDarkMode ? '#24343E' : '#F7F7F6', borderColor: activeColors.border }}
                  className="p-5 md:p-4 rounded-2xl mb-3.5 md:mb-3 border"
                >
                  <Text style={{ color: activeColors.foreground }} className="text-lg md:text-base font-fraunces-bold mb-1">
                    {item.title}
                  </Text>
                  <Text style={{ color: activeColors.mutedForeground }} className="text-sm md:text-xs font-nunito mb-3.5 md:mb-3">
                    Shared by {item.ownerName ?? 'a friend'} ({item.itemCount ?? 0} {(item.itemCount ?? 0) === 1 ? 'Item' : 'Items'})
                  </Text>

                  <View className="flex-row items-center justify-end gap-2.5 md:gap-2">
                    {/* Ignore Button: remove from pendingSharedLists in DB */}
                    <TouchableOpacity
                      onPress={() => handleIgnore(item._id)}
                      style={{ backgroundColor: isDarkMode ? '#334155' : '#E2E8F0' }}
                      className="px-4 py-2 md:px-3.5 md:py-1.5 rounded-full"
                    >
                      <Text style={{ color: activeColors.mutedForeground }} className="text-sm md:text-xs font-nunito-bold">
                        Ignore
                      </Text>
                    </TouchableOpacity>

                    {/* Accept Button: move from pending to sharedLists in DB */}
                    <TouchableOpacity
                      onPress={() => handleAccept(item._id)}
                      style={{ backgroundColor: activeColors.primary }}
                      className="px-5 py-2 md:px-4 md:py-1.5 rounded-full"
                    >
                      <Text className="text-sm md:text-xs font-nunito-bold text-white">
                        Accept
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
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
});

export default IncomingListsModal;
