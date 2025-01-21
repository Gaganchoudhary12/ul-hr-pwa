import React, { createContext, useState, useContext } from 'react';

const OnboardingCardsDataContext = createContext();

export const OnboardingCardsDataProvider = ({ children }) => {
  const [cardsData, setCardsData] = useState([]);

  return (
    <OnboardingCardsDataContext.Provider value={{ cardsData, setCardsData }}>
      {children}
    </OnboardingCardsDataContext.Provider>
  );
};

export const useOnboardingCardsData = () => {
  const context = useContext(OnboardingCardsDataContext);
  if (!context) {
    throw new Error("useCardsData must be used within a CardsDataProvider");
  }
  return context;
};
