import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../../config/theme';
import ListHeader from '../../components/ListHeader';
import { useImpactViewModel } from '../../viewmodels/useImpactViewModel';

export default function MiImpactoScreen() {
  const { impact, isLoading, error } = useImpactViewModel();
  return <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}><ScrollView contentContainerStyle={styles.content}><ListHeader title="Mi impacto 🌱" subtitle="Cada reserva retirada ayuda a reducir el desperdicio." />{isLoading ? <ActivityIndicator size="large" color={colors.primary} /> : error ? <Text style={styles.error}>{error}</Text> : <><Metric value={impact?.packages_rescued ?? 0} label="paquetes rescatados" /><Metric value={`${impact?.food_rescued_kg ?? 0} kg`} label="de alimentos rescatados" /><Metric value={`$${Number(impact?.money_saved ?? 0).toFixed(2)}`} label="pagados por alimentos aprovechados" /><Metric value={impact?.retired_orders ?? 0} label="pedidos retirados" /></>}</ScrollView></SafeAreaView>;
}
function Metric({ value, label }) { return <View style={styles.card}><Text style={styles.value}>{value}</Text><Text style={styles.label}>{label}</Text></View>; }
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.lg }, title: { ...typography.h1, color: colors.text }, subtitle: { ...typography.body, color: colors.textMuted, marginBottom: spacing.lg }, card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.sm }, value: { ...typography.h1, color: colors.primary }, label: { ...typography.body, color: colors.textMuted, marginTop: spacing.xs }, error: { color: colors.danger } });
