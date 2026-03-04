// src/context/NotificationContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthSession } from '../hooks/header/useAuthSession'; 

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'course' | 'system' | 'achievement' | 'promo';
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (notif: Omit<AppNotification, 'id' | 'read' | 'time'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  
  // Usamos tu hook
  const { user } = useAuthSession(); 
  
  // CORRECCIÓN AQUÍ: Usamos el email (o el name) en lugar de un id
  const userIdentifier = user?.email || user?.name;
  const storageKey = userIdentifier ? `virtualz_notifs_${userIdentifier}` : null;

  useEffect(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setNotifications(JSON.parse(saved));
      } else {
        // Si no hay nada guardado, simplemente iniciamos con el panel vacío
        setNotifications([]);
      }
    } else {
      setNotifications([]); 
    }
  }, [storageKey]);

  useEffect(() => {
    if (storageKey && notifications.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(notifications));
    } else if (storageKey && notifications.length === 0) {
      localStorage.removeItem(storageKey);
    }
  }, [notifications, storageKey]);

  const addNotification = (notif: Omit<AppNotification, 'id' | 'read' | 'time'>) => {
    if (!user) return; 
    const newNotif: AppNotification = {
      ...notif,
      id: crypto.randomUUID(),
      read: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, deleteNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificacion = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotificacion debe usarse dentro de un NotificationProvider");
  return context;
};