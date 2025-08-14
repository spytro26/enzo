// EXACT USER DATA VALIDATION TEST
// Testing with specific user input values to provide expected outputs

const fs = require('fs');

// User's exact input data
const userData = {
  roomTemperature: 2.0,           // °C
  outsideTemperature: 25.0,       // °C
  length: 16.4,                   // ft
  width: 16.4,                    // ft  
  height: 9.84,                   // ft
  thickness: 5.91,                // inches
  insulationMaterial: 'polystyrene',
  floorInsulation: false,
  storageMethod: 'palletized',
  aisleWidth: 1.2,                // ft
  ceilingClearance: 0.5,          // ft
  roomUsageType: 'storage_only',
  doorOpeningPerDay: 20,
  doorArea: 4.0,                  // m²
  coolerFansPower: 2.5,           // kW
  coolerFansWorkingTime: 20,      // hours
  illuminationIntensity: 15,      // W/m²
  illuminationWorkingTime: 8,     // hours/day
  numberOfPersons: 2,
  personsWorkingTime: 8,          // hours/day
  otherHeatSource: 2.3,           // kW
  otherHeatSourceWorkingTime: 8,  // hours/day
  product: 'dairy-butter',
  storageQuantity: 15000,         // kg
  stockShift: 1500,               // kg
  enteringTemp: 8.0,              // °C
  coolDownTime: 6,                // hours
  ventilationLossFactor: 'moderate',
  runningTime: 24,                // hours
  loadingPercentage: 80           // %
};

// Product data for butter
const butterData = {
  name: 'Butter',
  density: 920,                   // kg/m³
  recommendedTemp: 2.0,           // °C
  specificHeat: 2.0,              // kJ/kg·K
  respirationHeat: 0,             // kW/tonne (dairy products don't respire)
  stackingHeight: 2.5,            // m
  packagingFactor: 0.85,
  storageMethod: 'palletized'
};

// Unit settings for this calculation (mixed: feet for room, inches for thickness, metric for rest)
const unitSettings = {
  temperature: 'celsius',
  distanceLarge: 'foot',
  distanceSmall: 'inch',
  weight: 'kg',
  power: 'kw'
};

// Helper conversion functions
function convertDistance(value, from, to) {
  if (from === to) return value;
  if (from === 'foot' && to === 'meter') return value * 0.3048;
  if (from === 'meter' && to === 'foot') return value / 0.3048;
  if (from === 'inch' && to === 'millimeter') return value * 25.4;
  if (from === 'millimeter' && to === 'inch') return value / 25.4;
  if (from === 'inch' && to === 'meter') return value * 0.0254;
  return value;
}

function convertTemperature(value, from, to) {
  if (from === to) return value;
  let celsius = value;
  if (from === 'fahrenheit') celsius = (value - 32) * 5/9;
  if (to === 'fahrenheit') return celsius * 9/5 + 32;
  return celsius;
}

function convertWeight(value, from, to) {
  if (from === to) return value;
  if (from === 'pound' && to === 'kg') return value / 2.20462;
  if (from === 'kg' && to === 'pound') return value * 2.20462;
  return value;
}

