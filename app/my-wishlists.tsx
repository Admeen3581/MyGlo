// app/index.tsx
import React from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    Pressable,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Redirect } from 'expo-router';
import { useAuth } from '@clerk/expo';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/core/Button';
import { ScreenWrapper } from '@/components/wrapper/ScreenWrapper';

export default function Index() {
    const router = useRouter();
    const { isLoaded, isSignedIn } = useAuth();
    const { isDarkMode, activeColors } = useTheme();

    // Reactive subscription to public wishlists from Convex
    const wishlists = useQuery(api.wishlists.getFeed);

    if (!isLoaded) {
        return null;
    }

    if (!isSignedIn) {
        return <Redirect href="/onboarding" />;
    }

    return (
        <SafeAreaView
            style={[
                styles.safeArea,
                { backgroundColor: activeColors.background },
            ]}
        >
            <ScreenWrapper variant="default">
                <View className="flex-1 px-4 pt-4">
                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-2xl font-bold text-gray-900">
                            Explore Wishlists
                        </Text>
                        <Button
                            title="Test Page"
                            variant="primary"
                            size="sm"
                            isDarkMode={isDarkMode}
                            onPress={() => router.push('/testpage' as any)}
                        />
                    </View>

                    {/* Loading State */}
                    {wishlists === undefined ? (
                        <View className="flex-1 items-center justify-center py-20">
                            <ActivityIndicator size="large" color="#4F46E5" />
                            <Text className="mt-3 text-sm text-gray-500">
                                Loading wishlists...
                            </Text>
                        </View>
                    ) : wishlists.length === 0 ? (
                        /* Empty State */
                        <View className="flex-1 items-center justify-center py-20 px-4">
                            <Text className="text-lg font-semibold text-gray-800">
                                No wishlists found
                            </Text>
                            <Text className="text-center text-sm text-gray-500 mt-1 mb-6">
                                Create a wishlist or trigger the seed mutation from your dashboard.
                            </Text>
                        </View>
                    ) : (
                        /* Feed List */
                        <FlatList
                            data={wishlists}
                            keyExtractor={(item) => item._id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 32 }}
                            renderItem={({ item }) => (
                                <Pressable
                                    className="mb-4 rounded-2xl bg-white p-5 shadow-sm border border-gray-100 active:opacity-80"
                                    onPress={() => {
                                        // router.push(`/wishlist/${item._id}` as any);
                                    }}
                                >
                                    <View className="flex-row items-center justify-between mb-2">
                                        <Text className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                                            {item.ownerName}'s List
                                        </Text>
                                        <View className="rounded-full bg-gray-100 px-2.5 py-0.5">
                                            <Text className="text-xs text-gray-600">
                                                {item.itemCount} {item.itemCount === 1 ? 'item' : 'items'}
                                            </Text>
                                        </View>
                                    </View>

                                    <Text className="text-lg font-bold text-gray-900">
                                        {item.title}
                                    </Text>

                                    {item.description ? (
                                        <Text className="mt-1 text-sm text-gray-600" numberOfLines={2}>
                                            {item.description}
                                        </Text>
                                    ) : null}

                                    {item.keepPurchasesSecret && (
                                        <View className="mt-3 self-start rounded bg-amber-50 px-2 py-0.5 border border-amber-200">
                                            <Text className="text-[11px] font-medium text-amber-700">
                                                Surprise Mode Active
                                            </Text>
                                        </View>
                                    )}
                                </Pressable>
                            )}
                        />
                    )}
                </View>
            </ScreenWrapper>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
});