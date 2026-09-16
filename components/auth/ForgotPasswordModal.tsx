import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/core/Card';
import { Input } from '@/components/core/Input';
import { Button } from '@/components/core/Button';
import { CodeInput } from '@/components/auth/CodeInput';
import { ModalWrapper } from '../wrapper/ModalWrapper';
import { useTheme } from '@/hooks/useTheme';
import { getClerkErrorMessage } from '@/lib/clerk';
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
    const { isDarkMode, activeColors } = useTheme(customDarkMode);
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

    // Reset internal state when modal visibility changes
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
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [visible, initialEmail]);

    // Send reset code to user's email
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
                // CyberFeature: If account is not found, proceed to verification step silently to prevent account enumeration attacks
                if (createError.message.toLowerCase().includes("couldn't find your account")) {
                    setStep('verify');
                    setIsCodeVerified(false);
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
        } catch (err: unknown) {
            console.error('Send reset code error:', err);
            setErrorMessage(getClerkErrorMessage(err, 'Failed to send recovery code.'));
        } finally {
            setIsLoading(false);
        }
    };

    // Verify reset code and set new password
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
                    // CyberFeature: Display generic invalid code error for unverified attempts
                    if (verifyError.message.toLowerCase().includes("we were unable to complete factor one verification")) {
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
        } catch (err: unknown) {
            console.error('Reset password error:', err);
            setErrorMessage(getClerkErrorMessage(err, 'Password reset failed. Please try again.'));
        } finally {
            setIsLoading(false);
        }
    };

    // Resend 6-digit recovery code
    const handleResendCode = async () => {
        try {
            setErrorMessage('');
            setResendStatus('sending');
            setIsCodeVerified(false);
            const { error } = await signIn.resetPasswordEmailCode.sendCode();

            if (error) {
                // CyberFeature: Mask rate-limit/account error as sent to preserve privacy
                if (error.message.toLowerCase().includes("clerk: reset password email code")) {
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
        } catch (err: unknown) {
            setErrorMessage(getClerkErrorMessage(err, 'Failed to resend recovery code.'));
            setResendStatus('idle');
        }
    };

    const handleCodeChange = (text: string) => {
        setCode(text);
        setIsCodeVerified(false);
        if (errorMessage) setErrorMessage('');
    };

    const isEmailDestructive =
        !!errorMessage &&
        step === 'request' &&
        (!email.trim() ||
            errorMessage.toLowerCase().includes('email') ||
            errorMessage.toLowerCase().includes('account') ||
            errorMessage.toLowerCase().includes('check') ||
            errorMessage.toLowerCase().includes('enter'));

    const isNewPasswordDestructive =
        !!errorMessage &&
        step === 'verify' &&
        (!newPassword || errorMessage.toLowerCase().includes('password'));

    const isConfirmPasswordDestructive =
        !!errorMessage &&
        step === 'verify' &&
        (!confirmPassword ||
            confirmPassword !== newPassword ||
            errorMessage.toLowerCase().includes('match') ||
            errorMessage.toLowerCase().includes('password'));

    return (
        <ModalWrapper visible={visible} onClose={onClose} isDarkMode={isDarkMode}>
            <Card
                variant="default"
                isDarkMode={isDarkMode}
                style={isMobile ? { borderRadius: 0, borderWidth: 0, boxShadow: 'none', elevation: 0 } : undefined}
                className={
                    isMobile
                        ? 'w-full h-full flex-1 p-6 justify-between'
                        : 'w-full max-w-md p-6'
                }
            >
                {/* Modal Header Row */}
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

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                    keyboardShouldPersistTaps="handled"
                >
                    {step === 'request' ? (
                        /* Step 1: Request Password Reset */
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
                                statusType={isEmailDestructive ? 'destructive' : null}
                                placeholder="name@example.com"
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    if (errorMessage) setErrorMessage('');
                                }}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoComplete="email"
                                textContentType="emailAddress"
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
                        /* Step 2: Verify Code and Reset Password */
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

                            <Text
                                style={{ color: activeColors.mutedForeground }}
                                className="text-xs font-nunito-bold mb-2 uppercase tracking-wider"
                            >
                                Recovery Code
                            </Text>

                            <CodeInput
                                code={code}
                                onChangeCode={handleCodeChange}
                                isDarkMode={isDarkMode}
                                hasError={!!errorMessage}
                                autoFocus={step === 'verify'}
                                onSubmitEditing={handleResetPassword}
                            />

                            <Input
                                label="New Password"
                                statusType={isNewPasswordDestructive ? 'destructive' : null}
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
                                    statusType={isConfirmPasswordDestructive ? 'destructive' : null}
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
        </ModalWrapper>
    );
};

export default ForgotPasswordModal;
