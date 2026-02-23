// src/components/header/NotificationsMenu.tsx
import React, { useRef, useState } from 'react';
import { Award, PlayCircle, Gift, BellRing, CheckCircle2 } from 'lucide-react';
import { useClickOutside } from '../../hooks/header/useClickOutside';

interface NotificationsMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

// Datos de prueba (Mock Data) para que veas cómo luce
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'achievement',
    title: '¡Certificado Disponible!',
    message: 'Has completado "React Avanzado". Ya puedes descargar tu certificado.',
    time: 'Hace 5 min',
    read: false,
    icon: Award,
    colorClass: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  },
  {
    id: 2,
    type: 'course',
    title: 'Nuevo Módulo Desbloqueado',
    message: 'El profesor ha subido la sección de Hooks Personalizados.',
    time: 'Hace 2 horas',
    read: false,
    icon: PlayCircle,
    colorClass: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  },
  {
    id: 3,
    type: 'promo',
    title: 'Regalo de Bienvenida',
    message: 'Tienes un 10% de descuento en tu próxima suscripción a Virtual+.',
    time: 'Ayer',
    read: true,
    icon: Gift,
    colorClass: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
  },
  {
    id: 4,
    type: 'system',
    title: 'Actualización del Sistema',
    message: 'Hemos mejorado la velocidad de carga de los videos en un 40%.',
    time: 'Hace 2 días',
    read: true,
    icon: BellRing,
    colorClass: 'text-gray-300 bg-white/5 border-white/10',
  }
];


const NotificationsMenu: React.FC<NotificationsMenuProps> = ({ isOpen, setIsOpen, containerRef }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  // Usar solo el ref externo (containerRef) para detectar clics fuera
  useClickOutside(containerRef ?? menuRef, () => setIsOpen(false));

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      // Un poco más ancho que el UserMenu (w-80 o w-96) para que quepa el texto
      className="absolute top-full right-0 mt-4 w-80 sm:w-96 bg-[#050505]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_10px_50px_-10px_rgba(0,0,0,0.8)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2"
    >
      {/* CABECERA DEL MENÚ */}
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

      {/* LISTA DE NOTIFICACIONES (Con scrollbar oscuro personalizado) */}
      <div className="max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
        
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <div 
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`group relative p-4 border-b border-white/5 hover:bg-white/[0.04] transition-colors cursor-pointer flex gap-3 ${!notification.read ? 'bg-white/[0.02]' : ''}`}
              >
                {/* Ícono de la notificación */}
                <div className={`mt-0.5 shrink-0 h-10 w-10 rounded-full border flex items-center justify-center ${notification.colorClass}`}>
                  <Icon size={18} />
                </div>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className={`text-sm font-semibold truncate ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                      {notification.title}
                    </h4>
                    {/* Punto de luz azul (Neón) si no está leída */}
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
              </div>
            );
          })
        ) : (
          /* ESTADO VACÍO (Empty State) */
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