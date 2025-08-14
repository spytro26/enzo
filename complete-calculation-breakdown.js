// COMPLETE CALCULATION BREAKDOWN WITH STEP-BY-STEP EXPLANATION
// For user's exact input data with detailed explanations

console.log("=== COMPLETE CALCULATION BREAKDOWN ===");
console.log("Showing exactly how each value is calculated\n");

// USER'S EXACT INPUT DATA
const inputData = {
  roomTemperature: 2.0,           // °C
  outsideTemperature: 25.0,       // °C
  ventilationLossFactor: 'moderate',
  runningTime: 24,                // hours
  loadingPercentage: 80,          // %
  length: 16.4,                   // ft
  width: 16.4,                    // ft  
  height: 9.84,                   // ft
  insulationMaterial: 'polystyrene',
  thickness: 5.91,                // inches
  floorInsulation: false,         // no
  storageMethod: 'palletized',
  aisleWidth: 1.2,                // ft
  ceilingClearance: 0.5,          // ft
  roomUsageType: 'storage',
  doorOpenings: 20,               // per day
  doorArea: 4.0,                  // m²
  coolerFansPower: 2.5,           // kW
  coolerFansWorkingTime: 20,      // hours
  illuminationIntensity: 15,      // W/m²
  illuminationWorkingTime: 8,     // hours/day
  numberOfPersons: 2,
  personsWorkingTime: 8,          // hours/day
  otherHeatSource: 2.3,           // kW
  otherHeatSourceWorkingTime: 8,  // hours/day
  product: 'butter',
  storageQuantity: 15000,         // kg
  stockShift: 1500,               // kg
  enteringTemp: 8.0,              // °C
  coolDownTime: 6                 // hours
};

console.log("INPUT DATA SUMMARY:");
console.log("==================");
console.log(`Room: ${inputData.length}ft × ${inputData.width}ft × ${inputData.height}ft`);
console.log(`Thickness: ${inputData.thickness}in polystyrene`);
console.log(`Temperatures: ${inputData.roomTemperature}°C room, ${inputData.outsideTemperature}°C outside`);
console.log(`Product: Butter, ${inputData.storageQuantity}kg`);
console.log("");

// STEP 1: CONVERT UNITS TO METRIC
console.log("STEP 1: UNIT CONVERSIONS");
console.log("========================");

// Convert room dimensions from feet to meters
const lengthM = inputData.length * 0.3048;
const widthM = inputData.width * 0.3048;
const heightM = inputData.height * 0.3048;

console.log(`Room dimensions:`);
console.log(`  ${inputData.length}ft = ${lengthM.toFixed(3)}m`);
console.log(`  ${inputData.width}ft = ${widthM.toFixed(3)}m`);
console.log(`  ${inputData.height}ft = ${heightM.toFixed(3)}m`);

// Convert thickness from inches to meters
const thicknessMm = inputData.thickness * 25.4;
const thicknessM = thicknessMm / 1000;

console.log(`Thickness:`);
console.log(`  ${inputData.thickness}in = ${thicknessMm.toFixed(1)}mm = ${thicknessM.toFixed(4)}m`);

// Convert aisle width and ceiling clearance
const aisleWidthM = inputData.aisleWidth * 0.3048;
const ceilingClearanceM = inputData.ceilingClearance * 0.3048;

console.log(`Aisle width: ${inputData.aisleWidth}ft = ${aisleWidthM.toFixed(3)}m`);
console.log(`Ceiling clearance: ${inputData.ceilingClearance}ft = ${ceilingClearanceM.toFixed(3)}m`);
console.log("");

// STEP 2: CALCULATE AREAS AND VOLUMES
console.log("STEP 2: AREAS AND VOLUMES");
console.log("=========================");

const floorArea = lengthM * widthM;
const wallArea = 2 * (lengthM * heightM + widthM * heightM);
const ceilingArea = floorArea;
const totalInsulatedArea = wallArea + ceilingArea; // No floor insulation
const roomVolume = lengthM * widthM * heightM;

console.log(`Floor area: ${lengthM.toFixed(3)} × ${widthM.toFixed(3)} = ${floorArea.toFixed(2)} m²`);
console.log(`Wall area: 2 × (${lengthM.toFixed(3)}×${heightM.toFixed(3)} + ${widthM.toFixed(3)}×${heightM.toFixed(3)}) = ${wallArea.toFixed(2)} m²`);
console.log(`Ceiling area: ${ceilingArea.toFixed(2)} m²`);
console.log(`Total insulated area: ${wallArea.toFixed(2)} + ${ceilingArea.toFixed(2)} = ${totalInsulatedArea.toFixed(2)} m² (no floor insulation)`);
console.log(`Room volume: ${lengthM.toFixed(3)} × ${widthM.toFixed(3)} × ${heightM.toFixed(3)} = ${roomVolume.toFixed(2)} m³`);
console.log("");

