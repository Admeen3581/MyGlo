import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Badge } from '@/components/Badge';
import { FloatingNav } from '@/components/FloatingNav';
import { ColorSwatch } from '@/components/ColorSwatch';
import { BlobBackground } from '@/components/BlobBackground';
import { MyGloLogo } from '@/components/MyGloLogo';

export default function Index() {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode, activeColors } = useTheme();
  const [inputValue, setInputValue] = useState('');

  const dividerStyle = {
    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: activeColors.background },
      ]}
    >
      {/* Organic Background Blobs */}
      <BlobBackground
        color={activeColors.secondary}
        size={280}
        variant="blob1"
        style={{ top: -40, right: -60, opacity: isDarkMode ? 0.18 : 0.25 }}
      />
      <BlobBackground
        color={activeColors.accent}
        size={240}
        variant="blob2"
        style={{ top: 280, left: -80, opacity: isDarkMode ? 0.12 : 0.15 }}
      />
      <BlobBackground
        color={activeColors.primary}
        size={300}
        variant="blob3"
        style={{ bottom: 100, right: -100, opacity: isDarkMode ? 0.15 : 0.18 }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Floating Navigation Header */}
        <View className="mb-6">
          <FloatingNav
            title="MyGlo"
            actionText={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            onActionPress={toggleDarkMode}
            isDarkMode={isDarkMode}
          />
        </View>

        {/* Hero Section */}
        <View className="mb-8 pt-2">
          <View className="flex-row items-center mb-2">
            <Badge label="DESIGN SYSTEM v1.2" variant="secondary" isDarkMode={isDarkMode} />
          </View>
          <Text
            style={{ color: activeColors.foreground }}
            className="text-4xl font-fraunces-black mb-3"
          >
            Organic & Natural Design System
          </Text>
          <Text
            style={{ color: activeColors.mutedForeground }}
            className="text-base font-nunito-semibold mb-6"
          >
            A tactile, warm, wabi-sabi aesthetic crafted with soft amorphous blob shapes,
            natural ocean-floor color palettes, rounded typography, and soft colored shadows.
          </Text>

          <View className="flex-row flex-wrap gap-3">
            <Button
              title="Primary Action"
              variant="primary"
              size="md"
              isDarkMode={isDarkMode}
              onPress={() => {}}
            />
            <Button
              title="Explore Tokens"
              variant="outline"
              size="md"
              isDarkMode={isDarkMode}
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Section: New Pages (Testing) */}
        <View className="mb-8">
          <Text
            style={{ color: activeColors.foreground }}
            className="text-3xl font-fraunces-bold mb-2"
          >
            New Pages (Testing)
          </Text>
          <Text
            style={{ color: activeColors.mutedForeground }}
            className="text-sm font-nunito-medium mb-4"
          >
            Test implemented application pages and onboarding user flows.
          </Text>

          <Card variant="tl-large" isDarkMode={isDarkMode} className="space-y-4">
            <View className="flex-row items-center justify-between mb-1">
              <Badge label="NEW SCREEN" variant="primary" size="sm" isDarkMode={isDarkMode} />
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold"
              >
                /onboarding
              </Text>
            </View>

            <Text
              style={{ color: activeColors.foreground }}
              className="text-xl font-fraunces-semibold mb-1"
            >
              Onboarding Screen
            </Text>

            <Text
              style={{ color: activeColors.mutedForeground }}
              className="text-sm font-nunito mb-4"
            >
              Pixel-perfect implementation of the warm wabi-sabi onboarding screen featuring centered illustration card, typography, and clear action CTAs.
            </Text>

            <Button
              title="Open Onboarding Screen"
              variant="primary"
              size="md"
              isDarkMode={isDarkMode}
              onPress={() => router.push('/onboarding')}
            />
          </Card>
        </View>

        {/* Section: Logo Component Showcase */}
        <View className="mb-8">
          <Text
            style={{ color: activeColors.foreground }}
            className="text-3xl font-fraunces-bold mb-2"
          >
            Logo Component System
          </Text>
          <Text
            style={{ color: activeColors.mutedForeground }}
            className="text-sm font-nunito-medium mb-4"
          >
            Flexible logo component supporting automatic light/dark mode selection, 12 SVG variants, custom sizing, and alignment.
          </Text>

          {/* Automatic Theme Switching Showcase */}
          <Card variant="tl-large" isDarkMode={isDarkMode} className="mb-4 space-y-4">
            <Text
              style={{ color: activeColors.mutedForeground }}
              className="text-xs font-quicksand-bold uppercase tracking-widest mb-2"
            >
              Automatic Mode Selection ({isDarkMode ? 'Dark Active' : 'Light Active'})
            </Text>

            <View style={dividerStyle} className="mb-4 border-b pb-4">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold mb-2"
              >
                Standard Logo ({'color="auto"'})
              </Text>
              <MyGloLogo type="standard" isDarkMode={isDarkMode} size="md" align="left" />
            </View>

            <View style={dividerStyle} className="mb-4 border-b pb-4">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold mb-2"
              >
                Icon Only ({'type="icon"'})
              </Text>
              <MyGloLogo type="icon" isDarkMode={isDarkMode} size="md" align="left" />
            </View>

            <View className="pb-1">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold mb-2"
              >
                Logo with Subtext ({'type="subtext"'})
              </Text>
              <MyGloLogo type="subtext" isDarkMode={isDarkMode} size="md" align="left" />
            </View>
          </Card>

          {/* 12 SVG Color Variants Matrix */}
          <Card variant="tr-large" isDarkMode={isDarkMode} className="mb-4 space-y-4">
            <Text
              style={{ color: activeColors.mutedForeground }}
              className="text-xs font-quicksand-bold uppercase tracking-widest mb-2"
            >
              All 12 SVG Color & Format Variants
            </Text>

            {/* Light Variants */}
            <View style={dividerStyle} className="mb-4 border-b pb-4">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold mb-2"
              >
                Light Theme Variants ({'color="light"'})
              </Text>
              <View
                  style={{backgroundColor: '#F7F7F6' }}
                  className="p-3 rounded-xl flex-row items-center flex-wrap gap-4"
              >
                <MyGloLogo type="standard" color="light" size="sm" />
                <MyGloLogo type="icon" color="light" size="sm" />
                <MyGloLogo type="subtext" color="light" size="sm" />
              </View>
            </View>

            {/* Dark Variants */}
            <View style={dividerStyle} className="mb-4 border-b pb-4">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold mb-2"
              >
                Dark Theme Variants ({'color="dark"'})
              </Text>
              <View
                style={{ backgroundColor: '#0E151A' }}
                className="p-3 rounded-xl flex-row items-center flex-wrap gap-4"
              >
                <MyGloLogo type="standard" color="dark" size="sm" />
                <MyGloLogo type="icon" color="dark" size="sm" />
                <MyGloLogo type="subtext" color="dark" size="sm" />
              </View>
            </View>

            {/* Black Variants */}
            <View style={dividerStyle} className="mb-4 border-b pb-4">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold mb-2"
              >
                Black Monochrome Variants ({'color="black"'})
              </Text>
              <View
                  style={{ backgroundColor: '#FFFFFF' }}
                  className="p-3 rounded-xl flex-row items-center flex-wrap gap-4"
              >
                <MyGloLogo type="standard" color="black" size="sm" />
                <MyGloLogo type="icon" color="black" size="sm" />
                <MyGloLogo type="subtext" color="black" size="sm" />
              </View>
            </View>

            {/* White Variants */}
            <View className="pb-1">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold mb-2"
              >
                White Monochrome Variants ({'color="white"'})
              </Text>
              <View
                style={{ backgroundColor: activeColors.primary }}
                className="p-3 rounded-xl flex-row items-center flex-wrap gap-4"
              >
                <MyGloLogo type="standard" color="white" size="sm" />
                <MyGloLogo type="icon" color="white" size="sm" />
                <MyGloLogo type="subtext" color="white" size="sm" />
              </View>
            </View>
          </Card>

          {/* Resizing & Alignment Options */}
          <Card variant="br-large" isDarkMode={isDarkMode} className="space-y-4">
            <Text
              style={{ color: activeColors.mutedForeground }}
              className="text-xs font-quicksand-bold uppercase tracking-widest mb-2"
            >
              Resizing & Alignment Control
            </Text>

            <View style={dividerStyle} className="mb-4 border-b pb-4">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold mb-2"
              >
                Size Presets (xs, sm, md, lg, xl)
              </Text>
              <View className="flex-row items-center flex-wrap gap-4">
                  <MyGloLogo type="icon" isDarkMode={isDarkMode} size="xs" />
                  <MyGloLogo type="standard" isDarkMode={isDarkMode} size="sm" />
                  <MyGloLogo type="standard" isDarkMode={isDarkMode} size="md" />
                  <MyGloLogo type="standard" isDarkMode={isDarkMode} size="lg" />
                  <MyGloLogo type='standard' isDarkMode={isDarkMode} size="xl" />
              </View>
            </View>

            <View className="pb-1">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold mb-2"
              >
                Alignment Options (left, center, right)
              </Text>
              <View className="space-y-2">
                <MyGloLogo type="standard" isDarkMode={isDarkMode} size="sm" align="left" />
                <MyGloLogo type="standard" isDarkMode={isDarkMode} size="sm" align="center" />
                <MyGloLogo type="standard" isDarkMode={isDarkMode} size="sm" align="right" />
              </View>
            </View>
          </Card>
        </View>

        {/* Section: Design Philosophy */}
        <Card variant="tl-large" isDarkMode={isDarkMode} className="mb-8">
          <View className="flex-row items-center mb-3">
            <MyGloLogo type="icon" isDarkMode={isDarkMode} size={44} className="mr-2" />
            <Text
              style={{ color: activeColors.primary }}
              className="text-2xl font-fraunces-semibold"
            >
              Design Philosophy
            </Text>
          </View>
          <Text
            style={{ color: activeColors.foreground }}
            className="text-base font-nunito leading-relaxed mb-4"
          >
            Embracing imperfection, erosion by wind and water, and organic curves.
            There are no harsh 90-degree angles. Everything feels handcrafted, peaceful,
            and rooted.
          </Text>
          <View className="flex-row flex-wrap gap-2">
            <Badge label="Tactile" variant="primary" size="sm" isDarkMode={isDarkMode} />
            <Badge label="Wabi-Sabi" variant="secondary" size="sm" isDarkMode={isDarkMode} />
            <Badge label="Oceanic" variant="success" size="sm" isDarkMode={isDarkMode} />
            <Badge label="Soft Shadows" variant="warning" size="sm" isDarkMode={isDarkMode} />
          </View>
        </Card>

        {/* Section: Color Palette Tokens */}
        <View className="mb-8">
          <Text
            style={{ color: activeColors.foreground }}
            className="text-3xl font-fraunces-bold mb-2"
          >
            Color Palette ({isDarkMode ? 'Dark Mode' : 'Light Mode'})
          </Text>
          <Text
            style={{ color: activeColors.mutedForeground }}
            className="text-sm font-nunito-medium mb-4"
          >
            Water-drawn palette evoking ocean floors, clay pottery, and bleached driftwood.
          </Text>
          <View className="flex-row flex-wrap justify-between">
            <ColorSwatch name="Background" hex={activeColors.background} isDarkMode={isDarkMode} />
            <ColorSwatch name="Foreground" hex={activeColors.foreground} isDarkMode={isDarkMode} />
            <ColorSwatch name="Primary" hex={activeColors.primary} isDarkMode={isDarkMode} />
            <ColorSwatch name="Secondary" hex={activeColors.secondary} isDarkMode={isDarkMode} />
            <ColorSwatch name="Accent" hex={activeColors.accent} isDarkMode={isDarkMode} />
            <ColorSwatch name="Muted" hex={activeColors.muted} isDarkMode={isDarkMode} />
            <ColorSwatch name="Border" hex={activeColors.border} isDarkMode={isDarkMode} />
            <ColorSwatch name="Destructive" hex={activeColors.destructive} isDarkMode={isDarkMode} />
            <ColorSwatch name="Success" hex={activeColors.success} isDarkMode={isDarkMode} />
            <ColorSwatch name="Warning" hex={activeColors.warning} isDarkMode={isDarkMode} />
          </View>
        </View>

        {/* Section: Typography System & Font Utilities */}
        <View className="mb-8">
          <Text
            style={{ color: activeColors.foreground }}
            className="text-3xl font-fraunces-bold mb-2"
          >
            Typography Utility System
          </Text>
          <Text
            style={{ color: activeColors.mutedForeground }}
            className="text-base font-nunito-semibold mb-4"
          >
            Fraunces old-style serif titles combined with Nunito body & Quicksand metadata/accents.
          </Text>

          {/* Heading Utility Samples */}
          <Card variant="default" isDarkMode={isDarkMode} className="mb-4 space-y-4">
            <Text
              style={{ color: activeColors.mutedForeground }}
              className="text-xs font-quicksand-bold uppercase tracking-widest mb-2"
            >
              Heading & Title Utilities
            </Text>
            
            <View style={dividerStyle} className="mb-4 border-b pb-3">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold mb-1"
              >
                Hero Display Title (36px Fraunces Black)
              </Text>
              <Text
                style={{ color: activeColors.foreground }}
                className="text-4xl font-fraunces-black"
              >
                Hero Display Title
              </Text>
            </View>

            <View style={dividerStyle} className="mb-4 border-b pb-3">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold mb-1"
              >
                Primary Section Heading (28px Fraunces Bold)
              </Text>
              <Text
                style={{ color: activeColors.foreground }}
                className="text-3xl font-fraunces-bold"
              >
                Primary Section Heading
              </Text>
            </View>

            <View style={dividerStyle} className="mb-4 border-b pb-3">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold mb-1"
              >
                Secondary Card Title (22px Fraunces SemiBold)
              </Text>
              <Text
                style={{ color: activeColors.primary }}
                className="text-2xl font-fraunces-semibold"
              >
                Secondary Card Title
              </Text>
            </View>

            <View style={dividerStyle} className="mb-4 border-b pb-3">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold mb-1"
              >
                Tertiary Item Title (18px Fraunces Medium)
              </Text>
              <Text
                style={{ color: activeColors.foreground }}
                className="text-xl font-fraunces-medium"
              >
                Tertiary Item Title
              </Text>
            </View>

            <View className="pb-1">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold mb-1"
              >
                Quicksand Accent Highlight (18px Quicksand Bold)
              </Text>
              <Text
                style={{ color: isDarkMode ? activeColors.accentForeground : activeColors.accent }}
                className="text-lg font-quicksand-bold"
              >
                Quicksand Accent Highlight
              </Text>
            </View>
          </Card>

          {/* Subheading & Body Utility Samples */}
          <Card variant="tr-large" isDarkMode={isDarkMode} className="mb-4 space-y-4">
            <Text
              style={{ color: activeColors.mutedForeground }}
              className="text-xs font-quicksand-bold uppercase tracking-widest mb-2"
            >
              Subheading & Body Utilities
            </Text>
            
            <View style={dividerStyle} className="mb-4 border-b pb-3">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold mb-1"
              >
                Primary Subheading (16px Nunito SemiBold)
              </Text>
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-base font-nunito-semibold"
              >
                Primary Subheading — Explanatory intro under main headers.
              </Text>
            </View>

            <View style={dividerStyle} className="mb-4 border-b pb-3">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold mb-1"
              >
                Secondary Subheading (14px Nunito Medium)
              </Text>
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-sm font-nunito-medium"
              >
                Secondary Subheading — Group headers and sub-navigation descriptors.
              </Text>
            </View>

            <View style={dividerStyle} className="mb-4 border-b pb-3">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold mb-1"
              >
                Large Body (18px Nunito Regular)
              </Text>
              <Text
                style={{ color: activeColors.foreground }}
                className="text-lg font-nunito"
              >
                Large Body — Lead paragraph copy for featured articles and callouts.
              </Text>
            </View>

            <View style={dividerStyle} className="mb-4 border-b pb-3">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold mb-1"
              >
                Base Body (16px Nunito Regular)
              </Text>
              <Text
                style={{ color: activeColors.foreground }}
                className="text-base font-nunito"
              >
                Base Body — Comfortable reading copy for wishlist items and descriptions.
              </Text>
            </View>

            <View className="pb-1">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold mb-1"
              >
                Small Body (14px Nunito Regular)
              </Text>
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-sm font-nunito"
              >
                Small Body — Compact text for helper notes, secondary card text, and labels.
              </Text>
            </View>
          </Card>

          {/* Metadata & Footnote Utility Samples */}
          <Card variant="bl-large" isDarkMode={isDarkMode}>
            <Text
              style={{ color: activeColors.mutedForeground }}
              className="text-xs font-quicksand-bold uppercase tracking-widest mb-3"
            >
              Metadata, Overline & Footnote Utilities
            </Text>
            
            <View style={dividerStyle} className="mb-4 border-b pb-3">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold mb-1"
              >
                Metadata Overline (11px Quicksand Bold Uppercase Tracked)
              </Text>
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-bold uppercase tracking-widest"
              >
                WISHLIST ITEM • CATEGORY TAG
              </Text>
            </View>

            <View style={dividerStyle} className="mb-4 border-b pb-3">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold mb-1"
              >
                Metadata Caption (12px Quicksand SemiBold)
              </Text>
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold"
              >
                Added 2 days ago • Requested by Alex
              </Text>
            </View>

            <View>
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold mb-1"
              >
                Footnote Fine Print (11px Quicksand Medium)
              </Text>
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-medium"
              >
                © 2026 MyGlo Gift Giving App • Terms & Privacy
              </Text>
            </View>
          </Card>
        </View>

        {/* Section: Button Variants */}
        <View className="mb-8">
          <Text
            style={{ color: activeColors.foreground }}
            className="text-3xl font-fraunces-bold mb-2"
          >
            Button Component System
          </Text>
          <Text
            style={{ color: activeColors.mutedForeground }}
            className="text-sm font-nunito-medium mb-4"
          >
            Fully rounded pill shapes with generous horizontal padding.
          </Text>

          <Card variant="default" isDarkMode={isDarkMode} className="space-y-4">
            <View className="mb-3">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-bold uppercase tracking-widest mb-2"
              >
                Primary Pill
              </Text>
              <Button title="Primary Action" variant="primary" size="md" isDarkMode={isDarkMode} />
            </View>

            <View className="mb-3">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-bold uppercase tracking-widest mb-2"
              >
                Secondary Pill
              </Text>
              <Button title="Secondary Action" variant="secondary" size="md" isDarkMode={isDarkMode} />
            </View>

            <View className="mb-3">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-bold uppercase tracking-widest mb-2"
              >
                Outline Pill
              </Text>
              <Button title="Outline Action" variant="outline" size="md" isDarkMode={isDarkMode} />
            </View>

            <View className="mb-3">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-bold uppercase tracking-widest mb-2"
              >
                Ghost Pill
              </Text>
              <Button title="Ghost Action" variant="ghost" size="md" isDarkMode={isDarkMode} />
            </View>

            <View className="mb-1">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-bold uppercase tracking-widest mb-2"
              >
                Button Sizes (Small, Medium, Large)
              </Text>
              <View className="flex-row items-center flex-wrap gap-2">
                <Button title="Small" variant="primary" size="sm" isDarkMode={isDarkMode} />
                <Button title="Medium" variant="primary" size="md" isDarkMode={isDarkMode} />
                <Button title="Large" variant="primary" size="lg" isDarkMode={isDarkMode} />
              </View>
            </View>
          </Card>
        </View>

        {/* Section: Inputs & Forms */}
        <View className="mb-8">
          <Text
            style={{ color: activeColors.foreground }}
            className="text-3xl font-fraunces-bold mb-2"
          >
            Input Controls
          </Text>
          <Text
            style={{ color: activeColors.mutedForeground }}
            className="text-sm font-nunito-medium mb-4"
          >
            Pill-shaped text fields with semi-transparent background.
          </Text>

          <Card variant="br-large" isDarkMode={isDarkMode}>
            <Input
              label="Gift Item Title"
              placeholder="e.g. Handmade Ceramic Mug"
              value={inputValue}
              onChangeText={setInputValue}
              containerClassName="mb-4"
              isDarkMode={isDarkMode}
            />

            <Input
              label="Wishlist Link"
              placeholder="https://example.com/item/123"
              error={inputValue.length > 0 ? undefined : 'Please enter a valid gift URL'}
              isDarkMode={isDarkMode}
            />
          </Card>
        </View>

        {/* Section: Asymmetric Organic Cards */}
        <View className="mb-8">
          <Text
            style={{ color: activeColors.foreground }}
            className="text-3xl font-fraunces-bold mb-2"
          >
            Asymmetric Organic Cards
          </Text>
          <Text
            style={{ color: activeColors.mutedForeground }}
            className="text-sm font-nunito-medium mb-4"
          >
            Unique asymmetric border radii create erosion-like, handcrafted card frames.
          </Text>

          <View className="gap-4">
            <Card variant="tl-large" isDarkMode={isDarkMode}>
              <Text
                style={{ color: activeColors.foreground }}
                className="text-xl font-fraunces-medium mb-1"
              >
                Top-Left Eroded Radius
              </Text>
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-sm font-nunito"
              >
                Card with prominent top-left corner curve (64px).
              </Text>
            </Card>

            <Card variant="tr-large" isDarkMode={isDarkMode}>
              <Text
                style={{ color: isDarkMode ? activeColors.accentForeground : activeColors.accent }}
                className="text-lg font-quicksand-bold mb-1"
              >
                Top-Right Eroded Radius
              </Text>
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-sm font-nunito"
              >
                Card with prominent top-right corner curve (80px).
              </Text>
            </Card>

            <Card variant="br-large" isDarkMode={isDarkMode}>
              <Text
                style={{ color: activeColors.primary }}
                className="text-2xl font-fraunces-semibold mb-1"
              >
                Bottom-Right Eroded Radius
              </Text>
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-sm font-nunito"
              >
                Card with prominent bottom-right corner curve (64px).
              </Text>
            </Card>
          </View>
        </View>

        {/* Footer info */}
        <View style={dividerStyle} className="py-8 items-center border-t">
          <MyGloLogo type="subtext" isDarkMode={isDarkMode} size="sm" className="mb-3" />
          <Text
            style={{ color: activeColors.mutedForeground }}
            className="text-xs font-quicksand-semibold mb-1"
          >
            MyGlo Design System • NativeWind v5 + Tailwind v4
          </Text>
          <Text
            style={{ color: activeColors.mutedForeground }}
            className="text-xs font-quicksand-medium"
          >
            Built with Expo & React Native
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
});
