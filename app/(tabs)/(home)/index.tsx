
import React, { useState } from "react";
import { Stack } from "expo-router";
import { ScrollView, Pressable, StyleSheet, View, Text, Platform } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import { colors } from "@/styles/commonStyles";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  const theme = useTheme();
  const [unit, setUnit] = useState<'C' | 'F'>('C');

  // Mock weather data
  const weatherData = {
    location: "San Francisco",
    country: "United States",
    temperature: unit === 'C' ? 22 : 72,
    feelsLike: unit === 'C' ? 20 : 68,
    condition: "Partly Cloudy",
    description: "Expect partly cloudy skies throughout the day",
    humidity: 65,
    windSpeed: 12,
    pressure: 1013,
    visibility: 10,
    uvIndex: 6,
    sunrise: "6:42 AM",
    sunset: "7:28 PM",
    hourlyForecast: [
      { time: "Now", temp: unit === 'C' ? 22 : 72, icon: "cloud.sun.fill" },
      { time: "2 PM", temp: unit === 'C' ? 24 : 75, icon: "sun.max.fill" },
      { time: "3 PM", temp: unit === 'C' ? 25 : 77, icon: "sun.max.fill" },
      { time: "4 PM", temp: unit === 'C' ? 24 : 75, icon: "cloud.sun.fill" },
      { time: "5 PM", temp: unit === 'C' ? 23 : 73, icon: "cloud.fill" },
      { time: "6 PM", temp: unit === 'C' ? 21 : 70, icon: "cloud.moon.fill" },
    ],
    weeklyForecast: [
      { day: "Mon", high: unit === 'C' ? 25 : 77, low: unit === 'C' ? 18 : 64, icon: "sun.max.fill" },
      { day: "Tue", high: unit === 'C' ? 23 : 73, low: unit === 'C' ? 17 : 63, icon: "cloud.sun.fill" },
      { day: "Wed", high: unit === 'C' ? 21 : 70, low: unit === 'C' ? 16 : 61, icon: "cloud.rain.fill" },
      { day: "Thu", high: unit === 'C' ? 22 : 72, low: unit === 'C' ? 17 : 63, icon: "cloud.fill" },
      { day: "Fri", high: unit === 'C' ? 24 : 75, low: unit === 'C' ? 18 : 64, icon: "sun.max.fill" },
    ],
  };

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => setUnit(unit === 'C' ? 'F' : 'C')}
      style={styles.headerButtonContainer}
    >
      <Text style={[styles.unitText, { color: colors.primary }]}>°{unit}</Text>
    </Pressable>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Weather",
            headerRight: renderHeaderRight,
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
        {/* Location Header */}
        <View style={styles.locationHeader}>
          <IconSymbol name="location.fill" size={20} color={colors.primary} />
          <Text style={styles.locationText}>{weatherData.location}</Text>
          <Text style={styles.countryText}>{weatherData.country}</Text>
        </View>

        {/* Main Weather Card */}
        <View style={styles.mainCard}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientCard}
          >
            <IconSymbol name="cloud.sun.fill" size={80} color="#FFFFFF" />
            <Text style={styles.temperature}>{weatherData.temperature}°</Text>
            <Text style={styles.condition}>{weatherData.condition}</Text>
            <Text style={styles.feelsLike}>Feels like {weatherData.feelsLike}°</Text>
          </LinearGradient>
        </View>

        {/* Hourly Forecast */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Hourly Forecast</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.hourlyScroll}
          >
            {weatherData.hourlyForecast.map((hour, index) => (
              <View key={index} style={styles.hourlyCard}>
                <Text style={styles.hourlyTime}>{hour.time}</Text>
                <IconSymbol name={hour.icon as any} size={32} color={colors.primary} />
                <Text style={styles.hourlyTemp}>{hour.temp}°</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Weather Details Grid */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Weather Details</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailCard}>
              <IconSymbol name="drop.fill" size={24} color={colors.primary} />
              <Text style={styles.detailLabel}>Humidity</Text>
              <Text style={styles.detailValue}>{weatherData.humidity}%</Text>
            </View>
            <View style={styles.detailCard}>
              <IconSymbol name="wind" size={24} color={colors.secondary} />
              <Text style={styles.detailLabel}>Wind Speed</Text>
              <Text style={styles.detailValue}>{weatherData.windSpeed} km/h</Text>
            </View>
            <View style={styles.detailCard}>
              <IconSymbol name="gauge" size={24} color={colors.accent} />
              <Text style={styles.detailLabel}>Pressure</Text>
              <Text style={styles.detailValue}>{weatherData.pressure} hPa</Text>
            </View>
            <View style={styles.detailCard}>
              <IconSymbol name="eye.fill" size={24} color={colors.highlight} />
              <Text style={styles.detailLabel}>Visibility</Text>
              <Text style={styles.detailValue}>{weatherData.visibility} km</Text>
            </View>
            <View style={styles.detailCard}>
              <IconSymbol name="sun.max.fill" size={24} color={colors.accent} />
              <Text style={styles.detailLabel}>UV Index</Text>
              <Text style={styles.detailValue}>{weatherData.uvIndex}</Text>
            </View>
            <View style={styles.detailCard}>
              <IconSymbol name="sunrise.fill" size={24} color={colors.secondary} />
              <Text style={styles.detailLabel}>Sunrise</Text>
              <Text style={styles.detailValue}>{weatherData.sunrise}</Text>
            </View>
          </View>
        </View>

        {/* Weekly Forecast */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>7-Day Forecast</Text>
          {weatherData.weeklyForecast.map((day, index) => (
            <View key={index} style={styles.weeklyCard}>
              <Text style={styles.weeklyDay}>{day.day}</Text>
              <IconSymbol name={day.icon as any} size={28} color={colors.primary} />
              <View style={styles.weeklyTempContainer}>
                <Text style={styles.weeklyHigh}>{day.high}°</Text>
                <Text style={styles.weeklyLow}>{day.low}°</Text>
              </View>
            </View>
          ))}
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
  headerButtonContainer: {
    padding: 8,
    marginRight: 8,
  },
  unitText: {
    fontSize: 18,
    fontWeight: '700',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  locationText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  countryText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  mainCard: {
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    boxShadow: '0px 8px 24px rgba(74, 191, 242, 0.2)',
    elevation: 8,
  },
  gradientCard: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  temperature: {
    fontSize: 72,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 16,
  },
  condition: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 8,
  },
  feelsLike: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  hourlyScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  hourlyCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 80,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  hourlyTime: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  hourlyTemp: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 8,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 4,
  },
  weeklyCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  weeklyDay: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    width: 60,
  },
  weeklyTempContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  weeklyHigh: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  weeklyLow: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
