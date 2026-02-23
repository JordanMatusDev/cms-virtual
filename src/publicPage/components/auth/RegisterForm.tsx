
import { useRef, forwardRef, useImperativeHandle } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import type { AuthView } from './types';
import { useRegister } from '../../hooks/auth/useRegister';

interface RegisterFormProps {
  onSwitchView: (view: AuthView) => void;
  onRegisterSuccess?: (formData: any) => void;
  initialData?: any;
  focusEmail?: boolean;
}

const RegisterForm = forwardRef<any, RegisterFormProps>(({  onRegisterSuccess, initialData,  }, ref) => {
  const emailInputRef = useRef<HTMLInputElement | null>(null);
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

  useImperativeHandle(ref, () => ({
    focusEmail: () => {
      setStep(1);
      setTimeout(() => {
        emailInputRef.current?.focus();
      }, 100);
    },
    setFormData,
    getFormData: () => formData,
  }), [formData, setStep, setFormData]);



    return (
        <div className="animate-in fade-in slide-in-from-right-4">
            {/* Indicador de pasos (Bolitas) */}
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

            <form onSubmit={e => { e.preventDefault(); handleSubmit(onRegisterSuccess); }} className="space-y-4">
                {/* PASO 1: DATOS PERSONALES */}
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
                                                    <button type="button" onClick={handleNextStep}
                                                            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                                                            Siguiente <ArrowRight size={18} />
                                                    </button>
                                                </div>
                    </div>
                )}

                {/* PASO 2: SEGURIDAD */}
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
                            <button type="button" onClick={() => setStep(1)}
                                className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold py-3 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                                <ArrowLeft size={18} /> Atrás
                            </button>
                            <button type="submit" disabled={isLoading}
                                className="flex-[2] bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                                {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Crear Cuenta'}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
});

export default RegisterForm;
