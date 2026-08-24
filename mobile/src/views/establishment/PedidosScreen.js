import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../../config/theme';
import { useEstablishmentReservationsViewModel } from '../../viewmodels/useEstablishmentReservationsViewModel';
import { formatPrice, formatTime } from '../../utils/formatters';

export default function PedidosScreen() {
  const { pending, history, isLoading, error, reload, updateStatus } = useEstablishmentReservationsViewModel();
  async function action(item, status) {
    const text = status === 'retirado' ? 'confirmar que el cliente retiró el pedido' : 'cancelar el pedido';
    Alert.alert('Actualizar pedido', `¿Quieres ${text}?`, [
      { text: 'No', style: 'cancel' },
      { text: 'Sí', style: status === 'cancelado' ? 'destructive' : 'default', onPress: async () => { try { await updateStatus(item.id, status); } catch (e) { Alert.alert('Error', e?.response?.data?.message ?? 'No se pudo actualizar.'); } } },
    ]);
  }
  const sections = [...pending.map(x => ({ ...x, section: 'Pendientes' })), ...history.map(x => ({ ...x, section: 'Historial' }))];
  return <SafeAreaView style={styles.safe} edges={['left', 'right']}>
    <FlatList data={sections} keyExtractor={item => String(item.id)} refreshing={isLoading} onRefresh={reload} contentContainerStyle={styles.list}
      ListHeaderComponent={<View><Text style={styles.title}>Pedidos recibidos</Text><Text style={styles.subtitle}>{pending.length} pendientes · {history.length} en historial</Text></View>}
      ListEmptyComponent={<Text style={styles.empty}>{error ?? 'Aún no has recibido pedidos.'}</Text>}
      renderItem={({ item }) => <View style={styles.card}>
        <View style={styles.row}><Text style={styles.code}>{item.code}</Text><Text style={styles.status}>{item.status}</Text></View>
        <Text style={styles.titleCard}>{item.package?.title}</Text>
        <Text style={styles.detail}>Cliente: {item.user?.name ?? 'Cliente'}</Text>
        {item.user?.phone ? <Text style={styles.detail}>Teléfono: {item.user.phone}</Text> : null}
        <Text style={styles.detail}>Cantidad: {item.quantity} · Total: {formatPrice(item.total)}</Text>
        <Text style={styles.detail}>Retiro límite: {formatTime(item.pickup_deadline)}</Text>
        {item.status === 'reservado' ? <View style={styles.actions}>
          <TouchableOpacity style={styles.primary} onPress={() => action(item, 'retirado')}><Text style={styles.primaryText}>Confirmar retiro</Text></TouchableOpacity>
          <TouchableOpacity style={styles.cancel} onPress={() => action(item, 'cancelado')}><Text style={styles.cancelText}>Cancelar</Text></TouchableOpacity>
        </View> : null}
      </View>}
    />
  </SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.background }, list: { padding: spacing.lg }, title: { ...typography.h2, color: colors.text }, subtitle: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.md }, card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm }, row: { flexDirection: 'row', justifyContent: 'space-between' }, code: { fontWeight: '700', color: colors.textMuted }, status: { color: colors.primary, fontWeight: '700', fontSize: 12 }, titleCard: { ...typography.h3, color: colors.text, marginTop: spacing.sm }, detail: { ...typography.caption, color: colors.textMuted, marginTop: 3 }, actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }, primary: { flex: 1, backgroundColor: colors.primary, padding: spacing.sm, borderRadius: radius.sm, alignItems: 'center' }, primaryText: { color: '#fff', fontWeight: '700' }, cancel: { padding: spacing.sm, borderWidth: 1, borderColor: colors.danger, borderRadius: radius.sm, alignItems: 'center' }, cancelText: { color: colors.danger, fontWeight: '700' }, empty: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl } });
