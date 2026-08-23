import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EstablishmentPanelStack from './EstablishmentPanelStack';
import EstablishmentPublicacionesStack from './EstablishmentPublicacionesStack';
import PedidosScreen from '../views/establishment/PedidosScreen';
import ReportesScreen from '../views/establishment/ReportesScreen';
import PerfilScreen from '../views/PerfilScreen';
import { colors } from '../config/theme';

const Tab = createBottomTabNavigator();

// Establecimiento → Panel · Publicaciones · Pedidos · Reportes · Perfil (CLAUDE.md 6.3).
export default function EstablishmentTabs() {
  return <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary }}>
    <Tab.Screen name="Panel" component={EstablishmentPanelStack} />
    <Tab.Screen name="Publicaciones" component={EstablishmentPublicacionesStack} />
    <Tab.Screen name="Pedidos" component={PedidosScreen} options={{ headerShown: true, title: 'Pedidos' }} />
    <Tab.Screen name="Reportes" component={ReportesScreen} options={{ headerShown: true, title: 'Reportes' }} />
    <Tab.Screen name="Perfil" component={PerfilScreen} options={{ headerShown: true }} />
  </Tab.Navigator>;
}
