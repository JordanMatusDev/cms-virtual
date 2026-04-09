import { Mail, X } from 'lucide-react';
import logoImg from '../../assets/virtualz.png';
import { useRef } from 'react';
import { useTrapFocus } from '../../hooks/auth/useTrapFocus';

interface RegisterResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToLogin: () => void;
  onFixEmail: () => void;
  email?: string;
}

const RegisterResultModal = ({ isOpen, onClose, onGoToLogin, onFixEmail, email }: RegisterResultModalProps) => {
  if (!isOpen) return null;
  const modalRef = useRef<HTMLDivElement>(null);
  useTrapFocus(modalRef, isOpen);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity" />
      
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_0_80px_-8px_rgba(6,182,212,0.45)] overflow-hidden animate-in fade-in zoom-in-95 duration-300"
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
        <div className="p-8 pt-10">
          <div className="flex flex-col items-center mb-6">
            <img 
              src={logoImg} 
              alt="Virtual+" 
              className="h-12 w-auto mb-4 object-contain brightness-125 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" 
            />
            <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full ring-1 shadow-[0_0_20px_-5px] bg-cyan-500/10 ring-cyan-500/20 text-cyan-400 shadow-cyan-500/30">
              <Mail size={44} />
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center w-full">
            <h3 className="text-2xl font-bold text-white mb-3">
              Revisa tu correo
            </h3>
            
            {/* TEXTO AÑADIDO AQUÍ */}
            <p className="text-center text-gray-400 text-sm px-4 mb-2">
              Enviamos un enlace a <span className="text-cyan-400 font-medium">{email || 'tu correo'}</span> para verificar tu cuenta.
            </p>
            
            <p className="text-center text-gray-500/80 text-xs px-4 mb-6">
              Si no lo ves, revisa tu carpeta de spam.
            </p>
            
            <div className="flex flex-col items-center w-full max-w-xs">
              <button 
                onClick={onGoToLogin}
                className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white p-1 rounded-full hover:bg-white/10 z-10 transition-colors"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>
        
        <div className="bg-white/5 p-4 text-center border-t border-white/10">
          <p className="text-sm text-gray-400">
            ¿Te equivocaste de correo?{' '}
            <button
              onClick={onFixEmail}
              className="text-white font-medium hover:text-cyan-400 transition-colors focus:outline-none focus:underline"
              type="button"
            >
              Corrígelo aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterResultModal;