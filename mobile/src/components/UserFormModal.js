import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { colors, spacing, radius, typography } from '../config/theme';
import SelectField from './SelectField';
import { CITIES } from '../config/catalog';

const ROLES = [
  { value: 'cliente', label: 'Cliente' },
  { value: 'establecimiento', label: 'Establecimiento' },
  { value: 'administrador', label: 'Admin' },
];

const empty = { name: '', email: '', password: '', phone: '', city: '', role: 'cliente' };

export default function UserFormModal({ visible, user, onCancel, onSubmit }) {
  const editing = !!user;
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setForm(user ? { name: user.name ?? '', email: user.email ?? '', password: '', phone: user.phone ?? '', city: user.city ?? '', role: user.role ?? 'cliente' } : empty);
    }
  }, [visible, user]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  async function handleSubmit() {
    if (!form.name || !form.email || (!editing && !form.password)) {
      Alert.alert('Faltan datos', 'Completa nombre, correo' + (editing ? '.' : ' y contraseña.'));
      return;
    }
    setSaving(true);
    try {
      const payload = editing
        ? { name: form.name, email: form.email, phone: form.phone || null, city: form.city || null, role: form.role }
        : { ...form, phone: form.phone || null, city: form.city || null };
      await onSubmit(payload);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.title}>{editing ? 'Editar usuario' : 'Nuevo usuario'}</Text>

            <Text style={styles.label}>Nombre</Text>
            <TextInput style={styles.input} value={form.name} onChangeText={(v) => set('name', v)} />

            <Text style={styles.label}>Correo</Text>
            <TextInput style={styles.input} value={form.email} onChangeText={(v) => set('email', v)} autoCapitalize="none" keyboardType="email-address" />

            {!editing ? (
              <>
                <Text style={styles.label}>Contraseña</Text>
                <TextInput style={styles.input} value={form.password} onChangeText={(v) => set('password', v)} secureTextEntry />
              </>
            ) : null}

            <Text style={styles.label}>Teléfono (opcional)</Text>
            <TextInput style={styles.input} value={form.phone} onChangeText={(v) => set('phone', v)} keyboardType="phone-pad" />

            <SelectField
              label="Ciudad (opcional)"
              value={form.city}
              options={CITIES}
              onChange={(v) => set('city', v)}
              placeholder="Selecciona una ciudad"
              searchPlaceholder="Buscar o escribir una ciudad…"
              allowCustom
            />

            <Text style={styles.label}>Rol</Text>
            <View style={styles.roleRow}>
              {ROLES.map((r) => (
                <TouchableOpacity
                  key={r.value}
                  style={[styles.roleChip, form.role === r.value && styles.roleChipActive]}
                  onPress={() => set('role', r.value)}
                >
                  <Text style={[styles.roleChipText, form.role === r.value && styles.roleChipTextActive]}>{r.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.submit} disabled={saving} onPress={handleSubmit}>
              <Text style={styles.submitText}>{saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear usuario'}</Text>
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
  roleRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  roleChip: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, paddingVertical: spacing.xs, paddingHorizontal: spacing.md },
  roleChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  roleChipText: { color: colors.text, fontSize: 13 },
  roleChipTextActive: { color: '#fff', fontWeight: '700' },
  submit: { backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.sm },
  submitText: { color: '#fff', fontWeight: '700' },
  cancel: { textAlign: 'center', color: colors.textMuted },
});
