// Debug calculation script to identify accuracy issues
const { products, insulationMaterials } = require('./data/products.ts');
const { UnitConverter } = require('./utils/conversions.ts');

// Mock current room data
const testRoomData = {
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
  coolerFans: 250.00,
  coolerFansWorkingTime: 20,
  illumination: 15.00,
  illuminationWorkingTime: 8,
  persons: 2,
  personsWorkingTime: 8,
  otherHeatSources: 230.00,
  otherHeatSourcesWorkingTime: 0,
  doorOpenings: 20,
  doorSize: 4.0,
  roomUsageType: 'storage',
  altitudeCorrection: 0,
  storageType: 'palletized',
  aisleWidth: 1.2,
  ceilingClearance: 0.5,
};

const testUnitSettings = {
  temperature: 'celsius',
  power: 'kw',
  distanceSmall: 'inch',
  distanceLarge: 'foot',
  weight: 'kg',
  system: 'si',
};

console.log('=== CALCULATION DEBUG ANALYSIS ===\n');

// Convert dimensions
const lengthM = UnitConverter.convertDistance(testRoomData.length, testUnitSettings.distanceLarge, 'meter');
const widthM = UnitConverter.convertDistance(testRoomData.width, testUnitSettings.distanceLarge, 'meter');
const heightM = UnitConverter.convertDistance(testRoomData.height, testUnitSettings.distanceLarge, 'meter');
const thicknessM = UnitConverter.convertDistance(testRoomData.thickness, testUnitSettings.distanceSmall, 'millimeter') / 1000;

console.log('ROOM DIMENSIONS:');
console.log(`Length: ${testRoomData.length} ft = ${lengthM.toFixed(2)} m`);
console.log(`Width: ${testRoomData.width} ft = ${widthM.toFixed(2)} m`);
console.log(`Height: ${testRoomData.height} ft = ${heightM.toFixed(2)} m`);
console.log(`Wall thickness: ${testRoomData.thickness} in = ${(thicknessM * 1000).toFixed(1)} mm`);
console.log(`Room volume: ${(lengthM * widthM * heightM).toFixed(2)} m³`);

// Convert temperatures
const roomTempC = UnitConverter.convertTemperature(testRoomData.roomTemperature, testUnitSettings.temperature, 'celsius');
const outsideTempC = UnitConverter.convertTemperature(testRoomData.outsideTemperature, testUnitSettings.temperature, 'celsius');
const enteringTempC = UnitConverter.convertTemperature(testRoomData.enteringTemperature, testUnitSettings.temperature, 'celsius');
const tempDifference = outsideTempC - roomTempC;

console.log('\nTEMPERATURES:');
console.log(`Room temp: ${roomTempC}°C`);
console.log(`Outside temp: ${outsideTempC}°C`);
console.log(`Entering temp: ${enteringTempC}°C`);
console.log(`Temp difference: ${tempDifference}°C`);

// Get product info
const product = products.find((p) => p.id === testRoomData.product);
console.log('\nPRODUCT INFO:');
console.log(`Product: ${product?.name}`);
console.log(`Density: ${product?.density} kg/m³`);
console.log(`Specific heat: ${product?.specificHeat} kJ/kg·K`);
console.log(`Respiration heat: ${product?.respirationHeat} W/kg`);

// Check storage quantity conversion
const storageQuantityKg = UnitConverter.convertWeight(testRoomData.storageQuantity, testUnitSettings.weight, 'kg');
const stockShiftKg = UnitConverter.convertWeight(testRoomData.stockShift, testUnitSettings.weight, 'kg');

console.log('\nSTORAGE QUANTITIES:');
console.log(`Storage quantity: ${testRoomData.storageQuantity} kg = ${storageQuantityKg} kg`);
console.log(`Stock shift: ${testRoomData.stockShift} kg = ${stockShiftKg} kg`);

// Calculate respiration heat
const respirationHeat = storageQuantityKg * (product?.respirationHeat || 0);
console.log(`\nRESPIRATION HEAT CALCULATION:`);
console.log(`Formula: ${storageQuantityKg} kg × ${product?.respirationHeat || 0} W/kg = ${respirationHeat} W`);

