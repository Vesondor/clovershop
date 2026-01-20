import { useState, useEffect } from "react";

// Simplified notification hook without auth
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // In a real app without auth, you might fetch from local storage or public endpoint
  // For now, return empty state

  const markAsRead = async (id: string) => {
    // No-op
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    loading: false,
  };
};
