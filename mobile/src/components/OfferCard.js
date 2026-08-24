import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../config/theme';
import { formatPrice, formatTime } from '../utils/formatters';

export default function OfferCard({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Ionicons name="restaurant-outline" size={28} color={colors.primaryLight} />
        </View>
      )}
      <View style={styles.body}>
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
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  image: { width: '100%', height: 120 },
  imagePlaceholder: { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  body: { padding: spacing.md },
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
