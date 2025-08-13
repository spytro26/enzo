import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { InputField } from '@/components/InputField';
import { Dropdown } from '@/components/Dropdown';
import { AppContext } from '@/context/AppContext';
import { ValidationHelper } from '@/utils/validation';

export default function GeneralScreen() {
  const { roomData, setRoomData, unitSettings } = useContext(AppContext);

  const updateRoomData = (field: string, value: any) => {
    setRoomData(prev => ({ ...prev, [field]: value }));
  };

  const handleNumericInput = (field: string, text: string) => {
    const sanitized = ValidationHelper.sanitizeInput(text);
    updateRoomData(field, sanitized);
  };

  const tempUnit = unitSettings.temperature === 'celsius' ? '°C' : 
                   unitSettings.temperature === 'fahrenheit' ? '°F' : 'K';

  const ventilationOptions = [
    { label: 'Light', value: 'light' },
    { label: 'Moderate', value: 'moderate' },
    { label: 'High', value: 'high' },
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

        <InputField
          label="Room temperature"
          value={roomData.roomTemperature.toString()}
          onChangeText={(text) => handleNumericInput('roomTemperature', text)}
          unit={tempUnit}
          placeholder="2.00"
        />

        <InputField
          label="Outside temperature"
          value={roomData.outsideTemperature.toString()}
          onChangeText={(text) => handleNumericInput('outsideTemperature', text)}
          unit={tempUnit}
          placeholder="25.00"
        />

        <Dropdown
          label="Ventilation loss factor"
          options={ventilationOptions}
          value={roomData.ventilationLossFactor}
          onSelect={(value) => updateRoomData('ventilationLossFactor', value)}
          placeholder="Moderate"
        />

        <InputField
          label="Running time installing"
          value={roomData.runningTime.toString()}
          onChangeText={(text) => handleNumericInput('runningTime', text)}
          unit="hours"
          placeholder="24"
        />

        <InputField
          label="Loading perc. room"
          value={roomData.loadingPercentage.toString()}
          onChangeText={(text) => handleNumericInput('loadingPercentage', text)}
          unit="%"
          placeholder="80"
        />
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
});