// Main calculation function
function calculateExpectedValues(data, unitSettings, productData) {
  console.log("=== DETAILED CALCULATION BREAKDOWN ===\n");
  
  // 1. CONVERT INPUTS TO SI UNITS
  console.log("1. INPUT CONVERSIONS:");
  console.log("====================");
  const lengthM = convertDistance(data.length, unitSettings.distanceLarge, 'meter');
  const widthM = convertDistance(data.width, unitSettings.distanceLarge, 'meter');
  const heightM = convertDistance(data.height, unitSettings.distanceLarge, 'meter');
  const thicknessMm = convertDistance(data.thickness, unitSettings.distanceSmall, 'millimeter');
  const thicknessM = thicknessMm / 1000;
  const aisleWidthM = convertDistance(data.aisleWidth, unitSettings.distanceLarge, 'meter');
  const ceilingClearanceM = convertDistance(data.ceilingClearance, unitSettings.distanceLarge, 'meter');
  
  console.log(`Room dimensions: ${data.length}ft × ${data.width}ft × ${data.height}ft`);
  console.log(`                = ${lengthM.toFixed(2)}m × ${widthM.toFixed(2)}m × ${heightM.toFixed(2)}m`);
  console.log(`Thickness: ${data.thickness}in = ${thicknessMm.toFixed(1)}mm = ${thicknessM.toFixed(4)}m`);
  console.log(`Aisle width: ${data.aisleWidth}ft = ${aisleWidthM.toFixed(2)}m`);
  console.log(`Ceiling clearance: ${data.ceilingClearance}ft = ${ceilingClearanceM.toFixed(2)}m`);
  
  // 2. CALCULATE AREAS AND VOLUMES
  console.log("\n2. AREAS AND VOLUMES:");
  console.log("=====================");
  const floorArea = lengthM * widthM;
  const wallArea = 2 * (lengthM * heightM + widthM * heightM);
  const ceilingArea = floorArea;
  const totalArea = wallArea + ceilingArea; // No floor insulation
  const roomVolume = lengthM * widthM * heightM;
  
  console.log(`Floor area: ${floorArea.toFixed(1)} m²`);
  console.log(`Wall area: ${wallArea.toFixed(1)} m²`);
  console.log(`Ceiling area: ${ceilingArea.toFixed(1)} m²`);
  console.log(`Total insulated area: ${totalArea.toFixed(1)} m² (no floor insulation)`);
  console.log(`Room volume: ${roomVolume.toFixed(1)} m³`);
  
  // 3. CALCULATE EFFECTIVE STORAGE
  console.log("\n3. STORAGE CALCULATIONS:");
  console.log("========================");
  const effectiveLength = lengthM - aisleWidthM;
  const effectiveWidth = widthM - aisleWidthM;
  const effectiveHeight = heightM - ceilingClearanceM;
  const effectiveVolume = effectiveLength * effectiveWidth * effectiveHeight;
  const maxStorageCapacity = effectiveVolume * productData.density * productData.packagingFactor;
  
  console.log(`Effective storage dimensions: ${effectiveLength.toFixed(2)}m × ${effectiveWidth.toFixed(2)}m × ${effectiveHeight.toFixed(2)}m`);
  console.log(`Effective storage volume: ${effectiveVolume.toFixed(1)} m³`);
  console.log(`Max storage capacity: ${Math.round(maxStorageCapacity).toLocaleString()} kg`);
  console.log(`Current storage: ${data.storageQuantity.toLocaleString()} kg (${((data.storageQuantity/maxStorageCapacity)*100).toFixed(1)}% of max)`);
  
  // 4. TRANSMISSION LOSSES
  console.log("\n4. TRANSMISSION LOSSES:");
  console.log("=======================");
  const tempDifference = data.outsideTemperature - data.roomTemperature;
  const thermalConductivity = 0.035; // polystyrene W/m·K
  const uValue = thermalConductivity / thicknessM;
  const transmissionLosses = totalArea * uValue * tempDifference;
  
  console.log(`Temperature difference: ${tempDifference}°C`);
  console.log(`Thermal conductivity (polystyrene): ${thermalConductivity} W/m·K`);
  console.log(`U-value: ${thermalConductivity}/${thicknessM.toFixed(4)} = ${uValue.toFixed(3)} W/m²·K`);
  console.log(`Transmission losses: ${totalArea.toFixed(1)} × ${uValue.toFixed(3)} × ${tempDifference} = ${transmissionLosses.toFixed(0)} W`);
  
  // 5. VENTILATION LOSSES
  console.log("\n5. VENTILATION LOSSES:");
  console.log("======================");
  const airChangesPerHour = 0.5; // moderate ventilation
  const airDensity = 1.2; // kg/m³
  const airSpecificHeat = 1.02; // kJ/kg·K
  const ventilationLosses = (roomVolume * airChangesPerHour * airDensity * airSpecificHeat * tempDifference * 1000) / 3600;
  
  console.log(`Air changes per hour: ${airChangesPerHour} (moderate)`);
  console.log(`Air density: ${airDensity} kg/m³`);
  console.log(`Air specific heat: ${airSpecificHeat} kJ/kg·K`);
  console.log(`Ventilation losses: ${ventilationLosses.toFixed(0)} W`);
  
  // 6. DOOR OPENING LOSSES
  console.log("\n6. DOOR OPENING LOSSES:");
  console.log("=======================");
  const doorOpeningsPerHour = data.doorOpeningPerDay / 24;
  const doorOpeningLosses = data.doorArea * doorOpeningsPerHour * 10 * tempDifference;
  
  console.log(`Door openings per hour: ${doorOpeningsPerHour.toFixed(1)}`);
  console.log(`Door area: ${data.doorArea} m²`);
  console.log(`Door opening losses: ${data.doorArea} × ${doorOpeningsPerHour.toFixed(1)} × 10 × ${tempDifference} = ${doorOpeningLosses.toFixed(0)} W`);
  
  // 7. RESPIRATION HEAT (0 for butter - dairy products don't respire)
  console.log("\n7. RESPIRATION HEAT:");
  console.log("====================");
  const respirationHeat = 0; // Butter doesn't respire
  console.log(`Product: Butter (dairy product)`);
  console.log(`Respiration heat: ${respirationHeat} W (dairy products don't respire)`);
  
  // 8. COOLING DOWN HEAT
  console.log("\n8. COOLING DOWN HEAT:");
  console.log("=====================");
  const enteringTempDiff = data.enteringTemp - data.roomTemperature;
  const coolingDownHeat = (data.stockShift * productData.specificHeat * enteringTempDiff * 1000) / (data.coolDownTime * 3600);
  
  console.log(`Stock shift: ${data.stockShift} kg`);
  console.log(`Entering temp difference: ${data.enteringTemp}°C - ${data.roomTemperature}°C = ${enteringTempDiff}°C`);
  console.log(`Specific heat (butter): ${productData.specificHeat} kJ/kg·K`);
  console.log(`Cool down time: ${data.coolDownTime} hours`);
  console.log(`Cooling down heat: ${coolingDownHeat.toFixed(0)} W`);
  
  // 9. OTHER HEAT SOURCES
  console.log("\n9. OTHER HEAT SOURCES:");
  console.log("======================");
  const coolerFansLoad = (data.coolerFansPower * 1000 * data.coolerFansWorkingTime) / 24;
  const lightingLoad = (floorArea * data.illuminationIntensity * data.illuminationWorkingTime) / 24;
  const peopleLoad = (data.numberOfPersons * 120 * data.personsWorkingTime) / 24;
  const otherEquipmentLoad = (data.otherHeatSource * 1000 * data.otherHeatSourceWorkingTime) / 24;
  const totalOtherHeatSources = coolerFansLoad + lightingLoad + peopleLoad + otherEquipmentLoad;
  
  console.log(`Cooler fans: ${data.coolerFansPower}kW × ${data.coolerFansWorkingTime}h/24h = ${coolerFansLoad.toFixed(0)} W`);
  console.log(`Lighting: ${floorArea.toFixed(1)}m² × ${data.illuminationIntensity}W/m² × ${data.illuminationWorkingTime}h/24h = ${lightingLoad.toFixed(0)} W`);
  console.log(`People: ${data.numberOfPersons} × 120W × ${data.personsWorkingTime}h/24h = ${peopleLoad.toFixed(0)} W`);
  console.log(`Other equipment: ${data.otherHeatSource}kW × ${data.otherHeatSourceWorkingTime}h/24h = ${otherEquipmentLoad.toFixed(0)} W`);
  console.log(`Total other heat sources: ${totalOtherHeatSources.toFixed(0)} W`);
  
  // 10. TOTALS
  console.log("\n10. CALCULATION SUMMARY:");
  console.log("========================");
  const subtotal = transmissionLosses + ventilationLosses + doorOpeningLosses + respirationHeat + coolingDownHeat + totalOtherHeatSources;
  const safetyFactor = 1.15;
  const requiredCapacity = subtotal * safetyFactor;
  const totalSpecificCapacity = requiredCapacity / floorArea;
  
  console.log(`Transmission losses: ${transmissionLosses.toFixed(0)} W`);
  console.log(`Ventilation losses: ${ventilationLosses.toFixed(0)} W`);
  console.log(`Door opening losses: ${doorOpeningLosses.toFixed(0)} W`);
  console.log(`Respiration heat: ${respirationHeat.toFixed(0)} W`);
  console.log(`Cooling down heat: ${coolingDownHeat.toFixed(0)} W`);
  console.log(`Other heat sources: ${totalOtherHeatSources.toFixed(0)} W`);
  console.log(`Subtotal: ${subtotal.toFixed(0)} W`);
  console.log(`Safety factor: ${safetyFactor}`);
  console.log(`Required capacity: ${requiredCapacity.toFixed(0)} W = ${(requiredCapacity/1000).toFixed(2)} kW`);
  console.log(`Total specific capacity: ${totalSpecificCapacity.toFixed(2)} W/m²`);
  
  return {
    transmissionLosses: Math.round(transmissionLosses),
    ventilationLosses: Math.round(ventilationLosses),
    doorOpeningLosses: Math.round(doorOpeningLosses),
    respirationHeat: Math.round(respirationHeat),
    coolingDownHeat: Math.round(coolingDownHeat),
    otherHeatSources: Math.round(totalOtherHeatSources),
    subtotal: Math.round(subtotal),
    requiredCapacity: Math.round(requiredCapacity),
    requiredCapacityKW: Math.round(requiredCapacity/1000 * 100) / 100,
    totalSpecificCapacity: Math.round(totalSpecificCapacity * 100) / 100,
    recommendedEquipment: Math.ceil(requiredCapacity/1000 * 1.1),
    maxStorageCapacity: Math.round(maxStorageCapacity),
    recommendedTemp: productData.recommendedTemp,
    floorArea: Math.round(floorArea * 10) / 10,
    roomVolume: Math.round(roomVolume * 10) / 10
  };
}

