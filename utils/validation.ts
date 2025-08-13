export interface ValidationError {
  field: string;
  message: string;
}

export class ValidationHelper {
  static validateNumber(value: number, fieldName: string, min?: number, max?: number): ValidationError | null {
    if (isNaN(value)) {
      return { field: fieldName, message: `${fieldName} must be a valid number` };
    }
    
    if (min !== undefined && value < min) {
      return { field: fieldName, message: `${fieldName} must be at least ${min}` };
    }
    
    if (max !== undefined && value > max) {
      return { field: fieldName, message: `${fieldName} must not exceed ${max}` };
    }
    
    return null;
  }

  static validateDimensions(length: number, width: number, height: number): ValidationError[] {
    const errors: ValidationError[] = [];
    
    const lengthError = this.validateNumber(length, 'Length', 0.1, 100);
    if (lengthError) errors.push(lengthError);
    
    const widthError = this.validateNumber(width, 'Width', 0.1, 100);
    if (widthError) errors.push(widthError);
    
    const heightError = this.validateNumber(height, 'Height', 0.1, 50);
    if (heightError) errors.push(heightError);
    
    return errors;
  }

  static validateTemperatures(roomTemp: number, outsideTemp: number, enteringTemp: number): ValidationError[] {
    const errors: ValidationError[] = [];
    
    const roomTempError = this.validateNumber(roomTemp, 'Room temperature', -50, 50);
    if (roomTempError) errors.push(roomTempError);
    
    const outsideTempError = this.validateNumber(outsideTemp, 'Outside temperature', -50, 70);
    if (outsideTempError) errors.push(outsideTempError);
    
    const enteringTempError = this.validateNumber(enteringTemp, 'Entering temperature', -50, 70);
    if (enteringTempError) errors.push(enteringTempError);
    
    // Logical validation
    if (!isNaN(roomTemp) && !isNaN(outsideTemp) && outsideTemp <= roomTemp) {
      errors.push({ 
        field: 'temperatures', 
        message: 'Outside temperature must be higher than room temperature' 
      });
    }
    
    if (!isNaN(roomTemp) && !isNaN(enteringTemp) && enteringTemp <= roomTemp) {
      errors.push({ 
        field: 'temperatures', 
        message: 'Entering temperature must be higher than room temperature' 
      });
    }
    
    return errors;
  }

  static validateInsulation(thickness: number, floorThickness?: number): ValidationError[] {
    const errors: ValidationError[] = [];
    
    const thicknessError = this.validateNumber(thickness, 'Insulation thickness', 0.5, 50);
    if (thicknessError) errors.push(thicknessError);
    
    if (floorThickness !== undefined) {
      const floorThicknessError = this.validateNumber(floorThickness, 'Floor insulation thickness', 0.5, 50);
      if (floorThicknessError) errors.push(floorThicknessError);
    }
    
    return errors;
  }

  static validateWorkingHours(hours: number, fieldName: string): ValidationError | null {
    const error = this.validateNumber(hours, fieldName, 0, 24);
    return error;
  }

  static validateDoorParameters(doorOpenings: number, doorSize: number): ValidationError[] {
    const errors: ValidationError[] = [];
    
    const openingsError = this.validateNumber(doorOpenings, 'Door openings per day', 0, 500);
    if (openingsError) errors.push(openingsError);
    
    const sizeError = this.validateNumber(doorSize, 'Door size', 0.5, 50);
    if (sizeError) errors.push(sizeError);
    
    return errors;
  }

  static validateQuantities(storageQuantity: number, stockShift: number): ValidationError[] {
    const errors: ValidationError[] = [];
    
    const storageError = this.validateNumber(storageQuantity, 'Storage quantity', 0, 1000000);
    if (storageError) errors.push(storageError);
    
    const shiftError = this.validateNumber(stockShift, 'Stock shift', 0, 100000);
    if (shiftError) errors.push(shiftError);
    
    // Logical validation
    if (!isNaN(storageQuantity) && !isNaN(stockShift) && stockShift > storageQuantity) {
      errors.push({ 
        field: 'quantities', 
        message: 'Stock shift cannot exceed storage quantity' 
      });
    }
    
    return errors;
  }

  static sanitizeInput(value: string): number {
    const cleaned = value.replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
}
