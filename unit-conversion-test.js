// COMPREHENSIVE UNIT CONVERSION TEST
// Tests if calculations work correctly when users change units dynamically

console.log("=== UNIT CONVERSION DYNAMIC TESTING ===\n");

// Test the same data with different unit settings to ensure calculations adapt correctly

const testRoomData = {
  roomTemperature: 2.0,
  outsideTemperature: 25.0,
  ventilationLossFactor: 'moderate',
  runningTime: 24,
  loadingPercentage: 80,
  length: 16.4,          // Will test: meters vs feet
  width: 16.4,           // Will test: meters vs feet  
  height: 9.84,          // Will test: meters vs feet
  insulationMaterial: 'polystyrene',
  thickness: 5.91,       // Will test: inches vs mm
  floorInsulation: false,
  floorThickness: 2.0,
  storageType: 'palletized',
  aisleWidth: 1.2,
  ceilingClearance: 0.5, // Will test: feet vs meters
  roomUsageType: 'storage',
  product: 'fruits-apples',
  storageQuantity: 15000, // Will test: kg vs pounds
  stockShift: 1500,       // Will test: kg vs pounds
  enteringTemperature: 8.0,
  coolDownTime: 6,
  coolerFans: 2.5,
  coolerFansWorkingTime: 20,
  illumination: 15.0,
  illuminationWorkingTime: 8,
  persons: 2,
  personsWorkingTime: 8,
  otherHeatSources: 200,
  otherHeatSourcesWorkingTime: 8,
  doorOpenings: 20,
  doorSize: 4.0
};

// Test Scenario 1: SI Units (meters, mm, kg, celsius)
const unitSettings_SI = {
  temperature: 'celsius',
  power: 'kw',
  distanceSmall: 'millimeter',
  distanceLarge: 'meter',
  weight: 'kg',
  system: 'si'
};

// Test Scenario 2: Imperial Units (feet, inches, pounds, fahrenheit) 
const unitSettings_Imperial = {
  temperature: 'fahrenheit',
  power: 'btu',
  distanceSmall: 'inch',
  distanceLarge: 'foot',
  weight: 'pound',
  system: 'imperial'
};

// Test Scenario 3: Mixed Units (common real-world scenario)
const unitSettings_Mixed = {
  temperature: 'celsius',
  power: 'kw',
  distanceSmall: 'inch',      // inches for thickness
  distanceLarge: 'meter',     // meters for room dimensions  
  weight: 'kg',
  system: 'mixed'
};

// Manual calculations for validation
console.log("MANUAL CALCULATION VALIDATION:");
console.log("==============================");

// Test 1: Thickness conversion
console.log("1. THICKNESS CONVERSION:");
console.log("   Input: 5.91 (in different units)");
console.log("   If millimeter unit: 5.91mm → 0.00591m");
console.log("   If inch unit: 5.91in → 150.1mm → 0.1501m");
console.log("   Expected result: Different U-values and transmission losses");

// Test 2: Room dimensions  
console.log("\n2. ROOM DIMENSIONS:");
console.log("   Input: 16.4 × 16.4 × 9.84");
console.log("   If meter unit: 16.4m × 16.4m × 9.84m = 2647 m³");
console.log("   If foot unit: 16.4ft × 16.4ft × 9.84ft = 16.4×0.3048×16.4×0.3048×9.84×0.3048 = 75.0 m³");
console.log("   Expected result: Drastically different volumes and heat loads");

// Test 3: Storage quantity
console.log("\n3. STORAGE QUANTITY:");
console.log("   Input: 15000");
console.log("   If kg unit: 15000 kg = 15 tonnes");
console.log("   If pound unit: 15000 lb = 6804 kg = 6.8 tonnes");
console.log("   Expected result: Different respiration heat and storage capacity");

// Test 4: Temperature
console.log("\n4. TEMPERATURE:");
console.log("   Room: 2, Outside: 25, Entering: 8");
console.log("   If celsius: ΔT = 25-2 = 23°C");
console.log("   If fahrenheit: 2°F=-16.7°C, 25°F=-3.9°C, ΔT = 12.8°C");
console.log("   Expected result: Different temperature differences and heat loads");

console.log("\nUNIT CONVERSION LOGIC TEST:");
console.log("============================");

// Simulate the conversion logic used in calculations
function testConversions() {
  console.log("Testing thickness conversion logic:");
  
  // Test with millimeter setting (5.91mm input)
  const thicknessMm_1 = 5.91; // Direct mm input
  const thicknessM_1 = thicknessMm_1 / 1000; // 0.00591m
  const uValue_1 = 0.035 / thicknessM_1; // 5.93 W/m²·K (very high!)
  console.log("  5.91mm → U-value:", uValue_1.toFixed(2), "W/m²·K (VERY HIGH - thin insulation)");
  
  // Test with inch setting (5.91in input)  
  const thicknessMm_2 = 5.91 * 25.4; // 150.1mm
  const thicknessM_2 = thicknessMm_2 / 1000; // 0.1501m
  const uValue_2 = 0.035 / thicknessM_2; // 0.233 W/m²·K (normal)
  console.log("  5.91in → U-value:", uValue_2.toFixed(3), "W/m²·K (NORMAL - proper insulation)");
  
  console.log("\nTesting room volume logic:");
  
  // Test with meter setting
  const volume_1 = 16.4 * 16.4 * 9.84; // 2647 m³
  console.log("  16.4m × 16.4m × 9.84m =", volume_1.toFixed(0), "m³");
  
  // Test with foot setting
  const lengthM = 16.4 * 0.3048; // 5.00m
  const widthM = 16.4 * 0.3048;  // 5.00m  
  const heightM = 9.84 * 0.3048; // 3.00m
  const volume_2 = lengthM * widthM * heightM; // 75 m³
  console.log("  16.4ft × 16.4ft × 9.84ft =", volume_2.toFixed(0), "m³");
  
  console.log("\nExpected Impact:");
  console.log("  - Transmission losses ratio:", (uValue_1/uValue_2).toFixed(1), ":1");
  console.log("  - Room volume ratio:", (volume_1/volume_2).toFixed(1), ":1");
  console.log("  - Total heat load could differ by factor of 20-30!");
}

testConversions();

console.log("\nCRITICAL VALIDATION NEEDED:");
console.log("============================");
console.log("1. ✓ When user changes distance unit from 'foot' to 'meter':");
console.log("   - Same input (16.4) should be treated as meters, not feet");
console.log("   - Calculations should use meter-based logic");
console.log("   - Results should change dramatically");

console.log("\n2. ✓ When user changes thickness unit from 'inch' to 'mm':");
console.log("   - Same input (5.91) should be treated as mm, not inches");
console.log("   - Insulation becomes 25× thinner");
console.log("   - Transmission losses should increase 25×");

console.log("\n3. ✓ When user changes weight unit from 'kg' to 'pound':");
console.log("   - Same input (15000) should be treated as pounds, not kg");
console.log("   - Actual mass becomes 2.2× smaller");
console.log("   - Storage capacity and respiration should scale accordingly");

console.log("\n4. ✓ When user changes temperature unit:");
console.log("   - Temperature differences should be recalculated");
console.log("   - Heat loads should change based on actual temperature gap");

console.log("\nNEXT STEP: Test with actual calculation engine to verify these conversions work correctly!");

console.log("\n=== UNIT CONVERSION TEST COMPLETE ===");
