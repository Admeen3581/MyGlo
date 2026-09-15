import React from 'react';
import {
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';

export interface ModalWrapperProps {
  visible: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
  children: React.ReactNode;
}

// Responsive modal backdrop wrapper providing centered card container on desktop and full-screen layout on mobile
export const ModalWrapper: React.FC<ModalWrapperProps> = ({
  visible,
  onClose,
  isDarkMode: customDarkMode,
  children,
}) => {
  const { isDarkMode } = useTheme(customDarkMode);
  const { width } = useWindowDimensions();
  const isMobile = Platform.OS !== 'web' || width < 640;

  return (
    <Modal
      visible={visible}
      transparent={!isMobile}
      animationType={isMobile ? 'slide' : 'fade'}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[
          isMobile ? styles.mobileOverlayContainer : styles.overlayContainer,
          { backgroundColor: isDarkMode ? 'rgba(7, 11, 14, 0.75)' : 'rgba(16, 33, 41, 0.65)' },
        ]}
      >
        {/* Clickable backdrop overlay on desktop */}
        {!isMobile && (
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={onClose}
          />
        )}

        {/* Modal content container */}
        {isMobile ? (
          <SafeAreaView style={styles.safeArea}>
            {children}
          </SafeAreaView>
        ) : (
          children
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
});

export default ModalWrapper;