// STEP 3: CALCULATE STORAGE CAPACITY
console.log("STEP 3: STORAGE CAPACITY");
console.log("========================");

const effectiveLength = lengthM - aisleWidthM;
const effectiveWidth = widthM - aisleWidthM;
const effectiveHeight = heightM - ceilingClearanceM;
const effectiveVolume = effectiveLength * effectiveWidth * effectiveHeight;

// Butter properties
const butterDensity = 920; // kg/m³
const butterPackagingFactor = 0.85;
const butterRecommendedTemp = 2.0; // °C
const butterSpecificHeat = 2.9; // kJ/kg·K

const maxStorageCapacity = effectiveVolume * butterDensity * butterPackagingFactor;

console.log(`Effective storage dimensions:`);
console.log(`  Length: ${lengthM.toFixed(3)} - ${aisleWidthM.toFixed(3)} = ${effectiveLength.toFixed(3)} m`);
console.log(`  Width: ${widthM.toFixed(3)} - ${aisleWidthM.toFixed(3)} = ${effectiveWidth.toFixed(3)} m`);
console.log(`  Height: ${heightM.toFixed(3)} - ${ceilingClearanceM.toFixed(3)} = ${effectiveHeight.toFixed(3)} m`);
console.log(`Effective volume: ${effectiveLength.toFixed(3)} × ${effectiveWidth.toFixed(3)} × ${effectiveHeight.toFixed(3)} = ${effectiveVolume.toFixed(3)} m³`);
console.log(`Max storage capacity: ${effectiveVolume.toFixed(3)} × ${butterDensity} × ${butterPackagingFactor} = ${Math.round(maxStorageCapacity).toLocaleString()} kg`);
console.log(`Recommended temperature for butter: ${butterRecommendedTemp}°C`);
console.log("");

// STEP 4: TRANSMISSION LOSSES
console.log("STEP 4: TRANSMISSION LOSSES");
console.log("============================");

const tempDifference = inputData.outsideTemperature - inputData.roomTemperature;
const thermalConductivity = 0.035; // W/m·K for polystyrene
const uValue = thermalConductivity / thicknessM;
const transmissionLosses = totalInsulatedArea * uValue * tempDifference;

console.log(`Temperature difference: ${inputData.outsideTemperature}°C - ${inputData.roomTemperature}°C = ${tempDifference}°C`);
console.log(`Thermal conductivity (polystyrene): ${thermalConductivity} W/m·K`);
console.log(`U-value calculation: k/thickness = ${thermalConductivity}/${thicknessM.toFixed(4)} = ${uValue.toFixed(3)} W/m²·K`);
console.log(`Transmission losses: ${totalInsulatedArea.toFixed(2)} × ${uValue.toFixed(3)} × ${tempDifference} = ${transmissionLosses.toFixed(0)} W`);
console.log("");

// STEP 5: VENTILATION LOSSES  
console.log("STEP 5: VENTILATION LOSSES");
console.log("===========================");

const airChangesPerHour = 0.5; // moderate ventilation
const airDensity = 1.2; // kg/m³
const airSpecificHeat = 1.02; // kJ/kg·K
const ventilationLosses = (roomVolume * airChangesPerHour * airDensity * airSpecificHeat * tempDifference * 1000) / 3600;

console.log(`Air changes per hour: ${airChangesPerHour} (moderate ventilation)`);
console.log(`Air density: ${airDensity} kg/m³`);
console.log(`Air specific heat: ${airSpecificHeat} kJ/kg·K`);
console.log(`Calculation: (${roomVolume.toFixed(2)} × ${airChangesPerHour} × ${airDensity} × ${airSpecificHeat} × ${tempDifference} × 1000) ÷ 3600`);
console.log(`Ventilation losses: ${ventilationLosses.toFixed(0)} W`);
console.log("");

// STEP 6: DOOR OPENING LOSSES
console.log("STEP 6: DOOR OPENING LOSSES");
console.log("============================");

const doorOpeningsPerHour = inputData.doorOpenings / 24;
const doorOpeningLosses = inputData.doorArea * doorOpeningsPerHour * 10 * tempDifference;

