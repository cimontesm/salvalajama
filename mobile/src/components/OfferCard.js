import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../config/theme';
import { formatPrice, formatTime } from '../utils/formatters';

export default function OfferCard({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        {item.discount_percent > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>-{item.discount_percent}%</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.establishment} numberOfLines={1}>{item.establishment?.name}</Text>
      <View style={styles.priceRow}>
        {item.original_price > item.discounted_price ? (
          <Text style={styles.originalPrice}>{formatPrice(item.original_price)}</Text>
        ) : null}
        <Text style={styles.discountedPrice}>{formatPrice(item.discounted_price)}</Text>
      </View>
      <Text style={styles.meta}>
        {formatTime(item.pickup_start)} - {formatTime(item.pickup_end)} · {item.quantity_available} disponibles
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { ...typography.h3, color: colors.text, flex: 1, marginRight: spacing.sm },
  badge: { backgroundColor: colors.accent, borderRadius: radius.sm, paddingHorizontal: spacing.xs, paddingVertical: 2 },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  establishment: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs, marginTop: spacing.sm },
  originalPrice: { ...typography.body, color: colors.textMuted, textDecorationLine: 'line-through' },
  discountedPrice: { ...typography.h3, color: colors.primary },
  meta: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
});
