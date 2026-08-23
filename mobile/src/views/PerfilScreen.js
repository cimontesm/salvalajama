import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Screen from '../components/Screen';
import { colors, spacing, radius, typography } from '../config/theme';
import { useAuthViewModel } from '../viewmodels/useAuthViewModel';

// Perfil compartido por los tres roles (cliente/establecimiento/administrador).
// Muestra los datos del usuario autenticado y permite cerrar sesión.
export default function PerfilScreen() {
  const { user, logout } = useAuthViewModel();

  return (
    <Screen title="Perfil" subtitle="Tus datos en Salva la Jama">
      <View style={styles.card}>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.detail}>{user?.email}</Text>
        {user?.city ? <Text style={styles.detail}>{user.city}</Text> : null}
        <Text style={styles.roleBadge}>{user?.role}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  name: { ...typography.h3, color: colors.text },
  detail: { ...typography.body, color: colors.textMuted, marginTop: spacing.xs },
  roleBadge: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    color: '#fff',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '700',
  },
  button: {
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  buttonText: { color: colors.danger, fontWeight: '700' },
});
