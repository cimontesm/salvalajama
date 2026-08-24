import { useCallback, useEffect, useState } from 'react';
import * as notificationService from '../services/notifications.service';

export function useNotificationsViewModel() {
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const reload = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await notificationService.getNotifications();
      setItems(result.items); setUnreadCount(result.unreadCount);
    } finally { setIsLoading(false); }
  }, []);

  const markRead = useCallback(async (id) => {
    await notificationService.markNotificationAsRead(id);
    await reload();
  }, [reload]);

  const markAllRead = useCallback(async () => {
    await notificationService.markAllNotificationsAsRead();
    await reload();
  }, [reload]);

  useEffect(() => { reload(); }, [reload]);
  return { items, unreadCount, isLoading, reload, markRead, markAllRead };
}
