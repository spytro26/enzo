// Test script to understand how other heat sources and respiration heat are calculated

// Sample data for testing
const testData = {
  // Room dimensions
  length: 16.40,
  width: 16.40,
  height: 9.84,
  roomTemperature: 2.0,
  
  // Storage
  product: 'fruits-apples', // Has respiration heat: 0.004 kW/tonne/°C
  storageQuantity: 15000.00, // kg
  
  // Heat sources
  coolerFans: 2.50, // This should be treated as kW (< 1000)
  coolerFansWorkingTime: 20, // hours
  otherHeatSources: 2.30, // This should be treated as kW (< 1000)
  otherHeatSourcesWorkingTime: 8, // hours
  illumination: 15.00, // W/m²
  illuminationWorkingTime: 8, // hours
  persons: 2,
  personsWorkingTime: 8, // hours
};

console.log("=== CALCULATION ANALYSIS ===\n");

// 1. OTHER HEAT SOURCES CALCULATION
console.log("1. OTHER HEAT SOURCES BREAKDOWN:");
console.log("--------------------------------");

// Cooler Fans
const coolerFansValue = testData.coolerFans;
let coolerFansWatts;
if (coolerFansValue > 1000) {
  coolerFansWatts = coolerFansValue; // Already in Watts
  console.log(`Cooler Fans: ${coolerFansValue} (interpreted as Watts)`);
} else {
  coolerFansWatts = coolerFansValue * 1000; // Convert kW to Watts
  console.log(`Cooler Fans: ${coolerFansValue} kW = ${coolerFansWatts} Watts`);
}

const coolerFansLoad = coolerFansWatts * (testData.coolerFansWorkingTime / 24);
console.log(`Cooler Fans Load: ${coolerFansWatts} W × (${testData.coolerFansWorkingTime}/24) = ${coolerFansLoad.toFixed(2)} W`);

// Other Heat Sources
const otherHeatSourcesValue = testData.otherHeatSources;
let otherHeatSourcesWatts;
if (otherHeatSourcesValue > 1000) {
  otherHeatSourcesWatts = otherHeatSourcesValue; // Already in Watts
  console.log(`Other Heat Sources: ${otherHeatSourcesValue} (interpreted as Watts)`);
} else {
  otherHeatSourcesWatts = otherHeatSourcesValue * 1000; // Convert kW to Watts
  console.log(`Other Heat Sources: ${otherHeatSourcesValue} kW = ${otherHeatSourcesWatts} Watts`);
}

const otherLoad = otherHeatSourcesWatts * (testData.otherHeatSourcesWorkingTime / 24);
console.log(`Other Heat Load: ${otherHeatSourcesWatts} W × (${testData.otherHeatSourcesWorkingTime}/24) = ${otherLoad.toFixed(2)} W`);

// Illumination
const roomAreaM2 = testData.length * testData.width;
const illuminationLoad = testData.illumination * roomAreaM2 * (testData.illuminationWorkingTime / 24);
console.log(`Illumination Load: ${testData.illumination} W/m² × ${roomAreaM2.toFixed(2)} m² × (${testData.illuminationWorkingTime}/24) = ${illuminationLoad.toFixed(2)} W`);

// Persons
const personsLoad = testData.persons * 150 * (testData.personsWorkingTime / 24);
console.log(`Persons Load: ${testData.persons} persons × 150 W/person × (${testData.personsWorkingTime}/24) = ${personsLoad.toFixed(2)} W`);

// Defrost (assume freezing application for demo)
const isFreezingApplication = testData.roomTemperature < 0;
const defrostFactor = isFreezingApplication ? 0.12 : 0;
console.log(`Defrost Factor: ${defrostFactor * 100}% (${isFreezingApplication ? 'freezing' : 'chilling'} application)`);

const totalOtherHeatSources = coolerFansLoad + illuminationLoad + personsLoad + otherLoad;
console.log(`\nTOTAL OTHER HEAT SOURCES: ${totalOtherHeatSources.toFixed(2)} W`);

// 2. RESPIRATION HEAT CALCULATION
console.log("\n2. RESPIRATION HEAT CALCULATION:");
console.log("--------------------------------");

// Sample product data for apples
const appleProduct = {
  respirationHeat: 0.004, // kW/tonne/°C
  name: "Apples"
};

const storageQuantityKg = testData.storageQuantity;
const storageQuantityTonnes = storageQuantityKg / 1000;

if (appleProduct.respirationHeat > 0) {
  // Temperature factor (Q10 rule: doubles every 10°C)
  const referenceTemp = 0; // °C
  const roomTempC = testData.roomTemperature;
  const tempFactor = Math.pow(2, (roomTempC - referenceTemp) / 10);
  
  console.log(`Product: ${appleProduct.name}`);
  console.log(`Respiration Heat Rate: ${appleProduct.respirationHeat} kW/tonne/°C`);
  console.log(`Storage Quantity: ${storageQuantityTonnes} tonnes`);
  console.log(`Room Temperature: ${roomTempC}°C`);
  console.log(`Temperature Factor: 2^((${roomTempC} - ${referenceTemp})/10) = ${tempFactor.toFixed(3)}`);
  
  // Calculate respiration heat with temperature correction
  const respirationHeatKW = storageQuantityTonnes * appleProduct.respirationHeat * tempFactor;
  const respirationHeatW = respirationHeatKW * 1000;
  
  console.log(`Respiration Heat: ${storageQuantityTonnes} tonnes × ${appleProduct.respirationHeat} kW/tonne/°C × ${tempFactor.toFixed(3)} = ${respirationHeatKW.toFixed(3)} kW = ${respirationHeatW.toFixed(2)} W`);
  
  // Storage conditions factor
  const storageConditionsFactor = 0.7; // 30% reduction for controlled atmosphere
  const adjustedRespirationHeat = respirationHeatW * storageConditionsFactor;
  console.log(`Adjusted for Storage Conditions: ${respirationHeatW.toFixed(2)} W × ${storageConditionsFactor} = ${adjustedRespirationHeat.toFixed(2)} W`);
} else {
  console.log("Product has no respiration heat (non-living product)");
}

// 3. WHY RESPIRATION MIGHT SHOW 0
console.log("\n3. WHY RESPIRATION HEAT MIGHT SHOW 0:");
console.log("------------------------------------");
console.log("• If product is non-living (dairy, meat, processed foods) → respirationHeat = 0");
console.log("• If storage quantity is very small → calculation result approaches 0");
console.log("• If room temperature is very low → temperature factor reduces the value significantly");
console.log("• Products with respiration heat > 0: fruits, vegetables");
console.log("• Products with respiration heat = 0: dairy, meat, fish, processed foods");

// 4. COMMON ISSUES WITH LARGE VALUES
console.log("\n4. COMMON ISSUES WITH LARGE OTHER HEAT SOURCES:");
console.log("----------------------------------------------");
console.log("• Input 250 kW instead of 2.5 kW → 100x too large");
console.log("• Mixing units (entering Watts when expecting kW)");
console.log("• Not accounting for working time factor");
console.log("• Using industrial values for commercial applications");

console.log("\n=== END ANALYSIS ===");
