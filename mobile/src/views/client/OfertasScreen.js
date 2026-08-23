import React from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OfferCard from '../../components/OfferCard';
import { colors, spacing, radius, typography } from '../../config/theme';
import { useOffersViewModel } from '../../viewmodels/useOffersViewModel';

export default function OfertasScreen({ navigation }) {
  const {
    packages,
    isLoading,
    isRefreshing,
    error,
    search,
    setSearch,
    category,
    setCategory,
    categories,
    maxPrice,
    setMaxPrice,
    refresh,
  } = useOffersViewModel();

  const priceOptions = [null, 3, 5, 10];

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hola, Ana 🍽️</Text>
        <TextInput
          style={styles.search}
          placeholder="Buscar ofertas…"
          value={search}
          onChangeText={setSearch}
        />
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(c) => c}
          contentContainerStyle={styles.chipsRow}
          renderItem={({ item: c }) => (
            <TouchableOpacity
              style={[styles.chip, category === c && styles.chipActive]}
              onPress={() => setCategory(category === c ? null : c)}
            >
              <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
            </TouchableOpacity>
          )}
        />
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={priceOptions}
          keyExtractor={(p) => String(p)}
          contentContainerStyle={styles.chipsRow}
          renderItem={({ item: p }) => (
            <TouchableOpacity
              style={[styles.chip, maxPrice === p && styles.chipActive]}
              onPress={() => setMaxPrice(p)}
            >
              <Text style={[styles.chipText, maxPrice === p && styles.chipTextActive]}>
                {p ? `Hasta $${p}` : 'Cualquier precio'}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loading} size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={packages}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          refreshing={isRefreshing}
          onRefresh={refresh}
          ListEmptyComponent={
            <Text style={styles.empty}>{error ?? 'No hay ofertas disponibles por ahora.'}</Text>
          }
          renderItem={({ item }) => (
            <OfferCard item={item} onPress={() => navigation.navigate('DetalleOferta', { id: item.id })} />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  greeting: { ...typography.h2, color: colors.text, marginBottom: spacing.sm },
  search: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    backgroundColor: colors.surface,
    marginBottom: spacing.sm,
  },
  chipsRow: { gap: spacing.xs, paddingBottom: spacing.sm },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    marginRight: spacing.xs,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.text, fontSize: 13 },
  chipTextActive: { color: '#fff', fontWeight: '700' },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  loading: { marginTop: spacing.xl },
  empty: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
});
