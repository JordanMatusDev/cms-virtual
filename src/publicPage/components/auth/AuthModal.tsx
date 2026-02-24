import { useState, useRef } from 'react';
import { useTrapFocus } from '../../hooks/useTrapFocus';
import { X } from 'lucide-react';
import logoImg from '../../assets/virtualz.png'; 
import type { AuthView } from './types';
import LoginForm from './LoginForms';
import RegisterForm from './RegisterForm';
import RegisterResultModal from './RegisterResultModal';
import UpdateEmailModal from './UpdateEmailModal';
import ForgotPasswordForm from './ForgotPasswordForm';
import ForgotPasswordResultModal from './ForgotPasswordResultModal'; // <-- IMPORTANTE AÑADIR ESTO

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

const AuthModal = ({ isOpen, onClose, onLoginSuccess }: AuthModalProps) => {
  const [view, setView] = useState<AuthView>('login');
  
  // Estados para Registro
  const [showRegisterResult, setShowRegisterResult] = useState(false);
  const [registerFormData, setRegisterFormData] = useState<any>(null);
  const [focusEmail, setFocusEmail] = useState(false);
  const [showUpdateEmail, setShowUpdateEmail] = useState(false);
  const registerFormRef = useRef<any>(null);

  // --- NUEVOS: Estados para Recuperar Contraseña ---
  const [showForgotResult, setShowForgotResult] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  if (!isOpen) return null;
  const modalRef = useRef<HTMLDivElement>(null);
  useTrapFocus(modalRef);

  const handleClose = () => {
    setView('login');
    setShowRegisterResult(false);
    setRegisterFormData(null);
    setFocusEmail(false);
    setShowForgotResult(false); // Limpiamos al cerrar
    setForgotEmail('');
    onClose();
  };

  const getTitle = () => {
    if (view === 'login') return 'Iniciar Sesión';
    if (view === 'register') return 'Crear Cuenta';
    return 'Recuperar Contraseña';
  };

  // --- 1. AÑADIMOS EL IF DEL RESULTADO DE RECUPERAR CONTRASEÑA ---
  if (view === 'forgot' && showForgotResult) {
    return (
      <ForgotPasswordResultModal
        isOpen={true}
        onClose={() => {
          setShowForgotResult(false);
          setView('login'); // Lo manda al login después de cerrar
        }}
        email={forgotEmail}
      />
    );
  }

  // El if original del registro (Intacto)
  if (view === 'register' && showRegisterResult) {
    if (showUpdateEmail) {
      return (
        <UpdateEmailModal
          isOpen={showUpdateEmail}
          initialEmail={registerFormData?.email || ''}
          username={registerFormData?.username}
          userId={registerFormData?.id || registerFormData?.usuario?.id}
          onClose={() => setShowUpdateEmail(false)}
          onEmailUpdated={(newEmail) => {
            setRegisterFormData((prev: any) => ({ ...prev, email: newEmail }));
            setShowUpdateEmail(false);
          }}
        />
      );
    }
    return (
      <RegisterResultModal
        isOpen={showRegisterResult}
        onClose={() => {
          setShowRegisterResult(false);
          setView('register');
        }}
        onGoToLogin={() => {
          setShowRegisterResult(false);
          setView('login');
          setRegisterFormData(null);
          setFocusEmail(false);
        }}
        onFixEmail={() => {
          setShowUpdateEmail(true);
        }}
      />
    );
  }

  // Modal original completo
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity"></div>

      <div
        ref={modalRef}
        className={`relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_0_80px_-8px_rgba(6,182,212,0.45)] overflow-hidden transition-all duration-1000 animate-in fade-in ${isOpen ? 'opacity-100 scale-100 translate-y-0 blur-0' : 'opacity-0 scale-75 translate-y-16 blur-sm'}`}
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"></div>
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-500 hover:text-white p-1 rounded-full hover:bg-white/10 z-10 transition-colors">
          <X size={20} />
        </button>
        <div className="p-8 pt-10">
          <div className="flex flex-col items-center mb-6">
            <img src={logoImg} alt="Virtual+" className="h-12 w-auto mb-4 object-contain brightness-125 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
            <h2 className="text-2xl font-bold text-white tracking-tight">{getTitle()}</h2>
          </div>
          
          {view === 'login' && (
            <LoginForm
              onSuccess={(user: any) => { onLoginSuccess(user); window.dispatchEvent(new Event('auth:login')); handleClose(); }}
              onSwitchView={setView}
            />
          )}
          {view === 'register' && !showRegisterResult && (
            <RegisterForm
              ref={registerFormRef}
              onSwitchView={setView}
              initialData={registerFormData}
              focusEmail={focusEmail}
              onRegisterSuccess={(formData) => {
                setRegisterFormData(formData);
                setShowRegisterResult(true);
                setFocusEmail(false);
              }}
            />
          )}
          {/* --- 2. PASAMOS LA FUNCIÓN ONRESULT AL FORMULARIO --- */}
          {view === 'forgot' && (
            <ForgotPasswordForm 
              onSwitchView={setView} 
              onResult={(enviadoEmail) => {
                setForgotEmail(enviadoEmail);
                setShowForgotResult(true);
              }}
            />
          )}
        </div>
        
        {view !== 'forgot' && (
          <div className="bg-white/5 p-4 text-center border-t border-white/10">
            {view === 'register' ? (
              <p className="text-sm text-gray-400">
                ¿Ya tienes cuenta?{' '}
                <button
                  onClick={() => setView('login')}
                  className="text-white font-medium hover:text-cyan-400 transition-colors"
                  type="button"
                >
                  Inicia Sesión
                </button>
              </p>
            ) : (
              <p className="text-sm text-gray-400">
                {view === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
                <button 
                  onClick={() => setView(view === 'login' ? 'register' : 'login')}
                  className="text-white font-medium hover:text-cyan-400 transition-colors"
                >
                {view === 'login' ? 'Crear una cuenta' : 'Inicia Sesión'}
                </button>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthModal;