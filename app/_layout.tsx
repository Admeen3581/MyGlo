import '@/global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider } from '@/context/ThemeContext';
import {ClerkProvider, useAuth} from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import {ConvexProviderWithClerk} from "convex/react-clerk";
import {ConvexReactClient} from "convex/react";

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

    // Async Init Screen
    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync().then();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    // Secrets
    const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
    const convexKey = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
        unsavedChangesWarning: false,
    })

    if (!publishableKey) {
        throw new Error("No Clerk API Key found. Add your Clerk API key to the .env file. See more in ./app/_layout.tsx");
    }

    return (
        <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
            <ConvexProviderWithClerk client={convexKey} useAuth={useAuth}>
                <ThemeProvider>
                    <Stack
                        screenOptions={{
                            headerShown: false,
                        }}
                    />
                </ThemeProvider>
            </ConvexProviderWithClerk>
        </ClerkProvider>
    );
}
