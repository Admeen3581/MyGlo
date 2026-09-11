import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useSignIn, useClerk } from '@clerk/expo';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card } from '@/components/Card';
import { BlobBackground } from '@/components/BlobBackground';
import { MyGloLogo } from '@/components/MyGloLogo';
import { SocialAuthButtons } from '@/components/SocialAuthButtons';
import { VerificationModal } from '@/components/VerificationModal';
import { ForgotPasswordModal } from '@/components/ForgotPasswordModal';
import { ScreenWrapper } from '@/components/ScreenWrapper';

export default function SignInScreen() {
    const router = useRouter();
    const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
    const { signIn } = useSignIn();
    const { setActive } = useClerk();
    const { isDarkMode, toggleDarkMode, activeColors } = useTheme();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

    if (!isAuthLoaded) {
        return null;
    }

    if (isSignedIn) {
        return <Redirect href="/" />;
    }

    const handleSignIn = async () => {
        if (!email.trim() || !password) {
            setErrorMessage('Please enter both email and password.');
            return;
        }

        setErrorMessage('');
        setIsLoading(true);

        try {
            const { error: signInError } = await signIn.password({
                emailAddress: email.trim(),
                password,
            });

            if (signInError) {
                setErrorMessage(signInError.message || 'Invalid email or password.');
                setIsLoading(false);
                return;
            }

            if (signIn.status === 'complete' && signIn.createdSessionId) {
                await setActive({ session: signIn.createdSessionId });
                router.replace('/');
            } else if (
                signIn.status === 'needs_client_trust' ||
                signIn.status === 'needs_first_factor' ||
                signIn.status === 'needs_second_factor'
            ) {
                // Trigger sending email verification code for device trust / MFA
                if (signIn.status === 'needs_second_factor') {
                    await signIn.mfa.sendEmailCode();
                } else {
                    await signIn.emailCode.sendCode();
                }
                setShowVerificationModal(true);
            } else {
                setErrorMessage('Sign in incomplete. Additional verification required.');
                setIsLoading(false);
            }
        } catch (err: any) {
            console.error('Sign in error:', err);
            const clerkMsg = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || err?.message;
            setErrorMessage(clerkMsg || 'An unexpected error occurred during sign in.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = () => {
        setShowForgotPasswordModal(true);
    };

    const handleVerificationSuccess = () => {
        setShowVerificationModal(false);
        router.replace('/');
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
                <ScreenWrapper variant="auth">
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
                            Take a deep breath and feel the joy of giving.
                        </Text>
                    </View>

                    {/* Form Container Card */}
                    <Card variant="tl-large" isDarkMode={isDarkMode} className="mb-6 space-y-4 p-5">
                        <Input
                            label="Email Address"
                            placeholder="name@example.com"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                if (errorMessage) setErrorMessage('');
                            }}
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
                            onChangeText={(text) => {
                                setPassword(text);
                                if (errorMessage) setErrorMessage('');
                            }}
                            secureTextEntry={!showPassword}
                            rightLabel={
                                <TouchableOpacity
                                    onPress={handleForgotPassword}
                                    activeOpacity={0.7}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Text
                                        style={{ color: activeColors.primary }}
                                        className="text-xs font-nunito-bold"
                                    >
                                        Forgot Password?
                                    </Text>
                                </TouchableOpacity>
                            }
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

                        {errorMessage ? (
                            <Text
                                style={{ color: activeColors.destructive }}
                                className="text-xs font-nunito-semibold text-center mt-1"
                            >
                                {errorMessage}
                            </Text>
                        ) : null}

                        {/* Sign In Action Button */}
                        <View className="pt-2">
                            <Button
                                title={isLoading ? 'Signing In...' : 'Sign In'}
                                variant="primary"
                                size="lg"
                                isDarkMode={isDarkMode}
                                onPress={handleSignIn}
                                disabled={isLoading}
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
                </ScreenWrapper>
            </ScrollView>

            {/* Verification Modal for Device Trust / MFA Verification */}
            <VerificationModal
                visible={showVerificationModal}
                email={email}
                mode="signin"
                onClose={() => setShowVerificationModal(false)}
                onSuccess={handleVerificationSuccess}
                isDarkMode={isDarkMode}
            />

            {/* Forgot Password Recovery Modal */}
            <ForgotPasswordModal
                visible={showForgotPasswordModal}
                initialEmail={email}
                onClose={() => setShowForgotPasswordModal(false)}
                onSuccess={() => {
                    setShowForgotPasswordModal(false);
                    router.replace('/');
                }}
                isDarkMode={isDarkMode}
            />
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
        paddingBottom: 40,
    },
});
