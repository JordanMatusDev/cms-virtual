import { Outlet } from 'react-router';
import Header from './Header';
import Footer from './Footer';

// IMPORTANTE: Asegúrate de que esta ruta apunte a tu archivo CSS global 
// (el que trajiste del Repo 2 y que tiene las cosas de Tailwind).
// Si lo dejaste en src/publicPage/index.css, la ruta sería algo así:
import '../index.css'; 

export default function PublicLayout() {
  return (
    <div className="bg-[#050505] min-h-screen flex flex-col font-sans">
      <Header />
      
      {/* Aquí es donde React Router inyectará mágicamente las páginas 
          (Hero, CourseGrid, MyCourses, etc.) dependiendo de la URL */}
      <main className="flex-grow">
        <Outlet /> 
      </main>

      <Footer />
    </div>
  );
}