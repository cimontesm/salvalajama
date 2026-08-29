import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PasswordInput from '../../components/PasswordInput';
import { colors, spacing, radius, typography } from '../../config/theme';
import { useAuthViewModel } from '../../viewmodels/useAuthViewModel';
import { formatApiError } from '../../utils/formatters';

export default function LoginScreen({ navigation }) {
  const { submitLogin, isSubmitting } = useAuthViewModel();
  const [email, setEmail] = useState('ana@demo.ec');
  const [password, setPassword] = useState('');

  async function handleSubmit() {
    try {
      await submitLogin(email, password);
    } catch (e) {
      Alert.alert('No se pudo iniciar sesión', formatApiError(e, 'Verifica tus credenciales.'));
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

          <Text style={styles.title}>Hola 👋</Text>
          <Text style={styles.subtitle}>Inicia sesión para seguir rescatando comida.</Text>

          <View style={styles.card}>
            <View style={styles.field}>
              <Text style={styles.label}>Correo</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="tucorreo@ejemplo.com"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Contraseña</Text>
              <PasswordInput value={password} onChangeText={setPassword} />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isSubmitting} activeOpacity={0.85}>
              <Text style={styles.buttonText}>{isSubmitting ? 'Ingresando…' : 'Ingresar'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.linkWrap}>
            <Text style={styles.link}>¿No tienes cuenta? <Text style={styles.linkStrong}>Regístrate</Text></Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { flexGrow: 1, padding: spacing.lg, paddingTop: spacing.xl, justifyContent: 'center' },
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
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonText: { color: '#fff', fontWeight: '700' },
  linkWrap: { marginTop: spacing.lg, alignItems: 'center' },
  link: { color: colors.textMuted },
  linkStrong: { color: colors.primary, fontWeight: '700' },
});
