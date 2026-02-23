// src/components/header/MobileMenu.tsx
import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { useAuthSession } from '../../hooks/header/useAuthSession';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileClick: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onProfileClick }) => {
  if (!isOpen) return null;
  const { user } = useAuthSession();

  return (
    <div className="md:hidden absolute top-full left-0 w-full bg-[#050505]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl animate-in slide-in-from-top-2 z-50">
      <div className="p-4 space-y-4">
        <form onSubmit={e => e.preventDefault()} className="relative">
          <Search size={18} className="absolute left-3 top-3 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full bg-white/10 border border-white/10 rounded-xl py-3 pl-10 text-white focus:border-cyan-500 outline-none"
          />
        </form>
        <div className="pt-2 border-t border-white/10 flex items-center justify-between px-2">
          <span className="text-gray-400">Notificaciones</span>
          <div className="bg-white/10 p-2 rounded-full"><Bell size={20} className="text-white"/></div>
        </div>
        <div className="flex items-center justify-between px-2 pb-2">
          <span className="text-gray-400">Mi Perfil</span>
          <button onClick={onProfileClick} className="bg-white/10 p-2 rounded-full">
            {user && user.avatar ? (
              <img src={user.avatar} alt="User" className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <User size={20} className="text-white"/>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
