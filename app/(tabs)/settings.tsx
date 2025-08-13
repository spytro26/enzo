import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Dropdown } from '@/components/Dropdown';
import { AppContext } from '@/context/AppContext';

export default function SettingsScreen() {
  const { unitSettings, setUnitSettings } = useContext(AppContext);

  const updateUnitSetting = (field: string, value: any) => {
    setUnitSettings(prev => ({ ...prev, [field]: value }));
  };

  const temperatureOptions = [
    { label: 'Celsius', value: 'celsius' },
    { label: 'Fahrenheit', value: 'fahrenheit' },
    { label: 'Kelvin', value: 'kelvin' },
  ];

  const powerOptions = [
    { label: 'kW', value: 'kw' },
    { label: 'BTU/hr', value: 'btu' },
    { label: 'R', value: 'r' },
    { label: 'kcal/hr', value: 'kcal' },
    { label: 'Horsepower', value: 'horsepower' },
  ];

  const distanceSmallOptions = [
    { label: 'Inch', value: 'inch' },
    { label: 'Millimeter', value: 'millimeter' },
  ];

  const distanceLargeOptions = [
    { label: 'Foot', value: 'foot' },
    { label: 'Meter', value: 'meter' },
  ];

  const weightOptions = [
    { label: 'Kilogram', value: 'kg' },
    { label: 'Pound', value: 'pound' },
  ];

  const systemOptions = [
    { label: 'SI Metrics', value: 'si' },
    { label: 'Imperial', value: 'imperial' },
  ];

  const languageOptions = [
    { label: 'English', value: 'english' },
  ];

  return (
    <LinearGradient
      colors={['#1e3a8a', '#3b82f6']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>ENZO</Text>
          <Text style={styles.logoSubtext}>COMPLETE SOLUTION FOR COLD CHAIN REQUIREMENT</Text>
          <Text style={styles.title}>Cold Room Calculator</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Dropdown
              label="Temperature"
              options={temperatureOptions}
              value={unitSettings.temperature}
              onSelect={(value) => updateUnitSetting('temperature', value)}
            />
          </View>
          <View style={styles.halfWidth}>
            <Dropdown
              label="Power"
              options={powerOptions}
              value={unitSettings.power}
              onSelect={(value) => updateUnitSetting('power', value)}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Dropdown
              label="Distance (small)"
              options={distanceSmallOptions}
              value={unitSettings.distanceSmall}
              onSelect={(value) => updateUnitSetting('distanceSmall', value)}
            />
          </View>
          <View style={styles.halfWidth}>
            <Dropdown
              label="Distance (large)"
              options={distanceLargeOptions}
              value={unitSettings.distanceLarge}
              onSelect={(value) => updateUnitSetting('distanceLarge', value)}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Dropdown
              label="Weight"
              options={weightOptions}
              value={unitSettings.weight}
              onSelect={(value) => updateUnitSetting('weight', value)}
            />
          </View>
          <View style={styles.halfWidth}>
            <Dropdown
              label="Select system"
              options={systemOptions}
              value={unitSettings.system}
              onSelect={(value) => updateUnitSetting('system', value)}
            />
          </View>
        </View>

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  logoSubtext: {
    fontSize: 10,
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  halfWidth: {
    width: '48%',
  },
});