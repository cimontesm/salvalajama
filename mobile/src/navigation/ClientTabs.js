import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import OfertasStack from './OfertasStack';
import MisPedidosScreen from '../views/client/MisPedidosScreen';
import PlaceholderScreen from '../views/PlaceholderScreen';
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
        component={PlaceholderScreen}
        options={{ title: 'Mi impacto', tabBarIcon: icon('leaf-outline') }}
        initialParams={{ title: 'Mi impacto' }}
      />
      <Tab.Screen
        name="Notificaciones"
        component={PlaceholderScreen}
        options={{ tabBarIcon: icon('notifications-outline') }}
        initialParams={{ title: 'Notificaciones' }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{ tabBarIcon: icon('person-outline') }}
      />
    </Tab.Navigator>
  );
}
