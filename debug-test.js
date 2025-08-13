// Debug test to check current calculation behavior with different scenarios

console.log("=== DEBUGGING CURRENT CALCULATIONS ===\n");

// Test Case 1: Dairy Product (should have 0 respiration)
console.log("TEST 1: Dairy Product (Butter)");
console.log("Expected: Respiration = 0W");
console.log("Reason: Non-living product\n");

// Test Case 2: Living Product (should have respiration)
console.log("TEST 2: Living Product (Apples)");
console.log("Expected: Respiration > 0W");
console.log("Calculation: 15,000kg × 0.004 kW/tonne/°C × temp_factor × 1000");
console.log("At 2°C: temp_factor = 2^(2/10) = 1.149");
console.log("Result: 15 × 0.004 × 1.149 × 1000 = 68.9W");
console.log("With storage reduction: 68.9W × 0.7 = 48.2W\n");

// Test Case 3: Check unit handling
console.log("TEST 3: Unit Handling Check");
console.log("Input: 2.5 (cooler fans)");
console.log("Logic: if (2.5 > 1000) → NO, so treat as kW");
console.log("Conversion: 2.5 kW × 1000 = 2500W");
console.log("With time factor: 2500W × (20h/24h) = 2083W");
console.log();

console.log("Input: 2500 (cooler fans)");
console.log("Logic: if (2500 > 1000) → YES, so treat as W");
console.log("Conversion: 2500W (no conversion)");
console.log("With time factor: 2500W × (20h/24h) = 2083W");
console.log();

// Test Case 4: Check if there are any edge cases
console.log("POTENTIAL ISSUES TO CHECK:");
console.log("1. Are you selecting the right product type?");
console.log("2. Is the storage quantity realistic (not 0)?");
console.log("3. Are the input units consistent?");
console.log("4. Is the room temperature reasonable?");
console.log();

console.log("PRODUCTS WITH RESPIRATION HEAT:");
console.log("✅ Apples: 0.004 kW/tonne/°C");
console.log("✅ Bananas: 0.012 kW/tonne/°C");
console.log("✅ Vegetables: 0.001-0.015 kW/tonne/°C");
console.log();

console.log("PRODUCTS WITH NO RESPIRATION:");
console.log("❌ All Dairy Products: 0");
console.log("❌ All Meat Products: 0"); 
console.log("❌ All Fish Products: 0");
console.log("❌ All Processed Foods: 0");