console.log(`Door openings per day: ${inputData.doorOpenings}`);
console.log(`Door openings per hour: ${inputData.doorOpenings}/24 = ${doorOpeningsPerHour.toFixed(3)}`);
console.log(`Door area: ${inputData.doorArea} m²`);
console.log(`Door opening factor: 10 W/m²/opening/hour/°C (standard factor)`);
console.log(`Calculation: ${inputData.doorArea} × ${doorOpeningsPerHour.toFixed(3)} × 10 × ${tempDifference}`);
console.log(`Door opening losses: ${doorOpeningLosses.toFixed(0)} W`);
console.log("");

// STEP 7: RESPIRATION HEAT
console.log("STEP 7: RESPIRATION HEAT");
console.log("========================");

const respirationHeat = 0; // Butter doesn't respire

console.log(`Product: Butter (dairy product)`);
console.log(`Dairy products don't respire (no biological activity)`);
console.log(`Respiration heat: ${respirationHeat} W`);
console.log("");

// STEP 8: COOLING DOWN HEAT
console.log("STEP 8: COOLING DOWN HEAT");
console.log("=========================");

const enteringTempDiff = inputData.enteringTemp - inputData.roomTemperature;
const coolingDown = (inputData.stockShift * butterSpecificHeat * enteringTempDiff * 1000) / (inputData.coolDownTime * 3600);

console.log(`Stock shift (product entering daily): ${inputData.stockShift} kg`);
console.log(`Entering temperature: ${inputData.enteringTemp}°C`);
console.log(`Room temperature: ${inputData.roomTemperature}°C`);
console.log(`Temperature drop: ${inputData.enteringTemp} - ${inputData.roomTemperature} = ${enteringTempDiff}°C`);
console.log(`Specific heat (butter): ${butterSpecificHeat} kJ/kg·K`);
console.log(`Cool down time: ${inputData.coolDownTime} hours`);
console.log(`Calculation: (${inputData.stockShift} × ${butterSpecificHeat} × ${enteringTempDiff} × 1000) ÷ (${inputData.coolDownTime} × 3600)`);
console.log(`Cooling down heat: ${coolingDown.toFixed(0)} W`);
console.log("");

// STEP 9: OTHER HEAT SOURCES
console.log("STEP 9: OTHER HEAT SOURCES");
console.log("===========================");

const coolerFansLoad = (inputData.coolerFansPower * 1000) * (inputData.coolerFansWorkingTime / 24);
const illuminationLoad = inputData.illuminationIntensity * floorArea * (inputData.illuminationWorkingTime / 24);
const personsLoad = inputData.numberOfPersons * 120 * (inputData.personsWorkingTime / 24);
const otherEquipmentLoad = (inputData.otherHeatSource * 1000) * (inputData.otherHeatSourceWorkingTime / 24);

console.log(`Cooler fans:`);
console.log(`  Power: ${inputData.coolerFansPower} kW = ${inputData.coolerFansPower * 1000} W`);
console.log(`  Working time: ${inputData.coolerFansWorkingTime} hours/day`);
console.log(`  Average load: ${inputData.coolerFansPower * 1000} × (${inputData.coolerFansWorkingTime}/24) = ${coolerFansLoad.toFixed(0)} W`);

console.log(`Lighting:`);
console.log(`  Intensity: ${inputData.illuminationIntensity} W/m²`);
console.log(`  Floor area: ${floorArea.toFixed(2)} m²`);
console.log(`  Working time: ${inputData.illuminationWorkingTime} hours/day`);
console.log(`  Average load: ${inputData.illuminationIntensity} × ${floorArea.toFixed(2)} × (${inputData.illuminationWorkingTime}/24) = ${illuminationLoad.toFixed(0)} W`);

console.log(`People:`);
console.log(`  Number: ${inputData.numberOfPersons}`);
console.log(`  Heat per person: 120 W (standard value)`);
console.log(`  Working time: ${inputData.personsWorkingTime} hours/day`);
console.log(`  Average load: ${inputData.numberOfPersons} × 120 × (${inputData.personsWorkingTime}/24) = ${personsLoad.toFixed(0)} W`);

console.log(`Other equipment:`);
console.log(`  Power: ${inputData.otherHeatSource} kW = ${inputData.otherHeatSource * 1000} W`);
console.log(`  Working time: ${inputData.otherHeatSourceWorkingTime} hours/day`);
console.log(`  Average load: ${inputData.otherHeatSource * 1000} × (${inputData.otherHeatSourceWorkingTime}/24) = ${otherEquipmentLoad.toFixed(0)} W`);

