import React, { createContext, useContext, useState, useEffect } from "react";

export interface Notification {
  id: string;
  type:
    | "bid"
    | "bid_received"
    | "bid_placed"
    | "message"
    | "payment"
    | "task_update"
    | "system";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  taskId?: string;
  fromUser?: string;
  priority: "low" | "medium" | "high";
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "read">,
  ) => void;
  addNotificationForUser: (
    userId: string,
    notification: Omit<Notification, "id" | "timestamp" | "read">,
  ) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

// Global notification store for all users (in a real app, this would be in a backend)
const globalNotifications: { [userId: string]: Notification[] } = {};

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "bid",
      title: "New Bid Received",
      message:
        "Mike Wilson placed a ₹5,833 bid on your kitchen sink repair task",
      timestamp: "2024-01-15T15:30:00Z",
      read: false,
      actionUrl: "/task/123",
      taskId: "123",
      fromUser: "Mike Wilson",
      priority: "high",
    },
    {
      id: "2",
      type: "message",
      title: "New Message",
      message: "Sarah Johnson sent you a message about the moving task",
      timestamp: "2024-01-15T14:45:00Z",
      read: false,
      actionUrl: "/chat/456",
      fromUser: "Sarah Johnson",
      priority: "medium",
    },
    {
      id: "3",
      type: "payment",
      title: "Payment Released",
      message: "₹6,250 has been released for the completed kitchen sink repair",
      timestamp: "2024-01-15T13:20:00Z",
      read: true,
      actionUrl: "/wallet",
      taskId: "123",
      priority: "medium",
    },
    {
      id: "4",
      type: "task_update",
      title: "Task Completed",
      message: "Your moving assistance task has been marked as completed",
      timestamp: "2024-01-15T12:15:00Z",
      read: true,
      actionUrl: "/task/789",
      taskId: "789",
      priority: "medium",
    },
    {
      id: "5",
      type: "system",
      title: "Account Verified",
      message: "Your identity verification has been approved!",
      timestamp: "2024-01-14T16:30:00Z",
      read: false,
      actionUrl: "/profile",
      priority: "low",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true })),
    );
  };

  const addNotification = (
    notificationData: Omit<Notification, "id" | "timestamp" | "read">,
  ) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);
  };

  const addNotificationForUser = (
    userId: string,
    notificationData: Omit<Notification, "id" | "timestamp" | "read">,
  ) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    // Store in global notifications for the target user
    if (!globalNotifications[userId]) {
      globalNotifications[userId] = [];
    }
    globalNotifications[userId].unshift(newNotification);

    // If the target user is the current user, also add to local state
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Simulate receiving new notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        // 5% chance every 5 seconds
        const mockNotifications = [
          {
            type: "bid" as const,
            title: "New Bid Received",
            message: "John Smith placed a bid on your task",
            actionUrl: "/tasks",
            priority: "high" as const,
          },
          {
            type: "message" as const,
            title: "New Message",
            message: "You have a new message from a customer",
            actionUrl: "/chat",
            priority: "medium" as const,
          },
        ];

        const randomNotification =
          mockNotifications[
            Math.floor(Math.random() * mockNotifications.length)
          ];
        addNotification(randomNotification);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        addNotificationForUser,
        removeNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
}
