import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Redirect } from 'expo-router';
import { useAuth } from '@clerk/expo';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/core/Button';
import { ScreenWrapper } from '@/components/wrapper/ScreenWrapper';

export default function Index() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { isDarkMode, activeColors } = useTheme();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: activeColors.background },
      ]}
    >
      <ScreenWrapper variant="default">
        <View className="flex-1 items-center justify-center py-20">
          <Button
            title="Go to Test Page"
            variant="primary"
            size="lg"
            isDarkMode={isDarkMode}
            onPress={() => router.push('/testpage' as any)}
          />
        </View>
      </ScreenWrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
