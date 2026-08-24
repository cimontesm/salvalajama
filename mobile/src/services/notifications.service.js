import client from '../api/client';

export async function getNotifications() {
  const { data } = await client.get('/notifications');
  return { items: data.data ?? [], unreadCount: data.unread_count ?? 0 };
}

export async function markNotificationAsRead(id) {
  const { data } = await client.patch(`/notifications/${id}/read`);
  return data.data;
}

export async function markAllNotificationsAsRead() {
  const { data } = await client.patch('/notifications/read-all');
  return data;
}

export default client;
