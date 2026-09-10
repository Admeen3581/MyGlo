import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card } from '@/components/Card';
import { BlobBackground } from '@/components/BlobBackground';
import { MyGloLogo } from '@/components/MyGloLogo';
import { SocialAuthButtons } from '@/components/SocialAuthButtons';

export default function SignInScreen() {
    const router = useRouter();
    const { isDarkMode, toggleDarkMode, activeColors } = useTheme();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Blank onPress function as explicitly instructed by prompt
    const handleSignIn = () => {};

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
                size={300}
                variant="blob1"
                style={{ top: -50, right: -70, opacity: isDarkMode ? 0.18 : 0.25 }}
            />
            <BlobBackground
                color={activeColors.accent}
                size={250}
                variant="blob2"
                style={{ top: 250, left: -80, opacity: isDarkMode ? 0.12 : 0.18 }}
            />
            <BlobBackground
                color={activeColors.primary}
                size={320}
                variant="blob3"
                style={{ bottom: -30, right: -90, opacity: isDarkMode ? 0.15 : 0.2 }}
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Top Header Navigation */}
                <View className="flex-row items-center justify-between mb-6 pt-2">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                        style={{
                            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                            borderColor: activeColors.border,
                        }}
                        className="w-10 h-10 rounded-full border items-center justify-center"
                    >
                        <Ionicons name="arrow-back" size={20} color={activeColors.foreground} />
                    </TouchableOpacity>

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
                            {isDarkMode ? 'Light' : 'Dark'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Title Section */}
                <View className="mb-6">
                    <Text
                        style={{ color: activeColors.foreground }}
                        className="text-3xl font-fraunces-black mb-2"
                    >
                        Welcome Back
                    </Text>
                    <Text
                        style={{ color: activeColors.mutedForeground }}
                        className="text-sm font-nunito-semibold leading-relaxed"
                    >
                        Sign in to continue to your account.
                    </Text>
                </View>

                {/* Form Container Card */}
                <Card variant="tl-large" isDarkMode={isDarkMode} className="mb-6 space-y-4 p-5">
                    <Input
                        label="Email Address"
                        placeholder="name@example.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        leftIcon={
                            <Ionicons name="mail-outline" size={18} color={activeColors.mutedForeground} />
                        }
                        isDarkMode={isDarkMode}
                    />

                    <Input
                        label="Password"
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        leftIcon={
                            <Ionicons name="lock-closed-outline" size={18} color={activeColors.mutedForeground} />
                        }
                        rightIcon={
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Ionicons
                                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={18}
                                    color={activeColors.mutedForeground}
                                />
                            </TouchableOpacity>
                        }
                        isDarkMode={isDarkMode}
                    />

                    {/* Sign In Action Button (Blank onPress function) */}
                    <View className="pt-2">
                        <Button
                            title="Sign In"
                            variant="primary"
                            size="lg"
                            isDarkMode={isDarkMode}
                            onPress={handleSignIn}
                        />
                    </View>

                    {/* Social Auth Buttons Component */}
                    <SocialAuthButtons isDarkMode={isDarkMode} />
                </Card>


                {/* Footer Navigation Link */}
                <View className="flex-row items-center justify-center py-6">
                    <Text
                        style={{ color: activeColors.mutedForeground }}
                        className="text-sm font-nunito-medium mr-1"
                    >
                        Don&#39;t have an account?
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push('/signup' as any)}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={{ color: activeColors.primary }}
                            className="text-sm font-nunito-bold"
                        >
                            Sign Up
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 40,
    },
});
