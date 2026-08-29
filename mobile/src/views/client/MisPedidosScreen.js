import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, SectionList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../../config/theme';
import ListHeader from '../../components/ListHeader';
import { useReservationsViewModel } from '../../viewmodels/useReservationsViewModel';
import { formatPrice, formatDate, formatApiError } from '../../utils/formatters';
import RatingModal from '../../components/RatingModal';
import { createReview } from '../../services/reviews.service';

const STATUS_LABEL = { reservado: 'Reservado', retirado: 'Retirado', cancelado: 'Cancelado' };

export default function MisPedidosScreen() {
  const { active, history, isLoading, error, cancel, reload } = useReservationsViewModel();
  const [ratingTarget, setRatingTarget] = useState(null);

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
            Alert.alert('Error', formatApiError(e, 'No se pudo cancelar.'));
          }
        },
      },
    ]);
  }

  async function handleSubmitRating({ rating, comment }) {
    try {
      await createReview({ reservationId: ratingTarget.id, rating, comment });
      setRatingTarget(null);
      await reload();
      Alert.alert('¡Gracias!', 'Tu calificación fue enviada.');
    } catch (e) {
      Alert.alert('Error', formatApiError(e, 'No se pudo enviar la calificación.'));
    }
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
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => String(item.id)}
        refreshing={isLoading}
        onRefresh={reload}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<ListHeader title="Mis pedidos" subtitle={`${active.length} activas · ${history.length} en historial`} />}
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
            {item.status === 'retirado' && !item.review ? (
              <TouchableOpacity style={styles.rateButton} onPress={() => setRatingTarget(item)}>
                <Text style={styles.rateButtonText}>Calificar</Text>
              </TouchableOpacity>
            ) : null}
            {item.status === 'retirado' && item.review ? (
              <Text style={styles.reviewed}>Ya calificaste: {'★'.repeat(item.review.rating)}</Text>
            ) : null}
          </View>
        )}
      />
      <RatingModal
        visible={!!ratingTarget}
        onCancel={() => setRatingTarget(null)}
        onSubmit={handleSubmitRating}
        title={ratingTarget ? `¿Cómo estuvo "${ratingTarget.package?.title}"?` : ''}
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
  rateButton: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    borderRadius: radius.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  rateButtonText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  reviewed: { ...typography.caption, color: colors.accent, marginTop: spacing.sm, fontWeight: '700' },
  empty: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
});
