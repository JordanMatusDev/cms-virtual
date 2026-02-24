import { Mail, X } from 'lucide-react';
import logoImg from '../../assets/virtualz.png'; // Asegúrate de que la ruta sea correcta
import { useRef } from 'react';
import { useTrapFocus } from '../../hooks/useTrapFocus';

interface ForgotPasswordResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
}

const ForgotPasswordResultModal = ({ isOpen, onClose, email }: ForgotPasswordResultModalProps) => {
  if (!isOpen) return null;
  const modalRef = useRef<HTMLDivElement>(null);
  useTrapFocus(modalRef);
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-md transition-opacity" 
      />

      {/* Container Principal */}
      <div ref={modalRef} className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_0_80px_-8px_rgba(6,182,212,0.45)] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Botón X para cerrar (idéntico a AuthModal) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white p-1 rounded-full hover:bg-white/10 z-10 transition-colors"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>
        {/* Línea Superior Gradiente */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
        <div className="p-8 pt-10">
          {/* Header con Logo (Igual al de Registro) */}
          <div className="flex flex-col items-center mb-6">
            <img 
              src={logoImg} 
              alt="Virtual+" 
              className="h-12 w-auto mb-4 object-contain brightness-125 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" 
            />
            {/* Icono más arriba, menos margen inferior */}
            <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full ring-1 shadow-[0_0_20px_-5px] bg-cyan-500/10 ring-cyan-500/20 text-cyan-400 shadow-cyan-500/30">
              <Mail size={44} />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center space-y-4">
            <h3 className="text-xl font-bold text-white mt-0">¡Correo enviado!</h3>
            <p className="text-center text-gray-400 text-sm px-4">
              Hemos enviado el enlace de recuperación a <span className="text-cyan-400 font-medium">{email || 'tu correo'}</span>.<br />
              Revisa tu bandeja de entrada o la carpeta de spam para restablecer tu contraseña.            </p>
            <div className="flex flex-col items-center w-full max-w-xs mt-2 gap-2">
              <button 
                onClick={onClose} 
                className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
        {/* Footer eliminado, solo mensaje principal */}
      </div>
    </div>
  );
};

export default ForgotPasswordResultModal;
