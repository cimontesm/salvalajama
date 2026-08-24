import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import Screen from '../../components/Screen';
import PasswordInput from '../../components/PasswordInput';
import { colors, spacing, radius, typography } from '../../config/theme';
import { useAuthViewModel } from '../../viewmodels/useAuthViewModel';

export default function LoginScreen({ navigation }) {
  const { submitLogin, isSubmitting, error } = useAuthViewModel();
  const [email, setEmail] = useState('ana@demo.ec');
  const [password, setPassword] = useState('');

  async function handleSubmit() {
    try {
      await submitLogin(email, password);
    } catch (e) {
      Alert.alert('No se pudo iniciar sesión', e?.response?.data?.message ?? e?.message ?? 'Verifica tus credenciales.');
    }
  }

  return (
    <Screen title="Hola 👋" subtitle="Inicia sesión en Salva la Jama">
      <View style={styles.field}>
        <Text style={styles.label}>Correo</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="tucorreo@ejemplo.com"
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Contraseña</Text>
        <PasswordInput value={password} onChangeText={setPassword} />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isSubmitting}>
        <Text style={styles.buttonText}>{isSubmitting ? 'Ingresando…' : 'Ingresar'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
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
