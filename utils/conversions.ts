export class UnitConverter {
  // Temperature conversions
  static celsiusToFahrenheit(celsius: number): number {
    return (celsius * 9/5) + 32;
  }

  static fahrenheitToCelsius(fahrenheit: number): number {
    return (fahrenheit - 32) * 5/9;
  }

  static celsiusToKelvin(celsius: number): number {
    return celsius + 273.15;
  }

  static kelvinToCelsius(kelvin: number): number {
    return kelvin - 273.15;
  }

  // Power conversions (all to kW)
  static btuToKw(btu: number): number {
    return btu * 0.293071;
  }

  static rToKw(r: number): number {
    return r * 3.516853;
  }

  static kcalToKw(kcal: number): number {
    return kcal * 1.163;
  }

  static horsepowerToKw(hp: number): number {
    return hp * 0.745699;
  }

  // Distance conversions
  static inchToMm(inch: number): number {
    return inch * 25.4;
  }

  static mmToInch(mm: number): number {
    return mm / 25.4;
  }

  static footToMeter(foot: number): number {
    return foot * 0.3048;
  }

  static meterToFoot(meter: number): number {
    return meter / 0.3048;
  }

  // Weight conversions
  static kgToPound(kg: number): number {
    return kg * 2.20462;
  }

  static poundToKg(pound: number): number {
    return pound / 2.20462;
  }

  // Convert temperature based on unit setting
  static convertTemperature(value: number, from: string, to: string): number {
    if (from === to) return value;
    
    // Convert to Celsius first
    let celsius = value;
    if (from === 'fahrenheit') {
      celsius = this.fahrenheitToCelsius(value);
    } else if (from === 'kelvin') {
      celsius = this.kelvinToCelsius(value);
    }

    // Convert from Celsius to target unit
    if (to === 'fahrenheit') {
      return this.celsiusToFahrenheit(celsius);
    } else if (to === 'kelvin') {
      return this.celsiusToKelvin(celsius);
    }
    
    return celsius;
  }

  // Convert power based on unit setting - Enhanced for better accuracy
  static convertPower(value: number, from: string, to: string): number {
    if (from === to) return value;
    
    // Convert to kW first
    let kw = value;
    if (from === 'btu') {
      kw = this.btuToKw(value);
    } else if (from === 'r') {
      kw = this.rToKw(value);
    } else if (from === 'kcal') {
      kw = this.kcalToKw(value);
    } else if (from === 'horsepower') {
      kw = this.horsepowerToKw(value);
    } else if (from === 'w' || from === 'watt') {
      kw = value / 1000; // Convert watts to kW
    }

    // Convert from kW to target unit
    if (to === 'btu') {
      return kw / 0.293071;
    } else if (to === 'r') {
      return kw / 3.516853;
    } else if (to === 'kcal') {
      return kw / 1.163;
    } else if (to === 'horsepower') {
      return kw / 0.745699;
    } else if (to === 'w' || to === 'watt') {
      return kw * 1000; // Convert kW to watts
    }
    
    return kw;
  }

  // Convert weight based on unit setting
  static convertWeight(value: number, from: string, to: string): number {
    if (from === to) return value;
    
    // Convert to kg first
    let kg = value;
    if (from === 'pound') {
      kg = this.poundToKg(value);
    }

    // Convert from kg to target unit
    if (to === 'pound') {
      return this.kgToPound(kg);
    }
    
    return kg;
  }

  // Convert distance based on unit setting
  static convertDistance(value: number, from: string, to: string): number {
    if (from === to) return value;
    
    // For large distances (meter/foot)
    if ((from === 'meter' || from === 'foot') && (to === 'meter' || to === 'foot')) {
      if (from === 'foot' && to === 'meter') {
        return this.footToMeter(value);
      } else if (from === 'meter' && to === 'foot') {
        return this.meterToFoot(value);
      }
    }
    
    // For small distances (mm/inch)
    if ((from === 'millimeter' || from === 'inch') && (to === 'millimeter' || to === 'inch')) {
      if (from === 'inch' && to === 'millimeter') {
        return this.inchToMm(value);
      } else if (from === 'millimeter' && to === 'inch') {
        return this.mmToInch(value);
      }
    }
    
    return value;
  }
}