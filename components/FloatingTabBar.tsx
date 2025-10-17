
import React from 'react';
import { useRouter, usePathname } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@react-navigation/native';
import { IconSymbol } from '@/components/IconSymbol';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { colors } from '@/styles/commonStyles';

export interface TabBarItem {
  name: string;
  route: string;
  icon: string;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

export default function FloatingTabBar({
  tabs,
  containerWidth = Dimensions.get('window').width - 32,
  borderRadius = 24,
  bottomMargin = 16,
}: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const activeIndex = useSharedValue(0);

  // Find the active tab index
  const currentIndex = tabs.findIndex((tab) => {
    if (tab.route === '/(tabs)/(home)/') {
      return pathname === '/' || pathname.startsWith('/(tabs)/(home)');
    }
    return pathname.includes(tab.name);
  });

  if (currentIndex !== -1 && currentIndex !== activeIndex.value) {
    activeIndex.value = currentIndex;
  }

  const handleTabPress = (route: string) => {
    router.push(route as any);
  };

  const animatedStyle = useAnimatedStyle(() => {
    const tabWidth = containerWidth / tabs.length;
    return {
      transform: [
        {
          translateX: withSpring(activeIndex.value * tabWidth, {
            damping: 20,
            stiffness: 90,
          }),
        },
      ],
    };
  });

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[styles.safeArea, { bottom: bottomMargin }]}
    >
      <View
        style={[
          styles.container,
          {
            width: containerWidth,
            borderRadius,
          },
        ]}
      >
        {Platform.OS === 'ios' ? (
          <BlurView intensity={80} tint="light" style={styles.blurView}>
            <View style={styles.content}>
              <Animated.View
                style={[
                  styles.activeIndicator,
                  {
                    width: containerWidth / tabs.length,
                    borderRadius: borderRadius - 8,
                  },
                  animatedStyle,
                ]}
              />
              {tabs.map((tab, index) => {
                const isActive = currentIndex === index;
                return (
                  <TouchableOpacity
                    key={tab.name}
                    style={styles.tab}
                    onPress={() => handleTabPress(tab.route)}
                    activeOpacity={0.7}
                  >
                    <IconSymbol
                      name={tab.icon as any}
                      size={24}
                      color={isActive ? colors.primary : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.label,
                        { color: isActive ? colors.primary : colors.textSecondary },
                      ]}
                    >
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </BlurView>
        ) : (
          <View style={[styles.content, styles.androidContent]}>
            <Animated.View
              style={[
                styles.activeIndicator,
                styles.androidActiveIndicator,
                {
                  width: containerWidth / tabs.length,
                  borderRadius: borderRadius - 8,
                },
                animatedStyle,
              ]}
            />
            {tabs.map((tab, index) => {
              const isActive = currentIndex === index;
              return (
                <TouchableOpacity
                  key={tab.name}
                  style={styles.tab}
                  onPress={() => handleTabPress(tab.route)}
                  activeOpacity={0.7}
                >
                  <IconSymbol
                    name={tab.icon as any}
                    size={24}
                    color={isActive ? colors.primary : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.label,
                      { color: isActive ? colors.primary : colors.textSecondary },
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    overflow: 'hidden',
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
    elevation: 8,
  },
  blurView: {
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  androidContent: {
    backgroundColor: colors.card,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 4,
    zIndex: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    height: '100%',
    backgroundColor: `${colors.primary}20`,
    margin: 8,
    zIndex: 1,
  },
  androidActiveIndicator: {
    backgroundColor: `${colors.primary}15`,
  },
});
