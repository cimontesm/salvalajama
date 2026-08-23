import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, SectionList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../../config/theme';
import { useReservationsViewModel } from '../../viewmodels/useReservationsViewModel';
import { formatPrice, formatDate } from '../../utils/formatters';

const STATUS_LABEL = { reservado: 'Reservado', retirado: 'Retirado', cancelado: 'Cancelado' };

export default function MisPedidosScreen() {
  const { active, history, isLoading, error, cancel, reload } = useReservationsViewModel();

  async function handleCancel(id) {
    Alert.alert('Cancelar reserva', '¿Seguro que quieres cancelarla? Se repone el stock.', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Sí, cancelar',
        style: 'destructive',
        onPress: async () => {
          try {
            await cancel(id);
          } catch (e) {
            Alert.alert('Error', e?.response?.data?.message ?? 'No se pudo cancelar.');
          }
        },
      },
    ]);
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator style={{ marginTop: spacing.xl }} size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  const sections = [
    { title: 'Reservas activas', data: active, key: 'active' },
    { title: 'Historial', data: history, key: 'history' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => String(item.id)}
        refreshing={isLoading}
        onRefresh={reload}
        contentContainerStyle={styles.list}
        renderSectionHeader={({ section }) => <Text style={styles.sectionTitle}>{section.title}</Text>}
        ListEmptyComponent={<Text style={styles.empty}>{error ?? 'Aún no tienes pedidos.'}</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.code}>{item.code}</Text>
              <Text style={styles.status}>{STATUS_LABEL[item.status] ?? item.status}</Text>
            </View>
            <Text style={styles.title}>{item.package?.title}</Text>
            <Text style={styles.detail}>{item.establishment?.name}</Text>
            <Text style={styles.detail}>Total: {formatPrice(item.total)} · {formatDate(item.created_at)}</Text>
            {item.status === 'reservado' ? (
              <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancel(item.id)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg },
  sectionTitle: { ...typography.h3, color: colors.text, marginTop: spacing.md, marginBottom: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  code: { ...typography.caption, color: colors.textMuted, fontWeight: '700' },
  status: { ...typography.caption, color: colors.primary, fontWeight: '700' },
  title: { ...typography.h3, color: colors.text, marginTop: spacing.xs },
  detail: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  cancelButton: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  cancelButtonText: { color: colors.danger, fontWeight: '700', fontSize: 13 },
  empty: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
});
