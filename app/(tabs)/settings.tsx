
import React, { useState } from "react";
import { Stack } from "expo-router";
import { ScrollView, Pressable, StyleSheet, View, Text, Switch, Platform } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";

export default function SettingsScreen() {
  const [temperatureUnit, setTemperatureUnit] = useState<'celsius' | 'fahrenheit'>('celsius');
  const [windSpeedUnit, setWindSpeedUnit] = useState<'kmh' | 'mph'>('kmh');
  const [notifications, setNotifications] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    value, 
    onPress 
  }: { 
    icon: string; 
    title: string; 
    subtitle?: string; 
    value?: string; 
    onPress?: () => void;
  }) => (
    <Pressable style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingIcon}>
        <IconSymbol name={icon as any} size={24} color={colors.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {value && (
        <View style={styles.settingValue}>
          <Text style={styles.settingValueText}>{value}</Text>
          <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
        </View>
      )}
    </Pressable>
  );

  const SettingToggle = ({ 
    icon, 
    title, 
    subtitle, 
    value, 
    onValueChange 
  }: { 
    icon: string; 
    title: string; 
    subtitle?: string; 
    value: boolean; 
    onValueChange: (value: boolean) => void;
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIcon}>
        <IconSymbol name={icon as any} size={24} color={colors.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.textSecondary, true: colors.secondary }}
        thumbColor={value ? colors.card : colors.card}
      />
    </View>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Settings",
            headerLargeTitle: true,
          }}
        />
      )}
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={[
          styles.scrollContent,
          Platform.OS !== 'ios' && styles.scrollContentWithTabBar
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Units Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Units</Text>
          <View style={styles.card}>
            <SettingItem
              icon="thermometer"
              title="Temperature"
              subtitle="Choose your preferred temperature unit"
              value={temperatureUnit === 'celsius' ? 'Celsius (°C)' : 'Fahrenheit (°F)'}
              onPress={() => setTemperatureUnit(temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius')}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="wind"
              title="Wind Speed"
              subtitle="Choose your preferred wind speed unit"
              value={windSpeedUnit === 'kmh' ? 'km/h' : 'mph'}
              onPress={() => setWindSpeedUnit(windSpeedUnit === 'kmh' ? 'mph' : 'kmh')}
            />
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.card}>
            <SettingToggle
              icon="bell.fill"
              title="Push Notifications"
              subtitle="Receive weather updates"
              value={notifications}
              onValueChange={setNotifications}
            />
            <View style={styles.divider} />
            <SettingToggle
              icon="exclamationmark.triangle.fill"
              title="Weather Alerts"
              subtitle="Get notified about severe weather"
              value={weatherAlerts}
              onValueChange={setWeatherAlerts}
            />
          </View>
        </View>

        {/* General Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          <View style={styles.card}>
            <SettingToggle
              icon="arrow.clockwise"
              title="Auto Refresh"
              subtitle="Automatically update weather data"
              value={autoRefresh}
              onValueChange={setAutoRefresh}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="location.fill"
              title="Location Services"
              subtitle="Manage location permissions"
              value="Enabled"
              onPress={() => console.log('Open location settings')}
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <SettingItem
              icon="info.circle.fill"
              title="App Version"
              subtitle="1.0.0"
            />
            <View style={styles.divider} />
            <SettingItem
              icon="doc.text.fill"
              title="Terms of Service"
              onPress={() => console.log('Open terms')}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="hand.raised.fill"
              title="Privacy Policy"
              onPress={() => console.log('Open privacy policy')}
            />
          </View>
        </View>

        {/* Data Source Info */}
        <View style={styles.infoCard}>
          <IconSymbol name="cloud.fill" size={32} color={colors.primary} />
          <Text style={styles.infoTitle}>Weather Data</Text>
          <Text style={styles.infoText}>
            Weather information is provided for demonstration purposes. 
            Connect to a real weather API for live data.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  scrollContentWithTabBar: {
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  settingSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  settingValueText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: `${colors.textSecondary}20`,
    marginLeft: 68,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
