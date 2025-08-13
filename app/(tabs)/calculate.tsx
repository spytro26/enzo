import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppContext } from '@/context/AppContext';
import { ColdRoomCalculator } from '@/utils/calculations';

export default function CalculateScreen() {
  const { roomData, unitSettings } = useContext(AppContext);
  
  const results = ColdRoomCalculator.calculateCoolingLoad(roomData, unitSettings);

  const formatPower = (watts: number): string => {
    if (unitSettings.power === 'kw') {
      return `${(watts / 1000).toFixed(2)} kW`;
    }
    return `${watts.toFixed(2)} W`;
  };

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

        <View style={styles.resultsCard}>
          <Text style={styles.cardTitle}>Calculation Results</Text>
          
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Transmission losses</Text>
            <Text style={styles.resultValue}>{results.transmissionLosses.toFixed(2)} W</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Ventilation losses</Text>
            <Text style={styles.resultValue}>{results.ventilationLosses.toFixed(2)} W</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Door opening losses</Text>
            <Text style={styles.resultValue}>{results.doorOpeningLosses.toFixed(2)} W</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Other heat sources</Text>
            <Text style={styles.resultValue}>{results.otherHeatSources.toFixed(2)} W</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Cooling down/longer respiration</Text>
            <Text style={styles.resultValue}>{results.coolingDown.toFixed(2)} W</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Respiration</Text>
            <Text style={styles.resultValue}>{results.respirationHeat.toFixed(2)} W</Text>
          </View>

          <View style={[styles.resultRow, styles.subtotalRow]}>
            <Text style={styles.subtotalLabel}>Subtotal</Text>
            <Text style={styles.subtotalValue}>{results.subtotal.toFixed(2)} W</Text>
          </View>

          <View style={[styles.resultRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Required capacity</Text>
            <Text style={styles.totalValue}>{formatPower(results.requiredCapacity * 1000)}</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Total specific capacity</Text>
            <Text style={styles.resultValue}>{results.totalSpecificCapacity.toFixed(2)} W/m²</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Calculation Summary</Text>
          <Text style={styles.summaryText}>
            🏠 Total cooling capacity required: {formatPower(results.requiredCapacity * 1000)}
          </Text>
          <Text style={styles.summaryText}>
            📊 Specific capacity: {results.totalSpecificCapacity.toFixed(2)} W/m²
          </Text>
          <Text style={styles.summaryText}>
            🔧 Recommended: Consider {Math.ceil(results.requiredCapacity * 1.1)} kW equipment
          </Text>
          
          <Text style={styles.calculationNote}>
            ℹ️ This calculation includes: thermal transmission, ventilation, door openings, 
            product cooling, respiration heat (for fresh products), equipment loads, 
            lighting, personnel heat, defrost cycles (for frozen applications), 
            and appropriate safety factors.
          </Text>
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
  resultsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  resultLabel: {
    fontSize: 14,
    color: '#E5E7EB',
    flex: 1,
  },
  resultValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  subtotalRow: {
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    paddingTop: 12,
  },
  subtotalLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    flex: 1,
  },
  subtotalValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  totalRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    flex: 1,
  },
  totalValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  summaryText: {
    fontSize: 14,
    color: '#E5E7EB',
    lineHeight: 20,
    marginBottom: 4,
  },
  calculationNote: {
    fontSize: 13,
    color: '#9CA3AF',
    fontStyle: 'italic',
    lineHeight: 18,
    marginTop: 8,
    textAlign: 'center',
  },
});