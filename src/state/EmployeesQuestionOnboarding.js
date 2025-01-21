import React, { createContext, useState, useContext } from 'react';

const EmployeesQuestionOnboardingCardsDataContext = createContext();

export const EmployeesQuestionOnboardingCardsDataProvider = ({ children }) => {
  const [cardsData, setCardsData] = useState([]);

  return (
    <EmployeesQuestionOnboardingCardsDataContext.Provider value={{ cardsData, setCardsData }}>
      {children}
    </EmployeesQuestionOnboardingCardsDataContext.Provider>
  );
};

export const useEmployeesQuestionOnboardingCardsData = () => {
  const context = useContext(EmployeesQuestionOnboardingCardsDataContext);
  if (!context) {
    throw new Error("useCardsData must be used within a CardsDataProvider");
  }
  return context;
};
