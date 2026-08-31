import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OfertasScreen from '../views/client/OfertasScreen';
import DetalleOfertaScreen from '../views/client/DetalleOfertaScreen';
import ReservaScreen from '../views/client/ReservaScreen';
import { colors } from '../config/theme';

const Stack = createNativeStackNavigator();

export default function OfertasStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: colors.primary }}>
      <Stack.Screen name="Ofertas" component={OfertasScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DetalleOferta" component={DetalleOfertaScreen} options={{ title: 'Detalle' }} />
      <Stack.Screen name="Reserva" component={ReservaScreen} options={{ title: 'Reserva' }} />
    </Stack.Navigator>
  );
}
