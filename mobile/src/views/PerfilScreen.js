import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ListHeader from '../components/ListHeader';
import { colors, spacing, radius, typography } from '../config/theme';
import { useAuthViewModel } from '../viewmodels/useAuthViewModel';

// Perfil compartido por los tres roles (cliente/establecimiento/administrador).
// Usa el mismo SafeAreaView + ListHeader que el resto de pantallas del panel
// admin para que el encabezado se vea igual en todas las pestañas.
export default function PerfilScreen() {
  const { user, logout } = useAuthViewModel();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ListHeader title="Perfil" subtitle="Tus datos en Salva la Jama" />
        <View style={styles.card}>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.detail}>{user?.email}</Text>
          {user?.city ? <Text style={styles.detail}>{user.city}</Text> : null}
          <Text style={styles.roleBadge}>{user?.role}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={logout}>
          <Text style={styles.buttonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, flexGrow: 1 },
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
