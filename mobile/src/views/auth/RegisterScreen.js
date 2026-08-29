import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PasswordInput from '../../components/PasswordInput';
import { colors, spacing, radius, typography } from '../../config/theme';
import { useAuthViewModel } from '../../viewmodels/useAuthViewModel';
import { formatApiError } from '../../utils/formatters';

const ROLES = [
  { value: 'cliente', label: 'Cliente' },
  { value: 'establecimiento', label: 'Establecimiento' },
];

export default function RegisterScreen({ navigation }) {
  const { submitRegister, isSubmitting } = useAuthViewModel();
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '', role: 'cliente' });

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    try {
      await submitRegister(form);
    } catch (e) {
      Alert.alert('No se pudo crear la cuenta', formatApiError(e, 'Revisa los datos ingresados.'));
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.brand}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoEmoji}>🌱</Text>
            </View>
            <Text style={styles.brandName}>Salva la Jama</Text>
          </View>

          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>Únete y ayuda a reducir el desperdicio de comida.</Text>

          <View style={styles.card}>
            <View style={styles.field}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput style={styles.input} value={form.name} onChangeText={(v) => setField('name', v)} placeholderTextColor={colors.textMuted} />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Correo</Text>
              <TextInput
                style={styles.input}
                value={form.email}
                onChangeText={(v) => setField('email', v)}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor={colors.textMuted}
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
            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isSubmitting} activeOpacity={0.85}>
              <Text style={styles.buttonText}>{isSubmitting ? 'Creando…' : 'Crear cuenta'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkWrap}>
            <Text style={styles.link}>Ya tengo cuenta</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { flexGrow: 1, padding: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xl, justifyContent: 'center' },
  brand: { alignItems: 'center', marginBottom: spacing.lg },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  logoEmoji: { fontSize: 28 },
  brandName: { ...typography.h3, color: colors.primaryDark, fontWeight: '700' },
  title: { ...typography.h1, color: colors.text, textAlign: 'center' },
  subtitle: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xs, marginBottom: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  field: { marginBottom: spacing.md },
  label: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.xs, fontWeight: '700' },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.background,
    color: colors.text,
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
  linkWrap: { marginTop: spacing.lg, alignItems: 'center' },
  link: { color: colors.primary, fontWeight: '700' },
});