// Check other heat sources calculation
const coolerFansWatts = UnitConverter.convertPower(testRoomData.coolerFans, testUnitSettings.power, 'kw') * 1000;
const otherHeatSourcesWatts = UnitConverter.convertPower(testRoomData.otherHeatSources, testUnitSettings.power, 'kw') * 1000;

console.log('\nHEAT SOURCES:');
console.log(`Cooler fans: ${testRoomData.coolerFans} kW = ${coolerFansWatts} W`);
console.log(`Working time: ${testRoomData.coolerFansWorkingTime} hrs`);
console.log(`Other heat sources: ${testRoomData.otherHeatSources} kW = ${otherHeatSourcesWatts} W`);
console.log(`Working time: ${testRoomData.otherHeatSourcesWorkingTime} hrs`);

const coolerFansLoad = coolerFansWatts * (testRoomData.coolerFansWorkingTime / 24);
const roomAreaM2 = lengthM * widthM;
const illuminationLoad = testRoomData.illumination * roomAreaM2 * (testRoomData.illuminationWorkingTime / 24);
const personsLoad = testRoomData.persons * 150 * (testRoomData.personsWorkingTime / 24);
const otherLoad = otherHeatSourcesWatts * (testRoomData.otherHeatSourcesWorkingTime / 24);

console.log('\nDETAILED HEAT SOURCES:');
console.log(`Cooler fans load: ${coolerFansLoad.toFixed(2)} W`);
console.log(`Illumination load: ${illuminationLoad.toFixed(2)} W (${testRoomData.illumination} W/m² × ${roomAreaM2.toFixed(2)} m² × ${testRoomData.illuminationWorkingTime/24})`);
console.log(`Persons load: ${personsLoad.toFixed(2)} W (${testRoomData.persons} persons × 150 W × ${testRoomData.personsWorkingTime/24})`);
console.log(`Other load: ${otherLoad.toFixed(2)} W`);

// Product cooling calculation
const tempDrop = enteringTempC - roomTempC;
const packagingFactor = 1.10;
const coolingDown = (stockShiftKg * (product?.specificHeat || 3.0) * tempDrop * 1000 * packagingFactor) / (testRoomData.coolDownTime * 3600);

console.log('\nPRODUCT COOLING:');
console.log(`Temp drop: ${tempDrop}°C`);
console.log(`Specific heat: ${product?.specificHeat || 3.0} kJ/kg·K`);
console.log(`Stock shift: ${stockShiftKg} kg`);
console.log(`Cool down time: ${testRoomData.coolDownTime} hours`);
console.log(`Packaging factor: ${packagingFactor}`);
console.log(`Cooling down load: ${coolingDown.toFixed(2)} W`);

console.log('\n=== IDENTIFIED ISSUES ===');

if (respirationHeat === 0) {
  console.log('❌ ISSUE: Respiration heat is 0 W');
  console.log(`   Reason: Product "${product?.name}" has respirationHeat = ${product?.respirationHeat}`);
  if (product?.respirationHeat === 0) {
    console.log('   Solution: Non-living products (dairy, meat, fish) should have 0 respiration');
    console.log('   Action: This is correct for non-living products');
  }
}

if (coolerFansLoad > 10000) {
  console.log('❌ ISSUE: Cooler fans load seems very high');
  console.log(`   Value: ${coolerFansLoad.toFixed(2)} W`);
  console.log(`   Reason: ${testRoomData.coolerFans} kW fans × ${testRoomData.coolerFansWorkingTime/24} duty cycle`);
}

if (otherLoad === 0 && testRoomData.otherHeatSourcesWorkingTime === 0) {
  console.log('⚠️  WARNING: Other heat sources working time is 0');
  console.log('   This means no contribution from "other heat sources" even if power is specified');
}

console.log('\n=== RECOMMENDATIONS ===');
console.log('1. Check if cooler fans power (250 kW) is realistic for room size');
console.log('2. Verify other heat sources working time setting');
console.log('3. Consider using fruit/vegetable products to see respiration heat');
console.log('4. Review unit conversions for accuracy');
