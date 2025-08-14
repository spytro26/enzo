// FIXED CALCULATION TEST WITH EXACT USER DATA
// Testing the corrected calculation logic

console.log("=== FIXED CALCULATION TEST ===");

// User's exact input data
const userData = {
  roomTemperature: 2.0,           // °C
  outsideTemperature: 25.0,       // °C
  length: 16.4,                   // ft
  width: 16.4,                    // ft  
  height: 9.84,                   // ft
  thickness: 5.91,                // inches
  ventilationLossFactor: 'moderate',
  runningTime: 24,                // hours
  loadingPercentage: 80,          // %
  insulationMaterial: 'polystyrene',
  floorInsulation: false,
  doorOpenings: 20,               // per day
  doorSize: 4.0,                  // m²
  coolerFans: 2.5,                // kW
  coolerFansWorkingTime: 20,      // hours
  illumination: 15,               // W/m²
  illuminationWorkingTime: 8,     // hours/day
  persons: 2,
  personsWorkingTime: 8,          // hours/day
  otherHeatSources: 2.3,          // kW
  otherHeatSourcesWorkingTime: 8, // hours/day
  product: 'dairy-butter',
  storageQuantity: 15000,         // kg
  stockShift: 1500,               // kg
  enteringTemperature: 8.0,       // °C
  coolDownTime: 6,                // hours
  aisleWidth: 1.2,                // ft
  ceilingClearance: 0.5           // ft
};

// Unit settings (mixed: feet for room, inches for thickness)
const unitSettings = {
  temperature: 'celsius',
  distanceLarge: 'foot',
  distanceSmall: 'inch',
  weight: 'kg',
  power: 'kw'
};

// Butter product data
const butterData = {
  density: 920,                   // kg/m³
  recommendedTemp: 2.0,           // °C
  specificHeat: 2.9,              // kJ/kg·K
  respirationHeat: 0,             // kW/tonne (butter doesn't respire)
  packagingFactor: 0.85
};

// Conversion functions
function convertDistance(value, from, to) {
  if (from === to) return value;
  if (from === 'foot' && to === 'meter') return value * 0.3048;
  if (from === 'inch' && to === 'millimeter') return value * 25.4;
  return value;
}

console.log("INPUT DATA:");
console.log("===========");
console.log(`Room: ${userData.length}ft × ${userData.width}ft × ${userData.height}ft`);
console.log(`Thickness: ${userData.thickness}in (polystyrene)`);
console.log(`Temperatures: ${userData.roomTemperature}°C room, ${userData.outsideTemperature}°C outside`);
console.log(`Product: Butter, ${userData.storageQuantity}kg`);
console.log(`Equipment: ${userData.coolerFans}kW fans, ${userData.otherHeatSources}kW other`);
console.log("");

// FIXED CALCULATIONS
console.log("FIXED CALCULATIONS:");
console.log("==================");

// 1. Convert inputs to SI units
const lengthM = convertDistance(userData.length, unitSettings.distanceLarge, 'meter');
const widthM = convertDistance(userData.width, unitSettings.distanceLarge, 'meter');
const heightM = convertDistance(userData.height, unitSettings.distanceLarge, 'meter');
const thicknessMm = convertDistance(userData.thickness, unitSettings.distanceSmall, 'millimeter');
const thicknessM = thicknessMm / 1000;

console.log(`Converted dimensions: ${lengthM.toFixed(2)}m × ${widthM.toFixed(2)}m × ${heightM.toFixed(2)}m`);
console.log(`Converted thickness: ${thicknessMm.toFixed(1)}mm = ${thicknessM.toFixed(4)}m`);

// 2. Calculate areas
const wallArea = 2 * (lengthM * heightM + widthM * heightM);
const ceilingArea = lengthM * widthM;
const totalInsulatedArea = wallArea + ceilingArea; // No floor insulation
const roomVolume = lengthM * widthM * heightM;

console.log(`Wall area: ${wallArea.toFixed(1)} m²`);
console.log(`Ceiling area: ${ceilingArea.toFixed(1)} m²`);
console.log(`Total insulated area: ${totalInsulatedArea.toFixed(1)} m²`);
console.log(`Room volume: ${roomVolume.toFixed(1)} m³`);

// 3. Temperature difference
const tempDifference = userData.outsideTemperature - userData.roomTemperature;
console.log(`Temperature difference: ${tempDifference}°C`);

// 4. TRANSMISSION LOSSES - SIMPLIFIED
const thermalConductivity = 0.035; // polystyrene
const uValue = thermalConductivity / thicknessM;
const transmissionLosses = totalInsulatedArea * uValue * tempDifference;

console.log(`U-value: ${uValue.toFixed(3)} W/m²·K`);
console.log(`Transmission losses: ${totalInsulatedArea.toFixed(1)} × ${uValue.toFixed(3)} × ${tempDifference} = ${transmissionLosses.toFixed(0)} W`);

// 5. VENTILATION LOSSES - SIMPLIFIED
const airChangesPerHour = 0.5; // moderate
const airDensity = 1.2; // kg/m³
const specificHeatAir = 1.02; // kJ/kg·K
const ventilationLosses = (roomVolume * airChangesPerHour * airDensity * specificHeatAir * tempDifference * 1000) / 3600;

