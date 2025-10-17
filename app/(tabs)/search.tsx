
import React, { useState, useEffect } from "react";
import { Stack } from "expo-router";
import { ScrollView, Pressable, StyleSheet, View, Text, TextInput, Platform, ActivityIndicator } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import { searchCities, fetchWeatherByCoords } from "@/services/weatherService";

interface CityResult {
  name: string;
  country: string;
  lat: number;
  lon: number;
  temp?: number;
  condition?: string;
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<CityResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Popular cities including many from Kenya and Africa
  const popularCities: CityResult[] = [
    { name: "Nairobi", country: "KE", lat: -1.2921, lon: 36.8219, temp: 24, condition: "Partly Cloudy" },
    { name: "Mombasa", country: "KE", lat: -4.0435, lon: 39.6682, temp: 28, condition: "Sunny" },
    { name: "Kisumu", country: "KE", lat: -0.0917, lon: 34.7680, temp: 26, condition: "Cloudy" },
    { name: "Nakuru", country: "KE", lat: -0.3031, lon: 36.0800, temp: 22, condition: "Rainy" },
    { name: "Eldoret", country: "KE", lat: 0.5143, lon: 35.2698, temp: 20, condition: "Partly Cloudy" },
    { name: "Thika", country: "KE", lat: -1.0332, lon: 37.0690, temp: 23, condition: "Sunny" },
    { name: "Lagos", country: "NG", lat: 6.5244, lon: 3.3792, temp: 30, condition: "Humid" },
    { name: "Cairo", country: "EG", lat: 30.0444, lon: 31.2357, temp: 32, condition: "Hot" },
    { name: "Cape Town", country: "ZA", lat: -33.9249, lon: 18.4241, temp: 18, condition: "Windy" },
    { name: "Addis Ababa", country: "ET", lat: 9.0320, lon: 38.7469, temp: 21, condition: "Cloudy" },
    { name: "Dar es Salaam", country: "TZ", lat: -6.7924, lon: 39.2083, temp: 29, condition: "Humid" },
    { name: "Kampala", country: "UG", lat: 0.3476, lon: 32.5825, temp: 25, condition: "Rainy" },
  ];

  useEffect(() => {
    if (searchQuery.length > 2) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const performSearch = async () => {
    try {
      setLoading(true);
      console.log('Searching for:', searchQuery);
      
      const cities = await searchCities(searchQuery);
      
      if (cities.length > 0) {
        setSearchResults(cities);
      } else {
        // Fallback to filtering popular cities
        const filtered = popularCities.filter(city =>
          city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          city.country.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered);
      }
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to popular cities
      const filtered = popularCities.filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.country.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } finally {
      setLoading(false);
    }
  };

  const displayCities = searchQuery.length > 0 ? searchResults : popularCities;

  const getWeatherIcon = (condition?: string) => {
    if (!condition) return 'cloud.fill';
    
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return 'sun.max.fill';
      case 'cloudy':
        return 'cloud.fill';
      case 'rainy':
      case 'rain':
        return 'cloud.rain.fill';
      case 'partly cloudy':
        return 'cloud.sun.fill';
      case 'hot':
        return 'sun.max.fill';
      case 'humid':
        return 'humidity.fill';
      case 'windy':
        return 'wind';
      default:
        return 'cloud.fill';
    }
  };

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Search Location",
            headerLargeTitle: true,
          }}
        />
      )}
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search cities worldwide (e.g., Nairobi, Mombasa)..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="words"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")}>
                <IconSymbol name="xmark.circle.fill" size={20} color={colors.textSecondary} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Results */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            Platform.OS !== 'ios' && styles.scrollContentWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>
              {searchQuery ? `Search Results (${displayCities.length})` : 'Popular Cities in Kenya & Africa'}
            </Text>
            {loading && <ActivityIndicator size="small" color={colors.primary} />}
          </View>
          
          {displayCities.length > 0 ? (
            displayCities.map((city, index) => (
              <Pressable
                key={`${city.name}-${city.country}-${index}`}
                style={[
                  styles.cityCard,
                  selectedCity === city.name && styles.cityCardSelected
                ]}
                onPress={() => setSelectedCity(city.name)}
              >
                <View style={styles.cityInfo}>
                  <View style={styles.cityHeader}>
                    <Text style={styles.cityName}>{city.name}</Text>
                    <Text style={styles.cityCountry}>{city.country}</Text>
                  </View>
                  {city.temp && city.condition && (
                    <View style={styles.weatherInfo}>
                      <IconSymbol 
                        name={getWeatherIcon(city.condition) as any} 
                        size={32} 
                        color={colors.primary} 
                      />
                      <View style={styles.tempContainer}>
                        <Text style={styles.cityTemp}>{city.temp}°C</Text>
                        <Text style={styles.cityCondition}>{city.condition}</Text>
                      </View>
                    </View>
                  )}
                </View>
                {selectedCity === city.name && (
                  <IconSymbol name="checkmark.circle.fill" size={24} color={colors.secondary} />
                )}
              </Pressable>
            ))
          ) : (
            <View style={styles.emptyState}>
              <IconSymbol name="magnifyingglass" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyText}>No cities found</Text>
              <Text style={styles.emptySubtext}>Try searching for a different location</Text>
            </View>
          )}

          {/* Info Card */}
          <View style={styles.infoCard}>
            <IconSymbol name="info.circle.fill" size={20} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Search Any City Worldwide</Text>
              <Text style={styles.infoText}>
                Search for weather in over 200,000 cities across all countries. 
                Try searching for cities in Kenya like Nairobi, Mombasa, Kisumu, or any city worldwide!
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchBar: {
    backgroundColor: colors.card,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    outlineStyle: 'none',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  scrollContentWithTabBar: {
    paddingBottom: 100,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  cityCard: {
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
  cityCardSelected: {
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  cityInfo: {
    flex: 1,
  },
  cityHeader: {
    marginBottom: 8,
  },
  cityName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  cityCountry: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tempContainer: {
    flexDirection: 'column',
  },
  cityTemp: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  cityCondition: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: colors.primary + '15',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    flexDirection: 'row',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
