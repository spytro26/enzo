// Product validation script
const { products } = require('./data/products.ts');

console.log('=== PRODUCT DATABASE VALIDATION ===\n');

console.log(`Total products: ${products.length}`);

// Group by category
const categories = {};
products.forEach(product => {
  if (!categories[product.category]) {
    categories[product.category] = [];
  }
  categories[product.category].push(product.name);
});

console.log('\n=== PRODUCTS BY CATEGORY ===');
Object.keys(categories).sort().forEach(category => {
  console.log(`\n${category.toUpperCase()} (${categories[category].length} items):`);
  categories[category].sort().forEach(name => {
    console.log(`  • ${name}`);
  });
});

// Validation checks
console.log('\n=== VALIDATION CHECKS ===');

const errors = [];
const warnings = [];

products.forEach(product => {
  // Check required fields
  if (!product.id || !product.name || !product.category) {
    errors.push(`${product.name || 'Unknown'}: Missing required fields`);
  }
  
  // Check numeric ranges
  if (product.density < 50 || product.density > 2000) {
    warnings.push(`${product.name}: Unusual density (${product.density} kg/m³)`);
  }
  
  if (product.recommendedTemp < -50 || product.recommendedTemp > 25) {
    warnings.push(`${product.name}: Unusual temperature (${product.recommendedTemp}°C)`);
  }
  
  if (product.specificHeat < 1 || product.specificHeat > 5) {
    warnings.push(`${product.name}: Unusual specific heat (${product.specificHeat} kJ/kg·K)`);
  }
  
  if (product.respirationHeat < 0 || product.respirationHeat > 0.1) {
    warnings.push(`${product.name}: Unusual respiration heat (${product.respirationHeat} W/kg)`);
  }
  
  // Check storage parameters
  if (product.stackingHeight && (product.stackingHeight < 0.5 || product.stackingHeight > 5)) {
    warnings.push(`${product.name}: Unusual stacking height (${product.stackingHeight}m)`);
  }
  
  if (product.packagingFactor && (product.packagingFactor < 0.4 || product.packagingFactor > 0.95)) {
    warnings.push(`${product.name}: Unusual packaging factor (${product.packagingFactor})`);
  }
});

if (errors.length === 0) {
  console.log('✅ No validation errors found');
} else {
  console.log(`❌ ${errors.length} validation errors:`);
  errors.forEach(error => console.log(`  • ${error}`));
}

if (warnings.length === 0) {
  console.log('✅ No validation warnings');
} else {
  console.log(`⚠️  ${warnings.length} validation warnings:`);
  warnings.forEach(warning => console.log(`  • ${warning}`));
}

// Show temperature ranges
console.log('\n=== TEMPERATURE REQUIREMENTS ===');
const tempRanges = {
  frozen: products.filter(p => p.recommendedTemp < -10),
  chilled: products.filter(p => p.recommendedTemp >= -10 && p.recommendedTemp <= 5),
  controlled: products.filter(p => p.recommendedTemp > 5 && p.recommendedTemp <= 15),
  ambient: products.filter(p => p.recommendedTemp > 15)
};

Object.keys(tempRanges).forEach(range => {
  console.log(`${range.toUpperCase()}: ${tempRanges[range].length} products`);
  if (tempRanges[range].length > 0) {
    tempRanges[range].forEach(p => {
      console.log(`  • ${p.name}: ${p.recommendedTemp}°C`);
    });
  }
});

console.log('\n=== STORAGE METHODS ===');
const storageMethods = {};
products.forEach(product => {
  const method = product.storageMethod || 'unknown';
  if (!storageMethods[method]) {
    storageMethods[method] = [];
  }
  storageMethods[method].push(product.name);
});

Object.keys(storageMethods).forEach(method => {
  console.log(`${method.toUpperCase()}: ${storageMethods[method].length} products`);
});

console.log('\n=== SUMMARY ===');
console.log(`Total products: ${products.length}`);
console.log(`Categories: ${Object.keys(categories).length}`);
console.log(`Storage methods: ${Object.keys(storageMethods).length}`);
console.log(`Temperature range: ${Math.min(...products.map(p => p.recommendedTemp))}°C to ${Math.max(...products.map(p => p.recommendedTemp))}°C`);
console.log('✅ Product database validation complete!\n');
