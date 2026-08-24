import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import OfertasStack from './OfertasStack';
import MisPedidosScreen from '../views/client/MisPedidosScreen';
import MiImpactoScreen from '../views/shared/MiImpactoScreen';
import NotificacionesScreen from '../views/shared/NotificacionesScreen';
import PerfilScreen from '../views/PerfilScreen';
import { colors } from '../config/theme';

const Tab = createBottomTabNavigator();
const icon = (name) => ({ color, size }) => <Ionicons name={name} size={size} color={color} />;

export default function ClientTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true, tabBarActiveTintColor: colors.primary }}>
      <Tab.Screen
        name="OfertasTab"
        component={OfertasStack}
        options={{ headerShown: false, title: 'Ofertas', tabBarIcon: icon('restaurant-outline') }}
      />
      <Tab.Screen
        name="MisPedidos"
        component={MisPedidosScreen}
        options={{ title: 'Mis pedidos', tabBarIcon: icon('receipt-outline') }}
      />
      <Tab.Screen
        name="MiImpacto"
        component={MiImpactoScreen}
        options={{ title: 'Mi impacto', tabBarIcon: icon('leaf-outline') }}
      />
      <Tab.Screen
        name="Notificaciones"
        component={NotificacionesScreen}
        options={{ tabBarIcon: icon('notifications-outline') }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{ tabBarIcon: icon('person-outline') }}
      />
    </Tab.Navigator>
  );
}
