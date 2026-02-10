
import React, { createContext, useContext, useState } from 'react';
import { PageSettings, PageStatus } from '../types';

interface PageAccessContextType {
  settings: PageSettings;
  updateSetting: (role: 'client' | 'agent', page: string, status: PageStatus) => void;
}

const DEFAULT_SETTINGS: PageSettings = {
  client: {
    'DASHBOARD': PageStatus.ENABLED,
    'MY_PLOT': PageStatus.ENABLED,
    'PAYMENTS': PageStatus.ENABLED,
    'DOCUMENTS': PageStatus.ENABLED,
    'SUPPORT': PageStatus.ENABLED,
    'PROFILE': PageStatus.ENABLED
  },
  agent: {
    'DASHBOARD': PageStatus.ENABLED,
    'NETWORK': PageStatus.ENABLED,
    'SALES': PageStatus.ENABLED,
    'EARNINGS': PageStatus.ENABLED,
    'LEADERBOARD': PageStatus.ENABLED,
    'MARKETING': PageStatus.ENABLED,
    'PROFILE': PageStatus.ENABLED,
    'SUPPORT': PageStatus.ENABLED
  }
};

const PageAccessContext = createContext<PageAccessContextType | undefined>(undefined);

export const PageAccessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<PageSettings>(DEFAULT_SETTINGS);

  const updateSetting = (role: 'client' | 'agent', page: string, status: PageStatus) => {
    setSettings(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [page]: status
      }
    }));
  };

  return (
    <PageAccessContext.Provider value={{ settings, updateSetting }}>
      {children}
    </PageAccessContext.Provider>
  );
};

export const usePageAccess = () => {
  const context = useContext(PageAccessContext);
  if (!context) {
    throw new Error('usePageAccess must be used within a PageAccessProvider');
  }
  return context;
};
