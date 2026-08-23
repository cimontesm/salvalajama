import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../../config/theme';
import { useImpactViewModel } from '../../viewmodels/useImpactViewModel';

export default function ReportesScreen() {
  const { impact, isLoading, error, reload } = useImpactViewModel();
  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content}>
    <Text style={styles.title}>Indicadores de impacto</Text><Text style={styles.subtitle}>Mide cuánto alimento se rescató gracias a tus publicaciones.</Text>
    {isLoading ? <ActivityIndicator size="large" color={colors.primary} /> : error ? <Text style={styles.error}>{error}</Text> : <>
      <Metric title="Paquetes rescatados" value={impact?.packages_rescued ?? 0} />
      <Metric title="Alimentos rescatados" value={`${impact?.food_rescued_kg ?? 0} kg`} />
      <Metric title="Pedidos retirados" value={impact?.retired_orders ?? 0} />
      <Metric title="Tasa de aprovechamiento" value={`${impact?.rescue_rate_percent ?? 0}%`} />
      <Metric title="Valor pagado por alimentos rescatados" value={`$${Number(impact?.money_saved ?? 0).toFixed(2)}`} />
      <Text style={styles.note}>La cantidad de alimentos rescatados se calcula con las reservas marcadas como “retirado” y el peso estimado de cada paquete.</Text>
    </>}
  </ScrollView></SafeAreaView>;
}
function Metric({ title, value }) { return <View style={styles.card}><Text style={styles.value}>{value}</Text><Text style={styles.label}>{title}</Text></View>; }
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.lg }, title: { ...typography.h1, color: colors.text }, subtitle: { ...typography.body, color: colors.textMuted, marginBottom: spacing.lg }, card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.sm }, value: { ...typography.h1, color: colors.primary }, label: { ...typography.body, color: colors.textMuted, marginTop: spacing.xs }, note: { ...typography.caption, color: colors.textMuted, marginTop: spacing.md, lineHeight: 18 }, error: { color: colors.danger } });
