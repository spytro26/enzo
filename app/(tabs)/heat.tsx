import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { InputField } from '@/components/InputField';
import { Dropdown } from '@/components/Dropdown';
import { AppContext } from '@/context/AppContext';
import { ValidationHelper } from '@/utils/validation';

export default function HeatScreen() {
  const { roomData, setRoomData, unitSettings } = useContext(AppContext);

  const updateRoomData = (field: string, value: any) => {
    setRoomData(prev => ({ ...prev, [field]: value }));
  };

  const handleNumericInput = (field: string, text: string) => {
    const sanitized = ValidationHelper.sanitizeInput(text);
    updateRoomData(field, sanitized);
  };

  const powerUnit = unitSettings.power === 'kw' ? 'kW' : unitSettings.power.toUpperCase();

  // Room usage options
  const roomUsageOptions = [
    { label: 'Storage Only', value: 'storage' },
    { label: 'Processing Room', value: 'processing' },
    { label: 'Loading/Unloading', value: 'loading' },
  ];

  return (
    <LinearGradient
      colors={['#059669', '#10b981']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>ENZO</Text>
          <Text style={styles.logoSubtext}>COMPLETE SOLUTION FOR COLD CHAIN REQUIREMENT</Text>
          <Text style={styles.title}>Cold Room Calculator</Text>
        </View>

        <Dropdown
          label="Room usage type"
          options={roomUsageOptions}
          value={roomData.roomUsageType || 'storage'}
          onSelect={(value) => updateRoomData('roomUsageType', value)}
          placeholder="Storage Only"
        />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <InputField
              label="Door opening/day"
              value={(roomData.doorOpenings || 20).toString()}
              onChangeText={(text) => handleNumericInput('doorOpenings', text)}
              placeholder="20"
            />
          </View>
          <View style={styles.halfWidth}>
            <InputField
              label="Door area"
              value={(roomData.doorSize || 4.0).toString()}
              onChangeText={(text) => handleNumericInput('doorSize', text)}
              unit="m²"
              placeholder="4.0"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <InputField
              label="Cooler fans power"
              value={roomData.coolerFans.toString()}
              onChangeText={(text) => handleNumericInput('coolerFans', text)}
              unit={powerUnit}
              placeholder="2.50"
            />
          </View>
          <View style={styles.halfWidth}>
            <InputField
              label="Working time"
              value={roomData.coolerFansWorkingTime.toString()}
              onChangeText={(text) => handleNumericInput('coolerFansWorkingTime', text)}
              unit="hrs/day"
              placeholder="20"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <InputField
              label="Illumination intensity"
              value={roomData.illumination.toString()}
              onChangeText={(text) => handleNumericInput('illumination', text)}
              unit="W/m²"
              placeholder="15.00"
            />
          </View>
          <View style={styles.halfWidth}>
            <InputField
              label="Working time"
              value={roomData.illuminationWorkingTime.toString()}
              onChangeText={(text) => handleNumericInput('illuminationWorkingTime', text)}
              unit="hrs/day"
              placeholder="8"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <InputField
              label="Number of persons"
              value={roomData.persons.toString()}
              onChangeText={(text) => handleNumericInput('persons', text)}
              placeholder="2"
            />
          </View>
          <View style={styles.halfWidth}>
            <InputField
              label="Working time"
              value={roomData.personsWorkingTime.toString()}
              onChangeText={(text) => handleNumericInput('personsWorkingTime', text)}
              unit="hrs/day"
              placeholder="8"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <InputField
              label="Other heat sources"
              value={roomData.otherHeatSources.toString()}
              onChangeText={(text) => handleNumericInput('otherHeatSources', text)}
              unit={powerUnit}
              placeholder="2.30"
            />
          </View>
          <View style={styles.halfWidth}>
            <InputField
              label="Working time"
              value={roomData.otherHeatSourcesWorkingTime.toString()}
              onChangeText={(text) => handleNumericInput('otherHeatSourcesWorkingTime', text)}
              unit="hrs/day"
              placeholder="8"
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
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  halfWidth: {
    flex: 1,
    minWidth: 0,
  },
});