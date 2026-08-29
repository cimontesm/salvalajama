import React, { useMemo, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../config/theme';
import { capitalize } from '../utils/formatters';

// Convierte "guayaquil", "GUAYAQUIL" o "  guayaquil  " en "Guayaquil", y
// "santo domingo" en "Santo Domingo" — para que un valor escrito a mano
// siempre quede guardado con el mismo formato, sin importar cómo lo tipeen.
function toTitleCase(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/(^|[\s-])([a-záéíóúñü])/g, (match, sep, letter) => sep + letter.toUpperCase());
}

// Campo de "elegir de una lista o autocompletar" reutilizable: se ve como un
// input normal, pero al tocarlo abre un modal con buscador + lista, para
// evitar valores libres inconsistentes (mayúsculas/minúsculas, acentos, etc.).
// allowCustom=true permite quedarse con lo escrito si no hay match exacto
// (normalizado a Formato Título); allowCustom=false obliga a elegir de la lista.
export default function SelectField({
  label,
  value,
  options,
  onChange,
  placeholder = 'Selecciona una opción',
  allowCustom = false,
  searchPlaceholder = 'Buscar…',
}) {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((option) => option.toLowerCase().includes(q));
  }, [options, query]);

  const exactMatch = options.some((option) => option.toLowerCase() === query.trim().toLowerCase());

  function open() {
    setQuery('');
    setVisible(true);
  }

  function selectOption(option) {
    onChange(option);
    setVisible(false);
  }

  function useCustomValue() {
    const clean = toTitleCase(query);
    if (!clean) return;
    onChange(clean);
    setVisible(false);
  }

  return (
    <>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TouchableOpacity style={styles.field} onPress={open} activeOpacity={0.7}>
        <Text style={value ? styles.value : styles.placeholder} numberOfLines={1}>
          {value ? capitalize(value) : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.card}>
            <Text style={styles.title}>{label || 'Selecciona una opción'}</Text>

            {(allowCustom || options.length > 6) && (
              <TextInput
                style={styles.search}
                value={query}
                onChangeText={setQuery}
                placeholder={searchPlaceholder}
                autoCapitalize="words"
              />
            )}

            <FlatList
              data={filtered}
              keyExtractor={(item) => item}
              style={styles.list}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={<Text style={styles.empty}>Sin resultados.</Text>}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.option} onPress={() => selectOption(item)}>
                  <Text style={[styles.optionText, item === value && styles.optionTextActive]}>{capitalize(item)}</Text>
                  {item === value ? <Ionicons name="checkmark" size={18} color={colors.primary} /> : null}
                </TouchableOpacity>
              )}
            />

            {allowCustom && query.trim() && !exactMatch ? (
              <TouchableOpacity style={styles.customButton} onPress={useCustomValue}>
                <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
                <Text style={styles.customButtonText}>Usar "{toTitleCase(query)}"</Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={styles.cancel}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  label: { ...typography.caption, color: colors.text, fontWeight: '700', marginBottom: spacing.xs, marginTop: spacing.sm },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  value: { color: colors.text, fontSize: 15, flex: 1, marginRight: spacing.sm },
  placeholder: { color: colors.textMuted, fontSize: 15, flex: 1, marginRight: spacing.sm },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', padding: spacing.lg },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, maxHeight: '75%' },
  title: { ...typography.h3, color: colors.text, marginBottom: spacing.md, textAlign: 'center' },
  search: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.text,
    backgroundColor: colors.background,
    marginBottom: spacing.sm,
  },
  list: { flexGrow: 0 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionText: { ...typography.body, color: colors.text },
  optionTextActive: { color: colors.primary, fontWeight: '700' },
  empty: { ...typography.caption, color: colors.textMuted, textAlign: 'center', paddingVertical: spacing.md },
  customButton: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.sm, paddingVertical: spacing.sm },
  customButtonText: { color: colors.primary, fontWeight: '700' },
  cancel: { textAlign: 'center', color: colors.textMuted, marginTop: spacing.sm },
});
