import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import UsuariosScreen from '../views/admin/UsuariosScreen';
import EstablecimientosScreen from '../views/admin/EstablecimientosScreen';
import PublicacionesScreen from '../views/admin/PublicacionesScreen';
import MonitoreoScreen from '../views/admin/MonitoreoScreen';
import PerfilScreen from '../views/PerfilScreen';
import { colors } from '../config/theme';

const Tab = createBottomTabNavigator();
const icon = (name) => ({ color, size }) => <Ionicons name={name} size={size} color={color} />;

export default function AdminTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true, tabBarActiveTintColor: colors.primary }}>
      <Tab.Screen name="Usuarios" component={UsuariosScreen} options={{ headerShown: false, tabBarIcon: icon('people-outline') }} />
      <Tab.Screen name="Establecimientos" component={EstablecimientosScreen} options={{ headerShown: false, tabBarIcon: icon('storefront-outline') }} />
      <Tab.Screen name="Publicaciones" component={PublicacionesScreen} options={{ headerShown: false, tabBarIcon: icon('list-outline') }} />
      <Tab.Screen name="Monitoreo" component={MonitoreoScreen} options={{ headerShown: false, tabBarIcon: icon('stats-chart-outline') }} />
      <Tab.Screen name="Perfil" component={PerfilScreen} options={{ headerShown: false, tabBarIcon: icon('person-outline') }} />
    </Tab.Navigator>
  );
}
