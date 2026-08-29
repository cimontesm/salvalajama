import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../../config/theme';
import { useAdminPackages } from '../../viewmodels/useAdminViewModel';
import { formatPrice } from '../../utils/formatters';
import ListHeader from '../../components/ListHeader';

const STATUS_LABEL = { activo: 'Activo', agotado: 'Agotado', vencido: 'Vencido', inactivo: 'Inactivo' };

export default function PublicacionesScreen() {
  const { packages, isLoading, error, reload } = useAdminPackages();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <FlatList
        data={packages}
        keyExtractor={(item) => String(item.id)}
        refreshing={isLoading}
        onRefresh={reload}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <ListHeader title="Publicaciones" subtitle={`${packages.length} en la plataforma`} />
        }
        ListEmptyComponent={
          isLoading ? <ActivityIndicator size="large" color={colors.primary} /> : <Text style={styles.empty}>{error ?? 'No hay publicaciones.'}</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.name} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.status}>{STATUS_LABEL[item.status] ?? item.status}</Text>
            </View>
            <Text style={styles.detail}>{item.establishment?.name}</Text>
            <Text style={styles.detail}>
              {formatPrice(item.discounted_price)} · {item.quantity_available}/{item.quantity_total} disponibles
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { ...typography.h3, color: colors.text, flex: 1, marginRight: spacing.sm },
  status: { ...typography.caption, color: colors.primary, fontWeight: '700' },
  detail: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  empty: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
});
