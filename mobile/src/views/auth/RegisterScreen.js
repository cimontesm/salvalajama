import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import Screen from '../../components/Screen';
import PasswordInput from '../../components/PasswordInput';
import { colors, spacing, radius, typography } from '../../config/theme';
import { useAuthViewModel } from '../../viewmodels/useAuthViewModel';

const ROLES = [
  { value: 'cliente', label: 'Cliente' },
  { value: 'establecimiento', label: 'Establecimiento' },
];

export default function RegisterScreen({ navigation }) {
  const { submitRegister, isSubmitting, error } = useAuthViewModel();
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '', role: 'cliente' });

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    try {
      await submitRegister(form);
    } catch (e) {
      Alert.alert('No se pudo crear la cuenta', JSON.stringify(e?.response?.data?.errors ?? e?.response?.data?.message ?? e?.message ?? 'Revisa los datos ingresados.'));
    }
  }

  return (
    <Screen title="Crear cuenta" subtitle="Únete a Salva la Jama">
      <View style={styles.field}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput style={styles.input} value={form.name} onChangeText={(v) => setField('name', v)} />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Correo</Text>
        <TextInput
          style={styles.input}
          value={form.email}
          onChangeText={(v) => setField('email', v)}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Contraseña</Text>
        <PasswordInput value={form.password} onChangeText={(v) => setField('password', v)} />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Confirmar contraseña</Text>
        <PasswordInput value={form.password_confirmation} onChangeText={(v) => setField('password_confirmation', v)} />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Tipo de cuenta</Text>
        <View style={styles.roleRow}>
          {ROLES.map((r) => (
            <TouchableOpacity
              key={r.value}
              style={[styles.roleChip, form.role === r.value && styles.roleChipActive]}
              onPress={() => setField('role', r.value)}
            >
              <Text style={[styles.roleChipText, form.role === r.value && styles.roleChipTextActive]}>{r.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isSubmitting}>
        <Text style={styles.buttonText}>{isSubmitting ? 'Creando…' : 'Crear cuenta'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Ya tengo cuenta</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: spacing.md },
  label: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.xs },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  roleRow: { flexDirection: 'row', gap: spacing.sm },
  roleChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  roleChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  roleChipText: { color: colors.text },
  roleChipTextActive: { color: '#fff', fontWeight: '700' },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonText: { color: '#fff', fontWeight: '700' },
  link: { color: colors.primary, textAlign: 'center', marginTop: spacing.md },
});
