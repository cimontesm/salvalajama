import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../../config/theme';
import { capitalize } from '../../utils/formatters';
import { getPackages } from '../../services/packages.service';

const GUAYAQUIL_REGION = {
  latitude: -2.17,
  longitude: -79.9,
  latitudeDelta: 0.15,
  longitudeDelta: 0.15,
};

export default function MapaScreen() {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    getPackages({ available: true })
      .then((data) => mounted && setPackages(data ?? []))
      .catch((e) => mounted && setError(e?.response?.data?.message ?? 'No se pudo cargar el mapa.'))
      .finally(() => mounted && setIsLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const establishments = useMemo(() => {
    const map = new Map();
    packages.forEach((pkg) => {
      const est = pkg.establishment;
      if (est?.id && est.latitude && est.longitude && !map.has(est.id)) {
        map.set(est.id, { ...est, offersCount: 1 });
      } else if (est?.id && map.has(est.id)) {
        map.get(est.id).offersCount += 1;
      }
    });
    return Array.from(map.values());
  }, [packages]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator style={{ marginTop: spacing.xl }} size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <MapView style={styles.map} initialRegion={GUAYAQUIL_REGION}>
          {establishments.map((est) => (
            <Marker key={est.id} coordinate={{ latitude: est.latitude, longitude: est.longitude }} pinColor={colors.primary}>
              <Callout>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>{est.name}</Text>
                  <Text style={styles.calloutMeta}>{capitalize(est.category)}</Text>
                  <Text style={styles.calloutMeta}>{est.address}</Text>
                  <Text style={styles.calloutOffers}>{est.offersCount} oferta(s) disponible(s)</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  map: { flex: 1 },
  callout: { minWidth: 160, padding: spacing.xs },
  calloutTitle: { ...typography.body, fontWeight: '700', color: colors.text },
  calloutMeta: { ...typography.caption, color: colors.textMuted },
  calloutOffers: { ...typography.caption, color: colors.primary, fontWeight: '700', marginTop: 4 },
  error: { ...typography.body, color: colors.danger, textAlign: 'center', marginTop: spacing.xl, paddingHorizontal: spacing.lg },
});
