import React, { useContext } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
  Pressable,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';
import { LightColors, DarkColors } from '@/constants/colors';
import { ThemeContext } from '@/context/ThemeContext';
import { PolicyData, PolicyParagraph, PolicySection, PolicyTextSegment } from '@/types/policy';

export interface ParagraphModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  lastUpdated?: string;
  sections?: PolicySection[];
  data?: PolicyData;
  children?: React.ReactNode;
  isDarkMode?: boolean;
  actionButtonText?: string;
  onAction?: () => void;
}

export const ParagraphModal: React.FC<ParagraphModalProps> = ({
  visible,
  onClose,
  title: customTitle,
  subtitle: customSubtitle,
  lastUpdated: customLastUpdated,
  sections: customSections,
  data,
  children,
  isDarkMode: customDarkMode,
  actionButtonText,
  onAction,
}) => {
  const context = useContext(ThemeContext);
  const isDarkMode = customDarkMode !== undefined ? customDarkMode : (context?.isDarkMode ?? false);
  const activeColors = isDarkMode ? DarkColors : LightColors;

  const displayTitle = data?.title ?? customTitle ?? 'Information';
  const displaySubtitle = data?.subtitle ?? customSubtitle;
  const displayLastUpdated = data?.lastUpdated ?? customLastUpdated;
  const displaySections = data?.sections ?? customSections ?? [];

  const handleOpenLink = async (url: string) => {
    try {
      if (url.startsWith('mailto:') || url.startsWith('tel:')) {
        await Linking.openURL(url);
      } else {
        await WebBrowser.openBrowserAsync(url);
      }
    } catch (err) {
      console.error('Failed to open link:', url, err);
    }
  };

  const renderParagraphContent = (paragraph: PolicyParagraph, keyPrefix: string) => {
    if (typeof paragraph === 'string') {
      return (
        <Text
          key={keyPrefix}
          style={{ color: activeColors.foreground }}
          className="text-sm font-nunito leading-relaxed mb-3"
        >
          {paragraph}
        </Text>
      );
    }

    return (
      <Text
        key={keyPrefix}
        style={{ color: activeColors.foreground }}
        className="text-sm font-nunito leading-relaxed mb-3"
      >
        {paragraph.map((segment: PolicyTextSegment, segIdx: number) => {
          if (segment.link) {
            return (
              <Text
                key={`${keyPrefix}-seg-${segIdx}`}
                onPress={() => handleOpenLink(segment.link!)}
                style={{
                  color: activeColors.primary,
                  textDecorationLine: 'underline',
                  fontFamily: segment.bold ? 'Nunito-Bold' : 'Nunito-SemiBold',
                }}
              >
                {segment.text}
              </Text>
            );
          }

          return (
            <Text
              key={`${keyPrefix}-seg-${segIdx}`}
              style={{
                fontFamily: segment.bold
                  ? 'Nunito-Bold'
                  : segment.italic
                  ? 'Nunito-Italic'
                  : undefined,
              }}
            >
              {segment.text}
            </Text>
          );
        })}
      </Text>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.overlay,
          { backgroundColor: isDarkMode ? 'rgba(7, 11, 14, 0.8)' : 'rgba(16, 33, 41, 0.65)' },
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View
          style={[
            styles.modalCard,
            {
              backgroundColor: isDarkMode ? activeColors.muted : '#FFFFFF',
              borderColor: activeColors.border,
            },
          ]}
          className="w-full max-w-lg rounded-3xl border shadow-xl overflow-hidden"
        >
          {/* Modal Header */}
          <View
            style={{ borderBottomColor: activeColors.border }}
            className="flex-row items-start justify-between px-6 pt-6 pb-4 border-b"
          >
            <View className="flex-1 pr-4">
              <Text
                style={{ color: activeColors.foreground }}
                className="text-xl font-fraunces-bold"
              >
                {displayTitle}
              </Text>

              {displayLastUpdated && (
                <Text
                  style={{ color: activeColors.mutedForeground }}
                  className="text-xs font-quicksand-semibold mt-1"
                >
                  {displayLastUpdated}
                </Text>
              )}

              {displaySubtitle && (
                <Text
                  style={{ color: activeColors.mutedForeground }}
                  className="text-xs font-nunito mt-1"
                >
                  {displaySubtitle}
                </Text>
              )}
            </View>

            {/* Exit Button at top right */}
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              activeOpacity={0.7}
              accessibilityLabel="Close modal"
              accessibilityRole="button"
              style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }}
              className="w-9 h-9 rounded-full items-center justify-center"
            >
              <Ionicons name="close" size={20} color={activeColors.mutedForeground} />
            </TouchableOpacity>
          </View>

          {/* Wall of Text Scrollable Area */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            {children ? (
              children
            ) : (
              displaySections.map((section, secIdx) => (
                <View key={section.id || `sec-${secIdx}`} className="mb-5">
                  {section.heading && (
                    <Text
                      style={{ color: activeColors.foreground }}
                      className="text-base font-fraunces-semibold mb-2"
                    >
                      {section.heading}
                    </Text>
                  )}

                  {section.paragraphs?.map((p, pIdx) =>
                    renderParagraphContent(p, `sec-${secIdx}-p-${pIdx}`)
                  )}

                  {section.bulletPoints && section.bulletPoints.length > 0 && (
                    <View className="pl-2 mb-3">
                      {section.bulletPoints.map((bp, bpIdx) => (
                        <View key={`sec-${secIdx}-bp-${bpIdx}`} className="flex-row items-start mb-1.5">
                          <Text
                            style={{ color: activeColors.primary }}
                            className="text-sm font-bold mr-2 mt-0.5"
                          >
                            •
                          </Text>
                          <View className="flex-1">
                            {renderParagraphContent(bp, `sec-${secIdx}-bp-${bpIdx}`)}
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))
            )}
          </ScrollView>

          {/* Modal Footer Action Button (Optional) */}
          {(actionButtonText || onAction) && (
            <View
              style={{ borderTopColor: activeColors.border }}
              className="p-4 border-t items-center"
            >
              <TouchableOpacity
                onPress={onAction || onClose}
                activeOpacity={0.8}
                style={{ backgroundColor: activeColors.primary }}
                className="w-full py-3 rounded-2xl items-center justify-center"
              >
                <Text
                  style={{ color: activeColors.primaryForeground }}
                  className="text-sm font-nunito-bold"
                >
                  {actionButtonText || 'Close'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  modalCard: {
    maxHeight: '85%',
  },
  scrollView: {
    flexShrink: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
});

export default ParagraphModal;
