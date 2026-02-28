import { useState } from 'react';
import logoImg from '../assets/virtualz.png';
import React from 'react';
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import { confirmPasswordReset } from '../services/email/resetPasswordService';

// Modal de error para enlace expirado
function ExpiredLinkModal({ onGoToLogin }: { onGoToLogin: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity" />
      <div className="relative w-full max-w-sm bg-[#121212]/90 border border-red-500/30 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500" />
        <div className="p-8 pt-10 text-center">
          <div className="mb-6 relative inline-flex items-center justify-center">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative w-20 h-20 bg-black/40 border border-red-500/30 rounded-full flex items-center justify-center shadow-lg">
              <AlertCircle className="w-10 h-10 text-red-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Enlace expirado</h2>
          <p className="text-gray-400 text-sm mb-6">El enlace para restablecer tu contraseña ha expirado. Solicita uno nuevo desde la página de inicio de sesión.</p>
          <button
            onClick={onGoToLogin}
            className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
          >
            Ir al Inicio
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Estados para los inputs
  const [passwords, setPasswords] = useState<{ new: string; confirm: string }>({ new: '', confirm: '' });

  // Estados de visibilidad (Ojo)
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Estado de la interfaz
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'expired'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // ESTADOS NUEVOS PARA VALIDACIÓN
  // showFieldErrors se activa al intentar enviar el formulario
  const [showFieldErrors, setShowFieldErrors] = useState(false);
  // Guardamos qué errores hay en cada campo
  const [fieldErrors, setFieldErrors] = useState<{ new: string; confirm: string }>({ new: '', confirm: '' });

  // Función para validar los campos internamente
  const validateFields = (newPass: string, confirmPass: string) => {
    let errors = { new: '', confirm: '' };
    
    // Validación de nueva contraseña
    if (!newPass) {
      errors.new = 'Este campo es obligatorio.';
    } else if (newPass.length < 8) {
      errors.new = 'Mínimo 8 caracteres.';
    }

    // Validación de confirmar contraseña
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
    
    // 1. Actualizamos el valor de la contraseña
    setPasswords(prev => ({
      ...prev,
      [id]: value
    }));
    
    // 2. Limpiamos el error global (del backend) si lo hay
    setErrorMsg('');

    // 3. ¡LA MAGIA AQUÍ! 
    // Al escribir, simplemente borramos el error de ESTE cuadro en específico.
    // Así el rojo desaparece al instante y lo deja escribir tranquilo.
    // El otro cuadro conservará su error hasta que también escriban en él.
    if (showFieldErrors) {
      setFieldErrors(prev => ({
        ...prev,
        [id]: '' // Limpiamos solo el error del campo que se está editando
      }));
    }
  };

  // Validar y Enviar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    // 1. Al dar clic, indicamos que queremos mostrar los errores
    setShowFieldErrors(true);

    // 2. Evaluamos los errores
    const currentErrors = validateFields(passwords.new, passwords.confirm);
    setFieldErrors(currentErrors);

    // 3. Si hay algún error en los campos, detenemos el envío
    if (currentErrors.new || currentErrors.confirm) {
      return;
    }

    const token = searchParams.get('token') || searchParams.get('id') || searchParams.get('reset_token');
    if (!token) {
      setErrorMsg('Enlace no válido o expirado.');
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
        setStatus('success');
        setTimeout(() => {
          navigate('/login');
        }, 4000);
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
  if (status === 'expired') {
    return <ExpiredLinkModal onGoToLogin={() => navigate('/login')} />;
  }

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
           <p className="text-gray-400 text-sm mb-6">Tu contraseña ha sido cambiada correctamente.</p>
           
           <p className="text-xs text-green-400/80 mb-6 animate-pulse">Redirigiendo al inicio...</p>

           <button 
             onClick={() => navigate('/login')}
             className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
           >
             Ir al Inicio ahora
           </button>
        </div>
      </div>
    );
  }

  // --- VISTA FORMULARIO ---
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
                // Si showFieldErrors es true y hay un error para 'new', mostramos borde rojo
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
            {/* Mostrar mensaje de error de 'new' solo si showFieldErrors es true */}
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
                // Si showFieldErrors es true y hay un error para 'confirm', mostramos borde rojo
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
            {/* Mostrar mensaje de error de 'confirm' solo si showFieldErrors es true */}
            {showFieldErrors && fieldErrors.confirm && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mt-2 animate-in slide-in-from-top-1">
                {fieldErrors.confirm}
              </div>
            )}
          </div>

          {/* Mensaje de Error General (del backend) */}
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