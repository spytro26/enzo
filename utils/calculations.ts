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
    
    const roomVolume = lengthM * widthM * heightM;
    
    // Enhanced storage capacity calculation based on product-specific factors
    let usableHeight = heightM;
    let storageEfficiency = product.packagingFactor || 0.65; // Use product-specific packaging factor
    
    // Apply stacking height limitations
    if (product.stackingHeight && product.stackingHeight < heightM) {
      usableHeight = product.stackingHeight;
    }
    
    // Apply ceiling clearance (minimum 0.5m from ceiling for air circulation)
    const ceilingClearance = roomData.ceilingClearance || 0.5;
    usableHeight = Math.max(0, usableHeight - ceilingClearance);
    
    // Storage method adjustments
    switch (product.storageMethod) {
      case 'palletized':
        // Standard pallet dimensions (1.2m x 1.0m) with aisle requirements
        const aisleWidth = roomData.aisleWidth || 1.2; // Default aisle width
        const palletArea = 1.2; // Standard pallet footprint
        const totalAisleArea = (Math.floor(lengthM / (palletArea + aisleWidth)) * aisleWidth * widthM);
        const availableFloorArea = (lengthM * widthM) - totalAisleArea;
        storageEfficiency *= (availableFloorArea / (lengthM * widthM)) * 0.95; // 95% pallet efficiency
        break;
        
      case 'shelved':
        // Shelving requires more aisle space and has height limitations
        storageEfficiency *= 0.8; // Reduced efficiency due to shelving structure
        break;
        
      case 'bulk':
        // Bulk storage can use more space but needs sloping for access
        storageEfficiency *= 0.9; // High efficiency but some access requirements
        break;
        
      case 'hanging':
        // Hanging systems (meat rails) use different space calculations
        const railSpacing = 0.6; // meters between rails
        const railLength = Math.max(lengthM, widthM);
        const numberOfRails = Math.floor(Math.min(lengthM, widthM) / railSpacing);
        const hangingCapacity = numberOfRails * railLength * (product.density / 10); // Estimate for hanging
        const maxCapacity = hangingCapacity * (usableHeight / heightM);
        return UnitConverter.convertWeight(maxCapacity, 'kg', unitSettings.weight);
        
      default:
        // Use basic efficiency factor
        break;
    }
    
    // Calculate final capacity considering all factors
    const usableVolume = lengthM * widthM * usableHeight;
    const maxCapacity = usableVolume * product.density * storageEfficiency;
    
    // Convert result to display units
    return UnitConverter.convertWeight(maxCapacity, 'kg', unitSettings.weight);
  }

  static calculateCoolingLoad(data: RoomData, unitSettings: any): CalculationResult {
    // Convert all inputs to SI units for calculation
    const lengthM = UnitConverter.convertDistance(data.length, unitSettings.distanceLarge, 'meter');
    const widthM = UnitConverter.convertDistance(data.width, unitSettings.distanceLarge, 'meter');
    const heightM = UnitConverter.convertDistance(data.height, unitSettings.distanceLarge, 'meter');
    const thicknessM = UnitConverter.convertDistance(data.thickness, unitSettings.distanceSmall, 'millimeter') / 1000;
    const floorThicknessM = UnitConverter.convertDistance(data.floorThickness, unitSettings.distanceSmall, 'millimeter') / 1000;
    
    // Get insulation material properties
    const insulationMaterial = insulationMaterials.find(
      (mat) => mat.value === data.insulationMaterial
    );
    const thermalConductivity = insulationMaterial?.thermalConductivity || 0.035;

    // Calculate room surface areas in m²
    const wallArea = 2 * (lengthM * heightM + widthM * heightM);
    const ceilingArea = lengthM * widthM;
    const floorArea = data.floorInsulation ? lengthM * widthM : 0;

    // Convert temperatures to Celsius for calculation
    const roomTempC = UnitConverter.convertTemperature(data.roomTemperature, unitSettings.temperature, 'celsius');
    const outsideTempC = UnitConverter.convertTemperature(data.outsideTemperature, unitSettings.temperature, 'celsius');
    const enteringTempC = UnitConverter.convertTemperature(data.enteringTemperature, unitSettings.temperature, 'celsius');
    
    const tempDifference = outsideTempC - roomTempC;

    // Transmission losses (W) - Improved with thermal bridges and surface coefficients
    // Add thermal bridge factor for real-world conditions
    const thermalBridgeFactor = 1.15; // 15% increase due to thermal bridges
    
    // Surface heat transfer coefficients (W/m²·K)
    const exteriorCoefficient = 25; // Typical exterior surface coefficient
    const interiorCoefficient = 8.7; // Typical interior surface coefficient
    
    // Calculate total thermal resistance including surface resistances
    const wallResistance = (1/exteriorCoefficient) + (thicknessM/thermalConductivity) + (1/interiorCoefficient);
    const ceilingResistance = (1/exteriorCoefficient) + (thicknessM/thermalConductivity) + (1/interiorCoefficient);
    const floorResistance = data.floorInsulation ? 
      (1/exteriorCoefficient) + (floorThicknessM/thermalConductivity) + (1/interiorCoefficient) : 
      0.1; // Minimal resistance for uninsulated floor
    
    const wallUValue = (1 / wallResistance) * thermalBridgeFactor;
    const ceilingUValue = (1 / ceilingResistance) * thermalBridgeFactor;
    const floorUValue = data.floorInsulation ? (1 / floorResistance) * thermalBridgeFactor : 10; // High U-value for uninsulated
    
    const wallTransmission = wallArea * wallUValue * tempDifference;
    const ceilingTransmission = ceilingArea * ceilingUValue * tempDifference;
    const floorTransmission = floorArea * floorUValue * tempDifference;
    
    const transmissionLosses = wallTransmission + ceilingTransmission + floorTransmission;

    // Ventilation and infiltration losses (W) - Enhanced calculation
    const roomVolume = lengthM * widthM * heightM;
    
    // Base air changes per hour based on room usage - More accurate values
    let airChangesPerHour = 0.5; // Default moderate
    if (data.ventilationLossFactor === 'light') airChangesPerHour = 0.25;
    if (data.ventilationLossFactor === 'high') airChangesPerHour = 0.75;
    
    // Add infiltration air changes (additional uncontrolled air leakage) - More realistic
    const infiltrationRate = 0.10; // Reduced from 0.15 for better construction
    const totalAirChanges = airChangesPerHour + infiltrationRate;
    
    // Air properties at average temperature - More accurate calculations
    const avgTemp = (roomTempC + outsideTempC) / 2;
    const airDensity = 1.293 * (273.15 / (273.15 + avgTemp)); // More accurate density formula
    const specificHeatAir = 1.006; // kJ/kg·K
    
    // More accurate latent heat calculation
    const latentHeatFactor = 1.20; // Reduced from 1.25, more realistic
    
    // Convert to Watts properly - Fix unit conversion
    const ventilationLosses = (roomVolume / 3600) * totalAirChanges * airDensity * specificHeatAir * 1000 * tempDifference * latentHeatFactor;

    // Door opening losses (W) - Enhanced and more accurate calculation
    const doorOpenings = data.doorOpenings || 20; // Default 20 openings per day
    const doorArea = data.doorSize || 4.0; // Default 2m x 2m door
    
    // More accurate door opening heat load calculation
    // Based on air exchange during door opening and infiltration
    const doorOpenTimePerOpening = 30; // seconds per opening (typical)
    const airVelocityThroughDoor = 1.5; // m/s typical velocity
    const doorVolumePerOpening = doorArea * airVelocityThroughDoor * doorOpenTimePerOpening;
    const doorAirDensity = 1.293 * (273.15 / (273.15 + outsideTempC));
    
    // Heat load per opening including sensible and latent heat
    const doorOpeningHeatPerOpening = doorVolumePerOpening * doorAirDensity * specificHeatAir * 1000 * tempDifference * 1.15; // 15% for latent heat
    const doorOpeningLosses = (doorOpenings * doorOpeningHeatPerOpening) / (24 * 3600); // Average power over 24 hours in Watts

    // Product cooling load (W) - Enhanced and more accurate calculation
    const product = products.find((p) => p.id === data.product);
    const specificHeat = product?.specificHeat || 3.0;
    const tempDrop = Math.abs(enteringTempC - roomTempC); // Use absolute value for safety
    
    // Convert stock shift to kg for calculation
    const stockShiftKg = UnitConverter.convertWeight(data.stockShift, unitSettings.weight, 'kg');
    
    // Account for packaging and container thermal mass (more accurate values)
    let packagingFactor = 1.0; // Base factor
    switch (product?.storageMethod) {
      case 'palletized':
        packagingFactor = 1.08; // 8% for pallets and packaging
        break;
      case 'shelved':
        packagingFactor = 1.05; // 5% for minimal packaging
        break;
      case 'bulk':
        packagingFactor = 1.03; // 3% for minimal containers
        break;
      case 'hanging':
        packagingFactor = 1.02; // 2% for hooks and minimal packaging
        break;
      default:
        packagingFactor = 1.05;
    }
    
    // More accurate cooling down calculation
    const coolingDown = (stockShiftKg * specificHeat * tempDrop * 1000 * packagingFactor) / (data.coolDownTime * 3600);

    // Respiration heat (W) - Enhanced with temperature dependency
    const storageQuantityKg = UnitConverter.convertWeight(data.storageQuantity, unitSettings.weight, 'kg');
    let respirationHeat = 0;
    
    if (product && product.respirationHeat > 0) {
      // Temperature factor for respiration (Q10 rule: doubles every 10°C)
      const referenceTemp = 0; // °C - reference temperature for respiration data
      const tempFactor = Math.pow(2, (roomTempC - referenceTemp) / 10);
      
      // Calculate respiration heat with temperature correction
      respirationHeat = storageQuantityKg * product.respirationHeat * tempFactor * 1000; // Convert to W
      
      // Apply storage conditions factor (CA storage reduces respiration)
      if (data.roomUsageType === 'storage') {
        respirationHeat *= 0.7; // 30% reduction for controlled atmosphere
      }
    }

    // Defrost heat load (W) - NEW CALCULATION
    // Defrost cycles typically add 10-15% of the base cooling load for frozen storage
    const isFreezingApplication = roomTempC < 0;
    const defrostFactor = isFreezingApplication ? 0.12 : 0; // 12% for freezing applications
    const baseLoad = transmissionLosses + ventilationLosses + doorOpeningLosses;
    const defrostLoad = baseLoad * defrostFactor;

    // Other heat sources (W) - FIXED calculations with proper unit handling
    // Convert power inputs to watts - FIX: Handle units correctly
    let coolerFansWatts = 0;
    let otherHeatSourcesWatts = 0;
    
    // Fix cooler fans calculation - input might be in W, not kW
    if (data.coolerFans > 0) {
      if (data.coolerFans > 1000) {
        // If value is > 1000, assume it's already in Watts
        coolerFansWatts = data.coolerFans;
      } else {
        // If value is < 1000, assume it's in kW and convert
        coolerFansWatts = UnitConverter.convertPower(data.coolerFans, unitSettings.power, 'kw') * 1000;
      }
    }
    
    // Fix other heat sources calculation
    if (data.otherHeatSources > 0) {
      if (data.otherHeatSources > 1000) {
        // If value is > 1000, assume it's already in Watts
        otherHeatSourcesWatts = data.otherHeatSources;
      } else {
        // If value is < 1000, assume it's in kW and convert
        otherHeatSourcesWatts = UnitConverter.convertPower(data.otherHeatSources, unitSettings.power, 'kw') * 1000;
      }
    }
    
    // Calculate individual heat loads with proper time factors
    const coolerFansLoad = coolerFansWatts * (data.coolerFansWorkingTime / 24);
    const roomAreaM2 = lengthM * widthM;
    const illuminationLoad = data.illumination * roomAreaM2 * (data.illuminationWorkingTime / 24);
    const personsLoad = data.persons * 150 * (data.personsWorkingTime / 24); // 150W per person is accurate
    const otherLoad = otherHeatSourcesWatts * (data.otherHeatSourcesWorkingTime / 24);
    
    const otherHeatSources = coolerFansLoad + illuminationLoad + personsLoad + otherLoad + defrostLoad;

    // Calculate totals with improved and more accurate safety factors
    const loadingFactor = data.loadingPercentage / 100;
    
    // Apply loading factor to appropriate loads (only to building-related loads)
    const adjustedTransmissionLosses = transmissionLosses * loadingFactor;
    const adjustedVentilationLosses = ventilationLosses * loadingFactor;
    const adjustedDoorLosses = doorOpeningLosses * loadingFactor;
    
    const subtotal = adjustedTransmissionLosses + adjustedVentilationLosses + adjustedDoorLosses + 
                    otherHeatSources + coolingDown + respirationHeat;
    
    // More accurate safety factor based on application and uncertainty
    const roomArea = lengthM * widthM;
    let safetyFactor = 1.10; // Reduced base safety factor for better accuracy
    
    // Size-based adjustments
    if (roomArea < 25) safetyFactor = 1.20; // Small rooms have more variability
    else if (roomArea < 100) safetyFactor = 1.15; // Medium rooms
    else if (roomArea > 500) safetyFactor = 1.05; // Large rooms are more predictable
    
    // Usage-based adjustments
    if (data.roomUsageType === 'processing') safetyFactor += 0.10; // Processing adds uncertainty
    if (data.roomUsageType === 'loading') safetyFactor += 0.05; // Loading adds some uncertainty
    
    // Product-based adjustments
    if (product?.respirationHeat && product.respirationHeat > 0.005) safetyFactor += 0.05; // High respiration products
    
    // Climate-based adjustments
    if (tempDifference > 35) safetyFactor += 0.05; // High temperature difference
    if (tempDifference < 15) safetyFactor -= 0.02; // Low temperature difference (but minimum safety)
    
    // Ensure safety factor doesn't go below minimum or above maximum
    safetyFactor = Math.max(1.05, Math.min(1.30, safetyFactor));
    
    const requiredCapacity = subtotal * safetyFactor / 1000; // Convert to kW
    
    const totalArea = wallArea + ceilingArea + floorArea;
    const totalSpecificCapacity = requiredCapacity * 1000 / totalArea; // W/m²

    return {
      transmissionLosses: adjustedTransmissionLosses,
      ventilationLosses: adjustedVentilationLosses,
      doorOpeningLosses: adjustedDoorLosses,
      otherHeatSources,
      coolingDown,
      respirationHeat,
      subtotal,
      requiredCapacity,
      totalSpecificCapacity
    };
  }
}