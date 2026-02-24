import  { useRef, useState } from 'react';
import { useRegister } from '../../hooks/auth/useRegister';
import { useTrapFocus } from '../../hooks/useTrapFocus';
import { X, User, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import logoImg from '../../assets/virtualz.png';
import RegisterResultModal from './RegisterResultModal';
import UpdateEmailModal from './UpdateEmailModal';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  initialData?: any;
}

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin, initialData }: RegisterModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useTrapFocus(modalRef);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  // Estados locales para manejar los resultados
  const [showRegisterResult, setShowRegisterResult] = useState(false);
  const [showUpdateEmail, setShowUpdateEmail] = useState(false);
  const [registeredData, setRegisteredData] = useState<any>(null);

  // Estado local para transición de salida
  const [localExiting, setLocalExiting] = useState(false);

  const {
    step,
    setStep,
    formData,
    setFormData,
    showPass,
    setShowPass,
    showConfirm,
    setShowConfirm,
    isLoading,
    error,
    fieldErrors,
    handleNextStep,
    handleSubmit,
  } = useRegister(initialData);

  if (!isOpen && !localExiting) return null;
  // Limpiar datos
  const resetFields = () => {
    setStep(1);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    });
    setShowPass(false);
    setShowConfirm(false);
    if (fieldErrors) {
      Object.keys(fieldErrors).forEach(k => fieldErrors[k] = undefined);
    }
    // Si hay setter para error, usarlo aquí (ejemplo: setError && setError(''));
    // Si no, ignorar porque error es solo lectura.
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
    setShowRegisterResult(false);
    setShowUpdateEmail(false);
    setRegisteredData(null);
    onClose();
  };

  // 1. Mostrar Modal de Actualizar Email (si se requiere)
  if (showUpdateEmail) {
    return (
      <UpdateEmailModal
        isOpen={showUpdateEmail}
        initialEmail={registeredData?.email || ''}
        username={registeredData?.username}
        userId={registeredData?.id || registeredData?.usuario?.id}
        onClose={() => setShowUpdateEmail(false)}
        onEmailUpdated={(newEmail) => {
          setRegisteredData((prev: any) => ({ ...prev, email: newEmail }));
          setShowUpdateEmail(false);
        }}
      />
    );
  }

  // 2. Mostrar Resultado de Registro
  if (showRegisterResult) {
    return (
      <RegisterResultModal
        isOpen={showRegisterResult}
        onClose={() => {
          setShowRegisterResult(false);
        }}
        onGoToLogin={() => {
          handleFullClose();
          onSwitchToLogin();
        }}
        onFixEmail={() => {
          setShowUpdateEmail(true);
        }}
      />
    );
  }

  // 3. Render principal del Formulario de Registro
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
            <h2 className="text-2xl font-bold text-white tracking-tight">Crear Cuenta</h2>
          </div>

          {/* Indicador de pasos */}
          <div className="flex justify-center gap-2 mb-6">
            <div className={`h-1.5 w-8 rounded-full transition-all duration-300 ${step === 1 ? 'bg-cyan-500' : 'bg-cyan-900/40'}`} />
            <div className={`h-1.5 w-8 rounded-full transition-all duration-300 ${step === 2 ? 'bg-cyan-500' : 'bg-cyan-900/40'}`} />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2 animate-shake">
              <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={16} />
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={e => {
            e.preventDefault();
            handleSubmit((formDataRes) => {
              setRegisteredData(formDataRes);
              setShowRegisterResult(true);
            });
          }} className="space-y-4">
            
            {/* PASO 1 */}
            {step === 1 && (
              <div className="space-y-4 animate-in slide-in-from-left-4 fade-in duration-300">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-400 ml-1">Nombre</label>
                    <div className="relative group">
                      <input name="firstName" value={formData.firstName} onChange={e => { setFormData({ ...formData, firstName: e.target.value }); if (fieldErrors.firstName) fieldErrors.firstName = undefined; }}
                        autoComplete="off"
                        className={`w-full bg-[#050505] border rounded-xl py-3 pl-9 pr-3 text-base text-white focus:border-cyan-500/50 outline-none transition-all placeholder:text-gray-600 ${fieldErrors.firstName ? 'border-red-500 focus:border-red-500' : 'border-white/10'}`}
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                    </div>
                    {fieldErrors.firstName && (
                      <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mt-2">{fieldErrors.firstName}</div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-400 ml-1">Apellido</label>
                    <div className="relative group">
                      <input name="lastName" value={formData.lastName} onChange={e => { setFormData({ ...formData, lastName: e.target.value }); if (fieldErrors.lastName) fieldErrors.lastName = undefined; }}
                        autoComplete="off"
                        className={`w-full bg-[#050505] border rounded-xl py-3 pl-9 pr-3 text-base text-white focus:border-cyan-500/50 outline-none transition-all placeholder:text-gray-600 ${fieldErrors.lastName ? 'border-red-500 focus:border-red-500' : 'border-white/10'}`}
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                    </div>
                    {fieldErrors.lastName && (
                      <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mt-2">{fieldErrors.lastName}</div>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-400 ml-1">Correo Electrónico</label>
                  <div className="relative group">
                    <input
                      ref={emailInputRef}
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={e => { setFormData({ ...formData, email: e.target.value }); if (fieldErrors.email) fieldErrors.email = undefined; }}
                      autoComplete="off"
                      className={`w-full bg-[#050505] border rounded-xl py-3 pl-9 pr-3 text-base text-white focus:border-cyan-500/50 outline-none transition-all placeholder:text-gray-600 ${fieldErrors.email ? 'border-red-500 focus:border-red-500' : 'border-white/10'}`}
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                  </div>
                  {fieldErrors.email && (
                    <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mt-2">{fieldErrors.email}</div>
                  )}
                </div>
                <div className="pt-2">
                  <button type="button" onClick={handleNextStep} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                    Siguiente <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* PASO 2 */}
            {step === 2 && (
              <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-400 ml-1">Usuario</label>
                  <div className="relative group">
                    <input name="username" value={formData.username} onChange={e => { setFormData({ ...formData, username: e.target.value }); if (fieldErrors.username) fieldErrors.username = undefined; }}
                      autoComplete="off"
                      className={`w-full bg-[#050505] border rounded-xl py-3 pl-9 pr-3 text-base text-white focus:border-cyan-500/50 outline-none transition-all placeholder:text-gray-600 ${fieldErrors.username ? 'border-red-500 focus:border-red-500' : 'border-white/10'}`}
                      autoFocus />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                  </div>
                  {fieldErrors.username && (
                    <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mt-2">{fieldErrors.username}</div>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-400 ml-1">Contraseña</label>
                  <div className="relative group">
                    <input type={showPass ? 'text' : 'password'} name="password" value={formData.password} onChange={e => { setFormData({ ...formData, password: e.target.value }); if (fieldErrors.password) fieldErrors.password = undefined; }}
                      autoComplete="off"
                      className={`w-full bg-[#050505] border rounded-xl py-3 pl-9 pr-8 text-base text-white focus:border-cyan-500/50 outline-none transition-all placeholder:text-gray-600 ${fieldErrors.password ? 'border-red-500 focus:border-red-500' : 'border-white/10'}`}
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                    <button type="button" tabIndex={-1} onClick={() => setShowPass(!showPass)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400">
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mt-2">{fieldErrors.password}</div>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-400 ml-1">Confirmar Contraseña</label>
                  <div className="relative group">
                    <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={e => { setFormData({ ...formData, confirmPassword: e.target.value }); if (fieldErrors.confirmPassword) fieldErrors.confirmPassword = undefined; }}
                      autoComplete="off"
                      className={`w-full bg-[#050505] border rounded-xl py-3 pl-9 pr-8 text-base text-white focus:border-cyan-500/50 outline-none transition-all placeholder:text-gray-600 ${fieldErrors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-white/10'}`}
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                    <button type="button" tabIndex={-1} onClick={() => setShowConfirm(!showConfirm)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400">
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mt-2">{fieldErrors.confirmPassword}</div>
                  )}
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold py-3 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                    <ArrowLeft size={18} /> Atrás
                  </button>
                  <button type="submit" disabled={isLoading} className="flex-[2] bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Crear Cuenta'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
        
        {/* Footer para cambiar a Login */}
        <div className="bg-white/5 p-4 text-center border-t border-white/10">
          <p className="text-sm text-gray-400">
            ¿Ya tienes cuenta?{' '}
            <button onClick={handleSwitchToLogin} className="text-white font-medium hover:text-cyan-400 transition-colors" type="button">
              Inicia Sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;