import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../config/theme';
import { capitalize, formatApiError } from '../../utils/formatters';
import { useAdminEstablishments } from '../../viewmodels/useAdminViewModel';
import ListHeader from '../../components/ListHeader';
import EstablishmentFormModal from '../../components/EstablishmentFormModal';

const STATUS_STYLE = {
  aprobado: { bg: '#2E7D32', label: 'Aprobado' },
  pendiente: { bg: '#FF7A00', label: 'Pendiente' },
  suspendido: { bg: '#C62828', label: 'Suspendido' },
};

export default function EstablecimientosScreen() {
  const { establishments, isLoading, error, reload, create, update, setStatus, remove } = useAdminEstablishments();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEstablishment, setEditingEstablishment] = useState(null);

  function openCreate() {
    setEditingEstablishment(null);
    setModalVisible(true);
  }

  function openEdit(item) {
    setEditingEstablishment(item);
    setModalVisible(true);
  }

  async function handleSubmit(payload) {
    try {
      if (editingEstablishment) {
        await update(editingEstablishment.id, payload);
      } else {
        await create(payload);
      }
      setModalVisible(false);
    } catch (e) {
      Alert.alert('Error', formatApiError(e, 'No se pudo guardar el establecimiento.'));
    }
  }

  function changeStatus(item, status) {
    Alert.alert('Confirmar', `¿Cambiar el estado de ${item.name} a "${STATUS_STYLE[status]?.label ?? status}"?`, [
      { text: 'No', style: 'cancel' },
      {
        text: 'Sí',
        onPress: async () => {
          try {
            await setStatus(item.id, status);
          } catch (e) {
            Alert.alert('Error', formatApiError(e, 'No se pudo actualizar.'));
          }
        },
      },
    ]);
  }

  function confirmDelete(item) {
    Alert.alert('Eliminar establecimiento', `¿Eliminar "${item.name}"? Esta acción no se puede deshacer.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await remove(item.id);
          } catch (e) {
            Alert.alert('Error', formatApiError(e, 'No se pudo eliminar.'));
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <FlatList
        data={establishments}
        keyExtractor={(item) => String(item.id)}
        refreshing={isLoading}
        onRefresh={reload}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <ListHeader title="Establecimientos" subtitle={`${establishments.length} registrados`} onAdd={openCreate} addLabel="Nuevo" />
        }
        ListEmptyComponent={
          isLoading ? <ActivityIndicator size="large" color={colors.primary} /> : <Text style={styles.empty}>{error ?? 'No hay establecimientos.'}</Text>
        }
        renderItem={({ item }) => {
          const statusInfo = STATUS_STYLE[item.status] ?? { bg: colors.textMuted, label: item.status };
          return (
            <View style={styles.card}>
              <View style={styles.rowBetween}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={[styles.badge, { backgroundColor: statusInfo.bg }]}>
                  <Text style={styles.badgeText}>{statusInfo.label}</Text>
                </View>
              </View>
              <Text style={styles.detail}>{capitalize(item.category)} · {item.address}</Text>
              <Text style={styles.detail}>
                {item.packages_count ?? 0} publicaciones
                {item.average_rating ? ` · ${item.average_rating} ★` : ''}
              </Text>
              <View style={styles.actions}>
                {item.status !== 'aprobado' ? (
                  <TouchableOpacity style={styles.actionOk} onPress={() => changeStatus(item, 'aprobado')}>
                    <Text style={styles.actionOkText}>Aprobar</Text>
                  </TouchableOpacity>
                ) : null}
                {item.status !== 'suspendido' ? (
                  <TouchableOpacity style={styles.actionDanger} onPress={() => changeStatus(item, 'suspendido')}>
                    <Text style={styles.actionDangerText}>Suspender</Text>
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity style={styles.iconAction} onPress={() => openEdit(item)}>
                  <Ionicons name="create-outline" size={16} color={colors.primary} />
                  <Text style={styles.actionOkText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionDanger} onPress={() => confirmDelete(item)}>
                  <Ionicons name="trash-outline" size={16} color={colors.danger} />
                  <Text style={styles.actionDangerText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
      <EstablishmentFormModal
        visible={modalVisible}
        establishment={editingEstablishment}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { ...typography.h3, color: colors.text, flex: 1 },
  detail: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  badge: { borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm, flexWrap: 'wrap' },
  actionOk: { borderWidth: 1, borderColor: colors.primary, borderRadius: radius.sm, paddingVertical: spacing.xs, paddingHorizontal: spacing.md },
  actionOkText: { color: colors.primary, fontWeight: '700', fontSize: 13 },
  actionDanger: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: colors.danger, borderRadius: radius.sm, paddingVertical: spacing.xs, paddingHorizontal: spacing.md },
  actionDangerText: { color: colors.danger, fontWeight: '700', fontSize: 13 },
  iconAction: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: colors.primary, borderRadius: radius.sm, paddingVertical: spacing.xs, paddingHorizontal: spacing.md },
  empty: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
});
