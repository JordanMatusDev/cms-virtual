// src/components/header/UserMenu.tsx
import React, { useRef, useState, useEffect } from 'react';
import { Home, BookOpen, Award, Settings } from 'lucide-react';
import LogoutConfirmButton from '../../components/auth/LogoutConfirm';
import { useLocation, useNavigate } from 'react-router';
import { useAuthSession } from '../../hooks/header/useAuthSession';
import { useClickOutside } from '../../hooks/header/useClickOutside';

interface UserMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

const UserMenu: React.FC<UserMenuProps> = ({ isOpen, setIsOpen, containerRef }) => {
  const { user, setUser } = useAuthSession();
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  // Estado para confirmación inline
  const [confirmLogoutState, setConfirmLogoutState] = useState(false);
  // Estado para destello final
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useClickOutside(
    containerRef ?? menuRef,
    () => {
      setIsOpen(false);
      setConfirmLogoutState(false);
    }
  );

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setConfirmLogoutState(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Limpiar overlay si el usuario se desmonta
  useEffect(() => {
    if (!user && isLoggingOut) {
      setIsLoggingOut(false);
    }
  }, [user, isLoggingOut]);

  const handleLogout = () => {
    setIsOpen(false);
    setIsLoggingOut(true);
    setTimeout(() => {
      setUser(null); // Ahora sí, desmonta después del destello
      localStorage.clear();
      window.dispatchEvent(new Event('auth:logout'));
      // Ya no refresca la pantalla
    }, 700);
  };

  const go = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  const isCurrentPath = (path: string) => location.pathname === path;

  if (!user) return null;

  return (
    <>
      {isOpen && (
        <div ref={menuRef} className="absolute top-full right-0 mt-4 w-64 bg-[#050505]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] py-2 animate-in fade-in slide-in-from-top-2 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-white/10 mb-2">
            <p className="text-base font-bold text-white">{user.name}</p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>
          <div className="px-2 space-y-1">
            {!isCurrentPath('/') && (
              <button onClick={() => go('/')} className="w-full text-left flex items-center gap-3 px-3 py-2 text-base text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors">
                <Home size={18} className="text-cyan-400"/> Inicio
              </button>
            )}
            {!isCurrentPath('/mis-cursos') && (
              <button onClick={() => go('/mis-cursos')} className="w-full text-left flex items-center gap-3 px-3 py-2 text-base text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors">
                <BookOpen size={18} className="text-cyan-400"/> Inscripciones
              </button>
            )}
            {!isCurrentPath('/certificados') && (
              <button onClick={() => go('/certificados')} className="w-full text-left flex items-center gap-3 px-3 py-2 text-base text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors">
                <Award size={18} className="text-cyan-400"/> Certificados
              </button>
            )}
            {!isCurrentPath('/settings') && (
              <button onClick={() => go('/settings')} className="w-full text-left flex items-center gap-3 px-3 py-2 text-base text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors">
                <Settings size={18} className="text-purple-400"/> Configuración
              </button>
            )}
          </div>
          <div className="mt-2 pt-2 border-t border-white/10 px-2 min-h-[48px] flex items-center">
            <LogoutConfirmButton 
              onConfirm={handleLogout} 
              externalIsConfirming={confirmLogoutState}
              setExternalIsConfirming={setConfirmLogoutState}
            />
          </div>
        </div>
      )}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
          {/* Fondo negro que se oscurece */}
          <div className="absolute inset-0 bg-black animate-in fade-in duration-300 fill-mode-forwards"></div>
          {/* Explosión 1: Gradiente gigante con colores del hero */}
          <div className="absolute w-[150vw] h-[150vh] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/80 via-purple-900/40 to-transparent blur-[120px] mix-blend-screen animate-in zoom-in-50 fade-out duration-700 ease-out"></div>
          {/* Explosión 2: Centro brillante hero */}
          <div className="absolute w-full h-full bg-gradient-to-r from-cyan-900 via-purple-900 to-black blur-3xl opacity-60 mix-blend-overlay animate-in fade-in fade-out duration-500"></div>
        </div>
      )}
    </>
  );
};

export default UserMenu;
