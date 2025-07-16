import React, { createContext, useContext, useState } from 'react';

// Define the context type
interface KeyboardNavigationContextType {
  isKeyboardNavigationEnabled: boolean;
  setIsKeyboardNavigationEnabled: (enabled: boolean) => void;
}

// Create the context
const KeyboardNavigationContext = createContext<KeyboardNavigationContextType | undefined>(undefined);

// Provider component
export const KeyboardNavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isKeyboardNavigationEnabled, setIsKeyboardNavigationEnabled] = useState(false);

  return (
    <KeyboardNavigationContext.Provider value={{ isKeyboardNavigationEnabled, setIsKeyboardNavigationEnabled }}>
      {children}
    </KeyboardNavigationContext.Provider>
  );
};

// Hook to use the context
export const useKeyboardNavigation = () => {
  const context = useContext(KeyboardNavigationContext);
  if (context === undefined) {
    throw new Error('useKeyboardNavigation must be used within a KeyboardNavigationProvider');
  }
  return context;
}; 