const totalOtherHeatSources = coolerFansLoad + illuminationLoad + personsLoad + otherEquipmentLoad;

console.log(`Total other heat sources: ${coolerFansLoad.toFixed(0)} + ${illuminationLoad.toFixed(0)} + ${personsLoad.toFixed(0)} + ${otherEquipmentLoad.toFixed(0)} = ${totalOtherHeatSources.toFixed(0)} W`);
console.log("");

// STEP 10: TOTALS AND FINAL RESULTS
console.log("STEP 10: TOTALS AND FINAL RESULTS");
console.log("==================================");

const subtotal = transmissionLosses + ventilationLosses + doorOpeningLosses + totalOtherHeatSources + coolingDown + respirationHeat;
const safetyFactor = 1.15; // 15% safety factor
const requiredCapacity = subtotal * safetyFactor / 1000; // Convert to kW
const totalSpecificCapacity = requiredCapacity * 1000 / floorArea; // W/m²
const recommendedEquipment = Math.ceil(requiredCapacity * 1.1); // 10% extra for equipment sizing

console.log(`Subtotal calculation:`);
console.log(`  Transmission losses: ${transmissionLosses.toFixed(0)} W`);
console.log(`  Ventilation losses: ${ventilationLosses.toFixed(0)} W`);
console.log(`  Door opening losses: ${doorOpeningLosses.toFixed(0)} W`);
console.log(`  Other heat sources: ${totalOtherHeatSources.toFixed(0)} W`);
console.log(`  Cooling down: ${coolingDown.toFixed(0)} W`);
console.log(`  Respiration: ${respirationHeat} W`);
console.log(`  Subtotal: ${subtotal.toFixed(0)} W`);

console.log(`Safety factor: ${safetyFactor} (15% margin for uncertainties)`);
console.log(`Required capacity: ${subtotal.toFixed(0)} × ${safetyFactor} ÷ 1000 = ${requiredCapacity.toFixed(2)} kW`);

console.log(`Specific capacity: ${requiredCapacity.toFixed(2)} kW × 1000 ÷ ${floorArea.toFixed(2)} m² = ${totalSpecificCapacity.toFixed(2)} W/m²`);

console.log(`Recommended equipment: ${requiredCapacity.toFixed(2)} kW × 1.1 = ${recommendedEquipment} kW (rounded up)`);

console.log("");
console.log("=== FINAL EXPECTED APP VALUES ===");
console.log("==================================");
console.log(`Transmission losses: ${Math.round(transmissionLosses).toLocaleString()} W`);
console.log(`Ventilation losses: ${Math.round(ventilationLosses).toLocaleString()} W`);
console.log(`Door opening losses: ${Math.round(doorOpeningLosses).toLocaleString()} W`);
console.log(`Other heat sources: ${Math.round(totalOtherHeatSources).toLocaleString()} W`);
console.log(`Cooling down/longer respiration: ${Math.round(coolingDown).toLocaleString()} W`);
console.log(`Respiration: ${respirationHeat} W`);
console.log(`Required capacity: ${requiredCapacity.toFixed(2)} kW`);
console.log(`Total specific capacity: ${totalSpecificCapacity.toFixed(2)} W/m²`);
console.log(`🔧 Recommended: Consider ${recommendedEquipment} kW equipment`);
console.log(`Max storage capacity: ${Math.round(maxStorageCapacity).toLocaleString()} kg`);
console.log(`Recommended temperature: ${butterRecommendedTemp}°C`);

console.log("");
console.log("=== VALIDATION CHECKLIST ===");
console.log("==============================");
console.log("Your app should show these EXACT values:");
console.log(`✓ Transmission losses: ${Math.round(transmissionLosses)} W`);
console.log(`✓ Ventilation losses: ${Math.round(ventilationLosses)} W`);
console.log(`✓ Door opening losses: ${Math.round(doorOpeningLosses)} W`);
console.log(`✓ Other heat sources: ${Math.round(totalOtherHeatSources)} W`);
console.log(`✓ Cooling down: ${Math.round(coolingDown)} W`);
console.log(`✓ Respiration: ${respirationHeat} W`);
console.log(`✓ Required capacity: ${requiredCapacity.toFixed(2)} kW`);
console.log(`✓ Specific capacity: ${totalSpecificCapacity.toFixed(2)} W/m²`);
console.log(`✓ Recommended: ${recommendedEquipment} kW`);
console.log(`✓ Max storage: ${Math.round(maxStorageCapacity)} kg`);
console.log(`✓ Recommended temp: ${butterRecommendedTemp}°C`);
