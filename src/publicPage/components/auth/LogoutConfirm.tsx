import React from 'react';
import { LogOut, Check, X } from 'lucide-react';

interface LogoutConfirmButtonProps {
  onConfirm: () => void;
  externalIsConfirming: boolean;
  setExternalIsConfirming: (state: boolean) => void;
}

const LogoutConfirmButton: React.FC<LogoutConfirmButtonProps> = ({ 
  onConfirm, 
  externalIsConfirming, 
  setExternalIsConfirming 
}) => {
  if (!externalIsConfirming) {
    return (
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setExternalIsConfirming(true);
        }} 
        className="w-full text-left flex items-center gap-3 px-3 py-2 text-base text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all animate-in fade-in"
      >
        <LogOut size={18} /> Cerrar Sesión
      </button>
    );
  }
  return (
    <div className="w-full flex items-center justify-between gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg animate-in slide-in-from-right-4 fade-in duration-200 shadow-[0_0_15px_-5px_rgba(239,68,68,0.3)]" onClick={e => e.stopPropagation()}>
      <span className="text-sm font-medium text-red-400">¿Estás seguro?</span>
      <div className="flex items-center gap-1">
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setExternalIsConfirming(false);
          }} 
          className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors" 
          title="Cancelar"
        >
          <X size={16} />
        </button>
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onConfirm();
          }} 
          className="p-1.5 text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-md transition-colors shadow-lg shadow-red-500/30" 
          title="Sí, salir"
        >
          <Check size={16} />
        </button>
      </div>
    </div>
  );
};

export default LogoutConfirmButton;