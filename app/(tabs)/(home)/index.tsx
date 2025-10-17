
import React, { useState, useEffect } from "react";
import { Stack } from "expo-router";
import { ScrollView, Pressable, StyleSheet, View, Text, Platform, Alert, ActivityIndicator } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import { colors } from "@/styles/commonStyles";
import { LinearGradient } from "expo-linear-gradient";
import {
  fetchWeatherByCity,
  fetchHourlyForecast,
  fetchDailyForecast,
  getMockWeatherData,
  getMockHourlyForecast,
  getMockDailyForecast,
  WeatherData,
  HourlyForecast,
  DailyForecast,
} from "@/services/weatherService";

export default function HomeScreen() {
  const theme = useTheme();
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const [dailyForecast, setDailyForecast] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWeatherData();
  }, [unit]);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading weather data...');

      // Try to fetch real data for Nairobi, Kenya (default location)
      const weather = await fetchWeatherByCity('Nairobi,KE', unit);
      
      if (weather) {
        setWeatherData(weather);
        
        // Fetch forecasts
        const hourly = await fetchHourlyForecast(weather.lat, weather.lon, unit);
        const daily = await fetchDailyForecast(weather.lat, weather.lon, unit);
        
        setHourlyForecast(hourly.length > 0 ? hourly : getMockHourlyForecast(unit));
        setDailyForecast(daily.length > 0 ? daily : getMockDailyForecast(unit));
      } else {
        // Use mock data if API fails
        console.log('Using mock data - API key may not be configured');
        setWeatherData(getMockWeatherData(unit));
        setHourlyForecast(getMockHourlyForecast(unit));
        setDailyForecast(getMockDailyForecast(unit));
        setError('Using demo data. Configure API key for live weather.');
      }
    } catch (err) {
      console.error('Error loading weather:', err);
      setError('Failed to load weather data');
      // Use mock data as fallback
      setWeatherData(getMockWeatherData(unit));
      setHourlyForecast(getMockHourlyForecast(unit));
      setDailyForecast(getMockDailyForecast(unit));
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: string): string => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
      return 'sun.max.fill';
    } else if (conditionLower.includes('cloud')) {
      return 'cloud.sun.fill';
    } else if (conditionLower.includes('rain')) {
      return 'cloud.rain.fill';
    } else if (conditionLower.includes('storm') || conditionLower.includes('thunder')) {
      return 'cloud.bolt.fill';
    } else if (conditionLower.includes('snow')) {
      return 'snow';
    } else if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
      return 'cloud.fog.fill';
    }
    return 'cloud.sun.fill';
  };

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => setUnit(unit === 'C' ? 'F' : 'C')}
      style={styles.headerButtonContainer}
    >
      <Text style={[styles.unitText, { color: colors.primary }]}>°{unit}</Text>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading weather data...</Text>
      </View>
    );
  }

  if (!weatherData) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <IconSymbol name="exclamationmark.triangle.fill" size={48} color={colors.accent} />
        <Text style={styles.errorText}>Unable to load weather data</Text>
        <Pressable onPress={loadWeatherData} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

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
        {/* Error Banner */}
        {error && (
          <View style={styles.errorBanner}>
            <IconSymbol name="info.circle.fill" size={16} color={colors.accent} />
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}

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
            <IconSymbol 
              name={getWeatherIcon(weatherData.condition) as any} 
              size={80} 
              color="#FFFFFF" 
            />
            <Text style={styles.temperature}>{weatherData.temperature}°</Text>
            <Text style={styles.condition}>{weatherData.condition}</Text>
            <Text style={styles.feelsLike}>Feels like {weatherData.feelsLike}°</Text>
            <Text style={styles.description}>{weatherData.description}</Text>
          </LinearGradient>
        </View>

        {/* Hourly Forecast */}
        {hourlyForecast.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Hourly Forecast</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.hourlyScroll}
            >
              {hourlyForecast.map((hour, index) => (
                <View key={index} style={styles.hourlyCard}>
                  <Text style={styles.hourlyTime}>{hour.time}</Text>
                  <IconSymbol name={hour.icon as any} size={32} color={colors.primary} />
                  <Text style={styles.hourlyTemp}>{hour.temp}°</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

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
        {dailyForecast.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>5-Day Forecast</Text>
            {dailyForecast.map((day, index) => (
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
        )}

        {/* API Info */}
        <View style={styles.apiInfo}>
          <Text style={styles.apiInfoText}>
            💡 To get live weather data for all countries worldwide, add your OpenWeatherMap API key in services/weatherService.ts
          </Text>
          <Text style={styles.apiInfoSubtext}>
            Free tier includes weather for 200,000+ cities including all of Kenya
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorBanner: {
    backgroundColor: colors.accent + '20',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 12,
    color: colors.text,
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
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 8,
    textAlign: 'center',
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
  apiInfo: {
    backgroundColor: colors.primary + '15',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  apiInfoText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  apiInfoSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
