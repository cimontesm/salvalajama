import React from 'react';
import { View, StyleSheet } from 'react-native';
import Screen from '../components/Screen';
import { colors, spacing, typography, radius } from '../config/theme';

// Pantalla "vacía" para el esqueleto de navegación del Sprint 0 (CLAUDE.md 6.1/7).
// Cada sprint reemplaza esto por la pantalla real conectada a su viewmodel.
export default function PlaceholderScreen({ route }) {
  const { title, note } = route.params ?? {};
  return (
    <Screen title={title ?? route.name} subtitle="Pantalla pendiente de implementar en su sprint correspondiente.">
      <View style={styles.card}>
        <View style={styles.badge} />
      </View>
      {note ? <View style={styles.note} /> : null}
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
    minHeight: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
  },
  note: { marginTop: spacing.md },
});
