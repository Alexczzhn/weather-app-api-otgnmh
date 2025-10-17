
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { useFonts, Satisfy_400Regular } from '@expo-google-fonts/satisfy';

export default function LoadingScreen() {
  const [fontsLoaded] = useFonts({
    Satisfy_400Regular,
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>☀️</Text>
        <Text style={[styles.title, fontsLoaded && { fontFamily: 'Satisfy_400Regular' }]}>
          Weather App
        </Text>
        <ActivityIndicator 
          size="large" 
          color={colors.primary} 
          style={styles.loader}
        />
        <Text style={styles.subtitle}>Loading weather data...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 48,
    color: colors.primary,
    marginBottom: 30,
    textAlign: 'center',
  },
  loader: {
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 10,
  },
});
