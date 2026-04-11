import { ServerCrash, RefreshCw, AlertCircle } from 'lucide-react';
import { useState } from 'react';

const Maintenance = () => {
    const [isRetrying, setIsRetrying] = useState(false);

    const handleRetry = () => {
        setIsRetrying(true);
        setTimeout(() => {
            window.location.reload();
        }, 800);
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 font-sans relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(147,51,234,0.15)_0%,transparent_70%)] animate-[pulse_4s_ease-in-out_infinite]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(6,182,212,0.15)_0%,transparent_70%)] animate-[pulse_6s_ease-in-out_infinite_reverse]"></div>
                <div className="absolute inset-0 bg-[url('/assets/noise.svg')] opacity-5 mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 max-w-lg w-full flex flex-col items-center text-center">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full"></div>
                    <div className="w-24 h-24 bg-[#121212] border border-white/10 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.3)] relative">
                        <ServerCrash size={48} className="text-cyan-400" />
                        <div className="absolute -bottom-2 -right-2 bg-[#050505] rounded-full p-1 border border-white/10">
                            <AlertCircle size={20} className="text-purple-400" />
                        </div>
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-xl">
                    Servidores en <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Mantenimiento</span>
                </h1>

                <p className="text-gray-400 text-base md:text-lg mb-10 leading-relaxed">
                    Estamos realizando una actualización del servicio.
                    Por favor, inténtalo nuevamente en unos minutos.
                    Gracias por su comprensión.
                </p>

                <button
                    onClick={handleRetry}
                    disabled={isRetrying}
                    className="group relative px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-full overflow-hidden transition-all hover:bg-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        {isRetrying ? (
                            <>
                                <RefreshCw size={20} className="animate-spin text-cyan-400" />
                                Reconectando...
                            </>
                        ) : (
                            <>
                                <RefreshCw size={20} className="text-cyan-400 group-hover:rotate-180 transition-transform duration-700" />
                                Reintentar Conexión
                            </>
                        )}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default Maintenance;