
import React from 'react';
import { Platform } from 'react-native';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  // Define the tabs configuration
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'cloud.sun.fill',
      label: 'Weather',
    },
    {
      name: 'search',
      route: '/(tabs)/search',
      icon: 'magnifyingglass',
      label: 'Search',
    },
    {
      name: 'settings',
      route: '/(tabs)/settings',
      icon: 'gearshape.fill',
      label: 'Settings',
    },
  ];

  // Use NativeTabs for iOS, custom FloatingTabBar for Android and Web
  if (Platform.OS === 'ios') {
    return (
      <NativeTabs>
        <NativeTabs.Trigger name="(home)">
          <Icon sf="cloud.sun.fill" drawable="ic_home" />
          <Label>Weather</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="search">
          <Icon sf="magnifyingglass" drawable="ic_search" />
          <Label>Search</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="settings">
          <Icon sf="gearshape.fill" drawable="ic_settings" />
          <Label>Settings</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

  // For Android and Web, use Stack navigation with custom floating tab bar
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen name="(home)" />
        <Stack.Screen name="search" />
        <Stack.Screen name="settings" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
