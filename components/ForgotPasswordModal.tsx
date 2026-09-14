import React, { useState, useRef, useEffect, useContext } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    useWindowDimensions,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LightColors, DarkColors } from '@/constants/colors';
import { ThemeContext } from '@/context/ThemeContext';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useSignIn, useClerk } from '@clerk/expo';

interface ForgotPasswordModalProps {
    visible: boolean;
    initialEmail?: string;
    onClose: () => void;
    onSuccess: () => void;
    isDarkMode?: boolean;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
    visible,
    initialEmail = '',
    onClose,
    onSuccess,
    isDarkMode: customDarkMode,
}) => {
    const context = useContext(ThemeContext);
    const isDarkMode = customDarkMode !== undefined ? customDarkMode : (context?.isDarkMode ?? false);
    const activeColors = isDarkMode ? DarkColors : LightColors;
    const { width } = useWindowDimensions();
    const isMobile = width < 640;

    const { signIn } = useSignIn();
    const { setActive } = useClerk();

    const [step, setStep] = useState<'request' | 'verify'>('request');
    const [email, setEmail] = useState(initialEmail);
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
    const [isCodeVerified, setIsCodeVerified] = useState(false);

    const codeInputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                setStep('request');
                setEmail(initialEmail);
                setCode('');
                setNewPassword('');
                setConfirmPassword('');
                setErrorMessage('');
                setIsLoading(false);
                setResendStatus('idle');
                setIsCodeVerified(false);
            }, 150);
            return () => clearTimeout(timer);
        }
    }, [visible, initialEmail]);

    const handleSendCode = async () => {
        if (isLoading) return;

        if (!email.trim()) {
            setErrorMessage('Please enter your email address.');
            return;
        }

        setErrorMessage('');
        setIsLoading(true);

        try {
            const { error: createError } = await signIn.create({
                identifier: email.trim(),
            });

            if (createError) {
                {/*CyberFeature -- if user types in unknown email -> redirects as a success. Email not sent.*/}
                if(createError.message.toLowerCase().includes("couldn't find your account")) {
                    setStep('verify');
                    setIsCodeVerified(false);
                    setTimeout(() => codeInputRef.current?.focus(), 200);
                    setIsLoading(false);
                    return;
                }

                setErrorMessage(createError.message || 'Failed to locate account. Please check your email.');
                setIsLoading(false);
                return;
            }

            const { error: sendError } = await signIn.resetPasswordEmailCode.sendCode();
            if (sendError) {
                setErrorMessage(sendError.message || 'Failed to send recovery code. Please try again.');
                setIsLoading(false);
                return;
            }

            setStep('verify');
            setIsCodeVerified(false);
            setTimeout(() => codeInputRef.current?.focus(), 200);
        } catch (err: any) {
            console.error('Send reset code error:', err);

            const clerkMsg = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || err?.message;
            setErrorMessage(clerkMsg || 'Failed to send recovery code.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (isLoading) return;

        if (code.trim().length !== 6) {
            setErrorMessage('Please enter the 6-digit recovery code.');
            return;
        }
        if (!newPassword) {
            setErrorMessage('Please enter a new password.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        setErrorMessage('');
        setIsLoading(true);

        try {
            if (!isCodeVerified) {
                const { error: verifyError } = await signIn.resetPasswordEmailCode.verifyCode({
                    code: code.trim(),
                });

                if (verifyError) {
                    {/*CyberFeature -- if user types in unknown email -> redirects as a success. Code not sent.*/}
                    if(verifyError.message.toLowerCase().includes("we were unable to complete factor one verification")) {
                        setErrorMessage("Invalid recovery code. Please try again.");
                        setIsLoading(false);
                        return;
                    }
                    setErrorMessage(verifyError.message || 'Invalid recovery code. Please try again.');
                    setIsLoading(false);
                    return;
                }
                setIsCodeVerified(true);
            }

            const { error: submitError } = await signIn.resetPasswordEmailCode.submitPassword({
                password: newPassword,
            });

            if (submitError) {
                setErrorMessage(submitError.message || 'Failed to update password.');
                setIsLoading(false);
                return;
            }

            if (signIn.status === 'complete' && signIn.createdSessionId) {
                await setActive({ session: signIn.createdSessionId });
                onSuccess();
            } else {
                setErrorMessage('Password updated successfully. Please sign in.');
                setTimeout(() => onClose(), 1500);
            }
        } catch (err: any) {
            console.error('Reset password error:', err);
            const clerkMsg = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || err?.message;
            setErrorMessage(clerkMsg || 'Password reset failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        try {
            setErrorMessage('');
            setResendStatus('sending');
            setIsCodeVerified(false);
            const { error } = await signIn.resetPasswordEmailCode.sendCode();

            if (error) {
                {/*CyberFeature -- if user types in unknown email -> redirects as a success. Code not sent.*/}
                if(error.message.toLowerCase().includes("clerk: reset password email code"))
                {
                    setResendStatus('sent');
                    setErrorMessage('');
                    setTimeout(() => setResendStatus('idle'), 3000);
                    return;
                }
                setErrorMessage(error.message || 'Failed to resend recovery code.');
                setResendStatus('idle');
                return;
            }

            setResendStatus('sent');
            setTimeout(() => setResendStatus('idle'), 3000);
        } catch (err: any) {
            const clerkMsg = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || err?.message;
            setErrorMessage(clerkMsg || 'Failed to resend recovery code.');
            setResendStatus('idle');
        }
    };

    const handleCodeChange = (text: string) => {
        const cleaned = text.replace(/[^0-9]/g, '').slice(0, 6);
        setCode(cleaned);
        setIsCodeVerified(false);
        if (errorMessage) setErrorMessage('');
    };

    const digits = code.split('');

    const cardContent = (
        <Card
            variant="default"
            isDarkMode={isDarkMode}
            style={isMobile ? styles.mobileCardStyle : undefined}
            className={
                isMobile
                    ? 'w-full h-full flex-1 p-6 justify-between'
                    : 'w-full max-w-85 p-6'
            }
        >
            {/* Modal Header */}
            <View className="w-full flex-row justify-between items-center mb-4">
                <View
                    style={{ backgroundColor: isDarkMode ? activeColors.accent : '#E8F2EF' }}
                    className={isMobile ? 'w-12 h-12 rounded-full items-center justify-center' : 'w-10 h-10 rounded-full items-center justify-center'}
                >
                    <Ionicons
                        name={step === 'request' ? 'key-outline' : 'lock-open-outline'}
                        size={isMobile ? 24 : 20}
                        color={activeColors.primary}
                    />
                </View>
                <TouchableOpacity
                    onPress={onClose}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    activeOpacity={0.7}
                >
                    <Ionicons name="close" size={isMobile ? 26 : 22} color={activeColors.mutedForeground} />
                </TouchableOpacity>
            </View>

            {/* Scrollable Content inside modal */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                keyboardShouldPersistTaps="handled"
            >
                {step === 'request' ? (
                    <View className="w-full">
                        <Text
                            style={{ color: activeColors.foreground }}
                            className={isMobile ? 'text-3xl font-fraunces-bold text-center mb-2' : 'text-2xl font-fraunces-bold text-center mb-2'}
                        >
                            Reset Password
                        </Text>
                        <Text
                            style={{ color: activeColors.mutedForeground }}
                            className="text-xs font-nunito-semibold text-center mb-6 leading-relaxed px-2"
                        >
                            Enter your account email address to receive a 6-digit recovery code.
                        </Text>

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
                            returnKeyType="send"
                            onSubmitEditing={handleSendCode}
                            leftIcon={
                                <Ionicons name="mail-outline" size={18} color={activeColors.mutedForeground} />
                            }
                            isDarkMode={isDarkMode}
                        />

                        {errorMessage ? (
                            <Text
                                style={{ color: activeColors.destructive }}
                                className="text-xs font-nunito-semibold text-center mt-2 px-2"
                            >
                                {errorMessage}
                            </Text>
                        ) : null}

                        <View className="mt-6">
                            <Button
                                title={isLoading ? 'Sending Code...' : 'Send Recovery Code'}
                                variant="primary"
                                size="lg"
                                isDarkMode={isDarkMode}
                                onPress={handleSendCode}
                                disabled={isLoading}
                            />
                        </View>
                    </View>
                ) : (
                    <View className="w-full">
                        <Text
                            style={{ color: activeColors.foreground }}
                            className={isMobile ? 'text-3xl font-fraunces-bold text-center mb-2' : 'text-2xl font-fraunces-bold text-center mb-2'}
                        >
                            New Password
                        </Text>
                        <Text
                            style={{ color: activeColors.mutedForeground }}
                            className="text-xs font-nunito-semibold text-center mb-5 leading-relaxed px-2"
                        >
                            Code sent to{' '}
                            <Text style={{ color: activeColors.foreground }} className="font-nunito-bold">
                                {email}
                            </Text>
                        </Text>

                        {/* 6-digit Code Input Slots */}
                        <Text
                            style={{ color: activeColors.mutedForeground }}
                            className="text-xs font-nunito-bold mb-2 uppercase tracking-wider"
                        >
                            Recovery Code
                        </Text>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => codeInputRef.current?.focus()}
                            className="flex-row items-center justify-center gap-2 mb-4"
                        >
                            {[0, 1, 2, 3, 4, 5].map((index) => {
                                const isFilled = index < digits.length;
                                const isCurrentFocus = index === digits.length || (index === 5 && digits.length === 6);

                                return (
                                    <View
                                        key={index}
                                        style={[
                                            styles.digitBox,
                                            {
                                                backgroundColor: isDarkMode ? 'rgba(22, 34, 42, 0.9)' : '#FFFFFF',
                                                borderColor: errorMessage
                                                    ? activeColors.destructive
                                                    : isCurrentFocus
                                                        ? activeColors.primary
                                                        : isFilled
                                                            ? activeColors.secondary
                                                            : activeColors.border,
                                                borderWidth: isCurrentFocus ? 2 : 1,
                                            },
                                        ]}
                                        className={isMobile ? 'w-12 h-14 rounded-xl items-center justify-center shadow-sm' : 'w-10 h-10 rounded-xl items-center justify-center shadow-sm'}
                                    >
                                        <Text
                                            style={{ color: activeColors.foreground }}
                                            className={isMobile ? 'text-3xl font-fraunces-bold' : 'text-2xl font-fraunces-bold'}
                                        >
                                            {digits[index] || ''}
                                        </Text>
                                    </View>
                                );
                            })}
                        </TouchableOpacity>

                        <TextInput
                            ref={codeInputRef}
                            value={code}
                            onChangeText={handleCodeChange}
                            keyboardType="number-pad"
                            maxLength={6}
                            style={styles.hiddenInput}
                            caretHidden
                            returnKeyType="next"
                            onSubmitEditing={handleResetPassword}
                        />

                        {/* Password Inputs */}
                        <Input
                            label="New Password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChangeText={(text) => {
                                setNewPassword(text);
                                if (errorMessage) setErrorMessage('');
                            }}
                            secureTextEntry={!showPassword}
                            returnKeyType="next"
                            onSubmitEditing={handleResetPassword}
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

                        <View className="mt-3">
                            <Input
                                label="Confirm New Password"
                                placeholder="Re-enter new password"
                                value={confirmPassword}
                                onChangeText={(text) => {
                                    setConfirmPassword(text);
                                    if (errorMessage) setErrorMessage('');
                                }}
                                secureTextEntry={!showPassword}
                                returnKeyType="done"
                                onSubmitEditing={handleResetPassword}
                                leftIcon={
                                    <Ionicons name="lock-closed-outline" size={18} color={activeColors.mutedForeground} />
                                }
                                isDarkMode={isDarkMode}
                            />
                        </View>

                        {errorMessage ? (
                            <Text
                                style={{ color: activeColors.destructive }}
                                className="text-xs font-nunito-semibold text-center mt-2 px-2"
                            >
                                {errorMessage}
                            </Text>
                        ) : null}

                        {/* Actions */}
                        <View className="mt-5">
                            <Button
                                title={isLoading ? 'Updating Password...' : 'Reset Password & Sign In'}
                                variant="primary"
                                size="lg"
                                isDarkMode={isDarkMode}
                                onPress={handleResetPassword}
                                disabled={isLoading}
                            />
                        </View>

                        <TouchableOpacity
                            onPress={handleResendCode}
                            disabled={resendStatus === 'sending' || isLoading}
                            activeOpacity={0.7}
                            className="py-3 flex-row items-center justify-center"
                        >
                            <Text
                                style={{ color: activeColors.primary }}
                                className="text-xs font-nunito-bold text-center"
                            >
                                {resendStatus === 'sending'
                                    ? 'Sending code...'
                                    : resendStatus === 'sent'
                                        ? 'Code sent!'
                                        : "Didn't receive code? Resend"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </Card>
    );

    return (
        <Modal
            visible={visible}
            transparent={!isMobile}
            animationType={isMobile ? 'slide' : 'fade'}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={[
                    isMobile ? styles.mobileOverlayContainer : styles.overlayContainer,
                    { backgroundColor: isDarkMode ? 'rgba(7, 11, 14, 0.75)' : 'rgba(16, 33, 41, 0.65)' },
                ]}
            >
                {!isMobile && (
                    <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        activeOpacity={1}
                        onPress={onClose}
                    />
                )}

                {isMobile ? (
                    <SafeAreaView style={styles.safeArea}>
                        {cardContent}
                    </SafeAreaView>
                ) : (
                    cardContent
                )}
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlayContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    mobileOverlayContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    safeArea: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    mobileCardStyle: {
        borderRadius: 0,
        borderWidth: 0,
        shadowOpacity: 0,
        elevation: 0,
    },
    digitBox: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    hiddenInput: {
        position: 'absolute',
        width: 1,
        height: 1,
        opacity: 0,
    },
});

export default ForgotPasswordModal;
