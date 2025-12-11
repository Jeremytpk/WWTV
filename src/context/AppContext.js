import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // 'en' or 'fr'
  const [isPremium, setIsPremium] = useState(false);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fr' : 'en');
  };

  const upgradeToPremium = () => {
    setIsPremium(true);
  };

  return (
    <AppContext.Provider value={{ 
      language, 
      setLanguage, 
      toggleLanguage,
      isPremium,
      upgradeToPremium
    }}>
      {children}
    </AppContext.Provider>
  );
};
