import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PlaceholderScreen from '../views/PlaceholderScreen';
import { colors } from '../config/theme';

const Tab = createBottomTabNavigator();

// Administrador → Usuarios · Establecimientos · Publicaciones · Monitoreo (CLAUDE.md 6.3).
export default function AdminTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true, tabBarActiveTintColor: colors.primary }}>
      <Tab.Screen name="Usuarios" component={PlaceholderScreen} initialParams={{ title: 'Usuarios' }} />
      <Tab.Screen name="Establecimientos" component={PlaceholderScreen} initialParams={{ title: 'Establecimientos' }} />
      <Tab.Screen name="Publicaciones" component={PlaceholderScreen} initialParams={{ title: 'Publicaciones' }} />
      <Tab.Screen name="Monitoreo" component={PlaceholderScreen} initialParams={{ title: 'Monitoreo' }} />
    </Tab.Navigator>
  );
}
