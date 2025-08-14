export interface Product {
  id: string;
  name: string;
  category: 'dairy' | 'meat' | 'fish' | 'fruits' | 'vegetables' | 'beverages' | 'bakery' | 'confectionery' | 'floral' | 'frozen';
  density: number; // kg/m³
  recommendedTemp: number; // in Celsius
  specificHeat: number; // kJ/kg·K
  respirationHeat: number; // W/kg
  // New properties for better storage calculation
  stackingHeight?: number; // Maximum safe stacking height in meters
  packagingFactor?: number; // Volume efficiency due to packaging (0.7-0.95)
  storageMethod?: 'bulk' | 'palletized' | 'shelved' | 'hanging';
}

export interface UnitSettings {
  temperature: 'celsius' | 'fahrenheit' | 'kelvin';
  power: 'kw' | 'btu' | 'r' | 'kcal' | 'horsepower';
  distanceSmall: 'inch' | 'millimeter';
  distanceLarge: 'foot' | 'meter';
  weight: 'kg' | 'pound';
  system: 'si' | 'imperial';
}

export interface RoomData {
  roomTemperature: number;
  outsideTemperature: number;
  ventilationLossFactor: 'light' | 'moderate' | 'high';
  runningTime: number;
  loadingPercentage: number;
  length: number;
  width: number;
  height: number;
  insulationMaterial: string;
  thickness: number;
  floorInsulation: boolean;
  floorThickness: number;
  product: string;
  storageQuantity: number;
  stockShift: number;
  enteringTemperature: number;
  coolDownTime: number;
  coolerFans: number;
  coolerFansWorkingTime: number;
  illumination: number;
  illuminationWorkingTime: number;
  persons: number;
  personsWorkingTime: number;
  otherHeatSources: number;
  otherHeatSourcesWorkingTime: number;
  // Enhanced fields for improved calculations - FIXED TYPES
  doorOpenings: number; // Number of door openings per day
  doorSize: number; // Door area in m²
  roomUsageType?: 'storage' | 'processing' | 'loading'; // Usage type affects heat loads
  altitudeCorrection?: number; // Altitude in meters for air density correction
  // Storage configuration fields - FIXED TYPES
  storageType?: 'palletized' | 'shelving' | 'bulk' | 'hanging';
  aisleWidth: number; // Aisle width in user units
  ceilingClearance: number; // Required clearance from ceiling in user units
}

export interface CalculationResult {
  transmissionLosses: number;
  ventilationLosses: number;
  doorOpeningLosses: number;
  otherHeatSources: number;
  coolingDown: number;
  respirationHeat: number;
  subtotal: number;
  requiredCapacity: number;
  totalSpecificCapacity: number;
}