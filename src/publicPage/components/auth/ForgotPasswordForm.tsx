import { Mail, Loader2 } from 'lucide-react';
import ForgotPasswordResultModal from './ForgotPasswordResultModal';
import type { AuthView } from './types';
import useForgotPassword from '../../hooks/auth/useForgotPassword';

interface ForgotPasswordFormProps {
  onSwitchView: (view: AuthView) => void;
}

const ForgotPasswordForm = ({ onSwitchView }: ForgotPasswordFormProps) => {
  const {
    email,
    setEmail,
    showResult,
    setShowResult,
    handleSubmit,
    loading
  } = useForgotPassword();

  if (showResult) {
    return (
      <ForgotPasswordResultModal
        isOpen={true}
        onClose={() => {
          setShowResult(false);
          onSwitchView('login');
        }}
        email={email}
      />
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-4 relative">
      <div className="text-center px-2 mb-6">
        <p className="text-gray-400 text-sm">Ingresa tu correo asociado y te enviaremos un enlace de recuperación.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-400 ml-1">Correo Electrónico</label>
          <div className="relative group">
            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400" />
            <input 
              type="email" 
              className="w-full bg-[#050505] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-cyan-500/50 outline-none transition-all" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
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
  );
};

export default ForgotPasswordForm;