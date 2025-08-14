// Test unit conversions for different settings

// Simulate the UnitConverter class
class UnitConverter {
  static convertTemperature(value, from, to) {
    if (from === to) return value;
    
    let celsius = value;
    if (from === 'fahrenheit') {
      celsius = (value - 32) * 5/9;
    } else if (from === 'kelvin') {
      celsius = value - 273.15;
    }

    if (to === 'fahrenheit') {
      return (celsius * 9/5) + 32;
    } else if (to === 'kelvin') {
      return celsius + 273.15;
    }
    
    return celsius;
  }

  static convertDistance(value, from, to) {
    if (from === to) return value;
    
    if ((from === 'meter' || from === 'foot') && (to === 'meter' || to === 'foot')) {
      if (from === 'foot' && to === 'meter') {
        return value * 0.3048;
      } else if (from === 'meter' && to === 'foot') {
        return value / 0.3048;
      }
    }
    
    if ((from === 'millimeter' || from === 'inch') && (to === 'millimeter' || to === 'inch')) {
      if (from === 'inch' && to === 'millimeter') {
        return value * 25.4;
      } else if (from === 'millimeter' && to === 'inch') {
        return value / 25.4;
      }
    }
    
    return value;
  }
}

console.log("=== UNIT CONVERSION TESTS ===");

// Test 1: Current settings (foot/inch/celsius)
console.log("\nTest 1: Current Settings (foot/inch/celsius)");
const currentSettings = {
  temperature: 'celsius',
  distanceSmall: 'inch',
  distanceLarge: 'foot'
};

const roomData = {
  length: 16.4,      // ft
  width: 16.4,       // ft  
  height: 9.84,      // ft
  thickness: 5.91,   // in
  roomTemperature: 2.0,    // °C
  outsideTemperature: 25.0  // °C
};

// Convert to metric for calculation
const lengthM = UnitConverter.convertDistance(roomData.length, currentSettings.distanceLarge, 'meter');
const widthM = UnitConverter.convertDistance(roomData.width, currentSettings.distanceLarge, 'meter');
const heightM = UnitConverter.convertDistance(roomData.height, currentSettings.distanceLarge, 'meter');
const thicknessMm = UnitConverter.convertDistance(roomData.thickness, currentSettings.distanceSmall, 'millimeter');
const thicknessM = thicknessMm / 1000;

console.log(`Dimensions: ${roomData.length}ft × ${roomData.width}ft × ${roomData.height}ft`);
console.log(`Converted: ${lengthM.toFixed(3)}m × ${widthM.toFixed(3)}m × ${heightM.toFixed(3)}m`);
console.log(`Thickness: ${roomData.thickness}in = ${thicknessMm}mm = ${thicknessM.toFixed(4)}m`);

// Calculate areas
const wallArea = 2 * (lengthM * heightM + widthM * heightM);
const ceilingArea = lengthM * widthM;
const totalArea = wallArea + ceilingArea;

console.log(`Wall area: ${wallArea.toFixed(2)} m²`);
console.log(`Ceiling area: ${ceilingArea.toFixed(2)} m²`);
console.log(`Total area: ${totalArea.toFixed(2)} m²`);

// Calculate transmission
const thermalConductivity = 0.035;
const tempDiff = roomData.outsideTemperature - roomData.roomTemperature;
const uValue = thermalConductivity / thicknessM;
const transmission = totalArea * uValue * tempDiff;

console.log(`U-value: ${uValue.toFixed(3)} W/m²·K`);
console.log(`Temperature difference: ${tempDiff}°C`);
console.log(`Transmission losses: ${transmission.toFixed(0)} W`);

// Test 2: Imperial settings (fahrenheit/foot/inch)
console.log("\nTest 2: Imperial Settings (fahrenheit/foot/inch)");
const imperialSettings = {
  temperature: 'fahrenheit',
  distanceSmall: 'inch',
  distanceLarge: 'foot'
};

const imperialData = {
  length: 16.4,      // ft
  width: 16.4,       // ft  
  height: 9.84,      // ft
  thickness: 5.91,   // in
  roomTemperature: 35.6,    // °F (2°C)
  outsideTemperature: 77.0  // °F (25°C)
};

// Convert temperatures to Celsius
const roomTempC = UnitConverter.convertTemperature(imperialData.roomTemperature, imperialSettings.temperature, 'celsius');
const outsideTempC = UnitConverter.convertTemperature(imperialData.outsideTemperature, imperialSettings.temperature, 'celsius');

console.log(`Room temp: ${imperialData.roomTemperature}°F = ${roomTempC.toFixed(1)}°C`);
console.log(`Outside temp: ${imperialData.outsideTemperature}°F = ${outsideTempC.toFixed(1)}°C`);

const tempDiffImperial = outsideTempC - roomTempC;
const transmissionImperial = totalArea * uValue * tempDiffImperial;

console.log(`Temperature difference: ${tempDiffImperial.toFixed(1)}°C`);
console.log(`Transmission losses: ${transmissionImperial.toFixed(0)} W`);

// Test 3: Metric settings (celsius/meter/millimeter)
console.log("\nTest 3: Metric Settings (celsius/meter/millimeter)");
const metricSettings = {
  temperature: 'celsius',
  distanceSmall: 'millimeter',
  distanceLarge: 'meter'
};

const metricData = {
  length: 5.0,       // m
  width: 5.0,        // m  
  height: 3.0,       // m
  thickness: 150,    // mm
  roomTemperature: 2.0,    // °C
  outsideTemperature: 25.0  // °C
};

// Already in metric, so minimal conversion
const lengthM_metric = UnitConverter.convertDistance(metricData.length, metricSettings.distanceLarge, 'meter');
const widthM_metric = UnitConverter.convertDistance(metricData.width, metricSettings.distanceLarge, 'meter');
const heightM_metric = UnitConverter.convertDistance(metricData.height, metricSettings.distanceLarge, 'meter');
const thicknessMm_metric = UnitConverter.convertDistance(metricData.thickness, metricSettings.distanceSmall, 'millimeter');
const thicknessM_metric = thicknessMm_metric / 1000;

console.log(`Dimensions: ${metricData.length}m × ${metricData.width}m × ${metricData.height}m`);
console.log(`Thickness: ${metricData.thickness}mm = ${thicknessM_metric.toFixed(4)}m`);

// Calculate areas
const wallArea_metric = 2 * (lengthM_metric * heightM_metric + widthM_metric * heightM_metric);
const ceilingArea_metric = lengthM_metric * widthM_metric;
const totalArea_metric = wallArea_metric + ceilingArea_metric;

console.log(`Total area: ${totalArea_metric.toFixed(2)} m²`);

const uValue_metric = thermalConductivity / thicknessM_metric;
const tempDiff_metric = metricData.outsideTemperature - metricData.roomTemperature;
const transmission_metric = totalArea_metric * uValue_metric * tempDiff_metric;

console.log(`U-value: ${uValue_metric.toFixed(3)} W/m²·K`);
console.log(`Transmission losses: ${transmission_metric.toFixed(0)} W`);

console.log("\n=== SUMMARY ===");
console.log("All unit systems should give the same result:");
console.log(`Test 1 (current): ${transmission.toFixed(0)} W`);
console.log(`Test 2 (imperial): ${transmissionImperial.toFixed(0)} W`);
console.log(`Test 3 (metric): ${transmission_metric.toFixed(0)} W`);

if (Math.abs(transmission - transmissionImperial) < 1 && 
    Math.abs(transmission - transmission_metric) < 1) {
  console.log("✅ Unit conversions working correctly!");
} else {
  console.log("❌ Unit conversion issues detected!");
}
