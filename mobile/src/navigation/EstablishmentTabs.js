import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PlaceholderScreen from '../views/PlaceholderScreen';
import PerfilScreen from '../views/PerfilScreen';
import { colors } from '../config/theme';

const Tab = createBottomTabNavigator();

// Establecimiento → Panel · Publicaciones · Pedidos · Reportes · Perfil (CLAUDE.md 6.3).
export default function EstablishmentTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true, tabBarActiveTintColor: colors.primary }}>
      <Tab.Screen name="Panel" component={PlaceholderScreen} initialParams={{ title: 'Panel' }} />
      <Tab.Screen name="Publicaciones" component={PlaceholderScreen} initialParams={{ title: 'Publicaciones' }} />
      <Tab.Screen name="Pedidos" component={PlaceholderScreen} initialParams={{ title: 'Pedidos' }} />
      <Tab.Screen name="Reportes" component={PlaceholderScreen} initialParams={{ title: 'Reportes' }} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}
