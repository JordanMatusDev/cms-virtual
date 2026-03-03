import React, { useRef, useState } from 'react';
import { useLogin } from '../../hooks/auth/useLogin';
import { Eye, EyeOff, X, User, Lock } from 'lucide-react';
import { useTrapFocus } from '../../hooks/auth/useTrapFocus';
import logoImg from '../../assets/virtualz.png';

interface LoginModalProps {
  isOpen: boolean;
  isExiting?: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
  onSwitchToRegister: () => void;
  onSwitchToForgot: () => void;
}

const LoginModal = ({ isOpen, isExiting = false, onClose, onSuccess, onSwitchToRegister, onSwitchToForgot }: LoginModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useTrapFocus(modalRef, isOpen);

  // Estado local solo para transición entre modales
  const [localExiting, setLocalExiting] = useState(false);

  const {
    identifier,
    setIdentifier,
    password,
    setPassword,
    showPass,
    setShowPass,
    isSubmitting,
    isSuccessAnimating,
    fieldErrors,
    setFieldErrors,
    handleLogin,
  } = useLogin();

  // Limpiar campos y errores (forma correcta en React)
  const resetFields = () => {
    setIdentifier('');
    setPassword('');
    setShowPass(false);
    setFieldErrors({});
  };

  // Controlar visibilidad para animación
  if (!isOpen && !isExiting && !localExiting) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validamos manualmente si los campos están vacíos
    const currentErrors: any = {};
    if (!identifier.trim()) {
      currentErrors.identifier = 'El usuario o email es obligatorio.';
    }
    if (!password) {
      currentErrors.password = 'La contraseña es obligatoria.';
    }

    // 2. Si falta alguno, pintamos de rojo los correspondientes y detenemos el envío
    if (Object.keys(currentErrors).length > 0) {
      setFieldErrors(currentErrors);
      return; // No llamamos a handleLogin
    }

    // 3. Si ambos tienen texto, ahora sí mandamos la petición al backend
    handleLogin((user: any) => {
      onSuccess(user);
      window.dispatchEvent(new Event('auth:login'));
      onClose();
      resetFields();
    });
  };

  // Cambiar a registro
  const handleSwitchToRegister = () => {
    resetFields();
    setLocalExiting(true);
    setTimeout(() => {
      setLocalExiting(false);
      onSwitchToRegister();
    }, 250);
  };

  // Cambiar a recuperar contraseña
  const handleSwitchToForgot = () => {
    resetFields();
    setLocalExiting(true);
    setTimeout(() => {
      setLocalExiting(false);
      onSwitchToForgot();
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity"></div>

      {/* Contenedor Modal */}
      <div
        ref={modalRef}
        className={`relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_0_80px_-8px_rgba(6,182,212,0.45)] overflow-hidden
          animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-500 ease-out
          transition-all ${(isExiting || localExiting) ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}
      >
        <button 
          onClick={() => {
            resetFields(); // Limpiamos los campos y errores primero
            onClose();     // Luego cerramos el modal
          }} 
          className="absolute top-4 right-4 text-gray-500 hover:text-white p-1 rounded-full hover:bg-white/10 z-10 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8 pt-10">
          <div className="flex flex-col items-center mb-6">
            <img src={logoImg} alt="Virtual+" className="h-12 w-auto mb-4 object-contain brightness-125 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
            <h2 className="text-2xl font-bold text-white tracking-tight">Iniciar Sesión</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo Usuario/Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-400 ml-1 leading-4">Usuario o Email</label>
              <div className="relative group">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setFieldErrors((prev: any) => {
                      const newErrors = { ...prev };
                      delete newErrors.identifier; 
                      delete newErrors.general;    
                      
                      if (newErrors.password && newErrors.password !== 'La contraseña es obligatoria.') {
                        delete newErrors.password;
                      }
                      return newErrors;
                    });
                  }}
                  className={`w-full bg-[#050505] border rounded-xl py-3 pl-10 pr-4 text-white focus:border-cyan-500/50 outline-none transition-all placeholder:text-gray-600 ${(fieldErrors.identifier || (fieldErrors.password && fieldErrors.password !== 'La contraseña es obligatoria.')) ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/50' : 'border-white/10'}`}
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
              </div>
              {fieldErrors.identifier && (
                <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mt-2 animate-in slide-in-from-top-1">{fieldErrors.identifier}</div>
              )}
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-400 ml-1 leading-4">Contraseña</label>
              <div className="relative group">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldErrors((prev: any) => {
                      const newErrors = { ...prev };
                      delete newErrors.password; 
                      delete newErrors.general;  
                      return newErrors;
                    });
                  }}
                  className={`w-full bg-[#050505] border rounded-xl py-3 pl-10 pr-10 text-white focus:border-cyan-500/50 outline-none transition-all placeholder:text-gray-600 ${fieldErrors.password ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/50' : 'border-white/10'}`}
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.password && (
                <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mt-2 animate-in slide-in-from-top-1">{fieldErrors.password}</div>
              )}
            </div>

            {/* Olvidaste Contraseña */}
            <div className="flex justify-end pt-1">
              <button type="button" onClick={handleSwitchToForgot} className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Errores Generales (Ej: Suspendido, No Verificado) */}
            {fieldErrors.general && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mt-2 text-center">{fieldErrors.general}</div>
            )}

            {/* Botón Submit */}
            <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2 disabled:opacity-70">
              {isSuccessAnimating ? (
                <span className="flex items-center justify-center w-full gap-3">
                  <span className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center animate-spin shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                    <X size={20} strokeWidth={5} className="text-white" />
                  </span>
                  <span>Iniciando Sesión...</span>
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>
        </div>

        {/* Footer para cambiar a Registro */}
        <div className="bg-white/5 p-4 text-center border-t border-white/10">
          <p className="text-sm text-gray-400">
            ¿No tienes cuenta?{' '}
            <button onClick={handleSwitchToRegister} className="text-white font-medium hover:text-cyan-400 transition-colors">
              Crear una cuenta
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;