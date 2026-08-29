import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../config/theme';

export default function RatingModal({ visible, onCancel, onSubmit, title = 'Califica tu pedido' }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    setSaving(true);
    try {
      await onSubmit({ rating, comment });
      setRating(5);
      setComment('');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((n) => (
              <TouchableOpacity key={n} onPress={() => setRating(n)} hitSlop={6}>
                <Ionicons
                  name={n <= rating ? 'star' : 'star-outline'}
                  size={32}
                  color={colors.accent}
                  style={styles.star}
                />
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.input}
            placeholder="Cuéntanos cómo estuvo (opcional)"
            value={comment}
            onChangeText={setComment}
            multiline
          />
          <TouchableOpacity style={styles.submit} disabled={saving} onPress={handleSubmit}>
            <Text style={styles.submitText}>{saving ? 'Enviando…' : 'Enviar calificación'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCancel} disabled={saving}>
            <Text style={styles.cancel}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', padding: spacing.lg },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg },
  title: { ...typography.h3, color: colors.text, marginBottom: spacing.md, textAlign: 'center' },
  stars: { flexDirection: 'row', justifyContent: 'center', marginBottom: spacing.md },
  star: { marginHorizontal: 4 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    minHeight: 70,
    textAlignVertical: 'top',
    marginBottom: spacing.md,
    color: colors.text,
  },
  submit: { backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', marginBottom: spacing.sm },
  submitText: { color: '#fff', fontWeight: '700' },
  cancel: { textAlign: 'center', color: colors.textMuted },
});
