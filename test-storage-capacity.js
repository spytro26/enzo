// Quick test to verify improved storage capacity calculations
const { products, insulationMaterials } = require('./data/products.ts');

// Mock UnitConverter for testing
const UnitConverter = {
  convertDistance: (value, from, to) => {
    if (from === 'foot' && to === 'meter') return value * 0.3048;
    if (from === 'meter' && to === 'meter') return value;
    if (from === 'millimeter' && to === 'millimeter') return value;
    return value;
  },
  convertWeight: (value, from, to) => {
    if (from === 'kg' && to === 'kg') return value;
    return value;
  }
};

// Storage capacity calculation function (copied from calculations.ts)
function calculateMaxStorageCapacity(roomData, unitSettings) {
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

// Test data
const testRoomData = {
  length: 16.4,  // meters
  width: 16.4,   // meters  
  height: 9.84,  // meters
  product: 'dairy-butter',
  aisleWidth: 1.2,
  ceilingClearance: 0.5,
  storageType: 'palletized'
};

const testUnitSettings = {
  distanceLarge: 'meter',
  weight: 'kg'
};

// Test different products
const testProducts = ['dairy-butter', 'fruits-apple', 'meat-beef', 'vegetables-potatoes'];

console.log('=== STORAGE CAPACITY COMPARISON ===');
console.log('Room dimensions: 16.4m x 16.4m x 9.84m');
console.log('Room volume:', testRoomData.length * testRoomData.width * testRoomData.height, 'm³');
console.log('');

testProducts.forEach(productId => {
  const roomData = { ...testRoomData, product: productId };
  const product = products.find(p => p.id === productId);
  
  if (product) {
    const oldCapacity = (testRoomData.length * testRoomData.width * testRoomData.height) * product.density * 0.65;
    const newCapacity = calculateMaxStorageCapacity(roomData, testUnitSettings);
    
    console.log(`${product.name}:`);
    console.log(`  Density: ${product.density} kg/m³`);
    console.log(`  Storage method: ${product.storageMethod}`);
    console.log(`  Packaging factor: ${product.packagingFactor}`);
    console.log(`  Stacking height: ${product.stackingHeight}m`);
    console.log(`  Old capacity (65% efficiency): ${Math.round(oldCapacity).toLocaleString()} kg`);
    console.log(`  New capacity (enhanced): ${Math.round(newCapacity).toLocaleString()} kg`);
    console.log(`  Improvement: ${((newCapacity - oldCapacity) / oldCapacity * 100).toFixed(1)}%`);
    console.log('');
  }
});
