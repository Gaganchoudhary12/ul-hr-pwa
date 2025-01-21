import React, { createContext, useState, useContext } from 'react';

const CardsDataContext = createContext();

export const CardsDataProvider = ({ children }) => {
  const [cardsData, setCardsData] = useState([]);

  return (
    <CardsDataContext.Provider value={{ cardsData, setCardsData }}>
      {children}
    </CardsDataContext.Provider>
  );
};

export const useCardsData = () => {
  const context = useContext(CardsDataContext);
  if (!context) {
    throw new Error("useCardsData must be used within a CardsDataProvider");
  }
  return context;
};
