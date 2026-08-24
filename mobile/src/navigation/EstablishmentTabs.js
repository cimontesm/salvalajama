import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import EstablishmentPanelStack from './EstablishmentPanelStack';
import EstablishmentPublicacionesStack from './EstablishmentPublicacionesStack';
import PedidosScreen from '../views/establishment/PedidosScreen';
import ReportesScreen from '../views/establishment/ReportesScreen';
import PerfilScreen from '../views/PerfilScreen';
import { colors } from '../config/theme';

const Tab = createBottomTabNavigator();
const icon = (name) => ({ color, size }) => <Ionicons name={name} size={size} color={color} />;

export default function EstablishmentTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary }}>
      <Tab.Screen name="Panel" component={EstablishmentPanelStack} options={{ tabBarIcon: icon('grid-outline') }} />
      <Tab.Screen name="Publicaciones" component={EstablishmentPublicacionesStack} options={{ tabBarIcon: icon('megaphone-outline') }} />
      <Tab.Screen name="Pedidos" component={PedidosScreen} options={{ headerShown: true, title: 'Pedidos', tabBarIcon: icon('receipt-outline') }} />
      <Tab.Screen name="Reportes" component={ReportesScreen} options={{ headerShown: true, title: 'Reportes', tabBarIcon: icon('bar-chart-outline') }} />
      <Tab.Screen name="Perfil" component={PerfilScreen} options={{ headerShown: true, tabBarIcon: icon('person-outline') }} />
    </Tab.Navigator>
  );
}
