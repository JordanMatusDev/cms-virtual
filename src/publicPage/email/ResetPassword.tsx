import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle, Loader2, AlertCircle, Ban } from 'lucide-react';

import logoImg from '../assets/virtualz.png';
import { confirmPasswordReset, checkActionToken } from '../services/email/resetPasswordService';

// --- PANTALLA DE ENLACE EXPIRADO (Estilo Glass + Neón Rojo) ---
function ExpiredLinkModal() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Fondo Ambiental (Glow dinámico rojo) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] transition-colors duration-700 bg-red-600/10" />

      {/* Tarjeta Principal Glass */}
      <div className="w-full max-w-sm bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] relative z-10 animate-in zoom-in-95 duration-500">
        
        {/* Logo */}
        <div className="text-center mb-6">
          <img src={logoImg} alt="Virtual+" className="h-12 mx-auto mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
        </div>
        
        {/* Línea Superior de Color Rojo */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-80" />

        {/* Icono Central con Glow Rojo */}
        <div className="mb-6 relative inline-flex items-center justify-center">
          <div className="absolute inset-0 rounded-full blur-xl transition-colors duration-500 bg-red-500/20"></div>
          <div className="relative w-20 h-20 bg-black/40 border rounded-full flex items-center justify-center shadow-lg transition-colors duration-500 border-red-500/30">
            <Ban size={40} className="text-red-400" />
          </div>
        </div>

        {/* Textos */}
        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight animate-in fade-in slide-in-from-bottom-2 duration-300">
          Enlace Expirado
        </h2>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          Este enlace ya fue utilizado o ha caducado por seguridad. Por favor, solicita uno nuevo desde la pantalla de inicio de sesión.
        </p>

        {/* Botón de Acción */}
        <button
          onClick={() => {
            sessionStorage.setItem('openLoginModal', '1');
            window.location.href = '/';
          }}
          className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] active:scale-[0.98]"
        >
          Volver al Inicio de Sesión
        </button>
      </div>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL ---
