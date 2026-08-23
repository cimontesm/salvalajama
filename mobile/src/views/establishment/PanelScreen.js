import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../../config/theme';
import { useEstablishmentPackagesViewModel } from '../../viewmodels/useEstablishmentPackagesViewModel';
import { useEstablishmentReservationsViewModel } from '../../viewmodels/useEstablishmentReservationsViewModel';
import { useImpactViewModel } from '../../viewmodels/useImpactViewModel';
import { useNotificationsViewModel } from '../../viewmodels/useNotificationsViewModel';

export default function PanelScreen({ navigation }) {
  const packages = useEstablishmentPackagesViewModel(); const orders = useEstablishmentReservationsViewModel(); const impact = useImpactViewModel(); const notes = useNotificationsViewModel();
  const loading = packages.isLoading || orders.isLoading || impact.isLoading;
  return <SafeAreaView style={styles.safe} edges={['left', 'right']}>
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.head}><View><Text style={styles.title}>Panel</Text><Text style={styles.subtitle}>Resumen de tu establecimiento</Text></View><TouchableOpacity onPress={() => navigation.navigate('NotificacionesInternas')}><Text style={styles.bell}>🔔 {notes.unreadCount > 0 ? notes.unreadCount : ''}</Text></TouchableOpacity></View>
      {loading ? <ActivityIndicator size="large" color={colors.primary} /> : <>
        <View style={styles.grid}><Stat label="Publicaciones activas" value={packages.active.length} /><Stat label="Pedidos pendientes" value={orders.pending.length} /><Stat label="Alimentos rescatados" value={`${impact.impact?.food_rescued_kg ?? 0} kg`} /><Stat label="Paquetes rescatados" value={impact.impact?.packages_rescued ?? 0} /></View>
        <TouchableOpacity style={styles.card} onPress={() => navigation.getParent()?.navigate('Publicaciones')}><Text style={styles.cardTitle}>📦 Gestionar publicaciones</Text><Text style={styles.cardText}>Crea ofertas, actualiza el stock y revisa el historial.</Text></TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.getParent()?.navigate('Pedidos')}><Text style={styles.cardTitle}>🧾 Gestionar pedidos</Text><Text style={styles.cardText}>Consulta reservas y confirma los retiros de clientes.</Text></TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.getParent()?.navigate('Reportes')}><Text style={styles.cardTitle}>🌱 Ver impacto</Text><Text style={styles.cardText}>Consulta alimentos rescatados y tasa de aprovechamiento.</Text></TouchableOpacity>
      </>}
    </ScrollView>
  </SafeAreaView>;
}
function Stat({ label, value }) { return <View style={styles.stat}><Text style={styles.value}>{value}</Text><Text style={styles.label}>{label}</Text></View>; }
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.lg }, head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }, title: { ...typography.h1, color: colors.text }, subtitle: { ...typography.body, color: colors.textMuted }, bell: { fontSize: 22 }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md }, stat: { width: '48%', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md }, value: { ...typography.h2, color: colors.primary }, label: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs }, card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm }, cardTitle: { ...typography.h3, color: colors.text }, cardText: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs } });
