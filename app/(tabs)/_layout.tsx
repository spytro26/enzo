import { Tabs } from 'expo-router';
import { TabIcon } from '@/components/TabIcon';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1e40af',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#93c5fd',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'General',
          tabBarIcon: ({ size, color }) => (
            <TabIcon name="General" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dimensions"
        options={{
          title: 'Dimensions',
          tabBarIcon: ({ size, color }) => (
            <TabIcon name="Dimensions" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="heat"
        options={{
          title: 'Heat',
          tabBarIcon: ({ size, color }) => (
            <TabIcon name="Heat" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="product"
        options={{
          title: 'Product',
          tabBarIcon: ({ size, color }) => (
            <TabIcon name="Product" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calculate"
        options={{
          title: 'Calculate',
          tabBarIcon: ({ size, color }) => (
            <TabIcon name="Calculate" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <TabIcon name="Settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}