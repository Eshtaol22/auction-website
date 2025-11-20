import React, { createContext, useContext, useState,type ReactNode } from 'react';

interface SimpleContextType {
  message: string;
  setMessage: (message: string) => void;
}

const SimpleContext = createContext<SimpleContextType | undefined>(undefined);

export function SimpleProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('Context is working!');

  return (
    <SimpleContext.Provider
      value={{
        message,
        setMessage,
      }}
    >
      {children}
    </SimpleContext.Provider>
  );
}

export function useSimple() {
  const context = useContext(SimpleContext);
  if (context === undefined) {
    throw new Error('useSimple must be used within a SimpleProvider');
  }
  return context;
}