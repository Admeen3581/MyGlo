import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSSO } from '@clerk/expo';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useTheme } from '@/hooks/useTheme';

WebBrowser.maybeCompleteAuthSession();

interface SocialAuthButtonsProps {
  isDarkMode?: boolean;
}

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
  isDarkMode: customDarkMode,
}) => {
  const router = useRouter();
  const { isDarkMode, activeColors } = useTheme(customDarkMode);
  const { startSSOFlow } = useSSO();
  const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);

  const handleSocialPress = async (strategy: 'oauth_google' | 'oauth_apple') => {
    try {
      setLoadingStrategy(strategy);
      const redirectUrl = Linking.createURL('oauth-callback');
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl,
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace('/');
      }
    } catch (err: any) {
      console.error('Social auth error:', err);
    } finally {
      setLoadingStrategy(null);
    }
  };

  return (
    <View className="w-full">
      <View className="flex-row items-center my-4">
        <View
          style={{ backgroundColor: activeColors.border }}
          className="flex-1 h-px"
        />
        <Text
          style={{ color: activeColors.mutedForeground }}
          className="px-4 text-xs font-quicksand-bold uppercase tracking-wider m-5"
        >
          Or drift in with
        </Text>
        <View
          style={{ backgroundColor: activeColors.border }}
          className="flex-1 h-px"
        />
      </View>

      <View className="flex-row gap-3">
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={loadingStrategy !== null}
          onPress={() => handleSocialPress('oauth_google')}
          style={{
            backgroundColor: isDarkMode ? 'rgba(22, 34, 42, 0.85)' : 'rgba(255, 255, 255, 0.9)',
            borderColor: activeColors.border,
          }}
          className="flex-1 h-12 rounded-full border flex-row items-center justify-center px-3"
        >
          {loadingStrategy === 'oauth_google' ? (
            <ActivityIndicator size="small" color={activeColors.foreground} />
          ) : (
            <>
              <Ionicons
                name="logo-google"
                size={18}
                color={activeColors.foreground}
                style={{ marginRight: 8 }}
              />
              <Text
                style={{ color: activeColors.foreground }}
                className="text-sm font-nunito-bold"
              >
                Google
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          disabled={loadingStrategy !== null}
          onPress={() => handleSocialPress('oauth_apple')}
          style={{
            backgroundColor: isDarkMode ? 'rgba(22, 34, 42, 0.85)' : 'rgba(255, 255, 255, 0.9)',
            borderColor: activeColors.border,
          }}
          className="flex-1 h-12 rounded-full border flex-row items-center justify-center px-3"
        >
          {loadingStrategy === 'oauth_apple' ? (
            <ActivityIndicator size="small" color={activeColors.foreground} />
          ) : (
            <>
              <Ionicons
                name="logo-apple"
                size={20}
                color={activeColors.foreground}
                style={{ marginRight: 8 }}
              />
              <Text
                style={{ color: activeColors.foreground }}
                className="text-sm font-nunito-bold"
              >
                Apple
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SocialAuthButtons;
