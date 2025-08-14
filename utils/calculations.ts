import { RoomData, CalculationResult } from '@/types';
import { products, insulationMaterials } from '@/data/products';
import { UnitConverter } from './conversions';

export class ColdRoomCalculator {
  
  static generateRecommendations(data: RoomData, results: CalculationResult): string[] {
    const recommendations: string[] = [];
    
    // Insulation recommendations
    if (results.transmissionLosses > results.subtotal * 0.4) {
      recommendations.push("Consider thicker insulation or better insulation material to reduce transmission losses");
    }
    
    // Ventilation recommendations
    if (results.ventilationLosses > results.subtotal * 0.3) {
      recommendations.push("Reduce ventilation losses by improving door seals and minimizing door openings");
    }
    
    // Product specific recommendations
    const product = products.find((p) => p.id === data.product);
    if (product && product.respirationHeat > 0 && results.respirationHeat > 100) {
      recommendations.push("Consider controlled atmosphere storage to reduce respiration heat");
    }
    
    // Energy efficiency recommendations
    if (results.totalSpecificCapacity > 150) {
      recommendations.push("High specific capacity indicates potential for energy optimization");
    }
    
    // Safety factor recommendations
    if (results.requiredCapacity < 5) {
      recommendations.push("Consider minimum equipment capacity requirements for small installations");
    }
    
    return recommendations;
  }

  static calculateMaxStorageCapacity(roomData: RoomData, unitSettings: any): number {
    const product = products.find((p) => p.id === roomData.product);
    if (!product) return 0;
    
    // Convert dimensions to meters for calculation based on unit settings
    const lengthM = UnitConverter.convertDistance(roomData.length, unitSettings.distanceLarge, 'meter');
    const widthM = UnitConverter.convertDistance(roomData.width, unitSettings.distanceLarge, 'meter');
    const heightM = UnitConverter.convertDistance(roomData.height, unitSettings.distanceLarge, 'meter');
    
    // FIX: Proper aisle width and ceiling clearance conversion
    const aisleWidthM = roomData.aisleWidth ? 
      UnitConverter.convertDistance(roomData.aisleWidth, unitSettings.distanceLarge, 'meter') : 
      1.2; // Default 1.2m aisle width
      
    const ceilingClearanceM = roomData.ceilingClearance ? 
      UnitConverter.convertDistance(roomData.ceilingClearance, unitSettings.distanceLarge, 'meter') : 
      0.5; // Default 0.5m clearance
    
    // Calculate effective storage dimensions
    const effectiveLength = Math.max(0, lengthM - aisleWidthM);
    const effectiveWidth = Math.max(0, widthM - aisleWidthM);
    const effectiveHeight = Math.max(0, heightM - ceilingClearanceM);
    
    // Apply stacking height limitations
    const usableHeight = product.stackingHeight && product.stackingHeight < effectiveHeight ? 
      product.stackingHeight : effectiveHeight;
    
    // Calculate effective storage volume
    const effectiveVolume = effectiveLength * effectiveWidth * usableHeight;
    
    // Calculate maximum storage capacity
    const maxCapacity = effectiveVolume * product.density * (product.packagingFactor || 0.75);
    
    // Convert result to display units
    return UnitConverter.convertWeight(maxCapacity, 'kg', unitSettings.weight);
  }

