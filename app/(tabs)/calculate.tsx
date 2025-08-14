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

        <View style={styles.resultsCard}>
          <Text style={styles.cardTitle}>Calculation Results</Text>
          
          <View style={styles.resultRow}>
            <View style={styles.resultLabelContainer}>
              <Text style={styles.resultIcon}>🌡️</Text>
              <Text style={styles.resultLabel}>Transmission losses</Text>
            </View>
            <Text style={styles.resultValue}>{results.transmissionLosses.toFixed(0)} W</Text>
          </View>

          <View style={styles.resultRow}>
            <View style={styles.resultLabelContainer}>
              <Text style={styles.resultIcon}>💨</Text>
              <Text style={styles.resultLabel}>Ventilation losses</Text>
            </View>
            <Text style={styles.resultValue}>{results.ventilationLosses.toFixed(0)} W</Text>
          </View>

          <View style={styles.resultRow}>
            <View style={styles.resultLabelContainer}>
              <Text style={styles.resultIcon}>🚪</Text>
              <Text style={styles.resultLabel}>Door opening losses</Text>
            </View>
            <Text style={styles.resultValue}>{results.doorOpeningLosses.toFixed(0)} W</Text>
          </View>

          <View style={styles.resultRow}>
            <View style={styles.resultLabelContainer}>
              <Text style={styles.resultIcon}>⚡</Text>
              <Text style={styles.resultLabel}>Other heat sources</Text>
            </View>
            <Text style={styles.resultValue}>{results.otherHeatSources.toFixed(0)} W</Text>
          </View>

          <View style={styles.resultRow}>
            <View style={styles.resultLabelContainer}>
              <Text style={styles.resultIcon}>❄️</Text>
              <Text style={styles.resultLabel}>Cooling down/longer respiration</Text>
            </View>
            <Text style={styles.resultValue}>{results.coolingDown.toFixed(0)} W</Text>
          </View>

          <View style={styles.resultRow}>
            <View style={styles.resultLabelContainer}>
              <Text style={styles.resultIcon}>🫁</Text>
              <Text style={styles.resultLabel}>Respiration</Text>
            </View>
            <Text style={styles.resultValue}>{results.respirationHeat.toFixed(0)} W</Text>
          </View>

          <View style={[styles.resultRow, styles.subtotalRow]}>
            <View style={styles.resultLabelContainer}>
              <Text style={styles.subtotalIcon}>📊</Text>
              <Text style={styles.subtotalLabel}>Subtotal</Text>
            </View>
            <Text style={styles.subtotalValue}>{results.subtotal.toFixed(0)} W</Text>
          </View>

          <View style={[styles.resultRow, styles.totalRow]}>
            <View style={styles.resultLabelContainer}>
              <Text style={styles.totalIcon}>🔥</Text>
              <Text style={styles.totalLabel}>Req. capacity</Text>
            </View>
            <Text style={styles.totalValue}>{formatPower(results.requiredCapacity * 1000)}</Text>
          </View>

          <View style={styles.resultRow}>
            <View style={styles.resultLabelContainer}>
              <Text style={styles.resultIcon}>📈</Text>
              <Text style={styles.resultLabel}>Total specific capacity</Text>
            </View>
            <Text style={styles.resultValue}>{results.totalSpecificCapacity.toFixed(1)} W/m³</Text>
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
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 2,
  },
  resultLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  resultIcon: {
    fontSize: 18,
    marginRight: 10,
    width: 22,
  },
  resultLabel: {
    fontSize: 16,
    color: '#E5E7EB',
    fontWeight: '500',
  },
  resultValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'right',
  },
  subtotalRow: {
    marginTop: 12,
    borderTopWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    paddingTop: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    marginHorizontal: -4,
    paddingHorizontal: 8,
  },
  subtotalIcon: {
    fontSize: 20,
    marginRight: 10,
    width: 22,
  },
  subtotalLabel: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  subtotalValue: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'right',
  },
  totalRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginTop: 12,
    marginHorizontal: -4,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  totalIcon: {
    fontSize: 22,
    marginRight: 10,
    width: 24,
  },
  totalLabel: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '800',
    textAlign: 'right',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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