import React, { createContext, useState, useContext } from 'react';

const SelectedDateContext = createContext();

export const SelectedDateProvider = ({ children }) => {
  const [selectedValue, setSelectedValue] = useState(() => {
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'long' });
    const currentYear = now.getFullYear().toString();
    return `${currentMonth} ${currentYear}`;
  });

  return (
    <SelectedDateContext.Provider value={{ selectedValue, setSelectedValue }}>
      {children}
    </SelectedDateContext.Provider>
  );
};

export const useSelectedDate = () => useContext(SelectedDateContext);