console.log("=== USER DATA VALIDATION TEST ===");
console.log("Testing exact user input values\n");

console.log("INPUT DATA:");
console.log("===========");
console.log(`Room: ${userData.length}ft × ${userData.width}ft × ${userData.height}ft`);
console.log(`Thickness: ${userData.thickness}in (polystyrene)`);
console.log(`Temperatures: ${userData.roomTemperature}°C room, ${userData.outsideTemperature}°C outside`);
console.log(`Product: Butter, ${userData.storageQuantity}kg`);
console.log(`Stock shift: ${userData.stockShift}kg entering at ${userData.enteringTemp}°C`);
console.log(`Door openings: ${userData.doorOpeningPerDay}/day, ${userData.doorArea}m²`);
console.log(`Equipment: ${userData.coolerFansPower}kW fans, ${userData.otherHeatSource}kW other`);
console.log(`People: ${userData.numberOfPersons} persons, ${userData.personsWorkingTime}h/day`);
console.log(`Lighting: ${userData.illuminationIntensity}W/m², ${userData.illuminationWorkingTime}h/day`);
console.log("");

const results = calculateExpectedValues(userData, unitSettings, butterData);

console.log("\n=== EXPECTED APP OUTPUT VALUES ===");
console.log("===================================");
console.log("");
console.log("📊 CALCULATION RESULTS:");
console.log(`Transmission losses: ${results.transmissionLosses.toLocaleString()} W`);
console.log(`Ventilation losses: ${results.ventilationLosses.toLocaleString()} W`);
console.log(`Door opening losses: ${results.doorOpeningLosses.toLocaleString()} W`);
console.log(`Other heat sources: ${results.otherHeatSources.toLocaleString()} W`);
console.log(`Cooling down/longer respiration: ${results.coolingDownHeat.toLocaleString()} W`);
console.log(`Respiration: ${results.respirationHeat} W`);
console.log(`Subtotal: ${results.subtotal.toLocaleString()} W`);
console.log(`Required capacity: ${results.requiredCapacityKW} kW`);
console.log("");
console.log("📈 SUMMARY:");
console.log(`🏠 Total cooling capacity required: ${results.requiredCapacityKW} kW`);
console.log(`📊 Specific capacity: ${results.totalSpecificCapacity} W/m²`);
console.log(`🔧 Recommended: Consider ${results.recommendedEquipment} kW equipment`);
console.log("");
console.log("🏪 STORAGE INFO:");
console.log(`Max storage capacity: ${results.maxStorageCapacity.toLocaleString()} kg`);
console.log(`Recommended temperature for butter: ${results.recommendedTemp}°C`);
console.log(`Floor area: ${results.floorArea} m²`);
console.log(`Room volume: ${results.roomVolume} m³`);

console.log("\n=== VALIDATION CHECKLIST ===");
console.log("=============================");
console.log("Check these values in your app:");
console.log("");
console.log("✅ Transmission losses should show: " + results.transmissionLosses.toLocaleString() + " W");
console.log("✅ Ventilation losses should show: " + results.ventilationLosses.toLocaleString() + " W");
console.log("✅ Door opening losses should show: " + results.doorOpeningLosses.toLocaleString() + " W");
console.log("✅ Other heat sources should show: " + results.otherHeatSources.toLocaleString() + " W");
console.log("✅ Cooling down should show: " + results.coolingDownHeat.toLocaleString() + " W");
console.log("✅ Respiration should show: " + results.respirationHeat + " W");
console.log("✅ Required capacity should show: " + results.requiredCapacityKW + " kW");
console.log("✅ Specific capacity should show: " + results.totalSpecificCapacity + " W/m²");
console.log("✅ Recommended equipment: " + results.recommendedEquipment + " kW");
console.log("✅ Max storage should show: " + results.maxStorageCapacity.toLocaleString() + " kg");
console.log("✅ Recommended temp should show: " + results.recommendedTemp + "°C");

console.log("\n=== TEST COMPLETE ===");
