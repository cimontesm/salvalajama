import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import PlaceholderScreen from '../views/PlaceholderScreen';
import PerfilScreen from '../views/PerfilScreen';
import { colors } from '../config/theme';

const Tab = createBottomTabNavigator();
const icon = (name) => ({ color, size }) => <Ionicons name={name} size={size} color={color} />;

export default function EstablishmentTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true, tabBarActiveTintColor: colors.primary }}>
      <Tab.Screen name="Panel" component={PlaceholderScreen} initialParams={{ title: 'Panel' }} options={{ tabBarIcon: icon('grid-outline') }} />
      <Tab.Screen name="Publicaciones" component={PlaceholderScreen} initialParams={{ title: 'Publicaciones' }} options={{ tabBarIcon: icon('megaphone-outline') }} />
      <Tab.Screen name="Pedidos" component={PlaceholderScreen} initialParams={{ title: 'Pedidos' }} options={{ tabBarIcon: icon('receipt-outline') }} />
      <Tab.Screen name="Reportes" component={PlaceholderScreen} initialParams={{ title: 'Reportes' }} options={{ tabBarIcon: icon('bar-chart-outline') }} />
      <Tab.Screen name="Perfil" component={PerfilScreen} options={{ tabBarIcon: icon('person-outline') }} />
    </Tab.Navigator>
  );
}