  static calculateCoolingLoad(data: RoomData, unitSettings: any): CalculationResult {
    // Convert all inputs to SI units for calculation
    const lengthM = UnitConverter.convertDistance(data.length, unitSettings.distanceLarge, 'meter');
    const widthM = UnitConverter.convertDistance(data.width, unitSettings.distanceLarge, 'meter');
    const heightM = UnitConverter.convertDistance(data.height, unitSettings.distanceLarge, 'meter');
    
    // FIX: Proper thickness conversion - convert to millimeters first, then to meters
    const thicknessMm = UnitConverter.convertDistance(data.thickness, unitSettings.distanceSmall, 'millimeter');
    const thicknessM = thicknessMm / 1000; // Convert mm to meters
    
    // Get insulation material properties
    const insulationMaterial = insulationMaterials.find(
      (mat) => mat.value === data.insulationMaterial
    );
    const thermalConductivity = insulationMaterial?.thermalConductivity || 0.035;

    // Calculate room surface areas in m²
    const wallArea = 2 * (lengthM * heightM + widthM * heightM);
    const ceilingArea = lengthM * widthM;
    const floorArea = lengthM * widthM; // Always include floor area

    // Convert temperatures to Celsius for calculation
    const roomTempC = UnitConverter.convertTemperature(data.roomTemperature, unitSettings.temperature, 'celsius');
    const outsideTempC = UnitConverter.convertTemperature(data.outsideTemperature, unitSettings.temperature, 'celsius');
    const enteringTempC = UnitConverter.convertTemperature(data.enteringTemperature || data.roomTemperature, unitSettings.temperature, 'celsius');
    
    const tempDifference = outsideTempC - roomTempC;

    // TRANSMISSION LOSSES (W) - FIXED: INCLUDE FLOOR HEAT TRANSFER WITH PROPER THICKNESS
    const insulatedUValue = thermalConductivity / thicknessM;
    const uninsulatedFloorUValue = 0.2; // W/m²·K for typical uninsulated concrete slab on ground (professional cold storage)
    
    // Calculate floor insulation U-value if floor is insulated
    let floorUValue;
    if (data.floorInsulation) {
      const floorThicknessMm = UnitConverter.convertDistance(data.floorThickness || 2.0, unitSettings.distanceSmall, 'millimeter');
      const floorThicknessM = floorThicknessMm / 1000;
      floorUValue = thermalConductivity / floorThicknessM;
    } else {
      floorUValue = uninsulatedFloorUValue;
    }
    
    // Calculate transmission for each surface type
    const insulatedSurfaceArea = wallArea + ceilingArea;
    const insulatedTransmission = insulatedSurfaceArea * insulatedUValue * tempDifference;
    const floorTransmission = floorArea * floorUValue * tempDifference;
    
    const transmissionLosses = insulatedTransmission + floorTransmission;

    // VENTILATION LOSSES (W) - FIXED: SIMPLIFIED AND ACCURATE
    const roomVolume = lengthM * widthM * heightM;
    
    let airChangesPerHour = 0.5; // Default moderate
    if (data.ventilationLossFactor === 'light') airChangesPerHour = 0.25;
    if (data.ventilationLossFactor === 'high') airChangesPerHour = 0.75;
    
    const airDensity = 1.2; // kg/m³
    const specificHeatAir = 1.02; // kJ/kg·K
    
    const ventilationLosses = (roomVolume * airChangesPerHour * airDensity * specificHeatAir * tempDifference * 1000) / 3600;

    // DOOR OPENING LOSSES (W) - FIXED: ENSURE CORRECT CALCULATION
    const doorOpenings = data.doorOpenings; // Remove fallback to ensure we use actual value
    const doorArea = data.doorSize; // Remove fallback to ensure we use actual value
    
    const doorOpeningsPerHour = doorOpenings / 24;
    const doorOpeningLosses = doorArea * doorOpeningsPerHour * 10 * tempDifference;

    // PRODUCT COOLING LOAD (W) - FIXED: SIMPLIFIED AND ACCURATE
    const product = products.find((p) => p.id === data.product);
    const specificHeat = product?.specificHeat || 3.0;
    const tempDrop = Math.abs(enteringTempC - roomTempC);
    
    const stockShiftKg = UnitConverter.convertWeight(data.stockShift, unitSettings.weight, 'kg');
    
    const coolingDown = (stockShiftKg * specificHeat * tempDrop * 1000) / (data.coolDownTime * 3600);

    // RESPIRATION HEAT (W) - FIXED: CORRECT CALCULATION FOR BUTTER
    const storageQuantityKg = UnitConverter.convertWeight(data.storageQuantity, unitSettings.weight, 'kg');
    let respirationHeat = 0;
    
    if (product && product.respirationHeat > 0) {
      const referenceTemp = 0; // °C
      const tempFactor = Math.pow(2, (roomTempC - referenceTemp) / 10);
      const storageQuantityTonnes = storageQuantityKg / 1000;
      respirationHeat = storageQuantityTonnes * product.respirationHeat * tempFactor * 1000;
      
      if (data.roomUsageType === 'storage') {
        respirationHeat *= 0.7;
      }
    }

    // OTHER HEAT SOURCES (W) - FIXED: CORRECT CALCULATION
    const roomAreaM2 = lengthM * widthM;
    
    // FIXED: More conservative and accurate heat load calculations
    const coolerFansLoad = (data.coolerFans * 1000) * (data.coolerFansWorkingTime / 24);
    const illuminationLoad = data.illumination * roomAreaM2 * (data.illuminationWorkingTime / 24);
    const personsLoad = data.persons * 120 * (data.personsWorkingTime / 24);
    const otherEquipmentLoad = (data.otherHeatSources * 1000) * (data.otherHeatSourcesWorkingTime / 24);
    
    const otherHeatSources = coolerFansLoad + illuminationLoad + personsLoad + otherEquipmentLoad;

    // CALCULATE TOTALS - FIXED: PROPER CALCULATION
    const subtotal = transmissionLosses + ventilationLosses + doorOpeningLosses + 
                    otherHeatSources + coolingDown + respirationHeat;
    
    const safetyFactor = 1.15;
    const requiredCapacity = subtotal * safetyFactor / 1000;
    
    const totalSpecificCapacity = requiredCapacity * 1000 / roomVolume; // W/m³ instead of W/m²

    return {
      transmissionLosses,
      ventilationLosses,
      doorOpeningLosses,
      otherHeatSources,
      coolingDown,
      respirationHeat,
      subtotal,
      requiredCapacity,
      totalSpecificCapacity
    };
  }
}