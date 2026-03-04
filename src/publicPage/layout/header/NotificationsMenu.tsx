// src/components/header/NotificationsMenu.tsx
import React, { useRef } from 'react';
import { Award, PlayCircle, Gift, BellRing, CheckCircle2, X } from 'lucide-react';
import { useClickOutside } from '../../hooks/header/useClickOutside';
import { useNotificacion } from '../../context/NotificationContext'; // Importamos el hook

// Diccionario para saber qué ícono y color pintar según el 'type'
const ICON_MAP = {
  course: { icon: PlayCircle, colorClass: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20' },
  system: { icon: BellRing, colorClass: 'text-gray-300 bg-white/5 border-white/10' },
  achievement: { icon: Award, colorClass: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
  promo: { icon: Gift, colorClass: 'text-pink-400 bg-pink-400/10 border-pink-400/20' },
};

interface NotificationsMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

const NotificationsMenu: React.FC<NotificationsMenuProps> = ({ isOpen, setIsOpen, containerRef }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  
  // EXTRAEMOS LOS DATOS REALES DEL CONTEXTO
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotificacion();

  useClickOutside(containerRef ?? menuRef, () => setIsOpen(false));

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute top-full right-0 mt-4 w-80 sm:w-96 bg-[#050505]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_10px_50px_-10px_rgba(0,0,0,0.8)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2"
    >
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-white">Notificaciones</h3>
          {unreadCount > 0 && (
            <span className="bg-cyan-500/20 text-cyan-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-cyan-500/30">
              {unreadCount} nuevas
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <CheckCircle2 size={14} /> Leídas
          </button>
        )}
      </div>

      <div className="max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
        
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            // Asignamos el ícono basado en el tipo
            const style = ICON_MAP[notification.type] || ICON_MAP.system;
            const Icon = style.icon;

            return (
              <div 
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`group relative p-4 border-b border-white/5 hover:bg-white/[0.04] transition-colors cursor-pointer flex gap-3 ${!notification.read ? 'bg-white/[0.02]' : ''}`}
              >
                <div className={`mt-0.5 shrink-0 h-10 w-10 rounded-full border flex items-center justify-center ${style.colorClass}`}>
                  <Icon size={18} />
                </div>

                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className={`text-sm font-semibold truncate ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                      {notification.title}
                    </h4>
                    {!notification.read && (
                      <span className="shrink-0 mt-1.5 block h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                    {notification.message}
                  </p>
                  <span className="text-[10px] text-gray-500 font-medium mt-2 block">
                    {notification.time}
                  </span>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-full hover:bg-red-500/10"
                >
                  <X size={14} />
                </button>
              </div>
            );
          })
        ) : (
          <div className="py-12 px-4 text-center flex flex-col items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
              <BellRing size={24} className="text-gray-600" />
            </div>
            <p className="text-sm font-medium text-gray-300">Nada por aquí</p>
            <p className="text-xs text-gray-500 mt-1">Estás al día con todas tus alertas.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsMenu;