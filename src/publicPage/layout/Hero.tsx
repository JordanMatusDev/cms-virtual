import { useState, useEffect, useMemo } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useCourseGrid } from '../hooks/pages/useCourseGrid';

// Las categorías ahora se obtienen dinámicamente

const particlesOptions = {
  fullScreen: { enable: false },
  background: {
    color: { value: "transparent" },
  },
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: { enable: false },
      onHover: { enable: true, mode: "grab" },
      resize: { enable: true },
    },
    modes: {
      grab: {
        distance: 180,
        links: { opacity: 0.5 }
      }
    },
  },
  particles: {
    color: { value: "#22d3ee" },
    links: {
      color: "#9333ea",
      distance: 150,
      enable: true,
      opacity: 0.15,
      width: 2.5,
    },
    move: {
      direction: "none" as const,
      enable: true,
      outModes: { default: "out" as const }, // Flujo infinito y suave
      random: false,
      speed: 0.5,
      straight: false,
    },
    number: {
      density: { enable: true, area: 800 },
      value: 100,
    },
    opacity: { value: 0.3 },
    shape: { type: "circle" as const },
    size: { value: { min: 2, max: 3 } },
  },
  detectRetina: true,
};

const Hero = () => {
  const [textIndex, setTextIndex] = useState(0);
  const [init, setInit] = useState(false);
  const { availableCategories } = useCourseGrid();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  useEffect(() => {
    if (!availableCategories.length) return;
    const textInterval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % availableCategories.length);
    }, 3000);
    return () => clearInterval(textInterval);
  }, [availableCategories]);

  return (
    <div className="relative bg-[#050505] overflow-hidden min-h-[650px] flex items-center justify-center font-sans">

      {/* ================= CAPA 1: FONDO INTERACTIVO DE PARTÍCULAS ================= */}
      {useMemo(() => (
        init && (
          <Particles
            id="tsparticles"
            options={particlesOptions}
            className="absolute inset-0 z-0"
          />
        )
      ), [init])}

      {/* ================= CAPA 2: AMBIENTE LUMINOSO (OPTIMIZADO) ================= */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(8,145,178,0.2)_0%,transparent_70%)] animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(88,28,135,0.2)_0%,transparent_70%)] animate-[pulse_10s_ease-in-out_infinite_reverse]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
      </div>

      {/* ================= CAPA 3: CONTENIDO PRINCIPAL ================= */}
      <div className="relative z-20 max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 text-center pointer-events-none">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0a0a0a] border border-white/10 shadow-[0_0_20px_-5px_rgba(168,85,247,0.4)] text-gray-300 text-sm font-medium mb-8 backdrop-blur-md animate-in fade-in slide-in-from-top-5 duration-1000">
          <Sparkles size={14} className="text-purple-400" />
          <span className="bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">El aprendizaje del futuro, hoy.</span>
        </div>

        {/* Título Principal */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight drop-shadow-2xl">
          Aprende <br />
          <span className="inline-block pb-3 leading-[1.25] align-text-bottom text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient bg-300% drop-shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all duration-500">
            {availableCategories[textIndex] || ''}
          </span>
        </h1>

        <p className="mt-6 text-base md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-200">
          Todo el poder educativo de YouTube, organizado como una plataforma premium. Cero ruido, cero distracciones y acceso gratuito.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center pointer-events-auto animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-300">
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
    </div>
  );
};

export default Hero;