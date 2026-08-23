import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Screen from '../../components/Screen';
import { colors, spacing, radius, typography } from '../../config/theme';
import { getPackage } from '../../services/packages.service';
import { formatPrice, formatDate, formatTime } from '../../utils/formatters';

export default function DetalleOfertaScreen({ route, navigation }) {
  const { id } = route.params;
  const [pkg, setPkg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    getPackage(id)
      .then((data) => mounted && setPkg(data))
      .catch((e) => mounted && setError(e?.response?.data?.message ?? 'No se pudo cargar la oferta.'))
      .finally(() => mounted && setIsLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!isLoading && (error || !pkg)) {
      Alert.alert('Error', error ?? 'Oferta no encontrada.');
    }
  }, [isLoading, error, pkg]);

  if (isLoading) {
    return (
      <Screen title="Cargando…">
        <ActivityIndicator size="large" color={colors.primary} />
      </Screen>
    );
  }

  return (
    <Screen title={pkg?.title} subtitle={pkg?.establishment?.name}>
      <View style={styles.card}>
        <Text style={styles.description}>{pkg?.description}</Text>
        <View style={styles.priceRow}>
          {pkg?.original_price > pkg?.discounted_price ? (
            <Text style={styles.originalPrice}>{formatPrice(pkg.original_price)}</Text>
          ) : null}
          <Text style={styles.discountedPrice}>{formatPrice(pkg?.discounted_price)}</Text>
          {pkg?.discount_percent > 0 ? <Text style={styles.discount}>-{pkg.discount_percent}%</Text> : null}
        </View>
        <Text style={styles.detail}>Retiro: {formatDate(pkg?.pickup_start)}, {formatTime(pkg?.pickup_start)} - {formatTime(pkg?.pickup_end)}</Text>
        <Text style={styles.detail}>Dirección: {pkg?.establishment?.address}</Text>
        <Text style={styles.detail}>Disponibles: {pkg?.quantity_available}</Text>
      </View>
      <TouchableOpacity
        style={[styles.button, !pkg?.quantity_available && styles.buttonDisabled]}
        disabled={!pkg?.quantity_available}
        onPress={() => navigation.navigate('Reserva', { id: pkg.id })}
      >
        <Text style={styles.buttonText}>Reservar</Text>
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
  description: { ...typography.body, color: colors.text, marginBottom: spacing.md },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, marginBottom: spacing.md },
  originalPrice: { ...typography.body, color: colors.textMuted, textDecorationLine: 'line-through' },
  discountedPrice: { ...typography.h2, color: colors.primary },
  discount: { ...typography.caption, color: colors.accent, fontWeight: '700' },
  detail: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
  button: { backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.md, alignItems: 'center' },
  buttonDisabled: { backgroundColor: colors.border },
  buttonText: { color: '#fff', fontWeight: '700' },
});
