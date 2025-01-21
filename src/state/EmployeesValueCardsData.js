import React, { createContext, useState, useContext } from 'react';

const EmployeesCardsDataContext = createContext();

export const EmployeesCardsDataProvider = ({ children }) => {
  const [cardsData, setCardsData] = useState([]);

  return (
    <EmployeesCardsDataContext.Provider value={{ cardsData, setCardsData }}>
      {children}
    </EmployeesCardsDataContext.Provider>
  );
};

export const useEmployeesCardsData = () => {
  const context = useContext(EmployeesCardsDataContext);
  if (!context) {
    throw new Error("useCardsData must be used within a CardsDataProvider");
  }
  return context;
};
