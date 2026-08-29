import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../../config/theme';
import ListHeader from '../../components/ListHeader';
import { useEstablishmentReportsViewModel } from '../../viewmodels/useEstablishmentReportsViewModel';
import { formatPrice } from '../../utils/formatters';

function Metric({ value, label }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

export default function ReportesScreen() {
  const { report, isLoading, error } = useEstablishmentReportsViewModel();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ListHeader title="Reportes" subtitle="Estadísticas de tu negocio" />

        {isLoading ? (
          <ActivityIndicator style={styles.loading} size="large" color={colors.primary} />
        ) : error || !report ? (
          <Text style={styles.error}>{error ?? 'No se pudieron cargar los reportes.'}</Text>
        ) : (
          <>
            <View style={styles.metricsGrid}>
              <Metric value={report.total_reservations} label="reservas totales" />
              <Metric value={report.retired_count} label="retiradas" />
              <Metric value={report.pending_count} label="pendientes" />
              <Metric value={report.cancelled_count} label="canceladas" />
              <Metric value={formatPrice(report.estimated_revenue)} label="ingresos estimados" />
              <Metric value={`${report.kg_rescued} kg`} label="rescatados" />
              <Metric value={`${report.co2_avoided_kg} kg`} label="CO₂ evitado" />
            </View>

            <Text style={styles.sectionTitle}>Publicaciones más pedidas</Text>
            <FlatList
              data={report.top_packages}
              keyExtractor={(item) => String(item.id)}
              scrollEnabled={false}
              ListEmptyComponent={<Text style={styles.empty}>Aún no hay datos suficientes.</Text>}
              renderItem={({ item }) => (
                <View style={styles.packageRow}>
                  <Text style={styles.packageTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.packageMeta}>{item.reservations_count ?? 0} retiros</Text>
                </View>
              )}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  loading: { marginTop: spacing.xl },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  metricCard: { width: '47%', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md },
  metricValue: { ...typography.h2, color: colors.primary },
  metricLabel: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
  sectionTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.sm },
  packageRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.xs },
  packageTitle: { ...typography.body, color: colors.text, flex: 1, marginRight: spacing.sm },
  packageMeta: { ...typography.caption, color: colors.textMuted },
  empty: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.md },
  error: { ...typography.body, color: colors.danger, textAlign: 'center', marginTop: spacing.xl, paddingHorizontal: spacing.lg },
});
