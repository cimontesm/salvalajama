import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAuth } from '../store/AuthContext';
import AuthStack from './AuthStack';
import ClientTabs from './ClientTabs';
import EstablishmentTabs from './EstablishmentTabs';
import AdminTabs from './AdminTabs';
import { colors } from '../config/theme';

// Monta el stack de tabs según el rol; sin sesión, AuthStack.
export default function RootNavigator() {
  const { isAuthenticated, isLoading, role } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!isAuthenticated && <AuthStack />}
      {isAuthenticated && role === 'cliente' && <ClientTabs />}
      {isAuthenticated && role === 'establecimiento' && <EstablishmentTabs />}
      {isAuthenticated && role === 'administrador' && <AdminTabs />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
});
