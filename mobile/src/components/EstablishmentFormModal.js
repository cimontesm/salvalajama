import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { colors, spacing, radius, typography } from '../config/theme';
import SelectField from './SelectField';
import { CATEGORIES } from '../config/catalog';

const empty = { owner_email: '', name: '', category: '', address: '', latitude: '', longitude: '', opening_hours: '' };

export default function EstablishmentFormModal({ visible, establishment, onCancel, onSubmit }) {
  const editing = !!establishment;
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setForm(
        establishment
          ? {
              owner_email: '',
              name: establishment.name ?? '',
              category: establishment.category ?? '',
              address: establishment.address ?? '',
              latitude: String(establishment.latitude ?? ''),
              longitude: String(establishment.longitude ?? ''),
              opening_hours: establishment.opening_hours ?? '',
            }
          : empty
      );
    }
  }, [visible, establishment]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  async function handleSubmit() {
    if (!form.name || !form.category || !form.address || !form.latitude || !form.longitude || (!editing && !form.owner_email)) {
      Alert.alert('Faltan datos', 'Completa nombre, categoría, dirección, latitud, longitud' + (editing ? '.' : ' y el correo del dueño.'));
      return;
    }
    setSaving(true);
    try {
      const base = {
        name: form.name,
        category: form.category,
        address: form.address,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        opening_hours: form.opening_hours || null,
      };
      await onSubmit(editing ? base : { ...base, owner_email: form.owner_email });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.title}>{editing ? 'Editar establecimiento' : 'Nuevo establecimiento'}</Text>

            {!editing ? (
              <>
                <Text style={styles.label}>Correo del dueño (rol establecimiento)</Text>
                <TextInput style={styles.input} value={form.owner_email} onChangeText={(v) => set('owner_email', v)} autoCapitalize="none" keyboardType="email-address" placeholder="dueno@correo.com" />
              </>
            ) : null}

            <Text style={styles.label}>Nombre</Text>
            <TextInput style={styles.input} value={form.name} onChangeText={(v) => set('name', v)} />

            <SelectField
              label="Categoría"
              value={form.category}
              options={CATEGORIES}
              onChange={(v) => set('category', v)}
              placeholder="Selecciona una categoría"
            />

            <Text style={styles.label}>Dirección</Text>
            <TextInput style={styles.input} value={form.address} onChangeText={(v) => set('address', v)} />

            <Text style={styles.label}>Latitud</Text>
            <TextInput style={styles.input} value={form.latitude} onChangeText={(v) => set('latitude', v)} keyboardType="numbers-and-punctuation" placeholder="-2.1560" />

            <Text style={styles.label}>Longitud</Text>
            <TextInput style={styles.input} value={form.longitude} onChangeText={(v) => set('longitude', v)} keyboardType="numbers-and-punctuation" placeholder="-79.9080" />

            <Text style={styles.label}>Horario (opcional)</Text>
            <TextInput style={styles.input} value={form.opening_hours} onChangeText={(v) => set('opening_hours', v)} placeholder="Lun-Sáb 07:00-20:00" />

            <TouchableOpacity style={styles.submit} disabled={saving} onPress={handleSubmit}>
              <Text style={styles.submitText}>{saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear establecimiento'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onCancel} disabled={saving}>
              <Text style={styles.cancel}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg },
  title: { ...typography.h3, color: colors.text, marginBottom: spacing.md, textAlign: 'center' },
  label: { ...typography.caption, color: colors.text, fontWeight: '700', marginBottom: spacing.xs, marginTop: spacing.sm },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, color: colors.text, backgroundColor: colors.background },
  submit: { backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.sm },
  submitText: { color: '#fff', fontWeight: '700' },
  cancel: { textAlign: 'center', color: colors.textMuted },
});
