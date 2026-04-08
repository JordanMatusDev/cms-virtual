import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface MaintenanceContextType {
  maintenanceMode: boolean;
  setMaintenanceMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export const MaintenanceProvider = ({ children }: { children: ReactNode }) => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    // Dynamically import to avoid circular dependency issues
    import('../services/apiService').then((apiService) => {
      apiService.setMaintenanceCallback(() => {
        setMaintenanceMode(true);
      });
    });
  }, []);

  return (
    <MaintenanceContext.Provider value={{ maintenanceMode, setMaintenanceMode }}>
      {children}
    </MaintenanceContext.Provider>
  );
};

export const useMaintenance = () => {
  const context = useContext(MaintenanceContext);
  if (!context) {
    throw new Error('useMaintenance must be used within a MaintenanceProvider');
  }
  return context;
};
