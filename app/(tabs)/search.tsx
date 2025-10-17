
import React, { useState } from "react";
import { Stack } from "expo-router";
import { ScrollView, Pressable, StyleSheet, View, Text, TextInput, Platform } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // Mock popular cities
  const popularCities = [
    { name: "New York", country: "United States", temp: 18, condition: "Cloudy" },
    { name: "London", country: "United Kingdom", temp: 15, condition: "Rainy" },
    { name: "Tokyo", country: "Japan", temp: 22, condition: "Sunny" },
    { name: "Paris", country: "France", temp: 17, condition: "Partly Cloudy" },
    { name: "Sydney", country: "Australia", temp: 25, condition: "Sunny" },
    { name: "Dubai", country: "UAE", temp: 35, condition: "Hot" },
    { name: "Singapore", country: "Singapore", temp: 28, condition: "Humid" },
    { name: "Mumbai", country: "India", temp: 30, condition: "Sunny" },
  ];

  const filteredCities = searchQuery
    ? popularCities.filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.country.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : popularCities;

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return 'sun.max.fill';
      case 'cloudy':
        return 'cloud.fill';
      case 'rainy':
        return 'cloud.rain.fill';
      case 'partly cloudy':
        return 'cloud.sun.fill';
      case 'hot':
        return 'sun.max.fill';
      case 'humid':
        return 'humidity.fill';
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
              placeholder="Search for a city..."
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
          <Text style={styles.sectionTitle}>
            {searchQuery ? 'Search Results' : 'Popular Cities'}
          </Text>
          
          {filteredCities.length > 0 ? (
            filteredCities.map((city, index) => (
              <Pressable
                key={index}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    marginTop: 8,
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
});
