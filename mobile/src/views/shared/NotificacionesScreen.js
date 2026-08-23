import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../../config/theme';
import { useNotificationsViewModel } from '../../viewmodels/useNotificationsViewModel';
import { formatDate } from '../../utils/formatters';

export default function NotificacionesScreen() {
  const { items, unreadCount, isLoading, reload, markRead, markAllRead } = useNotificationsViewModel();
  return <SafeAreaView style={styles.safe}><FlatList data={items} keyExtractor={item => String(item.id)} refreshing={isLoading} onRefresh={reload} contentContainerStyle={styles.list}
    ListHeaderComponent={<View style={styles.header}><View><Text style={styles.title}>Notificaciones</Text><Text style={styles.subtitle}>{unreadCount} sin leer</Text></View>{unreadCount > 0 ? <TouchableOpacity onPress={markAllRead}><Text style={styles.readAll}>Marcar todas</Text></TouchableOpacity> : null}</View>}
    ListEmptyComponent={isLoading ? <ActivityIndicator size="large" color={colors.primary} /> : <Text style={styles.empty}>No tienes notificaciones.</Text>}
    renderItem={({ item }) => <TouchableOpacity style={[styles.card, !item.read_at && styles.unread]} onPress={() => !item.read_at && markRead(item.id)}><Text style={styles.cardTitle}>{item.title}</Text><Text style={styles.body}>{item.body}</Text><Text style={styles.date}>{formatDate(item.created_at)}</Text></TouchableOpacity>}
  /></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.background }, list: { padding: spacing.lg }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }, title: { ...typography.h1, color: colors.text }, subtitle: { ...typography.caption, color: colors.textMuted }, readAll: { color: colors.primary, fontWeight: '700', fontSize: 12 }, card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm }, unread: { borderColor: colors.primaryLight, borderWidth: 2 }, cardTitle: { ...typography.h3, color: colors.text }, body: { ...typography.body, color: colors.textMuted, marginTop: spacing.xs }, date: { ...typography.caption, color: colors.textMuted, marginTop: spacing.sm }, empty: { textAlign: 'center', color: colors.textMuted, marginTop: spacing.xl } });