export default function ResetPassword() {
  const [searchParams] = useSearchParams();

  // Estados de validación inicial
  const [isValidating, setIsValidating] = useState(true);

  // Estados para los inputs y visibilidad
  const [passwords, setPasswords] = useState<{ new: string; confirm: string }>({ new: '', confirm: '' });
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Estados de la interfaz y errores
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'expired'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [showFieldErrors, setShowFieldErrors] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ new: string; confirm: string }>({ new: '', confirm: '' });

  // Efecto para validar el token al cargar la página
  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token') || searchParams.get('id') || searchParams.get('reset_token');
      
      if (!token) {
        setStatus('expired');
        setIsValidating(false);
        return;
      }

      const isValid = await checkActionToken(token);
      
      if (!isValid) {
        setStatus('expired');
      }
      
      setIsValidating(false);
    };

    verifyToken();
  }, [searchParams]);

  // Función para validar los campos internamente
  const validateFields = (newPass: string, confirmPass: string) => {
    let errors = { new: '', confirm: '' };
    
    if (!newPass) {
      errors.new = 'Este campo es obligatorio.';
    } else if (newPass.length < 8) {
      errors.new = 'Mínimo 8 caracteres.';
    }

    if (!confirmPass) {
      errors.confirm = 'Este campo es obligatorio.';
    } else if (newPass !== confirmPass) {
      errors.confirm = 'Las contraseñas no coinciden.';
    }

    return errors;
  };

  // Manejar cambios en inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    setPasswords(prev => ({ ...prev, [id]: value }));
    setErrorMsg('');

    if (showFieldErrors) {
      setFieldErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  // Validar y Enviar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setShowFieldErrors(true);

    const currentErrors = validateFields(passwords.new, passwords.confirm);
    setFieldErrors(currentErrors);

    if (currentErrors.new || currentErrors.confirm) {
      return;
    }

    const token = searchParams.get('token') || searchParams.get('id') || searchParams.get('reset_token');
    if (!token) {
      setStatus('expired');
      return;
    }

    setStatus('loading');
    const minDelay = 1000;
    const startTime = Date.now();

    try {
      const result = await confirmPasswordReset(token, passwords.new);
      
      const elapsed = Date.now() - startTime;
      if (elapsed < minDelay) {
        await new Promise(res => setTimeout(res, minDelay - elapsed));
      }

      if (result.success) {
        // Al tener éxito, solo cambiamos el estado. No redirigimos automáticamente.
        setStatus('success');
      } else {
        if (result.status === 400 || (result.message && result.message.toLowerCase().includes('expirado'))) {
          setStatus('expired');
        } else {
          setStatus('error');
          setErrorMsg(result.message || 'No se pudo actualizar la contraseña.');
        }
      }
    } catch (error: any) {
      const elapsed = Date.now() - startTime;
      if (elapsed < minDelay) {
        await new Promise(res => setTimeout(res, minDelay - elapsed));
      }
      setStatus('error');
      setErrorMsg('Hubo un error de conexión. Intenta de nuevo.');
    }
  };

  // --- VISTAS CONDICIONALES ---

  // 1. Pantalla de carga mientras se valida el token con el backend
  if (isValidating) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4 relative z-10" />
        <p className="text-gray-400 animate-pulse relative z-10 font-medium">Verificando enlace seguro...</p>
      </div>
    );
  }

  // 2. Si el token expiró
  if (status === 'expired') {
    return <ExpiredLinkModal />;
  }

  // 3. Si fue un éxito
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-600/20 rounded-full blur-[120px]" />

        <div className="w-full max-w-sm bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center shadow-2xl relative z-10 animate-in zoom-in-95 duration-500">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-80" />
           
           <div className="mb-6 relative inline-flex items-center justify-center">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative w-20 h-20 bg-black/40 border border-green-500/30 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
           </div>

           <h2 className="text-2xl font-bold text-white mb-2">¡Contraseña Actualizada!</h2>
           <p className="text-gray-400 text-sm mb-8">Tu contraseña ha sido cambiada correctamente.</p>
           
           <button 
             onClick={() => {
               sessionStorage.setItem('openLoginModal', '1');
               window.location.href = '/';
             }}
             className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
           >
             Ir al Inicio ahora
           </button>
        </div>
      </div>
    );
  }

  // 4. Formulario (Solo llega aquí si el token es válido)
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-md bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-70"></div>

        <div className="text-center mb-8">
          <img src={logoImg} alt="Virtual+" className="h-12 mx-auto mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
          
          <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Restablecer Contraseña</h1>
          <p className="text-gray-400 text-sm">Ingresa tu nueva clave para recuperar el acceso.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          
          {/* Input: Nueva Contraseña */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1 tracking-wider">Nueva Contraseña</label>
            <div className="relative group">
              <div className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-purple-400 transition-colors">
                <Lock size={18} />
              </div>
              <input
                id="new"
                type={showNew ? "text" : "password"}
                value={passwords.new}
                onChange={handleChange}
                className={`w-full bg-black/40 border rounded-xl pl-10 pr-10 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 transition-all duration-300 
                  ${showFieldErrors && fieldErrors.new 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' 
                    : 'border-white/10 focus:border-purple-500/50 focus:ring-purple-500/50'}`}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-3.5 text-gray-500 hover:text-white transition-colors focus:outline-none"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {showFieldErrors && fieldErrors.new && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mt-2 animate-in slide-in-from-top-1">
                {fieldErrors.new}
              </div>
            )}
          </div>

          {/* Input: Confirmar Contraseña */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1 tracking-wider">Confirmar Contraseña</label>
            <div className="relative group">
              <div className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-purple-400 transition-colors">
                <Lock size={18} />
              </div>
              <input
                id="confirm"
                type={showConfirm ? "text" : "password"}
                value={passwords.confirm}
                onChange={handleChange}
                className={`w-full bg-black/40 border rounded-xl pl-10 pr-10 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 transition-all duration-300 
                  ${showFieldErrors && fieldErrors.confirm 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' 
                    : 'border-white/10 focus:border-purple-500/50 focus:ring-purple-500/50'}`}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3.5 text-gray-500 hover:text-white transition-colors focus:outline-none"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {showFieldErrors && fieldErrors.confirm && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mt-2 animate-in slide-in-from-top-1">
                {fieldErrors.confirm}
              </div>
            )}
          </div>

          {/* Mensaje de Error General */}
          {errorMsg && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20 animate-in slide-in-from-top-2">
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Botón Submit */}
          <button 
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-white text-black font-bold py-3.5 rounded-xl mt-4 hover:bg-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Actualizando...
              </>
            ) : (
              <>
                Restablecer Contraseña
                <ArrowRight size={18} />
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}