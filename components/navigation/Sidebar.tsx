import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { MyGloLogo } from '@/components/MyGloLogo';

export type NavTab = 'my-wishlists' | 'shared-lists' | 'friends' | 'profile';

export interface SidebarProps {
  activeTab: NavTab;
  isOpen: boolean;
}

interface NavItem {
  id: NavTab;
  label: string;
  activeIcon: keyof typeof Ionicons.glyphMap;
  inactiveIcon: keyof typeof Ionicons.glyphMap;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'my-wishlists',
    label: 'My Wishlists',
    activeIcon: 'heart',
    inactiveIcon: 'heart-outline',
  },
  {
    id: 'shared-lists',
    label: 'Shared with Me',
    activeIcon: 'gift',
    inactiveIcon: 'gift-outline',
  },
  {
    id: 'friends',
    label: 'Friends',
    activeIcon: 'people',
    inactiveIcon: 'people-outline',
  },
  {
    id: 'profile',
    label: 'Profile',
    activeIcon: 'person',
    inactiveIcon: 'person-outline',
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, isOpen }) => {
  const { isDarkMode, activeColors } = useTheme();

  if (!isOpen) return null;

  const handleTabPress = (tab: NavTab) => {
    router.push(`/${tab}` as any);
  };

  return (
    <View
      style={[
        styles.sidebar,
        {
          backgroundColor: isDarkMode ? '#0E151A' : '#F7F7F6',
          borderRightColor: activeColors.border,
        },
      ]}
      className="w-60 border-r border-solid py-5 px-3"
    >
      {/* Sidebar Top Branding Header */}
      <View className="flex-row items-center px-3 mb-6 gap-3">
        <View
          style={{ backgroundColor: activeColors.primary }}
          className="w-9 h-9 rounded-full items-center justify-center shadow-sm"
        >
          <MyGloLogo type="icon" color="white" size="sm" align="center" />
        </View>
        <Text
          style={{ color: activeColors.foreground }}
          className="text-lg font-fraunces-bold"
        >
          MyGlo
        </Text>
      </View>

      {/* Navigation List */}
      <View className="gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const iconColor = isActive ? activeColors.primary : activeColors.mutedForeground;
          const textColor = isActive ? activeColors.primary : activeColors.mutedForeground;

          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleTabPress(item.id)}
              activeOpacity={0.7}
              style={[
                isActive && {
                  backgroundColor: isDarkMode
                    ? 'rgba(235, 114, 88, 0.15)'
                    : 'rgba(235, 114, 88, 0.1)',
                },
              ]}
              className="flex-row items-center px-3.5 py-3 rounded-xl gap-3"
            >
              <Ionicons
                name={isActive ? item.activeIcon : item.inactiveIcon}
                size={22}
                color={iconColor}
              />
              <Text
                style={{ color: textColor }}
                className={`text-sm ${isActive ? 'font-nunito-bold' : 'font-nunito-semibold'}`}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    minWidth: 220,
    maxWidth: 250,
  },
});

export default Sidebar;
