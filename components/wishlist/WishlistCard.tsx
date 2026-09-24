import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/expo';
import { useMutation } from 'convex/react';
import { api } from '@/database/_generated/api';
import { useTheme } from '@/hooks/useTheme';
import { Badge } from '@/components/core/Badge';
import { WishlistCardMenuModal } from './WishlistCardMenuModal';
import { WishlistShareModal } from './WishlistShareModal';
import { RenameWishlistModal } from './RenameWishlistModal';
import { ConfirmModal } from '@/components/core/ConfirmModal';

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
  onRename?: () => void;
  onRemoveShared?: () => void;
  onDelete?: () => void;
}

export const WishlistCard: React.FC<WishlistCardProps> = ({
  wishlist,
  onPress,
  isDarkMode: customDarkMode,
  isShared = false,
  onRename: customOnRename,
  onRemoveShared: customOnRemoveShared,
  onDelete: customOnDelete,
}) => {
  const { user } = useUser();
  const { isDarkMode, activeColors } = useTheme(customDarkMode);
  const count = wishlist.itemCount ?? 0;

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const removeSharedListMutation = useMutation(api.users.removeSharedList);
  const deleteWishlistMutation = useMutation(api.wishlists.deleteWishlist);

  const displayTitle = wishlist.title.length > 30
    ? `${wishlist.title.substring(0, 28)}...`
    : wishlist.title;

  const handleDotsPress = () => {
    setIsMenuVisible(true);
  };

  const handleCardLongPress = () => {
    setIsMenuVisible(true);
  };

  const handleRenameClick = () => {
    if (customOnRename) {
      customOnRename();
    } else {
      setIsRenameModalVisible(true);
    }
  };

  const handleRemoveSharedClick = async () => {
    if (customOnRemoveShared) {
      customOnRemoveShared();
    } else if (user?.id && wishlist._id) {
      try {
        await removeSharedListMutation({
          clerkId: user.id,
          wishlistId: wishlist._id as any,
        });
      } catch (err) {
        console.error('[WishlistCard] Failed to remove shared wishlist:', err);
      }
    }
  };

  const handleDeleteClick = () => {
    if (customOnDelete) {
      customOnDelete();
    } else {
      setIsDeleteConfirmVisible(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!wishlist._id) return;
    try {
      setIsDeleting(true);
      await deleteWishlistMutation({ wishlistId: wishlist._id as any });
      setIsDeleteConfirmVisible(false);
    } catch (err) {
      console.error('[WishlistCard] Failed to delete wishlist:', err);
    } finally {
      setIsDeleting(false);
    }
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
            backgroundColor: activeColors.card,
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
            <Badge
              label={`${count} ${count === 1 ? 'Item' : 'Items'}`}
              variant="primary"
              size="sm"
              isDarkMode={isDarkMode}
            />

            {wishlist.isArchived && (
              <Badge
                label="Archived"
                variant="warning"
                size="sm"
                isDarkMode={isDarkMode}
              />
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
          style={{ color: activeColors.cardForeground }}
          className="text-xl font-fraunces-bold leading-snug"
        >
          {displayTitle}
        </Text>
      </TouchableOpacity>

      {/* Context Menu Modal Component */}
      <WishlistCardMenuModal
        isVisible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        title={displayTitle}
        wishlist={wishlist}
        isShared={isShared}
        isDarkMode={isDarkMode}
        onShare={() => setIsShareModalVisible(true)}
        onRename={handleRenameClick}
        onRemoveShared={handleRemoveSharedClick}
        onDelete={handleDeleteClick}
      />

      {/* Share Wishlist Modal Component */}
      <WishlistShareModal
        isVisible={isShareModalVisible}
        onClose={() => setIsShareModalVisible(false)}
        wishlistId={wishlist._id}
        isDarkMode={isDarkMode}
      />

      {/* Rename Wishlist Modal Component */}
      <RenameWishlistModal
        isVisible={isRenameModalVisible}
        onClose={() => setIsRenameModalVisible(false)}
        wishlistId={wishlist._id}
        currentTitle={wishlist.title}
        isDarkMode={isDarkMode}
      />

      {/* Confirmation Alert Modal for Deleting Wishlist */}
      <ConfirmModal
        isVisible={isDeleteConfirmVisible}
        onClose={() => setIsDeleteConfirmVisible(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Wishlist"
        message={`Are you sure you want to delete "${wishlist.title}"? This will permanently remove the list and unshare it from everyone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
        loading={isDeleting}
        isDarkMode={isDarkMode}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    elevation: 3,
  },
});

export default WishlistCard;
