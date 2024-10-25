"use client"

import React, { createContext, useState, useContext } from 'react';

const RefreshContext = createContext({
  refreshTrigger: 0,
  triggerRefresh: (action: string) => {},
});

export const RefreshProvider = ({ children }: {children: React.ReactNode}) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = (action: string) => {
    console.log(`Refreshing after action: ${action}`);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <RefreshContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefresh = () => useContext(RefreshContext);
