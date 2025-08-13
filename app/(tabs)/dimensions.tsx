import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { InputField } from '@/components/InputField';
import { Dropdown } from '@/components/Dropdown';
import { insulationMaterials } from '@/data/products';
import { AppContext } from '@/context/AppContext';
import { ValidationHelper } from '@/utils/validation';

export default function DimensionsScreen() {
  const { roomData, setRoomData, unitSettings } = useContext(AppContext);

  const updateRoomData = (field: string, value: any) => {
    setRoomData(prev => ({ ...prev, [field]: value }));
  };

  const handleNumericInput = (field: string, text: string) => {
    const sanitized = ValidationHelper.sanitizeInput(text);
    updateRoomData(field, sanitized);
  };

  const lengthUnit = unitSettings.distanceLarge === 'foot' ? 'ft' : 'm';
  const thicknessUnit = unitSettings.distanceSmall === 'inch' ? 'in' : 'mm';

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
          label="Length"
          value={roomData.length.toString()}
          onChangeText={(text) => handleNumericInput('length', text)}
          unit={lengthUnit}
          placeholder="16.40"
        />

        <InputField
          label="Width"
          value={roomData.width.toString()}
          onChangeText={(text) => handleNumericInput('width', text)}
          unit={lengthUnit}
          placeholder="16.40"
        />

        <InputField
          label="Height"
          value={roomData.height.toString()}
          onChangeText={(text) => handleNumericInput('height', text)}
          unit={lengthUnit}
          placeholder="9.84"
        />

        <Dropdown
          label="Insulation material"
          options={insulationMaterials.map(mat => ({ label: mat.label, value: mat.value }))}
          value={roomData.insulationMaterial}
          onSelect={(value) => updateRoomData('insulationMaterial', value)}
          placeholder="Polystyrene"
        />

        <InputField
          label="Thickness"
          value={roomData.thickness.toString()}
          onChangeText={(text) => handleNumericInput('thickness', text)}
          unit={thicknessUnit}
          placeholder="5.91"
        />

        <Dropdown
          label="Floor insulation"
          options={[
            { label: 'No', value: 'false' },
            { label: 'Yes', value: 'true' }
          ]}
          value={roomData.floorInsulation ? 'true' : 'false'}
          onSelect={(value) => updateRoomData('floorInsulation', value === 'true')}
          placeholder="No"
        />

        {roomData.floorInsulation && (
          <InputField
            label="Floor thickness"
            value={roomData.floorThickness.toString()}
            onChangeText={(text) => handleNumericInput('floorThickness', text)}
            unit={thicknessUnit}
            placeholder="2.0"
          />
        )}

        <Dropdown
          label="Storage Type"
          options={[
            { label: 'Palletized Storage', value: 'palletized' },
            { label: 'Shelving System', value: 'shelving' },
            { label: 'Bulk Storage', value: 'bulk' },
            { label: 'Hanging Rails', value: 'hanging' }
          ]}
          value={roomData.storageType || 'palletized'}
          onSelect={(value) => updateRoomData('storageType', value)}
          placeholder="Palletized Storage"
        />

        <InputField
          label="Aisle Width"
          value={roomData.aisleWidth?.toString() || ''}
          onChangeText={(text) => handleNumericInput('aisleWidth', text)}
          unit={lengthUnit}
          placeholder="1.2"
        />

        <InputField
          label="Ceiling Clearance"
          value={roomData.ceilingClearance?.toString() || ''}
          onChangeText={(text) => handleNumericInput('ceilingClearance', text)}
          unit={lengthUnit}
          placeholder="0.5"
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