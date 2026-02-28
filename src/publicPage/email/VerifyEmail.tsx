import { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, Ban, Loader2, ArrowRight } from 'lucide-react';
import { useSearchParams } from 'react-router';
// Asumimos que esta función la crearemos en el siguiente paso
import { verifyAndActivateUser } from '../services/email/verifyService';

type VerificationStatus = 'loading' | 'success' | 'already' | 'error';

export default function VerifyEmail() {
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [errorMessage] = useState('Enlace no válido o expirado.');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const verifyAccount = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setStatus('error');
        return;
      }
      const result = await verifyAndActivateUser(token);
      setStatus(result);
    };

    verifyAccount();
  }, [searchParams]);

  // Aquí devolvemos las clases completas de Tailwind para evitar que el compilador las borre
  const getStateConfig = () => {
    switch (status) {
      case 'success':
        return { 
          ambientBg: 'bg-green-600/20',
          topLine: 'via-green-500',
          iconGlow: 'bg-green-500/20',
          iconBorder: 'border-green-500/30',
          icon: <CheckCircle size={40} className="text-green-400" />, 
          title: '¡Cuenta Verificada!', 
          desc: 'Todo listo. Tu cuenta ha sido activada correctamente.' 
        };
      case 'already':
        return { 
          ambientBg: 'bg-yellow-600/10',
          topLine: 'via-yellow-500',
          iconGlow: 'bg-yellow-500/20',
          iconBorder: 'border-yellow-500/30',
          icon: <AlertTriangle size={40} className="text-yellow-400" />, 
          title: 'Enlace ya utilizado', 
          desc: 'Esta cuenta ya fue verificada anteriormente.' 
        };
      case 'error':
        return { 
          ambientBg: 'bg-red-600/10',
          topLine: 'via-red-500',
          iconGlow: 'bg-red-500/20',
          iconBorder: 'border-red-500/30',
          icon: <Ban size={40} className="text-red-400" />, 
          title: 'Error', 
          desc: errorMessage 
        };
      default: // loading
        return { 
          ambientBg: 'bg-blue-600/10',
          topLine: 'via-blue-500',
          iconGlow: 'bg-blue-500/20',
          iconBorder: 'border-blue-500/30',
          icon: <Loader2 size={40} className="text-blue-400 animate-spin" />, 
          title: 'Procesando...', 
          desc: 'Estamos validando tu cuenta, por favor espera.' 
        };
    }
  };

  const config = getStateConfig();

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Fondo Ambiental (Glow dinámico) */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] transition-colors duration-700 ${config.ambientBg}`} />

      {/* Tarjeta Principal Glass */}
      <div className="w-full max-w-sm bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] relative z-10 animate-in zoom-in-95 duration-500">
        
        {/* Logo */}
        <div className="text-center mb-6">
          <img src="/src/assets/virtualz.png" alt="Virtual+ Logo" className="h-12 mx-auto mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
        </div>
        
        {/* Línea Superior de Color */}
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent ${config.topLine} to-transparent opacity-80 transition-colors duration-500`} />

        {/* Icono Central con Glow */}
        <div className="mb-6 relative inline-flex items-center justify-center">
          <div className={`absolute inset-0 rounded-full blur-xl transition-colors duration-500 ${config.iconGlow} ${status === 'loading' ? 'animate-pulse' : ''}`}></div>
          <div className={`relative w-20 h-20 bg-black/40 border rounded-full flex items-center justify-center shadow-lg transition-colors duration-500 ${config.iconBorder}`}>
            {config.icon}
          </div>
        </div>

        {/* Textos */}
        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight animate-in fade-in slide-in-from-bottom-2 duration-300">
          {config.title}
        </h2>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          {config.desc}
        </p>

        {/* Botones de Acción */}
        {status !== 'loading' && (
          <button
            onClick={() => {
              if (status === 'error') {
                window.location.href = '/';
              } else {
                sessionStorage.setItem('openLoginModal', '1');
                window.location.href = '/';
              }
            }}
            className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2
              ${status === 'success' 
                ? 'bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)]' 
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/5'
              }`}
          >
            {status === 'error' ? 'Volver al Inicio' : 'Ir al Inicio de Sesión'}
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}