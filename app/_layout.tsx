import '@/global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Fraunces-Regular': require('../assets/fonts/fraunces_static/Fraunces_72pt_Soft-Regular.ttf'),
    'Fraunces-Medium': require('../assets/fonts/fraunces_static/Fraunces_72pt_Soft-Regular.ttf'),
    'Fraunces-SemiBold': require('../assets/fonts/fraunces_static/Fraunces_72pt_Soft-SemiBold.ttf'),
    'Fraunces-Bold': require('../assets/fonts/fraunces_static/Fraunces_72pt_Soft-Bold.ttf'),
    'Fraunces-Black': require('../assets/fonts/fraunces_static/Fraunces_72pt_Soft-Black.ttf'),
    'Nunito-Regular': require('../assets/fonts/nunito_static/Nunito-Regular.ttf'),
    'Nunito-Medium': require('../assets/fonts/nunito_static/Nunito-Medium.ttf'),
    'Nunito-SemiBold': require('../assets/fonts/nunito_static/Nunito-SemiBold.ttf'),
    'Nunito-Bold': require('../assets/fonts/nunito_static/Nunito-Bold.ttf'),
    'Nunito-ExtraBold': require('../assets/fonts/nunito_static/Nunito-ExtraBold.ttf'),
    'Quicksand-Regular': require('../assets/fonts/quicksand_static/Quicksand-Regular.ttf'),
    'Quicksand-Medium': require('../assets/fonts/quicksand_static/Quicksand-Medium.ttf'),
    'Quicksand-SemiBold': require('../assets/fonts/quicksand_static/Quicksand-SemiBold.ttf'),
    'Quicksand-Bold': require('../assets/fonts/quicksand_static/Quicksand-Bold.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
