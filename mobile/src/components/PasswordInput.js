import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../config/theme';

export default function PasswordInput({ value, onChangeText, placeholder = '••••••••', style }) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={[styles.wrapper, style]}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!visible}
        placeholder={placeholder}
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.toggle} onPress={() => setVisible((v) => !v)} hitSlop={8}>
        <Ionicons name={visible ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  input: { flex: 1, padding: spacing.md },
  toggle: { paddingHorizontal: spacing.md },
});
