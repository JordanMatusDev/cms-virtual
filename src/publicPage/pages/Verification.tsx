import logo from '../assets/virtualz.png';
import { 
    Search, 
    Loader2, 
    CheckCircle, 
    XCircle, 
    ShieldCheck, 
    Calendar, 
    User, 
    Award, 
    ArrowRight 
} from 'lucide-react';
import { useVerification } from '../hooks/pages/useVerification';
import usePageTitle from '../hooks/usePageTitle';

const Verification = () => {
    usePageTitle('Verificación de Certificados');
    const { 
        code, 
        setCode, 
        status, 
        certData, 
        handleVerify, 
        handleReset 
    } = useVerification();

    return (
        <div className="min-h-screen bg-[#04070f] text-white flex flex-col items-center justify-center p-4 pt-32 sm:pt-40 relative overflow-hidden">

            {/* --- TARJETA PRINCIPAL --- */}
            <div className="relative z-10 w-full max-w-xl bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-700">
                
                {/* SECCIÓN LOGO */}
                <div className="flex justify-center mb-8">
                    <div className="relative group">
                        <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-purple-500/20 rounded-xl blur-xl opacity-50 group-hover:opacity-100 transition duration-500"></div>
                        <img 
                            src={logo}
                            alt="Virtual+ Logo" 
                            className="h-12 w-auto relative z-10 transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150x50?text=Virtual+Logo'; }}
                        />
                    </div>
                </div>

                {/* Cabecera (Título) */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white mb-3 flex items-center justify-center gap-3">
                        <ShieldCheck className="w-8 h-8 text-cyan-400" />
                        Validación de Certificados
                    </h1>
                    <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">
                        Ingresa el código único que aparece en el diploma para verificar su autenticidad.
                    </p>
                </div>

                {/* --- INPUT DE BÚSQUEDA --- */}
                <form onSubmit={handleVerify} className="relative mb-8 group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <Search className={`h-5 w-5 transition-colors duration-300 ${status === 'loading' ? 'text-cyan-400' : 'text-gray-500 group-focus-within:text-cyan-400'}`} />
                    </div>
                    
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Ej: CERT-XYZ-2025"
                        disabled={status === 'loading' || status === 'success'}
                        className="w-full pl-12 pr-32 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-mono tracking-wider shadow-inner"
                    />

                    <div className="absolute right-2 top-2 bottom-2">
                        {status === 'loading' ? (
                            <div className="h-full px-6 flex items-center justify-center bg-white/5 rounded-lg border border-white/5">
                                <Loader2 className="animate-spin h-5 w-5 text-cyan-400" />
                            </div>
                        ) : status === 'success' ? (
                            <button
                                type="button"
                                onClick={handleReset}
                                className="h-full px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-all"
                            >
                                Nueva Consulta
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={!code.trim()}
                                className="h-full px-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-medium text-sm transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 group/btn"
                            >
                                Validar
                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        )}
                    </div>
                </form>

                {/* --- RESULTADOS --- */}
                <div className="min-h-[100px]">
                    
                    {/* ESTADO: IDLE (INICIAL) */}
                    {status === 'idle' && (
                        <div className="text-center py-4 opacity-50 border-t border-white/5 pt-6 border-dashed">
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Sistema de Verificación</p>
                            <div className="flex justify-center gap-4 text-gray-600">
                                <span className="flex items-center gap-1 text-xs"><ShieldCheck size={12}/> Seguro</span>
                                <span className="flex items-center gap-1 text-xs"><CheckCircle size={12}/> Oficial</span>
                            </div>
                        </div>
                    )}

                    {/* ESTADO: SUCCESS (ÉXITO) */}
                    {status === 'success' && certData && (
                        <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
                            <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl text-center relative overflow-hidden">
                                {/* Línea superior brillante */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50" />
                                
                                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                                <h3 className="text-xl font-bold text-white mb-4">¡Certificado Auténtico!</h3>
                                
                                <div className="space-y-3 text-left bg-black/20 p-4 rounded-lg border border-white/5 relative z-10">
                                    <div className="flex items-start gap-3">
                                        <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Estudiante</p>
                                            <p className="text-white font-medium">{certData.studentName}</p>
                                        </div>
                                    </div>
                                    <div className="h-px bg-white/10" />
                                    <div className="flex items-start gap-3">
                                        <Award className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Curso Completado</p>
                                            <p className="text-cyan-300 font-medium">{certData.courseName}</p>
                                        </div>
                                    </div>
                                    <div className="h-px bg-white/10" />
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Fecha de Emisión</p>
                                            <p className="text-gray-300">{certData.issueDate}</p>
                                        </div>
                                    </div>
                                </div>
                                {/* Icono grande de fondo en la esquina */}
                                <div className="absolute -right-6 -bottom-6 text-green-500/5 rotate-12 pointer-events-none">
                                    <CheckCircle size={120} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ESTADO: ERROR */}
                    {status === 'error' && (
                        <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
                            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-center relative overflow-hidden group">
                                {/* EL ICONO INCLINADO GRANDE EN LA ESQUINA */}
                                <div className="absolute -right-6 -top-6 text-red-500/10 rotate-12 group-hover:rotate-0 transition-transform duration-500 pointer-events-none">
                                    <XCircle size={100} />
                                </div>

                                <div className="relative z-10">
                                    <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                                    <h3 className="text-xl font-bold text-white mb-2">No encontrado</h3>
                                    <p className="text-gray-400 text-sm">
                                        El código <span className="text-white font-mono bg-white/10 px-1 rounded">{code}</span> no coincide con ningún registro.
                                    </p>
                                    <button 
                                        onClick={handleReset}
                                        className="mt-4 text-sm text-red-400 hover:text-red-300 underline decoration-dotted underline-offset-4 transition-colors"
                                    >
                                        Intentar nuevamente
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Verification;