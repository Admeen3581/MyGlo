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
import { VerificationModal } from '@/components/VerificationModal';
import { TermsOfService } from "@/components/TermsOfService";
import { PrivacyPolicy } from "@/components/PrivacyPolicy";
import { ScreenWrapper } from '@/components/ScreenWrapper';
import {
    getEmailStatus,
    getPasswordStatus,
    getConfirmPasswordStatus,
    ValidationStatus,
} from '@/lib/validation';

export default function SignUpScreen() {
    const router = useRouter();
    const { isDarkMode, toggleDarkMode, activeColors } = useTheme();

    const [email, setEmail] = useState('');
    const [emailBlurred, setEmailBlurred] = useState(false);
    const [isEmailUnavailable] = useState(false); // Extensible flag for backend check

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [showTOSModal, setShowTOSModal] = useState(false);

    const handleCreateAccount = () => {
        setShowVerificationModal(true);
    };

    const handleLinkToPrivacy = () => {
        setShowPrivacyModal(true);
    };

    const handleLinktoTOS = () => {
        setShowTOSModal(true);
    };

    const handleVerificationSuccess = () => {
        setShowVerificationModal(false);
        router.replace('/');
    };

    // Helper to render status text message outside the textbox (in rightLabel)
    const renderStatusLabel = (status: ValidationStatus | null) => {
        if (!status) return null;

        let color = activeColors.success;
        if (status.type === 'warning') {
            color = activeColors.warning;
        } else if (status.type === 'destructive') {
            color = activeColors.destructive;
        }

        return (
            <Text
                style={{ color }}
                className="text-xs font-nunito-semibold"
            >
                {status.text}
            </Text>
        );
    };

    // Helper to render status symbol icon inside the textbox (in rightIcon)
    const renderStatusIcon = (status: ValidationStatus | null) => {
        if (!status) return null;

        let color = activeColors.success;
        let iconName: keyof typeof Ionicons.glyphMap = 'checkmark-circle';

        if (status.type === 'warning') {
            color = activeColors.warning;
            iconName = 'alert-circle';
        } else if (status.type === 'destructive') {
            color = activeColors.destructive;
            iconName = 'alert-circle';
        }

        return <Ionicons name={iconName} size={20} color={color} />;
    };

    const emailStatus = getEmailStatus(email, emailBlurred, isEmailUnavailable);
    const passwordStatus = getPasswordStatus(password);
    const confirmPasswordStatus = getConfirmPasswordStatus(confirmPassword, password);

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
                            Join the Circle
                        </Text>
                        <Text
                            style={{ color: activeColors.mutedForeground }}
                            className="text-sm font-nunito-semibold leading-relaxed"
                        >
                            Take a deep breath and prepare to feel the joy of giving.
                        </Text>
                    </View>

                    {/* Form Container Card */}
                    <Card variant="tl-large" isDarkMode={isDarkMode} className="mb-6 space-y-4 p-5">
                        <Input
                            label="Email Address"
                            rightLabel={renderStatusLabel(emailStatus)}
                            placeholder="name@example.com"
                            value={email}
                            onChangeText={setEmail}
                            onBlur={() => setEmailBlurred(true)}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            leftIcon={
                                <Ionicons name="mail-outline" size={18} color={activeColors.mutedForeground} />
                            }
                            rightIcon={renderStatusIcon(emailStatus)}
                            isDarkMode={isDarkMode}
                        />

                        <Input
                            label="Password"
                            rightLabel={renderStatusLabel(passwordStatus)}
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={true}
                            leftIcon={
                                <Ionicons name="lock-closed-outline" size={18} color={activeColors.mutedForeground} />
                            }
                            rightIcon={
                                <View className="flex-row items-center gap-2">
                                    {renderStatusIcon(passwordStatus)}
                                </View>
                            }
                            isDarkMode={isDarkMode}
                        />

                        <Input
                            label="Verify Password"
                            rightLabel={renderStatusLabel(confirmPasswordStatus)}
                            placeholder="Reenter your password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={true}
                            leftIcon={
                                <Ionicons name="lock-closed-outline" size={18} color={activeColors.mutedForeground} />
                            }
                            rightIcon={
                                <View className="flex-row items-center gap-2">
                                    {renderStatusIcon(confirmPasswordStatus)}
                                </View>
                            }
                            isDarkMode={isDarkMode}
                        />

                        {/* Create Account Primary Action Button */}
                        <View className="pt-2">
                            <Button
                                title="Create Account"
                                variant="primary"
                                size="lg"
                                isDarkMode={isDarkMode}
                                onPress={handleCreateAccount}
                            />
                        </View>

                        {/* Social Auth Buttons Component */}
                        <SocialAuthButtons isDarkMode={isDarkMode} />


                        {/* Terms & Privacy Policy Note */}
                        <View className="pt-2 px-1 mt-3">
                            <Text
                                style={{ color: activeColors.mutedForeground }}
                                className="text-xs font-nunito-medium leading-relaxed text-center"
                            >
                                By signing up, you agree to our{' '}
                                <Text
                                    onPress={handleLinktoTOS}
                                    style={{ color: activeColors.primary }}
                                    className="font-nunito-bold underline"
                                >
                                    Terms of Service
                                </Text>{' '}
                                and{' '}
                                <Text
                                    onPress={handleLinkToPrivacy}
                                    style={{ color: activeColors.primary }}
                                    className="font-nunito-bold underline"
                                >
                                    Privacy Policy
                                </Text>
                                .
                            </Text>
                        </View>
                    </Card>

                    {/* Footer Navigation Link */}
                    <View className="flex-row items-center justify-center py-6">
                        <Text
                            style={{ color: activeColors.mutedForeground }}
                            className="text-sm font-nunito-medium mr-1"
                        >
                            Already have an account?
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push('/signin' as any)}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={{ color: activeColors.primary }}
                                className="text-sm font-nunito-bold"
                            >
                                Sign In
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScreenWrapper>
            </ScrollView>

            {/* Verification Code Modal */}
            <VerificationModal
                visible={showVerificationModal}
                email={email}
                onClose={() => setShowVerificationModal(false)}
                onSuccess={handleVerificationSuccess}
                isDarkMode={isDarkMode}
            />

            {/* Policies Modals */}
            <TermsOfService
                visible={showTOSModal}
                onClose={() => setShowTOSModal(false)}
                isDarkMode={isDarkMode}
            />
            <PrivacyPolicy
                visible={showPrivacyModal}
                onClose={() => setShowPrivacyModal(false)}
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