console.log(`Ventilation losses: ${roomVolume.toFixed(1)} × ${airChangesPerHour} × ${airDensity} × ${specificHeatAir} × ${tempDifference} × 1000 / 3600 = ${ventilationLosses.toFixed(0)} W`);

// 6. DOOR OPENING LOSSES - SIMPLIFIED
const doorOpeningsPerHour = userData.doorOpenings / 24;
const doorOpeningLosses = userData.doorSize * doorOpeningsPerHour * 10 * tempDifference;

console.log(`Door opening losses: ${userData.doorSize} × ${doorOpeningsPerHour.toFixed(1)} × 10 × ${tempDifference} = ${doorOpeningLosses.toFixed(0)} W`);

// 7. RESPIRATION HEAT (0 for butter)
const respirationHeat = 0;
console.log(`Respiration heat: ${respirationHeat} W (butter doesn't respire)`);

// 8. COOLING DOWN HEAT
const tempDrop = Math.abs(userData.enteringTemperature - userData.roomTemperature);
const coolingDown = (userData.stockShift * butterData.specificHeat * tempDrop * 1000) / (userData.coolDownTime * 3600);

console.log(`Cooling down: ${userData.stockShift} × ${butterData.specificHeat} × ${tempDrop} × 1000 / (${userData.coolDownTime} × 3600) = ${coolingDown.toFixed(0)} W`);

// 9. OTHER HEAT SOURCES - SIMPLIFIED
const roomAreaM2 = lengthM * widthM;
const coolerFansLoad = (userData.coolerFans * 1000) * (userData.coolerFansWorkingTime / 24);
const illuminationLoad = userData.illumination * roomAreaM2 * (userData.illuminationWorkingTime / 24);
const personsLoad = userData.persons * 120 * (userData.personsWorkingTime / 24);
const otherEquipmentLoad = (userData.otherHeatSources * 1000) * (userData.otherHeatSourcesWorkingTime / 24);
const otherHeatSources = coolerFansLoad + illuminationLoad + personsLoad + otherEquipmentLoad;

console.log(`Cooler fans: ${userData.coolerFans}kW × ${userData.coolerFansWorkingTime}h/24h = ${coolerFansLoad.toFixed(0)} W`);
console.log(`Lighting: ${roomAreaM2.toFixed(1)}m² × ${userData.illumination}W/m² × ${userData.illuminationWorkingTime}h/24h = ${illuminationLoad.toFixed(0)} W`);
console.log(`People: ${userData.persons} × 120W × ${userData.personsWorkingTime}h/24h = ${personsLoad.toFixed(0)} W`);
console.log(`Other equipment: ${userData.otherHeatSources}kW × ${userData.otherHeatSourcesWorkingTime}h/24h = ${otherEquipmentLoad.toFixed(0)} W`);
console.log(`Total other heat sources: ${otherHeatSources.toFixed(0)} W`);

// 10. TOTALS
const subtotal = transmissionLosses + ventilationLosses + doorOpeningLosses + otherHeatSources + coolingDown + respirationHeat;
const safetyFactor = 1.15;
const requiredCapacity = subtotal * safetyFactor / 1000; // Convert to kW
const totalSpecificCapacity = requiredCapacity * 1000 / roomAreaM2; // W/m²

console.log("");
console.log("FINAL RESULTS:");
console.log("==============");
console.log(`Transmission losses: ${Math.round(transmissionLosses)} W`);
console.log(`Ventilation losses: ${Math.round(ventilationLosses)} W`);
console.log(`Door opening losses: ${Math.round(doorOpeningLosses)} W`);
console.log(`Other heat sources: ${Math.round(otherHeatSources)} W`);
console.log(`Cooling down: ${Math.round(coolingDown)} W`);
console.log(`Respiration: ${Math.round(respirationHeat)} W`);
console.log(`Subtotal: ${Math.round(subtotal)} W`);
console.log(`Required capacity: ${requiredCapacity.toFixed(2)} kW`);
console.log(`Total specific capacity: ${totalSpecificCapacity.toFixed(2)} W/m²`);

// 11. STORAGE CAPACITY
const aisleWidthM = convertDistance(userData.aisleWidth, unitSettings.distanceLarge, 'meter');
const ceilingClearanceM = convertDistance(userData.ceilingClearance, unitSettings.distanceLarge, 'meter');
const effectiveLength = Math.max(0, lengthM - aisleWidthM);
const effectiveWidth = Math.max(0, widthM - aisleWidthM);
const effectiveHeight = Math.max(0, heightM - ceilingClearanceM);
const effectiveVolume = effectiveLength * effectiveWidth * effectiveHeight;
const maxStorageCapacity = effectiveVolume * butterData.density * butterData.packagingFactor;

console.log(`Max storage capacity: ${Math.round(maxStorageCapacity).toLocaleString()} kg`);
console.log(`Recommended temp: ${butterData.recommendedTemp}°C`);

console.log("");
console.log("=== THESE ARE THE CORRECT VALUES YOUR APP SHOULD SHOW ===");
