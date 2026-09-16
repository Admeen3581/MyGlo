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
import { useUser } from '@clerk/expo';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/core/Button';
import { Input } from '@/components/core/Input';
import { Card } from '@/components/core/Card';
import { BlobBackground } from '@/components/core/BlobBackground';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AvatarPicker } from '@/components/core/AvatarPicker';
import { ScreenWrapper } from '@/components/wrapper/ScreenWrapper';
import { getClerkErrorMessage } from '@/lib/clerk';
import { saveUserProfileBackend } from '@/lib/userApi';

export default function AccountLandingScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { isDarkMode, activeColors } = useTheme();

  // Pre-fill full name and avatar if user already has data in Clerk
  const defaultName = user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || '';
  const defaultAvatar = user?.imageUrl || (user?.unsafeMetadata?.avatar_url as string) || null;

  // Form State
  const [avatarUri, setAvatarUri] = useState<string | null>(defaultAvatar);
  const [name, setName] = useState(defaultName);
  const [nameError, setNameError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * handleAvatarPress
   * Launches expo-image-picker to let the user select a profile photo from their device.
   */
  const handleAvatarPress = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert('Permission to access photo library is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const imageBase64 = asset.base64
          ? `data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`
          : asset.uri;
        setAvatarUri(imageBase64);
      }
    } catch (err) {
      console.error('[AccountLanding] Error selecting profile image:', err);
    }
  };

  /**
   * Method: handleSaveAndContinue
   * Called when the user clicks "Save & Continue".
   * Validates required inputs (Full Name), parses first and last name using space substring,
   * and saves the user profile (including avatar photo) to Clerk via both client SDK and backend API.
   */
  const handleSaveAndContinue = async () => {
    if (isLoading) return;

    // Validate Required Field: Name
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError('Full name is required.');
      return;
    }

    setNameError('');
    setIsLoading(true);

    try {
      // Extract firstName and lastName from Full Name using substring on space (" ")
      const spaceIndex = trimmedName.indexOf(' ');
      let firstName = trimmedName;
      let lastName = '';

      if (spaceIndex !== -1) {
        firstName = trimmedName.substring(0, spaceIndex);
        lastName = trimmedName.substring(spaceIndex + 1).trim();
      }

      console.log('[AccountLanding] Saving user profile:', {
        firstName,
        lastName,
        hasAvatar: Boolean(avatarUri),
      });

      // 1. Update user profile via Clerk client SDK if user is signed in
      if (user) {
        // Update client profile image if selected
        if (avatarUri && typeof user.setProfileImage === 'function') {
          try {
            await user.setProfileImage({ file: avatarUri });
          } catch (imgErr) {
            console.warn('[AccountLanding] Client setProfileImage warning:', imgErr);
          }
        }

        await user.update({
          firstName,
          lastName,
        });

        // 2. Call backend API endpoint which invokes clerkClient.users.updateUser(...)
        await saveUserProfileBackend({
          userId: user.id,
          firstName,
          lastName,
          image: avatarUri,
        });
      }

      // Navigate to home screen or next step after saving profile
      router.replace('/');
    } catch (error) {
      console.error('[AccountLanding] Failed to save profile:', error);
      const errorMessage = getClerkErrorMessage(error, 'Failed to save profile. Please try again.');
      setNameError(errorMessage);
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
          <AuthHeader
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
              error={nameError || undefined}
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
              returnKeyType="next"
              leftIcon={
                <Ionicons name="person-outline" size={18} color={activeColors.mutedForeground} />
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
