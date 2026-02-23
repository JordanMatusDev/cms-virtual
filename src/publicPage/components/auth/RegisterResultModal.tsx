import { Mail, X } from 'lucide-react';
import logoImg from '../../assets/virtualz.png';

interface RegisterResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToLogin: () => void;
  onFixEmail: () => void;
}

const RegisterResultModal = ({ isOpen, onClose, onGoToLogin, onFixEmail }: RegisterResultModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-transparent backdrop-blur-md transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_0_50px_-12px_rgba(6,182,212,0.2)] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Botón X para cerrar (idéntico a otros modales) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white p-1 rounded-full hover:bg-white/10 z-10 transition-colors"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"></div>
        <div className="p-8 pt-10">
          {/* Header Común (Logo y Título) */}
          <div className="flex flex-col items-center mb-6">
            <img src={logoImg} alt="Virtual+" className="h-12 w-auto mb-4 object-contain brightness-125 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
            
          </div>
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* Icono con Glow Dinámico, igual al de confirmación de eliminación de avatar */}
            <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full ring-1 shadow-[0_0_20px_-5px] bg-cyan-500/10 ring-cyan-500/20 text-cyan-400 shadow-cyan-500/30">
              <Mail size={44} />
            </div>
            <h3 className="text-xl font-bold text-white">¡Revisa tu correo!</h3>
            <p className="text-center text-gray-400 text-sm px-4">
              Te hemos enviado un correo de verificación. Revisa tu bandeja de entrada o la carpeta de spam para activar tu cuenta.
            </p>
            <div className="flex flex-col items-center w-full max-w-xs mt-2 gap-2">
              <button
                className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                onClick={onGoToLogin}
              >
                Ir a iniciar sesión
              </button>
            </div>
          </div>
        </div>
        {/* Pie de página con corregir correo */}
        <div className="bg-white/5 p-4 text-center border-t border-white/10">
          <p className="text-sm text-gray-400">
            ¿Te equivocaste de correo?{' '}
            <button
              onClick={onFixEmail}
              className="text-white font-medium hover:text-cyan-400 transition-colors"
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
