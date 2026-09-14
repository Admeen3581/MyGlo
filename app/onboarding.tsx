import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Redirect } from 'expo-router';
import { useAuth } from '@clerk/expo';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { BlobBackground } from '@/components/BlobBackground';
import { MyGloLogo } from '@/components/MyGloLogo';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { images } from '@/constants/images';

export default function OnboardingScreen() {
    const router = useRouter();
    const { isLoaded, isSignedIn } = useAuth();
    const { isDarkMode, toggleDarkMode, activeColors } = useTheme();

    if (!isLoaded) {
        return null;
    }

    if (isSignedIn) {
        return <Redirect href="/" />;
    }

    const handleGetStarted = () => {
        router.push('/signup' as any);
    };

    const handleExistingAccount = () => {
        router.push('/signin' as any);
    };

    return (
        <SafeAreaView
            style={[
                styles.safeArea,
                { backgroundColor: activeColors.background },
            ]}
        >
            {/* Organic Background Blobs */}
            <BlobBackground
                color={activeColors.secondary}
                size={320}
                variant="blob1"
                style={{ top: -60, right: -80, opacity: isDarkMode ? 0.18 : 0.3 }}
            />
            <BlobBackground
                color={activeColors.accent}
                size={260}
                variant="blob2"
                style={{ top: 300, left: -90, opacity: isDarkMode ? 0.15 : 0.2 }}
            />
            <BlobBackground
                color={activeColors.primary}
                size={340}
                variant="blob3"
                style={{ bottom: -40, right: -110, opacity: isDarkMode ? 0.15 : 0.2 }}
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                <ScreenWrapper variant="auth" className="flex-1 justify-between">
                    {/* Top Header Navigation */}
                    <View className="flex-row items-center justify-between mb-6 pt-2">
                        <MyGloLogo type="standard" isDarkMode={isDarkMode} size="sm" />
                        <TouchableOpacity
                            onPress={toggleDarkMode}
                            activeOpacity={0.8}
                            style={{
                                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                                borderColor: activeColors.border,
                            }}
                            className="px-3 py-1.5 rounded-full border flex-row items-center"
                        >
                            <Text
                                style={{ color: activeColors.foreground }}
                                className="text-xs font-nunito-bold"
                            >
                                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Center Illustration Frame */}
                    <View className="items-center justify-center my-4">
                        <Card
                            variant="tl-large"
                            isDarkMode={isDarkMode}
                            className="w-full aspect-square max-w-[320px] items-center justify-center p-4 overflow-hidden"
                            style={{
                                backgroundColor: isDarkMode ? '#14232C' : '#E8F2EF',
                                borderColor: isDarkMode ? 'rgba(32, 164, 181, 0.2)' : 'rgba(132, 210, 189, 0.4)',
                            }}
                        >
                            <Image
                                source={images.onboarding}
                                style={styles.illustrationImage}
                                contentFit="cover"
                                priority="high"
                                transition={200}
                            />
                        </Card>
                    </View>

                    {/* Text Content Section */}
                    <View className="mt-6 mb-8 px-2 items-center">
                        <Text
                            style={{ color: activeColors.foreground }}
                            className="text-3xl font-fraunces-black text-center leading-tight mb-1"
                        >
                            Thoughtful giving,
                        </Text>
                        <Text
                            style={{ color: activeColors.foreground }}
                            className="text-3xl font-fraunces-black text-center leading-tight mb-4"
                        >
                            naturally shared.
                        </Text>

                        <Text
                            style={{ color: activeColors.mutedForeground }}
                            className="text-base font-nunito-semibold text-center leading-relaxed max-w-75"
                        >
                            Curate wishlists, share with friends and family, all without spoilers and duplicates ever again.
                        </Text>
                    </View>

                    {/* Bottom Actions */}
                    <View className="w-full mt-auto space-y-4 pt-4">
                        <Button
                            title="Get Started"
                            variant="primary"
                            size="lg"
                            isDarkMode={isDarkMode}
                            onPress={handleGetStarted}
                        />

                        <View className="flex-row items-center justify-center py-2 pt-3">
                            <TouchableOpacity onPress={handleExistingAccount} activeOpacity={0.7}>
                                <Text
                                    style={{ color: activeColors.primary }}
                                    className="text-sm font-nunito-bold"
                                >
                                    I already have an account
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScreenWrapper>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 28,
        justifyContent: 'space-between',
    },
    illustrationImage: {
        width: '100%',
        height: '100%',
        borderTopLeftRadius: 48,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
    },
});
