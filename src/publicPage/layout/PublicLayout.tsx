import { Outlet } from 'react-router';
import Header from './Header';
import Footer from './Footer';
import { MaintenanceProvider, useMaintenance } from '../context/MaintenanceContext';
import Maintenance from './Maintenance';
import '../index.css';

function PublicLayoutContent() {
  const { maintenanceMode } = useMaintenance();
  if (maintenanceMode) {
    return <Maintenance />;
  }
  return (
    <div className="bg-[#050505] min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function PublicLayout() {
  return (
    <MaintenanceProvider>
      <PublicLayoutContent />
    </MaintenanceProvider>
  );
}