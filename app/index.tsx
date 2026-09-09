import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LightColors, DarkColors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Badge } from '@/components/Badge';
import { FloatingNav } from '@/components/FloatingNav';
import { ColorSwatch } from '@/components/ColorSwatch';
import { BlobBackground } from '@/components/BlobBackground';
import { MyGloLogo } from '@/components/MyGloLogo';

export default function Index() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const activeColors = isDarkMode ? DarkColors : LightColors;

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
            onActionPress={() => setIsDarkMode(!isDarkMode)}
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
            className="text-4xl font-fraunces-black title-display mb-3"
          >
            Organic & Natural Design System
          </Text>
          <Text
            style={{ color: activeColors.mutedForeground }}
            className="text-base font-nunito-semibold subheading-primary mb-6"
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

        {/* Section: Logo Component Showcase */}
        <View className="mb-8">
          <Text
            style={{ color: activeColors.foreground }}
            className="text-3xl font-fraunces-bold title-primary mb-2"
          >
            Logo Component System
          </Text>
          <Text
            style={{ color: activeColors.mutedForeground }}
            className="text-sm font-nunito-medium subheading-secondary mb-4"
          >
            Flexible logo component supporting automatic light/dark mode selection, 12 SVG variants, custom sizing, and alignment.
          </Text>

          {/* Automatic Theme Switching Showcase */}
          <Card variant="tl-large" isDarkMode={isDarkMode} className="mb-4 space-y-4">
            <Text
              style={{ color: activeColors.mutedForeground }}
              className="text-xs font-quicksand-bold uppercase tracking-widest metadata-overline mb-2"
            >
              Automatic Mode Selection ({isDarkMode ? 'Dark Active' : 'Light Active'})
            </Text>

            <View style={dividerStyle} className="mb-4 border-b pb-4">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold metadata mb-2"
              >
                Standard Logo ({'color="auto"'})
              </Text>
              <MyGloLogo type="standard" isDarkMode={isDarkMode} size="md" align="left" />
            </View>

            <View style={dividerStyle} className="mb-4 border-b pb-4">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold metadata mb-2"
              >
                Icon Only ({'type="icon"'})
              </Text>
              <MyGloLogo type="icon" isDarkMode={isDarkMode} size="md" align="left" />
            </View>

            <View className="pb-1">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold metadata mb-2"
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
              className="text-xs font-quicksand-bold uppercase tracking-widest metadata-overline mb-2"
            >
              All 12 SVG Color & Format Variants
            </Text>

            {/* Light Variants */}
            <View style={dividerStyle} className="mb-4 border-b pb-4">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold metadata mb-2"
              >
                Light Theme Variants ({'color="light"'})
              </Text>
              <View className="flex-row items-center flex-wrap gap-4">
                <MyGloLogo type="standard" color="light" size="sm" />
                <MyGloLogo type="icon" color="light" size="sm" />
                <MyGloLogo type="subtext" color="light" size="sm" />
              </View>
            </View>

            {/* Dark Variants */}
            <View style={dividerStyle} className="mb-4 border-b pb-4">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold metadata mb-2"
              >
                Dark Theme Variants ({'color="dark"'})
              </Text>
              <View
                style={{ backgroundColor: isDarkMode ? '#0E151A' : '#1E293B' }}
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
                className="text-xs font-quicksand-semibold metadata mb-2"
              >
                Black Monochrome Variants ({'color="black"'})
              </Text>
              <View className="flex-row items-center flex-wrap gap-4">
                <MyGloLogo type="standard" color="black" size="sm" />
                <MyGloLogo type="icon" color="black" size="sm" />
                <MyGloLogo type="subtext" color="black" size="sm" />
              </View>
            </View>

            {/* White Variants */}
            <View className="pb-1">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold metadata mb-2"
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
              className="text-xs font-quicksand-bold uppercase tracking-widest metadata-overline mb-2"
            >
              Resizing & Alignment Control
            </Text>

            <View style={dividerStyle} className="mb-4 border-b pb-4">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold metadata mb-2"
              >
                Size Presets (sm, md, lg)
              </Text>
              <View className="flex-row items-center flex-wrap gap-4">
                  <MyGloLogo type="standard" isDarkMode={isDarkMode} size="sm" />
                  <MyGloLogo type="standard" isDarkMode={isDarkMode} size="md" />
                  <MyGloLogo type="standard" isDarkMode={isDarkMode} size="lg" />
                  <MyGloLogo type='standard' isDarkMode={isDarkMode} size="xl" />
              </View>
            </View>

            <View className="pb-1">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold metadata mb-2"
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
              className="text-2xl font-fraunces-semibold title-secondary"
            >
              Design Philosophy
            </Text>
          </View>
          <Text
            style={{ color: activeColors.foreground }}
            className="text-base font-nunito body-base leading-relaxed mb-4"
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
            className="text-3xl font-fraunces-bold title-primary mb-2"
          >
            Color Palette ({isDarkMode ? 'Dark Mode' : 'Light Mode'})
          </Text>
          <Text
            style={{ color: activeColors.mutedForeground }}
            className="text-sm font-nunito-medium subheading-secondary mb-4"
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
            className="text-3xl font-fraunces-bold title-primary mb-2"
          >
            Typography Utility System
          </Text>
          <Text
            style={{ color: activeColors.mutedForeground }}
            className="text-base font-nunito-semibold subheading-primary mb-4"
          >
            Fraunces old-style serif titles combined with Nunito body & Quicksand metadata/accents.
          </Text>

          {/* Heading Utility Samples */}
          <Card variant="default" isDarkMode={isDarkMode} className="mb-4 space-y-4">
            <Text
              style={{ color: activeColors.mutedForeground }}
              className="text-xs font-quicksand-bold uppercase tracking-widest metadata-overline mb-2"
            >
              Heading & Title Utilities
            </Text>
            
            <View style={dividerStyle} className="mb-4 border-b pb-3">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold metadata mb-1"
              >
                .title-display / .text-display (36px Fraunces Black)
              </Text>
              <Text
                style={{ color: activeColors.foreground }}
                className="text-4xl font-fraunces-black title-display"
              >
                Hero Display Title
              </Text>
            </View>

            <View style={dividerStyle} className="mb-4 border-b pb-3">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold metadata mb-1"
              >
                .title-primary / .text-title-1 (28px Fraunces Bold)
              </Text>
              <Text
                style={{ color: activeColors.foreground }}
                className="text-3xl font-fraunces-bold title-primary"
              >
                Primary Section Heading
              </Text>
            </View>

            <View style={dividerStyle} className="mb-4 border-b pb-3">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold metadata mb-1"
              >
                .title-secondary / .text-title-2 (22px Fraunces SemiBold)
              </Text>
              <Text
                style={{ color: activeColors.primary }}
                className="text-2xl font-fraunces-semibold title-secondary"
              >
                Secondary Card Title
              </Text>
            </View>

            <View style={dividerStyle} className="mb-4 border-b pb-3">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold metadata mb-1"
              >
                .title-tertiary / .text-title-3 (18px Fraunces Medium)
              </Text>
              <Text
                style={{ color: activeColors.foreground }}
                className="text-xl font-fraunces-medium title-tertiary"
              >
                Tertiary Item Title
              </Text>
            </View>

            <View className="pb-1">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold metadata mb-1"
              >
                .title-accent / .text-title-accent (18px Quicksand Bold)
              </Text>
              <Text
                style={{ color: isDarkMode ? activeColors.accentForeground : activeColors.accent }}
                className="text-lg font-quicksand-bold title-accent"
              >
                Quicksand Accent Highlight
              </Text>
            </View>
          </Card>

          {/* Subheading & Body Utility Samples */}
          <Card variant="tr-large" isDarkMode={isDarkMode} className="mb-4 space-y-4">
            <Text
              style={{ color: activeColors.mutedForeground }}
              className="text-xs font-quicksand-bold uppercase tracking-widest metadata-overline mb-2"
            >
              Subheading & Body Utilities
            </Text>
            
            <View style={dividerStyle} className="mb-4 border-b pb-3">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold metadata mb-1"
              >
                .subheading-primary (16px Nunito SemiBold)
              </Text>
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-base font-nunito-semibold subheading-primary"
              >
                Primary Subheading — Explanatory intro under main headers.
              </Text>
            </View>

            <View style={dividerStyle} className="mb-4 border-b pb-3">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold metadata mb-1"
              >
                .subheading-secondary (14px Nunito Medium)
              </Text>
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-sm font-nunito-medium subheading-secondary"
              >
                Secondary Subheading — Group headers and sub-navigation descriptors.
              </Text>
            </View>

            <View style={dividerStyle} className="mb-4 border-b pb-3">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold metadata mb-1"
              >
                .body-lg (18px Nunito Regular)
              </Text>
              <Text
                style={{ color: activeColors.foreground }}
                className="text-lg font-nunito body-lg"
              >
                Large Body — Lead paragraph copy for featured articles and callouts.
              </Text>
            </View>

            <View style={dividerStyle} className="mb-4 border-b pb-3">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold metadata mb-1"
              >
                .body-base (16px Nunito Regular)
              </Text>
              <Text
                style={{ color: activeColors.foreground }}
                className="text-base font-nunito body-base"
              >
                Base Body — Comfortable reading copy for wishlist items and descriptions.
              </Text>
            </View>

            <View className="pb-1">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold metadata mb-1"
              >
                .body-sm (14px Nunito Regular)
              </Text>
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-sm font-nunito body-sm"
              >
                Small Body — Compact text for helper notes, secondary card text, and labels.
              </Text>
            </View>
          </Card>

          {/* Metadata & Footnote Utility Samples */}
          <Card variant="bl-large" isDarkMode={isDarkMode}>
            <Text
              style={{ color: activeColors.mutedForeground }}
              className="text-xs font-quicksand-bold uppercase tracking-widest metadata-overline mb-3"
            >
              Metadata, Overline & Footnote Utilities
            </Text>
            
            <View style={dividerStyle} className="mb-4 border-b pb-3">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold metadata mb-1"
              >
                .metadata-overline (11px Quicksand Bold Uppercase Tracked)
              </Text>
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-bold uppercase tracking-widest metadata-overline"
              >
                WISHLIST ITEM • CATEGORY TAG
              </Text>
            </View>

            <View style={dividerStyle} className="mb-4 border-b pb-3">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold metadata mb-1"
              >
                .metadata (12px Quicksand SemiBold)
              </Text>
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold metadata"
              >
                Added 2 days ago • Requested by Alex
              </Text>
            </View>

            <View>
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-semibold metadata mb-1"
              >
                .footnote (11px Quicksand Medium)
              </Text>
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-medium footnote"
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
            className="text-3xl font-fraunces-bold title-primary mb-2"
          >
            Button Component System
          </Text>
          <Text
            style={{ color: activeColors.mutedForeground }}
            className="text-sm font-nunito-medium subheading-secondary mb-4"
          >
            Fully rounded pill shapes with generous horizontal padding.
          </Text>

          <Card variant="default" isDarkMode={isDarkMode} className="space-y-4">
            <View className="mb-3">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-bold uppercase tracking-widest metadata-overline mb-2"
              >
                Primary Pill
              </Text>
              <Button title="Primary Action" variant="primary" size="md" isDarkMode={isDarkMode} />
            </View>

            <View className="mb-3">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-bold uppercase tracking-widest metadata-overline mb-2"
              >
                Secondary Pill
              </Text>
              <Button title="Secondary Action" variant="secondary" size="md" isDarkMode={isDarkMode} />
            </View>

            <View className="mb-3">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-bold uppercase tracking-widest metadata-overline mb-2"
              >
                Outline Pill
              </Text>
              <Button title="Outline Action" variant="outline" size="md" isDarkMode={isDarkMode} />
            </View>

            <View className="mb-3">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-bold uppercase tracking-widest metadata-overline mb-2"
              >
                Ghost Pill
              </Text>
              <Button title="Ghost Action" variant="ghost" size="md" isDarkMode={isDarkMode} />
            </View>

            <View className="mb-1">
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-xs font-quicksand-bold uppercase tracking-widest metadata-overline mb-2"
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
            className="text-3xl font-fraunces-bold title-primary mb-2"
          >
            Input Controls
          </Text>
          <Text
            style={{ color: activeColors.mutedForeground }}
            className="text-sm font-nunito-medium subheading-secondary mb-4"
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
            className="text-3xl font-fraunces-bold title-primary mb-2"
          >
            Asymmetric Organic Cards
          </Text>
          <Text
            style={{ color: activeColors.mutedForeground }}
            className="text-sm font-nunito-medium subheading-secondary mb-4"
          >
            Unique asymmetric border radii create erosion-like, handcrafted card frames.
          </Text>

          <View className="gap-4">
            <Card variant="tl-large" isDarkMode={isDarkMode}>
              <Text
                style={{ color: activeColors.foreground }}
                className="text-xl font-fraunces-medium title-tertiary mb-1"
              >
                Top-Left Eroded Radius
              </Text>
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-sm font-nunito body-sm"
              >
                Card with prominent top-left corner curve (64px).
              </Text>
            </Card>

            <Card variant="tr-large" isDarkMode={isDarkMode}>
              <Text
                style={{ color: isDarkMode ? activeColors.accentForeground : activeColors.accent }}
                className="text-lg font-quicksand-bold title-accent mb-1"
              >
                Top-Right Eroded Radius
              </Text>
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-sm font-nunito body-sm"
              >
                Card with prominent top-right corner curve (80px).
              </Text>
            </Card>

            <Card variant="br-large" isDarkMode={isDarkMode}>
              <Text
                style={{ color: activeColors.primary }}
                className="text-2xl font-fraunces-semibold title-secondary mb-1"
              >
                Bottom-Right Eroded Radius
              </Text>
              <Text
                style={{ color: activeColors.mutedForeground }}
                className="text-sm font-nunito body-sm"
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
            className="text-xs font-quicksand-semibold metadata mb-1"
          >
            MyGlo Design System • NativeWind v5 + Tailwind v4
          </Text>
          <Text
            style={{ color: activeColors.mutedForeground }}
            className="text-xs font-quicksand-medium footnote"
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
