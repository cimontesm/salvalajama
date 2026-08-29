import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../config/theme';

// Encabezado homogéneo para todas las pantallas de Admin (mismo título,
// subtítulo y botón "+" opcional), para que las 4 pestañas se vean iguales.
export default function ListHeader({ title, subtitle, onAdd, addLabel = 'Nuevo' }) {
  return (
    <View style={styles.header}>
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>
        {onAdd ? (
          <TouchableOpacity style={styles.addButton} onPress={onAdd}>
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.addButtonText}>{addLabel}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { ...typography.h1, color: colors.text },
  subtitle: { ...typography.body, color: colors.textMuted, marginTop: spacing.xs },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  addButtonText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
