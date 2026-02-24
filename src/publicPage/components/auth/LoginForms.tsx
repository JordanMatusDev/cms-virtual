// import { useLogin } from '../../hooks/auth/useLogin';
// import { Eye, EyeOff, X, User, Lock } from 'lucide-react';
// import type { AuthView } from './types';




// interface LoginFormProps {
//   onSuccess: (user: any) => void;
//   onSwitchView: (view: AuthView) => void;
// }

// const LoginForm = ({ onSuccess, onSwitchView }: LoginFormProps) => {
//   const {
//     identifier,
//     setIdentifier,
//     password,
//     setPassword,
//     showPass,
//     setShowPass,
//     isSubmitting,
//     isSuccessAnimating,
//     fieldErrors,
//     handleLogin,
//   } = useLogin();

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     handleLogin(onSuccess);
//   };

//   return (
//     <div className="animate-in fade-in slide-in-from-left-4">
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="space-y-1.5">
//           <label className="text-sm font-medium text-gray-400 ml-1 leading-4">Usuario o Email</label>
//           <div className="relative group">
//             <input
//               type="text"
//               value={identifier}
//               onChange={(e) => setIdentifier(e.target.value)}
//               className={`w-full bg-[#050505] border rounded-xl py-3 pl-10 pr-4 text-white focus:border-cyan-500/50 outline-none transition-all placeholder:text-gray-600 ${(fieldErrors.identifier || (fieldErrors.password && !fieldErrors.identifier)) ? 'border-red-500 focus:border-red-500' : 'border-white/10'}`}
//             />
//             <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
//           </div>
//           {fieldErrors.identifier && (
//             <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mt-2">{fieldErrors.identifier}</div>
//           )}
//         </div>

//         <div className="space-y-1.5">
//           <label className="text-sm font-medium text-gray-400 ml-1 leading-4">Contraseña</label>
//           <div className="relative group">
//             <input
//               type={showPass ? 'text' : 'password'}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className={`w-full bg-[#050505] border rounded-xl py-3 pl-10 pr-10 text-white focus:border-cyan-500/50 outline-none transition-all placeholder:text-gray-600 ${fieldErrors.password ? 'border-red-500 focus:border-red-500' : 'border-white/10'}`}
//             />
//             <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
//             <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400">
//               {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           </div>
//           {fieldErrors.password && (
//             <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mt-2">{fieldErrors.password}</div>
//           )}
//         </div>

//         <div className="flex justify-end pt-1">
//           <button type="button" onClick={() => onSwitchView('forgot')} className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline">
//             ¿Olvidaste tu contraseña?
//           </button>
//         </div>

//         {fieldErrors.general && (
//           <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mt-2 text-center">{fieldErrors.general}</div>
//         )}

//         <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2 disabled:opacity-70">
//           {isSuccessAnimating ? (
//             <span className="flex items-center gap-3">
//               <span className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center animate-spin shadow-[0_0_20px_rgba(34,211,238,0.5)]">
//                 <X size={20} strokeWidth={5} className="text-white" />
//               </span>
//               Iniciando sesion...
//             </span>
//           ) : (
//             'Iniciar Sesión'
//           )}
//         </button>
//       </form>
//     </div>
//   );
// };
// export default LoginForm;
