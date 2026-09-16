import React, { useState } from 'react';
import {
    Modal,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    useWindowDimensions,
    PanResponder,
    Animated,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';

export interface ModalWrapperProps {
    visible: boolean;
    onClose: () => void;
    isDarkMode?: boolean;
    children: React.ReactNode;
}

export const ModalWrapper: React.FC<ModalWrapperProps> = ({
                                                              visible,
                                                              onClose,
                                                              isDarkMode: customDarkMode,
                                                              children,
                                                          }) => {
    const { isDarkMode } = useTheme(customDarkMode);
    const { width } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const isMobile = Platform.OS !== 'web' && width < 640;

    const [panY] = useState(() => new Animated.Value(0));

    const [panResponder] = useState(() =>
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                // Only intercept deliberate downward swipes to avoid blocking child ScrollViews
                return gestureState.dy > 20 && gestureState.vy > 0.3;
            },
            onPanResponderMove: Animated.event([null, { dy: panY }], { useNativeDriver: false }),
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 100 || gestureState.vy > 1.0) {
                    onClose();
                }
                Animated.spring(panY, {
                    toValue: 0,
                    useNativeDriver: false,
                    bounciness: 0,
                }).start();
            },
        })
    );

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType={isMobile ? 'slide' : 'fade'}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={[
                    styles.overlayContainer,
                    {
                        backgroundColor: isDarkMode ? 'rgba(7, 11, 14, 0.75)' : 'rgba(16, 33, 41, 0.65)',
                        justifyContent: isMobile ? 'flex-end' : 'center',
                        paddingHorizontal: isMobile ? 0 : 20,
                    },
                ]}
            >
                <TouchableOpacity
                    style={StyleSheet.absoluteFill}
                    activeOpacity={1}
                    onPress={onClose}
                />

                {isMobile ? (
                    <Animated.View
                        {...panResponder.panHandlers}
                        style={[
                            styles.mobileContentContainer,
                            {
                                transform: [{ translateY: panY }]
                            }
                        ]}
                    >
                        <View style={styles.dragIndicatorContainer}>
                            <View style={[styles.dragIndicator, { backgroundColor: isDarkMode ? '#3f3f46' : '#d4d4d8' }]} />
                        </View>
                        {children}
                    </Animated.View>
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
        alignItems: 'center',
    },
    mobileContentContainer: {
        width: '100%',
        alignItems: 'center',
    },
    dragIndicatorContainer: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 10,
        position: 'absolute',
        top: 0,
        zIndex: 10,
    },
    dragIndicator: {
        width: 40,
        height: 4,
        borderRadius: 2,
    },
});

export default ModalWrapper;
