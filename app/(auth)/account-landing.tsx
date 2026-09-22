import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/expo';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { api } from '@/database/_generated/api';
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
  const { user, isLoaded } = useUser();
  const { isDarkMode, activeColors } = useTheme();

  // Convex mutation to create/update user in the database
  const createUser = useMutation(api.users.createUser);

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
   * updates user profile in Clerk, and saves user details (firstName, lastName, avatar, clerkId, email)
   * into the Convex database users table.
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

      if (user) {
        const email = user.primaryEmailAddress?.emailAddress;

        // 1. Primary Operation: Save user record to Convex database (schema.ts users table)
        try {
          await createUser({
            clerkId: user.id,
            firstName,
            lastName,
            name: trimmedName,
            avatar: avatarUri ?? undefined,
            avatarUrl: avatarUri ?? undefined,
            email,
          });
        } catch (dbErr) {
          console.error('[AccountLanding] Error saving user to Convex database:', dbErr);
        }

        // 2. Secondary Operation: Update profile image in Clerk if provided
        if (avatarUri && typeof user.setProfileImage === 'function') {
          try {
            await user.setProfileImage({ file: avatarUri });
          } catch (imgErr) {
            console.warn('[AccountLanding] Client setProfileImage warning:', imgErr);
          }
        }

        // 3. Secondary Operation: Update Clerk user first/last name
        try {
          await user.update({
            firstName,
            lastName,
          });
        } catch (clerkErr) {
          console.warn('[AccountLanding] Clerk user.update warning:', clerkErr);
        }

        // 4. Secondary Operation: Call backend API endpoint
        try {
          await saveUserProfileBackend({
            userId: user.id,
            firstName,
            lastName,
            image: avatarUri,
          });
        } catch (apiErr) {
          console.warn('[AccountLanding] saveUserProfileBackend warning:', apiErr);
        }
      } else {
        console.warn('[AccountLanding] User is not logged in or Clerk user object is unavailable.', { isLoaded });
      }

      // Navigate to home screen or next step after saving profile
      router.replace('/');
    } catch (error) {
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
});
