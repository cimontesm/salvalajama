import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../config/theme';
import { capitalize, formatApiError } from '../../utils/formatters';
import { useAdminUsers } from '../../viewmodels/useAdminViewModel';
import ListHeader from '../../components/ListHeader';
import UserFormModal from '../../components/UserFormModal';

const ROLE_LABEL = { cliente: 'Cliente', establecimiento: 'Establecimiento', administrador: 'Admin' };

export default function UsuariosScreen() {
  const { users, isLoading, error, reload, create, update, setStatus, remove } = useAdminUsers();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  function openCreate() {
    setEditingUser(null);
    setModalVisible(true);
  }

  function openEdit(user) {
    setEditingUser(user);
    setModalVisible(true);
  }

  async function handleSubmit(payload) {
    try {
      if (editingUser) {
        await update(editingUser.id, payload);
      } else {
        await create(payload);
      }
      setModalVisible(false);
    } catch (e) {
      Alert.alert('Error', formatApiError(e, 'No se pudo guardar el usuario.'));
    }
  }

  function toggle(user) {
    const next = user.status === 'activo' ? 'suspendido' : 'activo';
    const verb = next === 'suspendido' ? 'suspender' : 'activar';
    Alert.alert('Confirmar', `¿Quieres ${verb} a ${user.name}?`, [
      { text: 'No', style: 'cancel' },
      {
        text: 'Sí',
        onPress: async () => {
          try {
            await setStatus(user.id, next);
          } catch (e) {
            Alert.alert('Error', formatApiError(e, 'No se pudo actualizar.'));
          }
        },
      },
    ]);
  }

  function confirmDelete(user) {
    Alert.alert('Eliminar usuario', `¿Eliminar a ${user.name}? Esta acción no se puede deshacer.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await remove(user.id);
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
        data={users}
        keyExtractor={(item) => String(item.id)}
        refreshing={isLoading}
        onRefresh={reload}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <ListHeader title="Usuarios" subtitle={`${users.length} en total`} onAdd={openCreate} addLabel="Nuevo" />
        }
        ListEmptyComponent={
          isLoading ? <ActivityIndicator size="large" color={colors.primary} /> : <Text style={styles.empty}>{error ?? 'No hay usuarios.'}</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.name}>{item.name}</Text>
              <View style={[styles.badge, item.status === 'activo' ? styles.badgeOk : styles.badgeDanger]}>
                <Text style={styles.badgeText}>{capitalize(item.status)}</Text>
              </View>
            </View>
            <Text style={styles.detail}>{item.email}</Text>
            <Text style={styles.detail}>{ROLE_LABEL[item.role] ?? item.role} · {item.city ?? 'sin ciudad'}</Text>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.iconAction} onPress={() => openEdit(item)}>
                <Ionicons name="create-outline" size={16} color={colors.primary} />
                <Text style={styles.actionText}>Editar</Text>
              </TouchableOpacity>
              {item.role !== 'administrador' ? (
                <TouchableOpacity style={styles.iconAction} onPress={() => toggle(item)}>
                  <Ionicons name={item.status === 'activo' ? 'pause-outline' : 'play-outline'} size={16} color={colors.primary} />
                  <Text style={styles.actionText}>{item.status === 'activo' ? 'Suspender' : 'Activar'}</Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity style={styles.iconActionDanger} onPress={() => confirmDelete(item)}>
                <Ionicons name="trash-outline" size={16} color={colors.danger} />
                <Text style={styles.actionDangerText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <UserFormModal visible={modalVisible} user={editingUser} onCancel={() => setModalVisible(false)} onSubmit={handleSubmit} />
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
  badgeOk: { backgroundColor: colors.primaryLight },
  badgeDanger: { backgroundColor: colors.danger },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm, flexWrap: 'wrap' },
  iconAction: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: colors.primary, borderRadius: radius.sm, paddingVertical: spacing.xs, paddingHorizontal: spacing.md },
  actionText: { color: colors.primary, fontWeight: '700', fontSize: 13 },
  iconActionDanger: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: colors.danger, borderRadius: radius.sm, paddingVertical: spacing.xs, paddingHorizontal: spacing.md },
  actionDangerText: { color: colors.danger, fontWeight: '700', fontSize: 13 },
  empty: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
});
