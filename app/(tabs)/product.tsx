import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { InputField } from '@/components/InputField';
import { Dropdown } from '@/components/Dropdown';
import { products } from '@/data/products';
import { AppContext } from '@/context/AppContext';
import { ValidationHelper } from '@/utils/validation';

export default function ProductScreen() {
  const { roomData, setRoomData, unitSettings } = useContext(AppContext);
  const { ColdRoomCalculator } = require('@/utils/calculations');

  const updateRoomData = (field: string, value: any) => {
    setRoomData(prev => ({ ...prev, [field]: value }));
  };

  const handleNumericInput = (field: string, text: string) => {
    const sanitized = ValidationHelper.sanitizeInput(text);
    updateRoomData(field, sanitized);
  };

  const selectedProduct = products.find(p => p.id === roomData.product);
  const maxStorageCapacity = ColdRoomCalculator.calculateMaxStorageCapacity(roomData, unitSettings);
  const weightUnit = unitSettings.weight === 'kg' ? 'kg' : 'lb';
  const tempUnit = unitSettings.temperature === 'celsius' ? '°C' : 
                   unitSettings.temperature === 'fahrenheit' ? '°F' : 'K';

  // Group products by category for better organization
  const categorizedProducts = products.reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({
      label: product.name,
      value: product.id
    });
    return acc;
  }, {} as Record<string, Array<{label: string, value: string}>>);

  // Create flat options list with category headers
  const productOptions: Array<{label: string, value: string, isHeader?: boolean}> = [];
  
  Object.keys(categorizedProducts).sort().forEach(category => {
    // Add category header
    productOptions.push({
      label: `── ${category.toUpperCase()} ──`,
      value: '',
      isHeader: true
    });
    
    // Add products in this category
    categorizedProducts[category]
      .sort((a, b) => a.label.localeCompare(b.label))
      .forEach(product => {
        productOptions.push(product);
      });
  });

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

        <Dropdown
          label="Products"
          options={productOptions}
          value={roomData.product}
          onSelect={(value) => updateRoomData('product', value)}
          placeholder="Select a product..."
        />

        {selectedProduct && (
          <View style={styles.productInfo}>
            <Text style={styles.productInfoTitle}>Product Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Category</Text>
              <Text style={styles.infoValue}>{selectedProduct.category}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Storage method</Text>
              <Text style={styles.infoValue}>{selectedProduct.storageMethod}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Max. allowed storage</Text>
              <Text style={styles.infoValue}>
                {maxStorageCapacity.toLocaleString()} {weightUnit}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Recomm. storage temp.</Text>
              <Text style={styles.infoValue}>
                {selectedProduct.recommendedTemp.toFixed(1)} {tempUnit}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Product density</Text>
              <Text style={styles.infoValue}>
                {selectedProduct.density} kg/m³
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Specific heat</Text>
              <Text style={styles.infoValue}>
                {selectedProduct.specificHeat} kJ/kg·K
              </Text>
            </View>
            {selectedProduct.respirationHeat > 0 && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Respiration heat</Text>
                <Text style={styles.infoValue}>
                  {selectedProduct.respirationHeat.toFixed(3)} W/kg
                </Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Max stacking height</Text>
              <Text style={styles.infoValue}>
                {selectedProduct.stackingHeight} m
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Packaging efficiency</Text>
              <Text style={styles.infoValue}>
                {((selectedProduct.packagingFactor || 0.65) * 100).toFixed(0)}%
              </Text>
            </View>
          </View>
        )}

        <InputField
          label="Storage quantity"
          value={roomData.storageQuantity.toString()}
          onChangeText={(text) => handleNumericInput('storageQuantity', text)}
          unit={weightUnit}
          placeholder="15000.00"
        />

        <InputField
          label="Stock shift"
          value={roomData.stockShift.toString()}
          onChangeText={(text) => handleNumericInput('stockShift', text)}
          unit={weightUnit}
          placeholder="1500.00"
        />

        <InputField
          label="Entering temperature"
          value={roomData.enteringTemperature.toString()}
          onChangeText={(text) => handleNumericInput('enteringTemperature', text)}
          unit={tempUnit}
          placeholder="8.00"
        />

        <InputField
          label="Cool down/congel. time"
          value={roomData.coolDownTime.toString()}
          onChangeText={(text) => handleNumericInput('coolDownTime', text)}
          unit="hr"
          placeholder="6"
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
  productInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  productInfoTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#E5E7EB',
  },
  infoValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});