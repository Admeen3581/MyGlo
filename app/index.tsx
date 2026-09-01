import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LightColors, DarkColors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Badge } from '@/components/Badge';
import { FloatingNav } from '@/components/FloatingNav';
import { ColorSwatch } from '@/components/ColorSwatch';
import { BlobBackground } from '@/components/BlobBackground';
import { images } from '@/constants/images';

export default function Index() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const activeColors = isDarkMode ? DarkColors : LightColors;

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
        style={{ top: -40, right: -60, opacity: 0.25 }}
      />
      <BlobBackground
        color={activeColors.accent}
        size={240}
        variant="blob2"
        style={{ top: 280, left: -80, opacity: 0.15 }}
      />
      <BlobBackground
        color={activeColors.primary}
        size={300}
        variant="blob3"
        style={{ bottom: 100, right: -100, opacity: 0.18 }}
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
            <Badge label="DESIGN SYSTEM v1.0" variant="secondary" />
          </View>
          <Text className="text-4xl font-fraunces-bold text-foreground mb-3 leading-tight">
            Organic & Natural Design System
          </Text>
          <Text className="text-base font-nunito text-muted-foreground leading-relaxed mb-6">
            A tactile, warm, wabi-sabi aesthetic crafted with soft amorphous blob shapes,
            natural ocean-floor color palettes, rounded typography, and soft colored shadows.
          </Text>

          <View className="flex-row flex-wrap gap-3">
            <Button
              title="Primary Action"
              variant="primary"
              size="md"
              onPress={() => {}}
            />
            <Button
              title="Explore Tokens"
              variant="outline"
              size="md"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Section: Design Philosophy */}
        <Card variant="tl-large" className="mb-8 bg-white/90">
          <View className="flex-row items-center mb-3">
            <Image
              source={images.logoIcon}
              style={{ width: 48, height: 48, marginRight: 8 }}
              contentFit="contain"
            />
            <Text className="text-2xl font-fraunces-semibold text-primary">
              Design Philosophy
            </Text>
          </View>
          <Text className="text-sm font-nunito text-foreground leading-relaxed mb-4">
            Embracing imperfection, erosion by wind and water, and organic curves.
            There are no harsh 90-degree angles. Everything feels handcrafted, peaceful,
            and rooted.
          </Text>
          <View className="flex-row flex-wrap gap-2">
            <Badge label="Tactile" variant="primary" size="sm" />
            <Badge label="Wabi-Sabi" variant="secondary" size="sm" />
            <Badge label="Oceanic" variant="success" size="sm" />
            <Badge label="Soft Shadows" variant="warning" size="sm" />
          </View>
        </Card>

        {/* Section: Color Palette Tokens */}
        <View className="mb-8">
          <Text className="text-2xl font-fraunces-bold text-foreground mb-2">
            Color Palette ({isDarkMode ? 'Dark Mode' : 'Light Mode'})
          </Text>
          <Text className="text-sm font-nunito text-muted-foreground mb-4">
            Water-drawn palette evoking ocean floors, clay pottery, and bleached driftwood.
          </Text>
          <View className="flex-row flex-wrap justify-between">
            <ColorSwatch name="Background" hex={activeColors.background} />
            <ColorSwatch name="Foreground" hex={activeColors.foreground} />
            <ColorSwatch name="Primary" hex={activeColors.primary} />
            <ColorSwatch name="Secondary" hex={activeColors.secondary} />
            <ColorSwatch name="Accent" hex={activeColors.accent} />
            <ColorSwatch name="Muted" hex={activeColors.muted} />
            <ColorSwatch name="Border" hex={activeColors.border} />
            <ColorSwatch name="Destructive" hex={activeColors.destructive} />
            <ColorSwatch name="Success" hex={activeColors.success} />
            <ColorSwatch name="Warning" hex={activeColors.warning} />
          </View>
        </View>

        {/* Section: Typography */}
        <View className="mb-8">
          <Text className="text-2xl font-fraunces-bold text-foreground mb-2">
            Typography System
          </Text>
          <Text className="text-sm font-nunito text-muted-foreground mb-4">
            Fraunces old-style serif combined with Nunito and Quicksand rounded sans-serif.
          </Text>

          <Card variant="default" className="mb-4">
            <Text className="text-xs font-nunito-bold text-muted-foreground uppercase tracking-widest mb-1">
              Fraunces Serif (Headings)
            </Text>
            <Text className="text-3xl font-fraunces-black text-foreground mb-1">
              Fraunces Black 700
            </Text>
            <Text className="text-2xl font-fraunces-bold text-foreground mb-1">
              Fraunces Bold 600
            </Text>
            <Text className="text-xl font-fraunces-semibold text-foreground mb-1">
              Fraunces SemiBold 500
            </Text>
            <Text className="text-lg font-fraunces text-foreground">
              Fraunces Regular 400
            </Text>
          </Card>

          <Card variant="tr-large" className="mb-4">
            <Text className="text-xs font-nunito-bold text-muted-foreground uppercase tracking-widest mb-1">
              Nunito Sans (Body & UI)
            </Text>
            <Text className="text-lg font-nunito-extrabold text-foreground mb-1">
              Nunito ExtraBold - Crisp UI Headers
            </Text>
            <Text className="text-base font-nunito-bold text-foreground mb-1">
              Nunito Bold - Button Labels & Actions
            </Text>
            <Text className="text-base font-nunito-semibold text-foreground mb-1">
              Nunito SemiBold - Subtitles & Badges
            </Text>
            <Text className="text-sm font-nunito text-foreground">
              Nunito Regular - Comfortable body copy for gift descriptions.
            </Text>
          </Card>

          <Card variant="bl-large">
            <Text className="text-xs font-quicksand-bold text-muted-foreground uppercase tracking-widest mb-1">
              Quicksand Sans (Secondary Accent)
            </Text>
            <Text className="text-lg font-quicksand-bold text-foreground mb-1">
              Quicksand Bold Typography
            </Text>
            <Text className="text-base font-quicksand-semibold text-foreground mb-1">
              Quicksand SemiBold Subheadings
            </Text>
            <Text className="text-sm font-quicksand text-foreground">
              Quicksand Regular for playful secondary captions.
            </Text>
          </Card>
        </View>

        {/* Section: Button Variants */}
        <View className="mb-8">
          <Text className="text-2xl font-fraunces-bold text-foreground mb-2">
            Button Component System
          </Text>
          <Text className="text-sm font-nunito text-muted-foreground mb-4">
            Fully rounded pill shapes with generous horizontal padding.
          </Text>

          <Card variant="default" className="space-y-4">
            <View className="mb-3">
              <Text className="text-xs font-nunito-bold text-muted-foreground mb-2 uppercase">
                Primary Pill
              </Text>
              <Button title="Primary Action" variant="primary" size="md" />
            </View>

            <View className="mb-3">
              <Text className="text-xs font-nunito-bold text-muted-foreground mb-2 uppercase">
                Secondary Pill
              </Text>
              <Button title="Secondary Action" variant="secondary" size="md" />
            </View>

            <View className="mb-3">
              <Text className="text-xs font-nunito-bold text-muted-foreground mb-2 uppercase">
                Outline Pill
              </Text>
              <Button title="Outline Action" variant="outline" size="md" />
            </View>

            <View className="mb-3">
              <Text className="text-xs font-nunito-bold text-muted-foreground mb-2 uppercase">
                Ghost Pill
              </Text>
              <Button title="Ghost Action" variant="ghost" size="md" />
            </View>

            <View className="mb-1">
              <Text className="text-xs font-nunito-bold text-muted-foreground mb-2 uppercase">
                Button Sizes (Small, Medium, Large)
              </Text>
              <View className="flex-row items-center flex-wrap gap-2">
                <Button title="Small" variant="primary" size="sm" />
                <Button title="Medium" variant="primary" size="md" />
                <Button title="Large" variant="primary" size="lg" />
              </View>
            </View>
          </Card>
        </View>

        {/* Section: Inputs & Forms */}
        <View className="mb-8">
          <Text className="text-2xl font-fraunces-bold text-foreground mb-2">
            Input Controls
          </Text>
          <Text className="text-sm font-nunito text-muted-foreground mb-4">
            Pill-shaped text fields with semi-transparent background.
          </Text>

          <Card variant="br-large">
            <Input
              label="Gift Item Title"
              placeholder="e.g. Handmade Ceramic Mug"
              value={inputValue}
              onChangeText={setInputValue}
              containerClassName="mb-4"
            />

            <Input
              label="Wishlist Link"
              placeholder="https://example.com/item/123"
              error={inputValue.length > 0 ? undefined : 'Please enter a valid gift URL'}
            />
          </Card>
        </View>

        {/* Section: Asymmetric Organic Cards */}
        <View className="mb-8">
          <Text className="text-2xl font-fraunces-bold text-foreground mb-2">
            Asymmetric Organic Cards
          </Text>
          <Text className="text-sm font-nunito text-muted-foreground mb-4">
            Unique asymmetric border radii create erosion-like, handcrafted card frames.
          </Text>

          <View className="gap-4">
            <Card variant="tl-large" className="bg-white">
              <Text className="text-lg font-fraunces-semibold text-primary mb-1">
                Top-Left Eroded Radius
              </Text>
              <Text className="text-sm font-nunito text-foreground">
                Card with prominent top-left corner curve (64px).
              </Text>
            </Card>

            <Card variant="tr-large" className="bg-white">
              <Text className="text-lg font-fraunces-semibold text-accent mb-1">
                Top-Right Eroded Radius
              </Text>
              <Text className="text-sm font-nunito text-foreground">
                Card with prominent top-right corner curve (80px).
              </Text>
            </Card>

            <Card variant="br-large" className="bg-white">
              <Text className="text-lg font-fraunces-semibold text-success mb-1">
                Bottom-Right Eroded Radius
              </Text>
              <Text className="text-sm font-nunito text-foreground">
                Card with prominent bottom-right corner curve (64px).
              </Text>
            </Card>
          </View>
        </View>

        {/* Footer info */}
        <View className="py-8 items-center border-t border-border/40">
          <Text className="text-xs font-nunito-semibold text-muted-foreground mb-1">
            MyGlo Design System • NativeWind v5 + Tailwind v4
          </Text>
          <Text className="text-xs font-fraunces text-muted-foreground">
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
