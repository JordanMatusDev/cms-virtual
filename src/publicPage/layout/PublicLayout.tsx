import { Outlet } from 'react-router';
import Header from './Header';
import Footer from './Footer';


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