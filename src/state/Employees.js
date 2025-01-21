import React, { createContext, useState } from 'react';

// Create the Employees Context
export const EmployeesContext = createContext();

// Create the Employees Provider component
export const EmployeesProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]); // State to hold the employee data

  return (
    <EmployeesContext.Provider value={{ employees, setEmployees }}>
      {children}
    </EmployeesContext.Provider>
  );
};

