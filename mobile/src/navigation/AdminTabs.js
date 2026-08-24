import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import PlaceholderScreen from '../views/PlaceholderScreen';
import PerfilScreen from '../views/PerfilScreen';
import { colors } from '../config/theme';

const Tab = createBottomTabNavigator();
const icon = (name) => ({ color, size }) => <Ionicons name={name} size={size} color={color} />;

export default function AdminTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true, tabBarActiveTintColor: colors.primary }}>
      <Tab.Screen name="Usuarios" component={PlaceholderScreen} initialParams={{ title: 'Usuarios' }} options={{ tabBarIcon: icon('people-outline') }} />
      <Tab.Screen name="Establecimientos" component={PlaceholderScreen} initialParams={{ title: 'Establecimientos' }} options={{ tabBarIcon: icon('storefront-outline') }} />
      <Tab.Screen name="Publicaciones" component={PlaceholderScreen} initialParams={{ title: 'Publicaciones' }} options={{ tabBarIcon: icon('list-outline') }} />
      <Tab.Screen name="Monitoreo" component={PlaceholderScreen} initialParams={{ title: 'Monitoreo' }} options={{ tabBarIcon: icon('stats-chart-outline') }} />
      <Tab.Screen name="Perfil" component={PerfilScreen} options={{ tabBarIcon: icon('person-outline') }} />
    </Tab.Navigator>
  );
}
