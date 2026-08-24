import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PublicacionesScreen from '../views/establishment/PublicacionesScreen';
import CrearPublicacionScreen from '../views/establishment/CrearPublicacionScreen';
import EditarPublicacionScreen from '../views/establishment/EditarPublicacionScreen';
import { colors } from '../config/theme';

const Stack = createNativeStackNavigator();
export default function EstablishmentPublicacionesStack() {
  return <Stack.Navigator screenOptions={{ headerShown: true, headerTintColor: colors.primary }}>
    <Stack.Screen name="ListaPublicaciones" component={PublicacionesScreen} options={{ title: 'Publicaciones' }} />
    <Stack.Screen name="CrearPublicacion" component={CrearPublicacionScreen} options={{ title: 'Nueva publicación' }} />
    <Stack.Screen name="EditarPublicacion" component={EditarPublicacionScreen} options={{ title: 'Editar publicación' }} />
  </Stack.Navigator>;
}
