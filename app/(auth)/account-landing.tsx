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
import { Button } from '@/components/core/Button';
import { Input } from '@/components/core/Input';
import { Card } from '@/components/core/Card';
import { BlobBackground } from '@/components/core/BlobBackground';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AvatarPicker } from '@/components/core/AvatarPicker';
import { ScreenWrapper } from '@/components/wrapper/ScreenWrapper';

export default function AccountLandingScreen() {
  const router = useRouter();
  const { isDarkMode, activeColors } = useTheme();

  // Form State
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [nameError, setNameError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Blank Method: handleAvatarPress
   * Called when the user clicks on the avatar container or camera badge.
   * Ready for backend image picker / file upload integration (e.g., expo-image-picker).
   */
  const handleAvatarPress = async () => {
    // TODO: Connect expo-image-picker or image upload service here:
    // const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 1 });
    // if (!result.canceled) setAvatarUri(result.assets[0].uri);
    console.log('[AccountLanding] handleAvatarPress triggered', typeof setAvatarUri);
  };

  /**
   * Blank Method: handleSaveAndContinue
   * Called when the user clicks "Save & Continue".
   * Validates required inputs (Full Name) and provides a hook for backend profile saving.
   */
  const handleSaveAndContinue = async () => {
    if (isLoading) return;

    // Validate Required Field: Name
    if (!name.trim()) {
      setNameError('Full name is required.');
      return;
    }

    setNameError('');
    setIsLoading(true);

    try {
      // TODO: Add backend / Clerk profile save implementation here
      // e.g. await user.update({ firstName, lastName }) or save to Zustand / API endpoint
      console.log('[AccountLanding] Saving user profile:', {
        name: name.trim(),
        username: username.trim(),
        avatarUri,
      });

      // Navigate to home screen or next step after saving profile
      router.replace('/');
    } catch (error) {
      console.error('[AccountLanding] Failed to save profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: activeColors.background },
      ]}
    >
      {/* Background Blobs */}
      <BlobBackground
        color={activeColors.secondary}
        size={320}
        variant="blob1"
        style={{ top: -60, right: -80, opacity: isDarkMode ? 0.18 : 0.3 }}
      />
      <BlobBackground
        color={activeColors.accent}
        size={260}
        variant="blob2"
        style={{ top: 280, left: -90, opacity: isDarkMode ? 0.15 : 0.2 }}
      />
      <BlobBackground
        color={activeColors.primary}
        size={340}
        variant="blob3"
        style={{ bottom: -40, right: -110, opacity: isDarkMode ? 0.15 : 0.2 }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ScreenWrapper variant="auth">
          {/* Header without pagination */}
          <AuthHeader
            showBackButton
            onBackPress={() => router.back()}
            isDarkMode={isDarkMode}
          />

          {/* Titles & Headings */}
          <View className="mb-6 items-center">
            <Text
              style={{ color: activeColors.foreground }}
              className="text-3xl font-fraunces-black text-center leading-tight mb-2"
            >
              Create Your Profile
            </Text>
            <Text
              style={{ color: activeColors.mutedForeground }}
              className="text-sm font-nunito-semibold text-center leading-relaxed max-w-[320px]"
            >
              Personalize your account to start curating and sharing gift wishlists.
            </Text>
          </View>

          {/* Form Card */}
          <Card variant="tl-large" isDarkMode={isDarkMode} className="mb-6 space-y-4 p-5">
            {/* Avatar Section */}
            <View className="items-center mb-2">
              <AvatarPicker
                avatarUri={avatarUri}
                onPress={handleAvatarPress}
                size={112}
                isDarkMode={isDarkMode}
              />
              <TouchableOpacity onPress={handleAvatarPress} activeOpacity={0.7}>
                <Text
                  style={{ color: activeColors.primary }}
                  className="text-xs font-nunito-bold text-center mt-1"
                >
                  Upload Profile Photo (Optional)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Name Input (Required) */}
            <Input
              label="Full Name *"
              placeholder="e.g. Alex Morgan"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (nameError) setNameError('');
              }}
              statusType={nameError ? 'destructive' : null}
              error={nameError}
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
              returnKeyType="next"
              leftIcon={
                <Ionicons name="person-outline" size={18} color={activeColors.mutedForeground} />
              }
              isDarkMode={isDarkMode}
            />

            {/* Username Input (Optional) */}
            <Input
              label="Username"
              rightLabel="(Optional)"
              placeholder="@alexmorgan"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoComplete="username"
              textContentType="username"
              returnKeyType="done"
              onSubmitEditing={handleSaveAndContinue}
              leftIcon={
                <Ionicons name="at-outline" size={18} color={activeColors.mutedForeground} />
              }
              isDarkMode={isDarkMode}
            />

            {/* Save & Continue CTA Button */}
            <View className="pt-3">
              <Button
                title={isLoading ? 'Saving...' : 'Save & Continue'}
                variant="primary"
                size="lg"
                isDarkMode={isDarkMode}
                onPress={handleSaveAndContinue}
                disabled={isLoading}
              />
            </View>
          </Card>
        </ScreenWrapper>
      </ScrollView>
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
