// TEST SCRIPT TO VERIFY ALL CALCULATION FIXES

const { ColdRoomCalculator } = require('./utils/calculations.ts');
const { products } = require('./data/products.ts');
const { UnitConverter } = require('./utils/conversions.ts');

// Test data matching the user's input
const testData = {
  // Room configuration
  roomTemperature: 2.0,
  outsideTemperature: 25.0,
  ventilationLossFactor: 'moderate',
  runningTime: 24,
  loadingPercentage: 80,
  
  // Dimensions 
  length: 16.4,
  width: 16.4,  
  height: 9.84,
  
  // Insulation
  insulationMaterial: 'polystyrene',
  thickness: 5.91, // inches
  floorInsulation: false,
  floorThickness: 2.0,
  
  // Storage configuration
  storageType: 'palletized',
  aisleWidth: 1.2,
  ceilingClearance: 0.5, // feet
  roomUsageType: 'storage',
  
  // Product
  product: 'fruits-apples',
  storageQuantity: 15000, // kg
  stockShift: 1500, // kg
  enteringTemperature: 8.0,
  coolDownTime: 6,
  
  // Heat sources
  coolerFans: 2.5, // kW
  coolerFansWorkingTime: 20,
  illumination: 15.0, // W/m²
  illuminationWorkingTime: 8,
  persons: 2,
  personsWorkingTime: 8,
  otherHeatSources: 200, // W (the problematic input)
  otherHeatSourcesWorkingTime: 8,
  
  // Door operations
  doorOpenings: 20,
  doorSize: 4.0
};

const unitSettings = {
  temperature: 'celsius',
  power: 'kw',
  distanceSmall: 'inch',
  distanceLarge: 'meter',
  weight: 'kg',
  system: 'mixed'
};

console.log('=== CALCULATION FIXES VERIFICATION ===\n');

// Test the fixes
try {
  console.log('INPUT DATA:');
  console.log(`Room: ${testData.length}×${testData.width}×${testData.height}m`);
  console.log(`Insulation: ${testData.thickness}" polystyrene`);
  console.log(`Product: Apples (${testData.storageQuantity}kg stored)`);
  console.log(`Other heat sources: ${testData.otherHeatSources}W`);
  console.log(`Ceiling clearance: ${testData.ceilingClearance} ft`);
  console.log('');

  // Test max storage capacity
  const maxStorage = ColdRoomCalculator.calculateMaxStorageCapacity(testData, unitSettings);
  console.log('MAX STORAGE CAPACITY:');
  console.log(`Result: ${Math.round(maxStorage).toLocaleString()} kg`);
  console.log(`Expected: ~280,000 kg (much higher than before)`);
  console.log('');

  // Test cooling load calculations  
  const results = ColdRoomCalculator.calculateCoolingLoad(testData, unitSettings);
  
  console.log('COOLING LOAD CALCULATIONS:');
  console.log('');
  
  console.log('EXPECTED FIXES:');
  console.log(`Transmission losses: ${results.transmissionLosses.toFixed(0)}W (should be ~4,900W, not 405W)`);
  console.log(`Respiration heat: ${results.respirationHeat.toFixed(0)}W (should be ~48W, not 48,245W)`);
  console.log(`Other heat sources: ${results.otherHeatSources.toFixed(0)}W (should be ~3,600W, not 68,975W)`);
  console.log(`Door opening losses: ${results.doorOpeningLosses.toFixed(0)}W (should be ~72W, not 1,051W)`);
  console.log('');
  
  console.log('DETAILED BREAKDOWN:');
  console.log(`  Transmission losses:    ${results.transmissionLosses.toFixed(0).padStart(8)} W`);
  console.log(`  Ventilation losses:     ${results.ventilationLosses.toFixed(0).padStart(8)} W`);
  console.log(`  Door opening losses:    ${results.doorOpeningLosses.toFixed(0).padStart(8)} W`);
  console.log(`  Product cooling:        ${results.coolingDown.toFixed(0).padStart(8)} W`);
  console.log(`  Respiration heat:       ${results.respirationHeat.toFixed(0).padStart(8)} W`);
  console.log(`  Other heat sources:     ${results.otherHeatSources.toFixed(0).padStart(8)} W`);
  console.log(`  ────────────────────────────────────`);
  console.log(`  Subtotal:               ${results.subtotal.toFixed(0).padStart(8)} W`);
  console.log(`  Required capacity:      ${results.requiredCapacity.toFixed(2).padStart(8)} kW`);
  console.log('');

  // Validation checks
  console.log('VALIDATION CHECKS:');
  
  // Check transmission losses (should be much higher)
  if (results.transmissionLosses > 3000) {
    console.log('✅ Transmission losses: FIXED (proper thickness conversion)');
  } else {
    console.log('❌ Transmission losses: Still too low');
  }
  
  // Check respiration heat (should be much lower for apples)
  if (results.respirationHeat < 100) {
    console.log('✅ Respiration heat: FIXED (proper unit handling)');
  } else {
    console.log('❌ Respiration heat: Still too high');
  }
  
  // Check other heat sources (should be reasonable)
  if (results.otherHeatSources < 10000) {
    console.log('✅ Other heat sources: FIXED (proper power conversion)');
  } else {
    console.log('❌ Other heat sources: Still too high');
  }
  
  // Check storage capacity (should be much higher)
  if (maxStorage > 100000) {
    console.log('✅ Storage capacity: FIXED (proper ceiling clearance conversion)');
  } else {
    console.log('❌ Storage capacity: Still too low');
  }

  // Check door opening losses (should be lower)
  if (results.doorOpeningLosses < 500) {
    console.log('✅ Door opening losses: FIXED (removed extra multiplier)');
  } else {
    console.log('❌ Door opening losses: Still too high');
  }

  console.log('\n=== SUMMARY ===');
  if (results.transmissionLosses > 3000 && 
      results.respirationHeat < 100 && 
      results.otherHeatSources < 10000 && 
      maxStorage > 100000 &&
      results.doorOpeningLosses < 500) {
    console.log('🎉 ALL MAJOR ISSUES FIXED! System ready for professional use.');
  } else {
    console.log('⚠️  Some issues remain. Additional debugging needed.');
  }

} catch (error) {
  console.error('Error running calculations:', error.message);
  console.log('\nThis likely indicates compilation issues that need to be resolved first.');
}

console.log('\n=== TEST COMPLETE ===');
