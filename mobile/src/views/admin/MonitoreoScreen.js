import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../../config/theme';
import { useAdminMonitoring } from '../../viewmodels/useAdminViewModel';
import ListHeader from '../../components/ListHeader';

function Metric({ value, label }) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

export default function MonitoreoScreen() {
  const { stats, isLoading, error } = useAdminMonitoring();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ListHeader title="Monitoreo" subtitle="Estado general de la plataforma." />
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <>
            <Metric value={stats?.users_total ?? 0} label="usuarios registrados" />
            <Metric value={stats?.establishments_total ?? 0} label="establecimientos" />
            <Metric value={stats?.establishments_pending ?? 0} label="pendientes de aprobación" />
            <Metric value={stats?.packages_active ?? 0} label="publicaciones activas" />
            <Metric value={stats?.reservations_total ?? 0} label="reservas totales" />
            <Metric value={stats?.reservations_retiradas ?? 0} label="pedidos retirados" />
            <Metric value={`${stats?.kg_rescatados ?? 0} kg`} label="de alimentos rescatados" />
            <Metric value={`${stats?.co2_evitado_kg ?? 0} kg`} label="de CO₂ evitado" />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.sm },
  value: { ...typography.h1, color: colors.primary },
  label: { ...typography.body, color: colors.textMuted, marginTop: spacing.xs },
  error: { color: colors.danger },
});
