import { Link, useLocation, useNavigate } from 'react-router';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoHome = () => {
    navigate('/');
    setTimeout(() => {
      // Cambiado a smooth para un regreso más suave
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, 50);
  };

  const handleGoToCourses = () => {
    if (location.pathname === '/') {
      const target = document.getElementById('course-grid');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    navigate('/#course-grid');
  };

  return (
    <footer className="bg-[#050505] border-t border-white/10 pt-16 pb-8 font-sans">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Grid estructurado para mantener tus 5 bloques perfectos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-16">
          
          {/* 1. BRAND (Toma 2 columnas para que no se apriete el texto) */}
          <div className="lg:col-span-2 lg:pr-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Virtual<span className="text-cyan-500">+</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tu plataforma para encontrar y organizar los mejores cursos gratuitos de YouTube.
            </p>
          </div>

          {/* 2. NAVEGACIÓN */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-bold text-lg mb-6 inline-block border-b-2 border-cyan-500 pb-1">
              Navegación
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <button
                  type="button"
                  onClick={handleGoHome}
                  className="hover:text-cyan-400 transition-all duration-300"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleGoToCourses}
                  className="hover:text-cyan-400 transition-all duration-300"
                >
                  Cursos
                </button>
              </li>
              <li>
                <Link to="/verificacion" className="hover:text-cyan-400 transition-all duration-300">Verificar Certificado</Link>
              </li>
            </ul>
          </div>

          {/* 3. LEGAL */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-bold text-lg mb-6 inline-block border-b-2 border-cyan-500 pb-1">
              Legal
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <Link to="/legal#sobre-nosotros" className="hover:text-cyan-400 transition-all duration-300">Sobre Nosotros</Link>
                </li>
                <li>
                  <Link to="/legal#politica-privacidad" className="hover:text-cyan-400 transition-all duration-300">Política de Privacidad</Link>
                </li>
                <li>
                  <Link to="/legal#terminos-servicio" className="hover:text-cyan-400 transition-all duration-300">Términos de Servicio</Link>
                </li>
            </ul>
          </div>

          {/* 4. SOPORTE (Justo como lo querías, en su propio espacio) */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-bold text-lg mb-6 inline-block border-b-2 border-cyan-500 pb-1">
              Soporte
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href="mailto:support@virtual-edu.lat" className="hover:text-cyan-400 transition-all duration-300 break-words">
                  support@virtual-edu.lat
                </a>
              </li>
            </ul>
          </div>

          {/* 5. SÍGUENOS (Completamente separado del soporte) */}
          <div className="lg:col-span-1">
             <h3 className="text-white font-bold text-lg mb-6 inline-block border-b-2 border-cyan-500 pb-1">
               Síguenos
             </h3>
             <div className="flex gap-4"> 
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-all duration-300 transform hover:scale-110">
                    <Facebook size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-all duration-300 transform hover:scale-110">
                    <Twitter size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-all duration-300 transform hover:scale-110">
                    <Instagram size={24} />
                </a>
             </div>
          </div>

        </div>
        
        {/* COPYRIGHT */}
        <div className="text-center pt-8 border-t border-white/5">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Virtual+. Todos los derechos reservados.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;