import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import type { WishlistCardItem } from './WishlistCard';

export interface WishlistCardMenuModalProps {
    isVisible: boolean;
    onClose: () => void;
    title: string;
    wishlist?: WishlistCardItem;
    isShared?: boolean;
    isDarkMode?: boolean;
    onAddItem?: () => void;
    onArchive?: () => void;
    onRename?: () => void;
    onShare?: () => void;
    onDelete?: () => void;
    onRemoveShared?: () => void;
}

export const WishlistCardMenuModal: React.FC<WishlistCardMenuModalProps> = ({
                                                                                isVisible,
                                                                                onClose,
                                                                                title,
                                                                                wishlist,
                                                                                isShared = false,
                                                                                isDarkMode: customDarkMode,
                                                                                onAddItem,
                                                                                onArchive,
                                                                                onRename,
                                                                                onShare,
                                                                                onDelete,
                                                                                onRemoveShared,
                                                                            }) => {
    const { isDarkMode, activeColors } = useTheme(customDarkMode);

    const handleAddItem = () => {
        // TODO: Implement Add Item functionality (e.g. open add item modal or navigate to add item screen)
        console.log('[WishlistCard] Add item pressed for wishlist:', wishlist?._id, wishlist?.title ?? title);
        onClose();
        onAddItem?.();
    };

    const handleArchive = () => {
        // TODO: Implement functionality when user archives/unarchives a wishlist.
        console.log('[WishlistCard] Archive pressed.');
        onClose();
    }

    const handleRename = () => {
        // TODO: Implement Rename functionality (e.g. open rename wishlist prompt/modal)
        console.log('[WishlistCard] Rename pressed for wishlist:', wishlist?._id, wishlist?.title ?? title);
        onClose();
        onRename?.();
    };

    const handleShare = () => {
        onClose();
        onShare?.();
    };

    const handleDelete = () => {
        // TODO: Implement Delete functionality (e.g. prompt confirmation and remove wishlist via Convex mutation)
        console.log('[WishlistCard] Delete pressed for wishlist:', wishlist?._id, wishlist?.title ?? title);
        onClose();
        onDelete?.();
    };

    const handleRemoveShared = () => {
        // TODO: Implement Remove from Shared functionality (e.g. remove wishlist ID from user's sharedLists)
        console.log('[WishlistCard] Remove from shared pressed for wishlist:', wishlist?._id, wishlist?.title ?? title);
        onClose();
        onRemoveShared?.();
    };

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
                            boxShadow: isDarkMode
                                ? '0px 12px 24px rgba(2, 8, 17, 0.5)'
                                : '0px 12px 24px rgba(1, 55, 125, 0.12)',
                        },
                    ]}
                    onPress={(e) => e.stopPropagation()}
                    className="w-72 rounded-3xl p-4 border"
                >
                    {/* Header */}
                    <View
                        style={{ borderBottomColor: activeColors.border }}
                        className="flex-row items-center justify-between pb-3 mb-2 border-b"
                    >
                        <Text
                            style={{ color: activeColors.cardForeground }}
                            className="font-fraunces-bold text-base flex-1 mr-2"
                            numberOfLines={1}
                        >
                            {title}
                        </Text>
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

                    {/* Menu Options */}
                    {isShared ? (
                        /* Shared Wishlist Options: Share & Remove from Shared */
                        <>
                            <TouchableOpacity
                                onPress={handleShare}
                                className="flex-row items-center py-3 px-2 rounded-xl active:opacity-70"
                            >
                                <Ionicons
                                    name="share-outline"
                                    size={20}
                                    color={activeColors.cardForeground}
                                />
                                <Text
                                    style={{ color: activeColors.cardForeground }}
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
                                    color={activeColors.destructive}
                                />
                                <Text
                                    style={{ color: activeColors.destructive }}
                                    className="text-base font-nunito-bold ml-3"
                                >
                                    Remove from Shared
                                </Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        /* Owned Wishlist Options: Add Item, Rename, Share, Delete */
                        <>
                            <TouchableOpacity
                                onPress={handleAddItem}
                                className="flex-row items-center py-3 px-2 rounded-xl active:opacity-70"
                            >
                                <Ionicons
                                    name="add-circle-outline"
                                    size={20}
                                    color={activeColors.cardForeground}
                                />
                                <Text
                                    style={{ color: activeColors.cardForeground }}
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
                                    color={activeColors.cardForeground}
                                />
                                <Text
                                    style={{ color: activeColors.cardForeground }}
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
                                    color={activeColors.cardForeground}
                                />
                                <Text
                                    style={{ color: activeColors.cardForeground }}
                                    className="text-base font-nunito-semibold ml-3"
                                >
                                    Share
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleArchive}
                                className="flex-row items-center py-3 px-2 rounded-xl active:opacity-70"
                            >
                                <Ionicons
                                    name="lock-closed-outline"
                                    size={20}
                                    color={activeColors.cardForeground}
                                />
                                <Text
                                    style={{ color: activeColors.cardForeground }}
                                    className="text-base font-nunito-semibold ml-3"
                                >
                                    Archive
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
                                    color={activeColors.destructive}
                                />
                                <Text
                                    style={{ color: activeColors.destructive }}
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
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    menuContainer: {
        elevation: 10,
    },
});

export default WishlistCardMenuModal;
