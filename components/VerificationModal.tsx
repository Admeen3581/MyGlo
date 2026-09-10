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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LightColors, DarkColors } from '@/constants/colors';
import { ThemeContext } from '@/context/ThemeContext';
import { Card } from '@/components/Card';

interface VerificationModalProps {
  visible: boolean;
  email?: string;
  onClose: () => void;
  onSuccess: () => void;
  isDarkMode?: boolean;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  visible,
  email,
  onClose,
  onSuccess,
  isDarkMode: customDarkMode,
}) => {
  const context = useContext(ThemeContext);
  const isDarkMode = customDarkMode !== undefined ? customDarkMode : (context?.isDarkMode ?? false);
  const activeColors = isDarkMode ? DarkColors : LightColors;
  const { width } = useWindowDimensions();
  const isMobile = width < 640;

  const [code, setCode] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setCode('');
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleCodeChange = (text: string) => {
    // Only accept numeric input up to 6 digits
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 6);
    setCode(cleaned);

    if (cleaned.length === 6) {
      // Delay slightly for visual feedback before auto-navigating to home route (/)
      setTimeout(() => {
        onSuccess();
      }, 250);
    }
  };

  const digits = code.split('');

  const cardContent = (
    <Card
      variant="default"
      isDarkMode={isDarkMode}
      style={isMobile ? styles.mobileCardStyle : undefined}
      className={
        isMobile
          ? 'w-full h-full flex-1 p-6 items-center justify-between'
          : 'w-full max-w-85 p-6 items-center'
      }
    >
      {/* Top Header Row */}
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

      {/* Main Content (Centered on mobile full screen) */}
      <View className={isMobile ? 'w-full items-center my-auto px-2' : 'w-full items-center'}>
        {/* Title & Description */}
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

        {/* 6-Digit Code Slots */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => inputRef.current?.focus()}
          className={isMobile ? 'flex-row items-center justify-center gap-4.5 mb-8' : 'flex-row items-center justify-center gap-2 mb-6'}
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
                    borderColor: isCurrentFocus
                      ? activeColors.primary
                      : isFilled
                      ? activeColors.secondary
                      : activeColors.border,
                    borderWidth: isCurrentFocus ? 2 : 1,
                  },
                ]}
                className={isMobile ? 'w-14 h-16 rounded-xl items-center justify-center shadow-sm pt-2' : 'w-10 h-12 rounded-xl items-center justify-center shadow-sm'}
              >
                <Text
                  style={{ color: activeColors.foreground }}
                  className={isMobile ? 'text-6xl font-fraunces-bold' : 'text-3xl font-fraunces-bold'}
                >
                  {digits[index] || ''}
                </Text>
              </View>
            );
          })}
        </TouchableOpacity>

        {/* Hidden Input for Keyboard handling */}
        <TextInput
          ref={inputRef}
          value={code}
          onChangeText={handleCodeChange}
          keyboardType="number-pad"
          maxLength={6}
          style={styles.hiddenInput}
          caretHidden
          autoFocus
        />

        {/* Resend Helper */}
        <TouchableOpacity onPress={() => {}} activeOpacity={0.7} className="py-2">
          <Text
            style={{ color: activeColors.primary }}
            className={isMobile ? 'text-sm font-nunito-bold text-center' : 'text-xs font-nunito-bold text-center'}
          >
            Didn&#39;t receive? Resend
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom spacer on mobile for flex layout balance */}
      {isMobile && <View className="h-6" />}
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

export default VerificationModal;
