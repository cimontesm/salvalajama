import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Screen from '../../components/Screen';
import { colors, spacing, radius, typography } from '../../config/theme';
import { getPackage } from '../../services/packages.service';
import { useReservationsViewModel } from '../../viewmodels/useReservationsViewModel';
import { formatPrice, formatDate, formatTime } from '../../utils/formatters';

export default function ReservaScreen({ route, navigation }) {
  const { id } = route.params;
  const { reserve } = useReservationsViewModel();
  const [pkg, setPkg] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  useEffect(() => {
    getPackage(id).then(setPkg).catch(() => {});
  }, [id]);

  async function handleReserve() {
    setIsSubmitting(true);
    try {
      const reservation = await reserve(id, quantity);
      setConfirmed(reservation);
    } catch (e) {
      const message = e?.response?.status === 409
        ? 'Ya no hay stock suficiente para esa cantidad.'
        : e?.response?.data?.message ?? 'No se pudo completar la reserva.';
      Alert.alert('No se pudo reservar', message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (confirmed) {
    return (
      <Screen title="¡Reserva confirmada!" subtitle={`Código ${confirmed.code}`}>
        <View style={styles.card}>
          <Text style={styles.codeLabel}>Tu código</Text>
          <Text style={styles.code}>{confirmed.code}</Text>
          <Text style={styles.detail}>Retira antes de: {formatDate(confirmed.pickup_deadline)}, {formatTime(confirmed.pickup_deadline)}</Text>
          <Text style={styles.detail}>Total a pagar: {formatPrice(confirmed.total)}</Text>
          <Text style={styles.notice}>Pagas en el establecimiento al retirar tu pedido.</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Ofertas')}>
          <Text style={styles.buttonText}>Volver a ofertas</Text>
        </TouchableOpacity>
      </Screen>
    );
  }

  if (!pkg) {
    return (
      <Screen title="Cargando…">
        <ActivityIndicator size="large" color={colors.primary} />
      </Screen>
    );
  }

  return (
    <Screen title="Confirmar reserva" subtitle={pkg.title}>
      <View style={styles.card}>
        <Text style={styles.detail}>Establecimiento: {pkg.establishment?.name}</Text>
        <Text style={styles.detail}>Precio unitario: {formatPrice(pkg.discounted_price)}</Text>
        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Text style={styles.qtyButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{quantity}</Text>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => setQuantity((q) => Math.min(pkg.quantity_available, q + 1))}
          >
            <Text style={styles.qtyButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.total}>Total: {formatPrice(pkg.discounted_price * quantity)}</Text>
        <Text style={styles.notice}>Pagas en el establecimiento al retirar.</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleReserve} disabled={isSubmitting}>
        <Text style={styles.buttonText}>{isSubmitting ? 'Reservando…' : 'Confirmar reserva'}</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  detail: { ...typography.body, color: colors.text, marginBottom: spacing.xs },
  quantityRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginVertical: spacing.md },
  qtyButton: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyButtonText: { ...typography.h3, color: colors.text },
  qtyValue: { ...typography.h3, color: colors.text, minWidth: 24, textAlign: 'center' },
  total: { ...typography.h3, color: colors.primary, marginTop: spacing.sm },
  notice: { ...typography.caption, color: colors.textMuted, marginTop: spacing.sm },
  codeLabel: { ...typography.caption, color: colors.textMuted },
  code: { ...typography.h1, color: colors.primary, marginBottom: spacing.sm },
  button: { backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.md, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
});
