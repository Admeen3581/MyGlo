import React, { createContext, useState, ReactNode } from 'react';
import { useUser } from '@clerk/expo';
import { LightColors, DarkColors, ThemeColors } from '@/constants/colors';
import { saveUserThemeBackend, ThemeMode } from '@/lib/themeApi';

export interface ThemeContextType {
    isDarkMode: boolean;
    theme: ThemeMode;
    activeColors: ThemeColors;
    toggleDarkMode: () => void;
    setDarkMode: (isDark: boolean) => void;
    isLoadingTheme: boolean;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
    initialDarkMode?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
                                                                children,
                                                                initialDarkMode = false,
                                                            }) => {
    const { user, isLoaded, isSignedIn } = useUser();
    const [isDarkMode, setIsDarkMode] = useState<boolean>(initialDarkMode);

    // Track synced user ID to sync theme during render when user logs in
    const [syncedUserId, setSyncedUserId] = useState<string | null>(null);

    const currentUserId = isSignedIn && user ? user.id : null;

    if (isLoaded && currentUserId !== syncedUserId) {
        setSyncedUserId(currentUserId);
        if (currentUserId && user) {
            {/*Use unsafe metadata as colors/styles don't need to be secure-- ease of use.*/}
            const savedTheme = user.unsafeMetadata?.theme as ThemeMode | undefined;
            if (savedTheme === 'dark' || savedTheme === 'light') {
                setIsDarkMode(savedTheme === 'dark');
            }
        }
    }

    const syncThemeToClerk = async (newIsDark: boolean) => {
        const newTheme: ThemeMode = newIsDark ? 'dark' : 'light';

        if (isSignedIn && user?.id) {
            // 1. Call Backend API route (which uses process.env.CLERK_SECRET_KEY!)
            try {
                await saveUserThemeBackend(user.id, newTheme);
            } catch (e) {
                console.error('Failed to sync theme to backend API:', e);
            }

            // 2. Update Clerk metadata on client using modern non-deprecated user.updateMetadata
            if (typeof user.updateMetadata === 'function') {
                try {
                    await user.updateMetadata({
                        unsafeMetadata: {
                            ...(user.unsafeMetadata || {}),
                            theme: newTheme,
                        },
                    });
                } catch (e) {
                    console.error('Failed to update metadata via Clerk user SDK:', e);
                }
            }
        }
    };

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => {
            const nextValue = !prev;
            syncThemeToClerk(nextValue);
            return nextValue;
        });
    };

    const setDarkMode = (isDark: boolean) => {
        setIsDarkMode(isDark);
        syncThemeToClerk(isDark);
    };

    const activeColors = isDarkMode ? DarkColors : LightColors;
    const theme: ThemeMode = isDarkMode ? 'dark' : 'light';
    const isLoadingTheme = !isLoaded;

    return (
        <ThemeContext.Provider
            value={{
                isDarkMode,
                theme,
                activeColors,
                toggleDarkMode,
                setDarkMode,
                isLoadingTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};
