import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { colors, spacing, radius, typography } from '../../config/theme';
import { useEstablishmentPackagesViewModel } from '../../viewmodels/useEstablishmentPackagesViewModel';
import { deletePackage } from '../../services/packages.service';
import { formatPrice, formatDate, formatTime } from '../../utils/formatters';

const tabs = [
  ['active', 'Activas'],
  ['expired', 'Vencidas'],
  ['history', 'Historial'],
];

export default function PublicacionesScreen({ navigation }) {
  const { active, expired, history, isLoading, error, reload } = useEstablishmentPackagesViewModel();
  const [selected, setSelected] = useState('active');
  const data = { active, expired, history }[selected];
  useFocusEffect(useCallback(() => { reload(); }, [reload]));

  async function remove(item) {
    Alert.alert('Eliminar publicación', '¿Quieres eliminar/desactivar esta publicación?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
        try { await deletePackage(item.id); reload(); }
        catch (e) { Alert.alert('Error', e?.response?.data?.message ?? 'No se pudo eliminar.'); }
      } },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View><Text style={styles.title}>Publicaciones</Text><Text style={styles.subtitle}>Gestiona tus ofertas y stock</Text></View>
          <TouchableOpacity style={styles.add} onPress={() => navigation.navigate('CrearPublicacion')}><Text style={styles.addText}>+ Nueva</Text></TouchableOpacity>
        </View>
        <View style={styles.tabs}>{tabs.map(([key, label]) => (
          <TouchableOpacity key={key} onPress={() => setSelected(key)} style={[styles.tab, selected === key && styles.tabActive]}>
            <Text style={[styles.tabText, selected === key && styles.tabTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}</View>
      </View>
      {isLoading ? <ActivityIndicator style={styles.loading} size="large" color={colors.primary} /> : (
        <FlatList data={data} keyExtractor={item => String(item.id)} contentContainerStyle={styles.list} refreshing={isLoading} onRefresh={reload}
          ListEmptyComponent={<Text style={styles.empty}>{error ?? 'No hay publicaciones en esta sección.'}</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.row}><Text style={styles.cardTitle}>{item.title}</Text><Text style={[styles.badge, item.status === 'activo' ? styles.good : styles.muted]}>{item.status}</Text></View>
              <Text style={styles.detail}>{item.category} · {formatPrice(item.discounted_price)} · {item.discount_percent}% descuento</Text>
              <Text style={styles.stock}>Stock: {item.quantity_available} / {item.quantity_total}</Text>
              <Text style={styles.detail}>Retiro: {formatTime(item.pickup_start)} - {formatTime(item.pickup_end)}</Text>
              {item.expires_at ? <Text style={styles.detail}>Vence: {formatDate(item.expires_at)}</Text> : null}
              {selected === 'active' ? <View style={styles.actions}>
                <TouchableOpacity style={styles.outline} onPress={() => navigation.navigate('EditarPublicacion', { package: item })}><Text style={styles.outlineText}>Editar</Text></TouchableOpacity>
                <TouchableOpacity style={styles.delete} onPress={() => remove(item)}><Text style={styles.deleteText}>Eliminar</Text></TouchableOpacity>
              </View> : null}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, header: { padding: spacing.lg },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, title: { ...typography.h2, color: colors.text }, subtitle: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  add: { backgroundColor: colors.primary, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.md }, addText: { color: '#fff', fontWeight: '700' },
  tabs: { flexDirection: 'row', marginTop: spacing.md, gap: spacing.xs }, tab: { flex: 1, padding: spacing.sm, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center' }, tabActive: { backgroundColor: colors.primary, borderColor: colors.primary }, tabText: { color: colors.textMuted, fontSize: 12 }, tabTextActive: { color: '#fff', fontWeight: '700' },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl }, loading: { marginTop: spacing.xl }, empty: { textAlign: 'center', color: colors.textMuted, marginTop: spacing.xl },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm }, row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm }, cardTitle: { ...typography.h3, color: colors.text, flex: 1 }, badge: { fontSize: 11, fontWeight: '700', paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.sm, overflow: 'hidden' }, good: { backgroundColor: '#E7F5E8', color: colors.primary }, muted: { backgroundColor: '#EEF0EE', color: colors.textMuted }, detail: { ...typography.caption, color: colors.textMuted, marginTop: 4 }, stock: { ...typography.body, color: colors.text, fontWeight: '700', marginTop: spacing.sm }, actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }, outline: { borderWidth: 1, borderColor: colors.primary, borderRadius: radius.sm, padding: spacing.sm, flex: 1, alignItems: 'center' }, outlineText: { color: colors.primary, fontWeight: '700' }, delete: { borderWidth: 1, borderColor: colors.danger, borderRadius: radius.sm, padding: spacing.sm, flex: 1, alignItems: 'center' }, deleteText: { color: colors.danger, fontWeight: '700' },
});
