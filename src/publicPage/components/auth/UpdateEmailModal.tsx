import { useState, useRef } from 'react';
import { useTrapFocus } from '../../hooks/auth/useTrapFocus';
import { sendVerificationEmail } from '../../services/auth/registerService';
import { updatePendingUserEmail } from '../../services/auth/updatePendingUserEmail';
import { checkEmailExists } from '../../services/auth/checkExistsService';
import { Mail, Loader2, AlertCircle, X } from 'lucide-react';

interface UpdateEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmailUpdated: (newEmail: string) => void;
  initialEmail: string;
  username?: string;
  userId?: number;
}

const UpdateEmailModal = ({ isOpen, onClose, onEmailUpdated, initialEmail, username, }: UpdateEmailModalProps) => {
  const [email, setEmail] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [currentEmail, setCurrentEmail] = useState(initialEmail);

  if (!isOpen) return null;
  const modalRef = useRef<HTMLDivElement>(null);
  useTrapFocus(modalRef);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldError(null);
    try {
      // Validar si el correo ya existe
      if (email.trim() !== currentEmail.trim()) {
        const exists = await checkEmailExists(email.trim());
        if (exists) {
          setFieldError('El correo ya está registrado.');
          setIsLoading(false);
          return;
        }
      }
      // Buscar el usuario por el email actual y actualizarlo
      const updatedId = await updatePendingUserEmail(currentEmail, email);
      if (!updatedId) throw new Error('No se pudo actualizar el correo en el servidor.');
      if (username) {
        await sendVerificationEmail(email, username);
      }
      setCurrentEmail(email);
      onEmailUpdated(email);
      onClose();
    } catch (err: any) {
      setError('No se pudo actualizar el correo. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md transition-opacity"></div>
      <div ref={modalRef} className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_0_80px_-8px_rgba(6,182,212,0.45)] overflow-hidden animate-in fade-in zoom-in-95 duration-300 min-w-[350px] min-h-[440px] flex flex-col justify-center">
        {/* Línea superior de colores */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"></div>
        {/* Botón Cerrar */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white p-1 rounded-full hover:bg-white/10 z-10 transition-colors">
          <X size={20} />
        </button>
        <div className="p-8 pt-14 flex-1 flex flex-col justify-center">
          <div className="flex flex-col items-center mb-4">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full ring-1 shadow bg-cyan-500/10 ring-cyan-500/20 text-cyan-400 shadow-cyan-500/30">
              <Mail size={44} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Actualizar correo</h3>
            <p className="text-center text-gray-400 text-sm mt-1">Ingresa el nuevo correo para tu cuenta pendiente de verificación.</p>
          </div>
          {error && (
            <div className="mb-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 animate-shake">
              <AlertCircle className="text-red-400" size={16} />
              <span className="text-xs text-red-300">{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-400 ml-1">Correo electrónico</label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setFieldError(null); }}
                  autoComplete="off"
                  className={`w-full bg-[#050505] border rounded-xl py-3 pl-9 pr-3 text-base text-white focus:border-cyan-500/50 outline-none transition-all placeholder:text-gray-600 ${fieldError ? 'border-red-500 focus:border-red-500' : 'border-white/10'}`}
                  required
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
              </div>
              {fieldError && (
                <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mt-2">{fieldError}</div>
              )}
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || email.trim() === '' || email.trim() === currentEmail.trim()}
                className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Actualizar correo'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateEmailModal;
