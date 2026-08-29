import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, radius, typography } from '../../config/theme';
import ListHeader from '../../components/ListHeader';
import SelectField from '../../components/SelectField';
import { CATEGORIES } from '../../config/catalog';
import { getMyProfile, updateEstablishment, createEstablishment } from '../../services/establishments.service';
import { formatApiError, capitalize } from '../../utils/formatters';

const STATUS_STYLE = {
  aprobado: { bg: '#2E7D32', label: 'Aprobado' },
  pendiente: { bg: '#FF7A00', label: 'Pendiente de aprobación' },
  suspendido: { bg: '#C62828', label: 'Suspendido' },
};

const empty = { name: '', category: '', address: '', latitude: '', longitude: '', opening_hours: '' };

function toFormState(data) {
  return {
    name: data.name ?? '',
    category: data.category ?? '',
    address: data.address ?? '',
    latitude: String(data.latitude ?? ''),
    longitude: String(data.longitude ?? ''),
    opening_hours: data.opening_hours ?? '',
  };
}

// Panel principal del establecimiento: autoservicio (no depende de params de
// navegación, resuelve el negocio del dueño autenticado). Si todavía no tiene
// un establecimiento (por ejemplo, se acaba de registrar), muestra un
// formulario para crearlo en vez de un mensaje sin salida; si ya lo tiene,
// muestra su perfil editable.
export default function PanelScreen() {
  const [establishment, setEstablishment] = useState(null);
  const [needsCreation, setNeedsCreation] = useState(false);
  const [form, setForm] = useState(empty);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await getMyProfile();
      setEstablishment(data);
      setNeedsCreation(false);
      setForm(toFormState(data));
    } catch (e) {
      if (e?.response?.status === 422) {
        // No tiene establecimiento todavía: mostramos el formulario de creación.
        setEstablishment(null);
        setNeedsCreation(true);
        setForm(empty);
      } else {
        setLoadError(formatApiError(e, 'No se pudo cargar tu establecimiento.'));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  function validate() {
    if (!form.name || !form.category || !form.address || !form.latitude || !form.longitude) {
      Alert.alert('Faltan datos', 'Completa nombre, categoría, dirección, latitud y longitud.');
      return false;
    }
    return true;
  }

  async function handleCreate() {
    if (!validate()) return;
    setSaving(true);
    try {
      const created = await createEstablishment({
        name: form.name,
        category: form.category,
        address: form.address,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        opening_hours: form.opening_hours || null,
      });
      setEstablishment(created);
      setNeedsCreation(false);
      Alert.alert('¡Listo!', 'Tu establecimiento fue creado y está pendiente de aprobación por un administrador.');
    } catch (e) {
      Alert.alert('No se pudo crear tu establecimiento', formatApiError(e, 'Revisa los datos ingresados.'));
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate() {
    if (!validate()) return;
    setSaving(true);
    try {
      const updated = await updateEstablishment(establishment.id, {
        name: form.name,
        category: form.category,
        address: form.address,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        opening_hours: form.opening_hours || null,
      });
      setEstablishment(updated);
      Alert.alert('Listo', 'Tu perfil fue actualizado.');
    } catch (e) {
      Alert.alert('No se pudo guardar', formatApiError(e, 'Revisa los datos ingresados.'));
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <ActivityIndicator style={styles.loading} size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (loadError) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={styles.content}>
          <ListHeader title="Mi negocio" subtitle="Perfil de tu establecimiento" />
          <Text style={styles.error}>{loadError}</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const formFields = (
    <>
      <Text style={styles.label}>Nombre</Text>
      <TextInput style={styles.input} value={form.name} onChangeText={(v) => set('name', v)} placeholder="Nombre de tu negocio" placeholderTextColor={colors.textMuted} />

      <SelectField
        label="Categoría"
        value={form.category}
        options={CATEGORIES}
        onChange={(v) => set('category', v)}
        placeholder="Selecciona una categoría"
      />

      <Text style={styles.label}>Dirección</Text>
      <TextInput style={styles.input} value={form.address} onChangeText={(v) => set('address', v)} placeholder="Calle, referencia, ciudad" placeholderTextColor={colors.textMuted} />

      <Text style={styles.label}>Latitud</Text>
      <TextInput style={styles.input} value={form.latitude} onChangeText={(v) => set('latitude', v)} keyboardType="numbers-and-punctuation" placeholder="-2.1560" placeholderTextColor={colors.textMuted} />

      <Text style={styles.label}>Longitud</Text>
      <TextInput style={styles.input} value={form.longitude} onChangeText={(v) => set('longitude', v)} keyboardType="numbers-and-punctuation" placeholder="-79.9080" placeholderTextColor={colors.textMuted} />

      <Text style={styles.label}>Horario (opcional)</Text>
      <TextInput style={styles.input} value={form.opening_hours} onChangeText={(v) => set('opening_hours', v)} placeholder="Lun-Sáb 07:00-20:00" placeholderTextColor={colors.textMuted} />
    </>
  );

  if (needsCreation) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ListHeader title="Mi negocio" subtitle="Crea el perfil de tu establecimiento" />
          <Text style={styles.intro}>
            Aún no tienes un establecimiento registrado. Complétalo para empezar a publicar ofertas — quedará pendiente de aprobación por un administrador.
          </Text>

          {formFields}

          <TouchableOpacity style={styles.save} disabled={saving} onPress={handleCreate}>
            <Text style={styles.saveText}>{saving ? 'Creando…' : 'Crear mi negocio'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const statusInfo = STATUS_STYLE[establishment?.status] ?? { bg: colors.textMuted, label: capitalize(establishment?.status) };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ListHeader title="Mi negocio" subtitle="Perfil de tu establecimiento" />

        <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
          <Text style={styles.statusText}>{statusInfo.label}</Text>
        </View>
        {establishment?.status === 'pendiente' ? (
          <Text style={styles.statusHint}>Un administrador debe aprobar tu establecimiento antes de que aparezca en el catálogo de clientes.</Text>
        ) : null}
        {establishment?.status === 'suspendido' ? (
          <Text style={styles.statusHint}>Tu establecimiento está suspendido: tus publicaciones no son visibles para los clientes.</Text>
        ) : null}

        {formFields}

        <TouchableOpacity style={styles.save} disabled={saving} onPress={handleUpdate}>
          <Text style={styles.saveText}>{saving ? 'Guardando…' : 'Guardar cambios'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  loading: { marginTop: spacing.xl },
  error: { ...typography.body, color: colors.danger, textAlign: 'center', marginTop: spacing.xl },
  intro: { ...typography.body, color: colors.textMuted, marginBottom: spacing.lg },
  statusBadge: { alignSelf: 'flex-start', borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, marginBottom: spacing.sm },
  statusText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  statusHint: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.md },
  label: { ...typography.caption, color: colors.text, fontWeight: '700', marginBottom: spacing.xs, marginTop: spacing.sm },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, color: colors.text },
  save: { backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', marginTop: spacing.lg },
  saveText: { color: '#fff', fontWeight: '700' },
});
