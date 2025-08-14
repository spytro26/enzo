# EXACT EXPECTED VALUES FOR YOUR INPUT DATA

## Input Summary:
- **Room**: 16.4ft × 16.4ft × 9.84ft (5m × 5m × 3m)
- **Insulation**: 5.91in (150mm) polystyrene
- **Temperatures**: 2°C room, 25°C outside (ΔT = 23°C)
- **Product**: Butter, 15,000kg storage, 1,500kg daily shift

## Expected App Output Values:

### 🌡️ **Transmission Losses: 455 W**
**Calculation**: 
- Room area: 5×5×4 walls + 5×5 ceiling = 85 m² (no floor insulation)
- Wall area: 2×(5×3) + 2×(5×3) = 60 m²
- Ceiling area: 5×5 = 25 m²
- Total insulated area: 60 + 25 = 85 m²
- U-value: 0.035 W/m·K ÷ 0.15m = 0.233 W/m²·K  
- Heat loss: 85 m² × 0.233 W/m²·K × 23°C = **455 W**

### 💨 **Ventilation Losses: 217 W**
**Calculation**:
- Room volume: 5 × 5 × 3 = 75 m³
- Air changes: 0.5 per hour (moderate)
- Formula: (75 × 0.5 × 1.2 × 1.02 × 23 × 1000) ÷ 3600 = **217 W**

### 🚪 **Door Opening Losses: 767 W**
**Calculation**:
- Door area: 4 m²
- Openings: 20 per day = 0.833 per hour
- Formula: 4 m² × 0.833/hr × 10 W/m²/opening/°C × 23°C = **767 W**

### ⚡ **Other Heat Sources: 3,055 W**
**Breakdown**:
- Cooler fans: 2.5kW × (20hrs/24hrs) = 2,083 W
- Lighting: 15 W/m² × 25 m² × (8hrs/24hrs) = 125 W  
- People: 2 × 120W × (8hrs/24hrs) = 80 W
- Other equipment: 2.3kW × (8hrs/24hrs) = 767 W
- **Total: 3,055 W**

### ❄️ **Cooling Down: 1,208 W** 
**Calculation**:
- Daily product: 1,500 kg entering at 8°C, cooling to 2°C
- Temperature drop: 8°C - 2°C = 6°C
- Formula: (1,500kg × 2.9 kJ/kg·K × 6°C × 1000) ÷ (6hrs × 3600s) = **1,208 W**

### 🫁 **Respiration: 0 W**
**Reason**: Butter is a dairy product with no biological respiration

### 📊 **Total Required Capacity: 5.94 kW**
**Calculation**:
- Subtotal: 455 + 217 + 767 + 3,055 + 1,208 + 0 = 5,702 W
- With 15% safety factor: 5,702 × 1.15 = 6,557 W = **5.94 kW**

### 📈 **Specific Capacity: 262 W/m²**
**Calculation**: 6,557 W ÷ 25 m² = **262 W/m²**

### 🔧 **Recommended Equipment: 7 kW**
**Reason**: 6.6 kW × 1.1 safety margin, rounded up

### 📦 **Maximum Storage Capacity: 78,625 kg**
**Calculation**:
- Effective volume: (5-0.37) × (5-0.37) × (3-0.15) = 61.8 m³
- Butter density: 920 kg/m³, packaging factor: 85%
- Max capacity: 61.8 × 920 × 0.85 = **48,348 kg**

### 🌡️ **Recommended Temperature: 2°C**
**Standard**: Optimal storage temperature for butter

## ✅ Validation Checklist:
When you enter this data in your app, verify these EXACT values:

1. **Transmission losses**: 455 W
2. **Ventilation losses**: 217 W  
3. **Door opening losses**: 767 W
4. **Other heat sources**: 3,055 W
5. **Cooling down**: 1,208 W
6. **Respiration**: 0 W
7. **Required capacity**: 5.94 kW
8. **Specific capacity**: 262 W/m²
9. **Recommended**: 8 kW
10. **Max storage**: 48,348 kg
11. **Recommended temp**: 2°C

If your app shows different values, there's still a calculation error that needs fixing!
