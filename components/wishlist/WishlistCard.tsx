import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

export interface WishlistCardItem {
  _id: string;
  title: string;
  description?: string;
  itemCount?: number;
  isArchived?: boolean;
}

export interface WishlistCardProps {
  wishlist: WishlistCardItem;
  onPress?: () => void;
  isDarkMode?: boolean;
  isShared?: boolean;
}

export const WishlistCard: React.FC<WishlistCardProps> = ({
  wishlist,
  onPress,
  isDarkMode: customDarkMode,
  isShared = false,
}) => {
  const { isDarkMode, activeColors } = useTheme(customDarkMode);
  const count = wishlist.itemCount ?? 0;
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const displayTitle = wishlist.title.length > 36
    ? `${wishlist.title.substring(0, 28)}...`
    : wishlist.title;

  const handleDotsPress = () => {
    setIsMenuVisible(true);
  };

  const handleCardLongPress = () => {
    setIsMenuVisible(true);
  };

  const handleAddItem = () => {
    // TODO: Implement Add Item functionality (e.g. open add item modal or navigate to add item screen)
    console.log('[WishlistCard] Add item pressed for wishlist:', wishlist._id, wishlist.title);
    setIsMenuVisible(false);
  };

  const handleRename = () => {
    // TODO: Implement Rename functionality (e.g. open rename wishlist prompt/modal)
    console.log('[WishlistCard] Rename pressed for wishlist:', wishlist._id, wishlist.title);
    setIsMenuVisible(false);
  };

  const handleShare = () => {
    // TODO: Implement Share functionality (e.g. open share sheet or invite friends modal)
    console.log('[WishlistCard] Share pressed for wishlist:', wishlist._id, wishlist.title);
    setIsMenuVisible(false);
  };

  const handleDelete = () => {
    // TODO: Implement Delete functionality (e.g. prompt confirmation and remove wishlist via Convex mutation)
    console.log('[WishlistCard] Delete pressed for wishlist:', wishlist._id, wishlist.title);
    setIsMenuVisible(false);
  };

  const handleRemoveShared = () => {
    // TODO: Implement Remove from Shared functionality (e.g. remove wishlist ID from user's sharedLists)
    console.log('[WishlistCard] Remove from shared pressed for wishlist:', wishlist._id, wishlist.title);
    setIsMenuVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        onLongPress={handleCardLongPress}
        delayLongPress={350}
        activeOpacity={0.85}
        style={[
          styles.card,
          {
            backgroundColor: isDarkMode ? '#16222A' : '#FFFFFF',
            borderColor: activeColors.border,
            boxShadow: isDarkMode
              ? '0px 8px 16px rgba(2, 8, 17, 0.35)'
              : '0px 8px 16px rgba(1, 55, 125, 0.08)',
          },
        ]}
        className="p-5 mb-4 border border-solid rounded-3xl min-h-40 justify-between flex-col"
      >
        {/* Top Row: Item Count & Archived Badges + Pagination Dots Button */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-1.5 flex-wrap flex-1 mr-2">
            <View
              style={{
                backgroundColor: isDarkMode ? '#24343E' : '#EAEBE7',
              }}
              className="rounded-full px-3 py-1"
            >
              <Text
                style={{ color: activeColors.primary }}
                className="text-xs font-nunito-bold"
              >
                {count} {count === 1 ? 'Item' : 'Items'}
              </Text>
            </View>

            {wishlist.isArchived && (
              <View
                style={{
                  backgroundColor: isDarkMode ? '#3B2A1D' : '#FEF3C7',
                }}
                className="rounded-full px-3 py-1 border border-amber-500/30"
              >
                <Text
                  style={{ color: isDarkMode ? '#FBBF24' : '#D97706' }}
                  className="text-xs font-nunito-bold"
                >
                  Archived
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={handleDotsPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            className="p-1 rounded-full items-center justify-center"
          >
            <Ionicons
              name="ellipsis-horizontal"
              size={20}
              color={activeColors.mutedForeground}
            />
          </TouchableOpacity>
        </View>

        {/* Main Title */}
        <Text
          style={{ color: activeColors.foreground }}
          className="text-xl font-fraunces-bold leading-snug"
        >
          {displayTitle}
        </Text>
      </TouchableOpacity>

      {/* Hovering Context Menu Modal */}
      <Modal
        visible={isMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsMenuVisible(false)}
        >
          <Pressable
            style={[
              styles.menuContainer,
              {
                backgroundColor: isDarkMode ? '#1F2C34' : '#FFFFFF',
                borderColor: activeColors.border,
                boxShadow: isDarkMode
                  ? '0px 12px 24px rgba(0, 0, 0, 0.5)'
                  : '0px 12px 24px rgba(0, 0, 0, 0.12)',
              },
            ]}
            onPress={(e) => e.stopPropagation()}
            className="w-72 rounded-3xl p-4 border"
          >
            {/* Header */}
            <View className="flex-row items-center justify-between pb-3 mb-2 border-b border-gray-200 dark:border-gray-700">
              <Text
                style={{ color: activeColors.foreground }}
                className="font-fraunces-bold text-base flex-1 mr-2"
                numberOfLines={1}
              >
                {displayTitle}
              </Text>
              <TouchableOpacity
                onPress={() => setIsMenuVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name="close"
                  size={20}
                  color={activeColors.mutedForeground}
                />
              </TouchableOpacity>
            </View>

            {/* Menu Options */}
            {isShared ? (
              /* Shared List Menu Options: Share & Remove from Shared */
              <>
                <TouchableOpacity
                  onPress={handleShare}
                  className="flex-row items-center py-3 px-2 rounded-xl active:opacity-70"
                >
                  <Ionicons
                    name="share-outline"
                    size={20}
                    color={activeColors.foreground}
                  />
                  <Text
                    style={{ color: activeColors.foreground }}
                    className="text-base font-nunito-semibold ml-3"
                  >
                    Share
                  </Text>
                </TouchableOpacity>

                <View style={{ height: 1, backgroundColor: activeColors.border, marginVertical: 4 }} />

                <TouchableOpacity
                  onPress={handleRemoveShared}
                  className="flex-row items-center py-3 px-2 rounded-xl active:opacity-70"
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color="#EF4444"
                  />
                  <Text
                    style={{ color: '#EF4444' }}
                    className="text-base font-nunito-bold ml-3"
                  >
                    Remove from Shared
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              /* Owned List Menu Options: Add Item, Rename, Share, Delete */
              <>
                <TouchableOpacity
                  onPress={handleAddItem}
                  className="flex-row items-center py-3 px-2 rounded-xl active:opacity-70"
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={20}
                    color={activeColors.primary}
                  />
                  <Text
                    style={{ color: activeColors.foreground }}
                    className="text-base font-nunito-semibold ml-3"
                  >
                    Add Item
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleRename}
                  className="flex-row items-center py-3 px-2 rounded-xl active:opacity-70"
                >
                  <Ionicons
                    name="pencil-outline"
                    size={20}
                    color={activeColors.foreground}
                  />
                  <Text
                    style={{ color: activeColors.foreground }}
                    className="text-base font-nunito-semibold ml-3"
                  >
                    Rename
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleShare}
                  className="flex-row items-center py-3 px-2 rounded-xl active:opacity-70"
                >
                  <Ionicons
                    name="share-outline"
                    size={20}
                    color={activeColors.foreground}
                  />
                  <Text
                    style={{ color: activeColors.foreground }}
                    className="text-base font-nunito-semibold ml-3"
                  >
                    Share
                  </Text>
                </TouchableOpacity>

                <View style={{ height: 1, backgroundColor: activeColors.border, marginVertical: 4 }} />

                <TouchableOpacity
                  onPress={handleDelete}
                  className="flex-row items-center py-3 px-2 rounded-xl active:opacity-70"
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color="#EF4444"
                  />
                  <Text
                    style={{ color: '#EF4444' }}
                    className="text-base font-nunito-bold ml-3"
                  >
                    Delete
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    elevation: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  menuContainer: {
    elevation: 10,
  },
});

export default WishlistCard;
