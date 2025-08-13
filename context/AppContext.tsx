import React, { createContext, useState, ReactNode } from 'react';
import { RoomData, UnitSettings } from '@/types';

interface AppContextType {
  roomData: RoomData;
  setRoomData: React.Dispatch<React.SetStateAction<RoomData>>;
  unitSettings: UnitSettings;
  setUnitSettings: React.Dispatch<React.SetStateAction<UnitSettings>>;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [roomData, setRoomData] = useState<RoomData>({
    roomTemperature: 2.00,
    outsideTemperature: 25.00,
    ventilationLossFactor: 'moderate',
    runningTime: 24,
    loadingPercentage: 80,
    length: 16.40,
    width: 16.40,
    height: 9.84,
    insulationMaterial: 'polystyrene',
    thickness: 5.91,
    floorInsulation: false,
    floorThickness: 2.0,
    product: 'dairy-butter',
    storageQuantity: 15000.00,
    stockShift: 1500.00,
    enteringTemperature: 8.00,
    coolDownTime: 6,
    coolerFans: 2.50, // Changed from 250.00 to 2.5 kW (more realistic)
    coolerFansWorkingTime: 20,
    illumination: 15.00,
    illuminationWorkingTime: 8,
    persons: 2,
    personsWorkingTime: 8,
    otherHeatSources: 2.30, // Changed from 230.00 to 2.3 kW (more realistic)
    otherHeatSourcesWorkingTime: 8, // Changed from 0 to 8 hours (more realistic)
    // New enhanced fields with defaults
    doorOpenings: 20,
    doorSize: 4.0,
    roomUsageType: 'storage',
    altitudeCorrection: 0,
    // Storage configuration fields
    storageType: 'palletized',
    aisleWidth: 1.2,
    ceilingClearance: 0.5,
  });

  const [unitSettings, setUnitSettings] = useState<UnitSettings>({
    temperature: 'celsius',
    power: 'kw',
    distanceSmall: 'inch',
    distanceLarge: 'foot',
    weight: 'kg',
    system: 'si',
  });

  return (
    <AppContext.Provider value={{
      roomData,
      setRoomData,
      unitSettings,
      setUnitSettings,
    }}>
      {children}
    </AppContext.Provider>
  );
}