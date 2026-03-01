import { Link, useLocation, useNavigate } from 'react-router';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoHome = () => {
    navigate('/');
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
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
        
        
        <div className="flex flex-col md:grid md:grid-cols-2 lg:flex lg:flex-row lg:justify-between gap-10 mb-16">
          
          <div className="lg:w-1/4">
            <h2 className="text-2xl font-bold text-white mb-4">
              Virtual<span className="text-cyan-500">+</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tu plataforma para encontrar y organizar los mejores cursos gratuitos de YouTube.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6 inline-block border-b-2 border-cyan-500 pb-1">
              Navegación
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <button
                  type="button"
                  onClick={handleGoHome}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleGoToCourses}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Cursos
                </button>
              </li>
              <li>
                <Link to="/verificacion" className="hover:text-cyan-400 transition-colors">Verificar Certificado</Link>
              </li>
            </ul>
          </div>

          {/* 3. LEGAL */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 inline-block border-b-2 border-cyan-500 pb-1">
              Legal
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <Link to="/legal#sobre-nosotros" className="hover:text-cyan-400 transition-colors">Sobre Nosotros</Link>
                </li>
                <li>
                  <Link to="/legal#politica-privacidad" className="hover:text-cyan-400 transition-colors">Política de Privacidad</Link>
                </li>
                <li>
                  <Link to="/legal#terminos-servicio" className="hover:text-cyan-400 transition-colors">Términos de Servicio</Link>
                </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6 inline-block border-b-2 border-cyan-500 pb-1">
              Soporte
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href="mailto:support@virtual-edu.lat" className="hover:text-cyan-400 transition-colors">
                  support@virtual-edu.lat
                </a>
              </li>
            </ul>
          </div>

          
          <div>
             <h3 className="text-white font-bold text-lg mb-6 inline-block border-b-2 border-cyan-500 pb-1">
               Síguenos
             </h3>
             <div className="flex gap-4"> 
                <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110">
                    <Facebook size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110">
                    <Twitter size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110">
                    <Instagram size={24} />
                </a>
             </div>
          </div>

        </div>
        
        
        <div className="text-center pt-8 border-t border-white/5">
          <p className="text-gray-500 text-sm">
            &copy; 2025 Virtual+. Todos los derechos reservados.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;