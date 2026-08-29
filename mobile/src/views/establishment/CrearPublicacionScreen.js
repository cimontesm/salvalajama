import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, radius, typography } from '../../config/theme';
import { createPackage } from '../../services/packages.service';
import SelectField from '../../components/SelectField';
import { CATEGORIES } from '../../config/catalog';
import { formatApiError } from '../../utils/formatters';

const empty = { title: '', description: '', category: 'supermercado', original_price: '', discounted_price: '', quantity_total: '1', estimated_weight_kg: '', pickup_start: '', pickup_end: '', expires_at: '', image_url: '' };

export default function CrearPublicacionScreen({ navigation }) {
  const [form, setForm] = useState(empty); const [saving, setSaving] = useState(false);
  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));
  async function save() {
    if (!form.title || !form.category || !form.original_price || !form.discounted_price || !form.quantity_total || !form.pickup_start || !form.pickup_end) return Alert.alert('Faltan datos', 'Completa título, categoría, precios, cantidad y horario de retiro.');
    setSaving(true);
    try {
      await createPackage({ ...form, original_price: Number(form.original_price), discounted_price: Number(form.discounted_price), quantity_total: Number(form.quantity_total), estimated_weight_kg: Number(form.estimated_weight_kg || 0), expires_at: form.expires_at || null, image_url: form.image_url || null });
      Alert.alert('Listo', 'Publicación creada correctamente.', [{ text: 'Aceptar', onPress: () => navigation.goBack() }]);
    } catch (e) { Alert.alert('Error', formatApiError(e, 'No se pudo crear la publicación.')); }
    finally { setSaving(false); }
  }
  return <FormScreen title="Nueva publicación" form={form} set={set} saving={saving} onSave={save} onCancel={() => navigation.goBack()} />;
}

async function pickPhoto(set) {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    Alert.alert('Permiso necesario', 'Necesitamos acceso a tus fotos para elegir una imagen.');
    return;
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.4,
    base64: true,
  });
  if (result.canceled || !result.assets?.[0]?.base64) return;
  const asset = result.assets[0];
  const mime = asset.mimeType || 'image/jpeg';
  set('image_url', `data:${mime};base64,${asset.base64}`);
}

export function FormScreen({ title, form, set, saving, onSave, onCancel, editing = false }) {
  const fields = [
    ['title', 'Título', 'Ej. Caja de frutas maduras'], ['description', 'Descripción', 'Qué incluye el paquete'],
    ['original_price', 'Precio original', '6.00'], ['discounted_price', 'Precio de oferta', '2.50'], ['quantity_total', 'Cantidad total', '10'], ...(editing ? [['quantity_available', 'Cantidad disponible', '8']] : []),
    ['estimated_weight_kg', 'Peso estimado por paquete (kg)', '1.2'], ['pickup_start', 'Inicio retiro', '2026-08-23 18:00'], ['pickup_end', 'Fin retiro', '2026-08-23 20:00'], ['expires_at', 'Fecha de vencimiento (opcional)', '2026-08-23 23:59'],
  ];
  return <ScrollView style={styles.safe} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <Text style={styles.subtitle}>Los horarios usan formato YYYY-MM-DD HH:MM.</Text>
    <View style={styles.field}>
      <Text style={styles.label}>Foto del paquete</Text>
      {form.image_url ? <Image source={{ uri: form.image_url }} style={styles.preview} resizeMode="cover" /> : null}
      <TouchableOpacity style={styles.photoButton} onPress={() => pickPhoto(set)}>
        <Text style={styles.photoButtonText}>{form.image_url ? 'Cambiar foto' : 'Elegir foto de la galería'}</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.field}>
      <SelectField label="Categoría" value={form.category} options={CATEGORIES} onChange={(v) => set('category', v)} placeholder="Selecciona una categoría" />
    </View>
    {fields.map(([key, label, placeholder]) => <View key={key} style={styles.field}><Text style={styles.label}>{label}</Text><TextInput value={String(form[key] ?? '')} onChangeText={v => set(key, v)} placeholder={placeholder} style={[styles.input, key === 'description' && styles.textarea]} multiline={key === 'description'} /></View>)}
    <TouchableOpacity disabled={saving} style={styles.save} onPress={onSave}><Text style={styles.saveText}>{saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear publicación'}</Text></TouchableOpacity>
    <TouchableOpacity disabled={saving} style={styles.cancel} onPress={onCancel}><Text style={styles.cancelText}>Cancelar</Text></TouchableOpacity>
  </ScrollView>;
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.lg, paddingBottom: spacing.xl }, title: { ...typography.h1, color: colors.text }, subtitle: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.lg }, field: { marginBottom: spacing.md }, label: { ...typography.caption, color: colors.text, fontWeight: '700', marginBottom: spacing.xs }, input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, color: colors.text }, textarea: { minHeight: 90, textAlignVertical: 'top' }, preview: { width: '100%', height: 160, borderRadius: radius.md, marginBottom: spacing.sm, backgroundColor: colors.surface }, photoButton: { borderWidth: 1, borderColor: colors.primary, borderRadius: radius.md, padding: spacing.sm, alignItems: 'center' }, photoButtonText: { color: colors.primary, fontWeight: '700' }, save: { backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', marginTop: spacing.sm }, saveText: { color: '#fff', fontWeight: '700' }, cancel: { padding: spacing.md, alignItems: 'center' }, cancelText: { color: colors.danger, fontWeight: '700' } });
