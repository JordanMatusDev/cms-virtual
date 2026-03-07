import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { Info, ShieldCheck, FileText } from 'lucide-react';

export default function LegalInfo() {
  const location = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    const isReload = navEntries.length > 0 && navEntries[0].type === "reload";

    if (isReload) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    } else if (location.hash) {
      // Le damos 300ms para asegurar que la página nueva ya se dibujó por completo
      setTimeout(() => {
        const element = document.getElementById(location.hash.substring(1));
        if (element) {
          // Usamos scrollIntoView nativo en lugar de matemáticas. 
          // Respetará el margen 'scroll-mt-40' que pusimos en las secciones.
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-[#04070f] text-white font-sans selection:bg-cyan-500/30 relative py-20 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-4 tracking-tight leading-normal pb-2">
            Información Legal
          </h1>
          <p className="text-gray-400 text-lg">Todo lo que necesitas saber sobre Virtual+</p>
        </div>

        {/* --- SECCIÓN 1: SOBRE NOSOTROS --- */}
        {/* Cambiamos scroll-mt-24 por scroll-mt-40 */}
        <section 
          id="sobre-nosotros" 
          className="bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-500 ease-out scroll-mt-40 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1/3 h-1 bg-gradient-to-r from-cyan-500 to-transparent opacity-50"></div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400">
              <Info size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white">Sobre Nosotros</h2>
          </div>
          
          <div className="space-y-6 text-gray-400 leading-relaxed">
            <p>
              Bienvenidos a <strong className="text-white font-semibold">Virtual+</strong>, tu destino principal para descubrir y organizar los mejores cursos gratuitos disponibles en YouTube.
            </p>
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-2">Nuestra Misión</h3>
              <p>Nuestra misión es democratizar el aprendizaje facilitando el acceso a educación de calidad para todos, sin importar dónde se encuentren.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-2">¿Qué Hacemos?</h3>
              <p>Navegamos por la inmensidad de YouTube para encontrar cursos completos y de alta calidad, organizándolos en una plataforma intuitiva para que tu experiencia de aprendizaje sea fluida y estructurada.</p>
            </div>
          </div>
        </section>

        {/* --- SECCIÓN 2: POLÍTICA DE PRIVACIDAD --- */}
        {/* Cambiamos scroll-mt-24 por scroll-mt-40 */}
        <section 
          id="politica-privacidad" 
          className="bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-500 delay-100 ease-out fill-mode-both scroll-mt-40 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-1/3 h-1 bg-gradient-to-l from-purple-500 to-transparent opacity-50"></div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
              <ShieldCheck size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white">Política de Privacidad</h2>
          </div>

          <div className="space-y-6 text-gray-400 leading-relaxed">
            <p className="text-sm bg-white/5 inline-block px-3 py-1 rounded-full border border-white/10">
              Última actualización: <strong className="text-gray-300">10 de Octubre de 2025</strong>
            </p>
            <p>En Virtual+, respetamos tu privacidad y nos comprometemos a protegerla mediante el cumplimiento de esta política.</p>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-3">Información que Recopilamos</h3>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong className="text-gray-300">Información de la cuenta:</strong> Tu nombre de usuario, dirección de correo electrónico y contraseña (cifrada de forma segura).</li>
                <li><strong className="text-gray-300">Progreso del usuario:</strong> Guardamos un registro de los cursos en los que te inscribes para ayudarte a retomar donde te quedaste.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-3">Uso de tu Información</h3>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Presentarte nuestro sitio web y sus contenidos.</li>
                <li>Proporcionarte la información y los servicios que nos solicitas.</li>
                <li>Permitirte participar en las funciones interactivas de nuestro sitio web.</li>
                <li>Notificarte sobre cambios en la plataforma o nuevos cursos relevantes.</li>
              </ul>
            </div>
            <p className="text-purple-300/80 bg-purple-500/10 p-4 rounded-xl border border-purple-500/20">
              No vendemos ni compartimos tu información personal con terceros para fines comerciales bajo ninguna circunstancia.
            </p>
          </div>
        </section>

        {/* --- SECCIÓN 3: TÉRMINOS DE SERVICIO --- */}
        {/* Cambiamos scroll-mt-24 por scroll-mt-40 */}
        <section 
          id="terminos-servicio" 
          className="bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-500 delay-200 ease-out fill-mode-both scroll-mt-40 relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
              <FileText size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white">Términos de Servicio</h2>
          </div>

          <div className="space-y-6 text-gray-400 leading-relaxed">
            <p className="text-sm bg-white/5 inline-block px-3 py-1 rounded-full border border-white/10">
              Última actualización: <strong className="text-gray-300">10 de Octubre de 2025</strong>
            </p>
            <p>Al acceder o utilizar los servicios de Virtual+, aceptas estar sujeto a los siguientes términos y condiciones.</p>

            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-2">Uso de la Plataforma</h3>
              <p>Nuestra plataforma está diseñada estrictamente para fines educativos personales y no comerciales. No puedes utilizar Virtual+ para ninguna actividad ilegal o no autorizada.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-2">Contenido y Derechos de Autor</h3>
              <p>Virtual+ es una plataforma de curación de contenido. No alojamos ninguno de los videos de los cursos en nuestros servidores; todo el contenido multimedia se transmite directamente desde YouTube y pertenece a sus respectivos creadores originales.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-2">Cuentas de Usuario</h3>
              <p>Eres completamente responsable de mantener la confidencialidad de tu cuenta y contraseña, así como de todas las actividades que ocurran bajo tu perfil.</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}