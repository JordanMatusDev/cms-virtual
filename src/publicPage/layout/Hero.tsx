import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Cpu } from 'lucide-react';

const Hero = () => {
  // --- ESTADOS PARA ANIMACIONES ---
  const [textIndex, setTextIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);

  const words = [
    "Programación",
    "Diseño UX/UI",
    "Marketing",
    "Inteligencia Artificial",
    "Desarrollo Web",
    "Ciberseguridad",
    "Data Science",
    "Machine Learning",
    "Bases de Datos",
    "Desarrollo de Apps",
    "Finanzas",
    "Idiomas",
    "Gestión de Proyectos"
  ];

  // --- IMÁGENES HOLOGRÁFICAS (Set 1: Arriba Derecha - Temas Cerebrales/Redes) ---
  const holoImagesTop = [
    "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=500&q=80", // Red neuronal base
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=500&q=80", // Cerebro IA
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=500&q=80", // Conexiones de datos
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=500&q=80", // Chip futurista
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=500&q=80"  // Red global
  ];

  // --- IMÁGENES HOLOGRÁFICAS (Set 2: Abajo Izquierda - Temas de Código/Data) ---
  const holoImagesBottom = [
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=500&q=80", // Data stream base
    "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=500&q=80", // Código en pantalla
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80", // Placa de circuito
    "https://images.unsplash.com/photo-1535378620166-273708d44e4c?auto=format&fit=crop&w=500&q=80", // Realidad aumentada abstracta
    "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=500&q=80"  // Tecnología de flujo
  ];


  // 1. Efecto de escritura del Título (Cada 3 segundos)
  useEffect(() => {
    const textInterval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(textInterval);
  }, []);

  // 2. Efecto de rotación de Imágenes (Cada 5 segundos - más lento para que se aprecie)
  useEffect(() => {
    const imageInterval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % holoImagesTop.length);
    }, 5000);
    return () => clearInterval(imageInterval);
  }, []);


  return (
    <div className="relative bg-[#050505] overflow-hidden min-h-[650px] flex items-center justify-center font-sans">
      
      {/* ================= CAPA 1: AMBIENTE LUMINOSO ================= */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-cyan-900/20 rounded-full blur-[120px] animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[120px] animate-[pulse_10s_ease-in-out_infinite_reverse]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
      </div>


      {/* ================= CAPA 2: HOLOGRAMAS CAMBIANTES ================= */}
      <div className="absolute inset-0 pointer-events-none z-0">
          
          {/* --- Elemento 1 (Arriba Derecha) --- */}
          {/* Contenedor fijo para la animación de flotar */}
          <div className="absolute top-20 right-[10%] w-64 h-64 animate-[float_6s_ease-in-out_infinite]">
             {/* Renderizamos TODAS las imágenes apiladas */}
             {holoImagesTop.map((imgUrl, index) => (
                 <img 
                    key={index}
                    src={imgUrl} 
                    alt={`Hologram Top ${index}`}
                    // CLAVE: La opacidad cambia si el índice coincide. 'transition-opacity duration-1000' hace el fade suave.
                    className={`absolute inset-0 w-full h-full object-contain mix-blend-screen filter hue-rotate-180 brightness-150 contrast-150 transition-opacity duration-1000 ease-in-out ${index === imageIndex ? 'opacity-30' : 'opacity-0'}`}
                />
             ))}
          </div>

           {/* --- Elemento 2 (Abajo Izquierda) --- */}
           <div className="absolute bottom-20 left-[5%] w-80 h-80 animate-[float_8s_ease-in-out_infinite_reverse]">
             {holoImagesBottom.map((imgUrl, index) => (
                 <img 
                    key={index}
                    src={imgUrl} 
                    alt={`Hologram Bottom ${index}`}
                    className={`absolute inset-0 w-full h-full object-contain mix-blend-screen filter brightness-125 saturate-200 transition-opacity duration-1000 ease-in-out ${index === imageIndex ? 'opacity-20' : 'opacity-0'}`}
                />
             ))}
          </div>

          {/* Elemento 3: Icono estático central (opcional, para dar ancla) */}
          <div className="absolute top-1/3 left-1/4 opacity-10 text-cyan-500 animate-[pulse_4s_ease-in-out_infinite]">
            <Cpu size={120} strokeWidth={1} />
          </div>
      </div>


      {/* ================= CAPA 3: CONTENIDO PRINCIPAL ================= */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0a0a0a] border border-white/10 shadow-[0_0_20px_-5px_rgba(168,85,247,0.4)] text-gray-300 text-sm font-medium mb-8 backdrop-blur-md animate-in fade-in slide-in-from-top-5 duration-1000">
          <Sparkles size={14} className="text-purple-400" />
          <span className="bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">El aprendizaje del futuro, hoy.</span>
        </div>

        {/* Título Principal */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight drop-shadow-2xl">
          Aprende <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient bg-300% drop-shadow-[0_0_25px_rgba(34,211,238,0.4)]">
            {words[textIndex]}
          </span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-200">
          La mejor selección de cursos gratuitos de la web, curados por expertos y organizados para ti. Sin ruido, solo conocimiento.
        </p>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-300">
          <button
            type="button"
            className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 shadow-[0_0_50px_-10px_rgba(34,211,238,0.6)] hover:shadow-[0_0_70px_-10px_rgba(168,85,247,0.7)]"
            onClick={() => {
              const target = document.getElementById('course-grid');
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              } else {
                window.location.hash = '#course-grid';
              }
            }}
          >
            <span className="relative flex items-center gap-2 z-10">
              Explorar Ahora <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </div>

      {/* Definición de la animación de flotar */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default Hero;