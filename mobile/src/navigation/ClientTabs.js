import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import OfertasStack from './OfertasStack';
import MisPedidosScreen from '../views/client/MisPedidosScreen';
import PlaceholderScreen from '../views/PlaceholderScreen';
import PerfilScreen from '../views/PerfilScreen';
import { colors } from '../config/theme';

const Tab = createBottomTabNavigator();

export default function ClientTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true, tabBarActiveTintColor: colors.primary }}>
      <Tab.Screen name="OfertasTab" component={OfertasStack} options={{ headerShown: false, title: 'Ofertas' }} />
      <Tab.Screen name="MisPedidos" component={MisPedidosScreen} options={{ title: 'Mis pedidos' }} />
      <Tab.Screen name="MiImpacto" component={PlaceholderScreen} options={{ title: 'Mi impacto' }} initialParams={{ title: 'Mi impacto' }} />
      <Tab.Screen name="Notificaciones" component={PlaceholderScreen} initialParams={{ title: 'Notificaciones' }} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}
