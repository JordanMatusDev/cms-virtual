import React, { useRef, useState } from 'react';
import { Mail, Loader2, X } from 'lucide-react';
import { useTrapFocus } from '../../hooks/auth/useTrapFocus';
import logoImg from '../../assets/virtualz.png';
import useForgotPassword from '../../hooks/auth/useForgotPassword';
import ForgotPasswordResultModal from './ForgotPasswordResultModal';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const ForgotPasswordModal = ({ isOpen, onClose, onSwitchToLogin }: ForgotPasswordModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useTrapFocus(modalRef);

  const [showResult, setShowResult] = useState(false);
  const [successEmail, setSuccessEmail] = useState('');
  const [localExiting, setLocalExiting] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const {
    email,
    setEmail,
    loading,
    handleSubmit,
    error,
  } = useForgotPassword();

  // Limpiar datos
  const resetFields = () => {
    setEmail('');
    setEmailError(null);
    // No se puede limpiar error general porque el hook no provee setter.
  };

  // Validar email
  const validateEmail = (value: string) => {
    return /^\S+@\S+\.\S+$/.test(value);
  };

  // Cambiar a Login con transición
  const handleSwitchToLogin = () => {
    resetFields();
    setLocalExiting(true);
    setTimeout(() => {
      setLocalExiting(false);
      onSwitchToLogin();
    }, 250);
  };

  const handleFullClose = () => {
    setShowResult(false);
    setSuccessEmail('');
    onClose();
  };

  if (!isOpen && !localExiting) return null;

  // 1. Mostrar Resultado de Envío Exitoso
  if (showResult) {
    return (
      <ForgotPasswordResultModal
        isOpen={showResult}
        onClose={() => {
          handleFullClose();
          onSwitchToLogin(); // Lo mandamos al login al cerrar el éxito
        }}
        email={successEmail}
      />
    );
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError('Ingresa un correo electrónico válido.');
      return;
    } else {
      setEmailError(null);
    }
    const success = await handleSubmit(e);
    if (success) {
      setSuccessEmail(email);
      setShowResult(true);
    }
  };

  // 2. Render Principal del Formulario
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity" onClick={handleFullClose}></div>

      <div
        ref={modalRef}
        className={`relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_0_80px_-8px_rgba(6,182,212,0.45)] overflow-hidden transition-all duration-300 ${localExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} animate-in fade-in translate-y-0 blur-0`}
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"></div>
        <button onClick={handleFullClose} className="absolute top-4 right-4 text-gray-500 hover:text-white p-1 rounded-full hover:bg-white/10 z-10 transition-colors">
          <X size={20} />
        </button>

        <div className="p-8 pt-10">
          <div className="flex flex-col items-center mb-6">
            <img src={logoImg} alt="Virtual+" className="h-12 w-auto mb-4 object-contain brightness-125 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
            <h2 className="text-2xl font-bold text-white tracking-tight">Recuperar Contraseña</h2>
          </div>

          <div className="text-center px-2 mb-6">
            <p className="text-gray-400 text-sm">Ingresa tu correo asociado y te enviaremos un enlace de recuperación.</p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-400 ml-1">Correo Electrónico</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400" />
                <input 
                  type="text"
                  className={`w-full bg-[#050505] border rounded-xl py-3 pl-10 pr-4 text-white focus:border-cyan-500/50 outline-none transition-all ${emailError ? 'border-red-500 focus:border-red-500' : 'border-white/10'}`}
                  autoComplete="off"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(null);
                  }}
                />
              </div>
              {error && (
                (typeof error === 'string' && error.trim() !== '' && (
                  <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mt-2">{error}</div>
                ))
              )}
              {emailError && (
                <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mt-2">{emailError}</div>
              )}
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  'Enviar correo'
                )}
              </button>
            </div>
            
          </form>
        </div>

        {/* Footer para volver al login */}
        <div className="bg-white/5 p-4 text-center border-t border-white/10">
          <p className="text-sm text-gray-400">
            ¿Recuerdas la contraseña?{' '}
            <button onClick={handleSwitchToLogin} className="text-white font-medium hover:text-cyan-400 transition-colors">
              Iniciar sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;