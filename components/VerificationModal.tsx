import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { CodeInput } from '@/components/CodeInput';
import { ModalWrapper } from './ModalWrapper';
import { useTheme } from '@/hooks/useTheme';
import { getClerkErrorMessage } from '@/lib/clerk';
import { useSignUp, useSignIn, useClerk } from '@clerk/expo';

interface VerificationModalProps {
    visible: boolean;
    email?: string;
    mode?: 'signup' | 'signin';
    onClose: () => void;
    onSuccess: () => void;
    isDarkMode?: boolean;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
    visible,
    email,
    mode = 'signup',
    onClose,
    onSuccess,
    isDarkMode: customDarkMode,
}) => {
    const { isDarkMode, activeColors } = useTheme(customDarkMode);
    const { width } = useWindowDimensions();
    const isMobile = Platform.OS !== 'web' || width < 640;

    const [code, setCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

    const { signUp } = useSignUp();
    const { signIn } = useSignIn();
    const { setActive } = useClerk();

    // Reset code state on modal open
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                setErrorMessage('');
                setResendStatus('idle');
                setCode('');
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [visible]);

    const handleCodeChange = (cleanedCode: string) => {
        setCode(cleanedCode);
        if (errorMessage) setErrorMessage('');

        if (cleanedCode.length === 6 && !isVerifying) {
            handleVerify(cleanedCode);
        }
    };

    // Handles the verification code process for sign in MFA or sign up verification
    const handleVerify = async (codeToVerify?: string) => {
        const codeValue = codeToVerify || code;
        if (codeValue.length !== 6 || isVerifying) return;

        setErrorMessage('');
        setIsVerifying(true);

        try {
            if (mode === 'signin') {
                let result: { error: any };
                if (signIn.status === 'needs_second_factor') {
                    result = await signIn.mfa.verifyEmailCode({ code: codeValue });
                } else {
                    result = await signIn.emailCode.verifyCode({ code: codeValue });
                }

                if (result?.error) {
                    setErrorMessage(result.error.message || 'Invalid verification code. Please try again.');
                    setCode('');
                    setIsVerifying(false);
                    return;
                }

                if (signIn.createdSessionId) {
                    setCode('');
                    await setActive({ session: signIn.createdSessionId });
                    onSuccess();
                } else {
                    setErrorMessage('Verification incomplete. Additional steps required.');
                    setCode('');
                    setIsVerifying(false);
                }
            } else {
                // Sign Up email verification
                const { error: codeError } = await signUp.verifications.verifyEmailCode({ code: codeValue });
                if (codeError) {
                    setErrorMessage(codeError.message || 'Invalid verification code. Please try again.');
                    setCode('');
                    setIsVerifying(false);
                    return;
                }

                if (signUp.createdSessionId) {
                    setCode('');
                    await setActive({ session: signUp.createdSessionId });
                    onSuccess();
                } else {
                    setErrorMessage('Verification incomplete. Additional steps required.');
                    setCode('');
                    setIsVerifying(false);
                }
            }
        } catch (err: unknown) {
            console.error('Verification error:', err);
            setErrorMessage(getClerkErrorMessage(err, 'Verification failed. Please try again.'));
            setCode('');
            setIsVerifying(false);
        }
    };

    // Resend email verification code
    const handleResend = async () => {
        try {
            setErrorMessage('');
            setResendStatus('sending');
            setCode('');
            if (mode === 'signin') {
                if (signIn.status === 'needs_second_factor') {
                    await signIn.mfa.sendEmailCode();
                } else {
                    await signIn.emailCode.sendCode();
                }
            } else {
                const { error: sendError } = await signUp.verifications.sendEmailCode();
                if (sendError) {
                    setErrorMessage(sendError.message || 'Failed to resend code.');
                    setResendStatus('idle');
                    return;
                }
            }
            setResendStatus('sent');
            setTimeout(() => setResendStatus('idle'), 3000);
        } catch (err: unknown) {
            setErrorMessage(getClerkErrorMessage(err, 'Failed to resend verification code.'));
            setResendStatus('idle');
        }
    };

    return (
        <ModalWrapper visible={visible} onClose={onClose} isDarkMode={isDarkMode}>
            <Card
                variant="default"
                isDarkMode={isDarkMode}
                style={isMobile ? { borderRadius: 0, borderWidth: 0, boxShadow: 'none', elevation: 0 } : undefined}
                className={
                    isMobile
                        ? 'w-full h-full flex-1 p-6 items-center justify-between'
                        : 'w-full max-w-md p-8 items-center'
                }
            >
                {/* Modal Header */}
                <View className="w-full flex-row justify-between items-center mb-4">
                    <View
                        style={{ backgroundColor: isDarkMode ? activeColors.accent : '#E8F2EF' }}
                        className={isMobile ? 'w-12 h-12 rounded-full items-center justify-center' : 'w-10 h-10 rounded-full items-center justify-center'}
                    >
                        <Ionicons name="mail" size={isMobile ? 24 : 20} color={activeColors.primary} />
                    </View>
                    <TouchableOpacity
                        onPress={onClose}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="close" size={isMobile ? 26 : 22} color={activeColors.mutedForeground} />
                    </TouchableOpacity>
                </View>

                {/* 6-Digit Code Entry Section */}
                <View className={isMobile ? 'w-full items-center my-auto px-2' : 'w-full items-center'}>
                    <Text
                        style={{ color: activeColors.foreground }}
                        className={isMobile ? 'text-4xl font-fraunces-bold text-center mb-3' : 'text-2xl font-fraunces-bold text-center mb-2'}
                    >
                        Enter Code
                    </Text>
                    <Text
                        style={{ color: activeColors.mutedForeground }}
                        className={isMobile ? 'text-md font-nunito-semibold text-center mb-8 leading-relaxed px-4' : 'text-xs font-nunito-semibold text-center mb-6 leading-relaxed px-2'}
                    >
                        We sent a 6-digit verification code to{' '}
                        <Text style={{ color: activeColors.foreground }} className="font-nunito-bold">
                            {email || 'your email'}
                        </Text>
                        . Please enter it below.
                    </Text>

                    <CodeInput
                        code={code}
                        onChangeCode={handleCodeChange}
                        isDarkMode={isDarkMode}
                        hasError={!!errorMessage}
                        autoFocus={visible}
                        onSubmitEditing={() => handleVerify()}
                    />

                    {errorMessage ? (
                        <Text
                            style={{ color: activeColors.destructive }}
                            className="text-xs font-nunito-semibold text-center mb-4 px-2"
                        >
                            {errorMessage}
                        </Text>
                    ) : null}

                    <TouchableOpacity
                        onPress={handleResend}
                        disabled={resendStatus === 'sending' || isVerifying}
                        activeOpacity={0.7}
                        className="py-2 flex-row items-center justify-center"
                    >
                        <Text
                            style={{ color: activeColors.primary }}
                            className={isMobile ? 'text-sm font-nunito-bold text-center' : 'text-xs font-nunito-bold text-center'}
                        >
                            {resendStatus === 'sending'
                                ? 'Sending code...'
                                : resendStatus === 'sent'
                                    ? 'Code sent!'
                                    : "Didn't receive? Resend"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {isMobile && <View className="h-6" />}
            </Card>
        </ModalWrapper>
    );
};

export default VerificationModal;
