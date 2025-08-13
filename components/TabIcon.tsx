import React from 'react';
import { 
  FileText, 
  Ruler, 
  Thermometer, 
  Package, 
  Calculator, 
  Settings 
} from 'lucide-react-native';

interface TabIconProps {
  name: string;
  color: string;
  size: number;
}

export function TabIcon({ name, color, size }: TabIconProps) {
  switch (name) {
    case 'General':
      return <FileText size={size} color={color} />;
    case 'Dimensions':
      return <Ruler size={size} color={color} />;
    case 'Heat':
      return <Thermometer size={size} color={color} />;
    case 'Product':
      return <Package size={size} color={color} />;
    case 'Calculate':
      return <Calculator size={size} color={color} />;
    case 'Settings':
      return <Settings size={size} color={color} />;
    default:
      return <FileText size={size} color={color} />;
  }
}