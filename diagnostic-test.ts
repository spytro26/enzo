// DIAGNOSTIC CALCULATION TEST
// Tests the calculation function with exact app data to find discrepancies

import { RoomData, UnitSettings } from '../types/index';
import { ColdRoomCalculator } from '../utils/calculations';

// Exact data from AppContext
const roomData: RoomData = {
  roomTemperature: 2.00,
  outsideTemperature: 25.00,
  ventilationLossFactor: 'moderate',
  runningTime: 24,
  loadingPercentage: 80,
  length: 16.40,
  width: 16.40,
  height: 9.84,
  insulationMaterial: 'polystyrene',
  thickness: 5.91,
  floorInsulation: false,
  floorThickness: 2.0,
  product: 'dairy-butter',
  storageQuantity: 15000.00,
  stockShift: 1500.00,
  enteringTemperature: 8.00,
  coolDownTime: 6,
  coolerFans: 2.50,
  coolerFansWorkingTime: 20,
  illumination: 15.00,
  illuminationWorkingTime: 8,
  persons: 2,
  personsWorkingTime: 8,
  otherHeatSources: 2.30,
  otherHeatSourcesWorkingTime: 8,
  doorOpenings: 20,
  doorSize: 4.0,
  roomUsageType: 'storage',
  altitudeCorrection: 0,
  storageType: 'palletized',
  aisleWidth: 1.2,
  ceilingClearance: 0.5,
};

const unitSettings: UnitSettings = {
  temperature: 'celsius',
  power: 'kw',
  distanceSmall: 'inch',
  distanceLarge: 'foot',
  weight: 'kg',
  system: 'si',
};

console.log("=== DIAGNOSTIC CALCULATION TEST ===");
console.log("Testing with exact app data...");

try {
  const results = ColdRoomCalculator.calculateCoolingLoad(roomData, unitSettings);
  
  console.log("\nCURRENT APP RESULTS:");
  console.log("===================");
  console.log(`Transmission losses: ${results.transmissionLosses.toFixed(2)} W`);
  console.log(`Ventilation losses: ${results.ventilationLosses.toFixed(2)} W`);
  console.log(`Door opening losses: ${results.doorOpeningLosses.toFixed(2)} W`);
  console.log(`Other heat sources: ${results.otherHeatSources.toFixed(2)} W`);
  console.log(`Cooling down: ${results.coolingDown.toFixed(2)} W`);
  console.log(`Respiration: ${results.respirationHeat.toFixed(2)} W`);
  console.log(`Subtotal: ${results.subtotal.toFixed(2)} W`);
  console.log(`Required capacity: ${results.requiredCapacity.toFixed(2)} kW`);
  console.log(`Specific capacity: ${results.totalSpecificCapacity.toFixed(2)} W/m²`);
  
  console.log("\nEXPECTED RESULTS:");
  console.log("================");
  console.log("Transmission losses: 1164 W");
  console.log("Ventilation losses: 217 W");
  console.log("Door opening losses: 767 W");
  console.log("Other heat sources: ~1400 W");
  console.log("Cooling down: 1208 W");
  console.log("Respiration: 0 W");
  
  console.log("\nDISCREPANCIES:");
  console.log("==============");
  const expectedTransmission = 1164;
  const expectedVentilation = 217;
  const expectedDoor = 767;
  const expectedOther = 1400;
  const expectedCooling = 1208;
  
  console.log(`Transmission: ${results.transmissionLosses.toFixed(0)}W vs ${expectedTransmission}W (${((results.transmissionLosses/expectedTransmission)*100).toFixed(1)}%)`);
  console.log(`Ventilation: ${results.ventilationLosses.toFixed(0)}W vs ${expectedVentilation}W (${((results.ventilationLosses/expectedVentilation)*100).toFixed(1)}%)`);
  console.log(`Door opening: ${results.doorOpeningLosses.toFixed(0)}W vs ${expectedDoor}W (${((results.doorOpeningLosses/expectedDoor)*100).toFixed(1)}%)`);
  console.log(`Other sources: ${results.otherHeatSources.toFixed(0)}W vs ${expectedOther}W (${((results.otherHeatSources/expectedOther)*100).toFixed(1)}%)`);
  console.log(`Cooling down: ${results.coolingDown.toFixed(0)}W vs ${expectedCooling}W (${((results.coolingDown/expectedCooling)*100).toFixed(1)}%)`);
  
} catch (error) {
  console.error("Calculation error:", error);
}

export {};
