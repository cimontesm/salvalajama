import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PanelScreen from '../views/establishment/PanelScreen';
import NotificacionesScreen from '../views/shared/NotificacionesScreen';
import { colors } from '../config/theme';

const Stack = createNativeStackNavigator();
export default function EstablishmentPanelStack() {
  return <Stack.Navigator screenOptions={{ headerShown: true, headerTintColor: colors.primary }}>
    <Stack.Screen name="PanelInicio" component={PanelScreen} options={{ title: 'Panel', headerShown: false }} />
    <Stack.Screen name="NotificacionesInternas" component={NotificacionesScreen} options={{ title: 'Notificaciones', headerShown: false }} />
  </Stack.Navigator>;
}

// Cecilia Montes