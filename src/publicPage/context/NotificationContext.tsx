// src/context/NotificationContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthSession } from '../hooks/header/useAuthSession';
import { Award, PartyPopper, BellRing, CheckCircle2, Hand, GraduationCap, Trash2, } from 'lucide-react';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'course' | 'system' | 'achievement' | 'promo' | 'welcome' | 'remove' | 'success';
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (notif: Omit<AppNotification, 'id' | 'read' | 'time'>) => void;
  showToast: (notif: Omit<AppNotification, 'id' | 'read' | 'time'>) => void; 
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  // AQUÍ ES DONDE VA EL ESTADO DE LOS TOASTS (dentro del componente)
  const [activeToasts, setActiveToasts] = useState<AppNotification[]>([]);

  // Usamos tu hook
  const { user } = useAuthSession();

  // Usamos el email (o el name) en lugar de un id
  const userIdentifier = user?.email || user?.name;
  const storageKey = userIdentifier ? `virtualz_notifs_${userIdentifier}` : null;

  useEffect(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setNotifications(JSON.parse(saved));
      } else {
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

  // Función addNotification corregida
  const addNotification = (notif: Omit<AppNotification, 'id' | 'read' | 'time'>) => {
    const toastId = Date.now().toString();

    // Armamos la notificación completa con los datos faltantes
    const newNotif: AppNotification = {
      ...notif,
      id: toastId,
      read: false,
      time: 'Ahora' // Puedes cambiar esto por la hora real si lo prefieres
    };

    // 1. Lo guardamos en el historial de la campanita
    setNotifications(prev => [newNotif, ...prev]);

    // 2. Lo lanzamos a la pantalla como alerta flotante
    setActiveToasts(prev => [...prev, newNotif]);

    // 3. Lo desaparecemos de la pantalla después de 4 segundos
    setTimeout(() => {
      setActiveToasts(prev => prev.filter(toast => toast.id !== toastId));
    }, 4000);
  };

  // Función para mostrar Toasts sin guardar en el historial
  const showToast = (notif: Omit<AppNotification, 'id' | 'read' | 'time'>) => {
    const toastId = Date.now().toString();
    const newNotif: AppNotification = { 
      ...notif, 
      id: toastId,
      read: true, 
      time: 'Ahora' 
    };
    setActiveToasts(prev => [...prev, newNotif]);
    setTimeout(() => {
        setActiveToasts(prev => prev.filter(toast => toast.id !== toastId));
    }, 4000); 
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

  const ICON_MAP = {
    course: { icon: GraduationCap, colorClass: 'text-violet-400 bg-violet-400/10 border-violet-400/20' },
    system: { icon: BellRing, colorClass: 'text-gray-300 bg-white/5 border-white/10' },
    achievement: { icon: Award, colorClass: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
    promo: { icon: PartyPopper, colorClass: 'text-pink-400 bg-pink-400/10 border-pink-400/20' },
    welcome: { icon: Hand, colorClass: 'text-green-400 bg-green-400/10 border-green-400/20' },
    remove: { icon: Trash2, colorClass: 'text-red-400 bg-red-400/10 border-red-400/20' },
    success: { icon: CheckCircle2, colorClass: 'text-green-400 bg-green-400/10 border-green-400/20' }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, showToast, markAsRead, markAllAsRead, deleteNotification }}>
      {children}

      {/* --- CONTENEDOR FLOTANTE DE TOASTS --- */}
      <div className="fixed top-[85px] right-6 md:right-24 lg:right-[120px] xl:right-[calc(50vw-580px)] z-[99999] flex flex-col gap-3 pointer-events-none">
        {activeToasts.map((toast) => {
          // Obtenemos el icono y los colores (si no existe el tipo, usamos system por defecto)
          const { icon: Icon, colorClass } = ICON_MAP[toast.type] || ICON_MAP.system;

          return (
            <div
              key={toast.id}
              className="bg-[#151515] border border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-4 rounded-xl flex items-start gap-4 w-80 pointer-events-auto transition-all duration-300 animate-in fade-in slide-in-from-top-6"
            >
              {/* Renderizamos el icono con el fondo y borde que definiste */}
              <div className={`shrink-0 p-2 rounded-full border ${colorClass}`}>
                <Icon size={20} />
              </div>

              <div className="flex-1 mt-0.5">
                <h4 className="text-white font-bold text-sm mb-1">{toast.title}</h4>
                <p className="text-gray-300 text-xs leading-relaxed">{toast.message}</p>
              </div>
            </div>
          );
        })}
      </div>

    </NotificationContext.Provider>
  );
};

export const useNotificacion = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotificacion debe usarse dentro de un NotificationProvider");
  return context;
};