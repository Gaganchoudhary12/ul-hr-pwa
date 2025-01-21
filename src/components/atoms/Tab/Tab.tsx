import React, { useContext } from 'react';
import { ReactComponent as RateEmployees } from '../../../assets/rateEmployee.svg';
import { ReactComponent as MyQuiz } from '../../../assets/myQuiz.svg';
import { ReactComponent as PastQuiz } from '../../../assets/pastQuiz.svg';
import { EmployeesContext } from '../../../state/Employees.js';

const Tab = ({ selectedView, onSelectView, from }) => {
  const { employees } = useContext(EmployeesContext);

  return (
    <div className="flex items-center justify-center overflow-x-auto mb-4 px-2">
  <div className="flex items-center space-x-2">
    {employees.length > 0 && (
      <button
        className={`flex items-center px-3 py-2 rounded-full border ${
          selectedView === 'rateEmployees' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'
        }`}
        onClick={() => onSelectView('rateEmployees')}
      >
        <RateEmployees width={24} height={24} />
        <span
          className={`ml-2 text-sm font-medium ${
            selectedView === 'rateEmployees' ? 'text-blue-900' : 'text-gray-900'
          }`}
        >
          Rate Employee
        </span>
      </button>
    )}

    {from !== 'managerRatings' && (
      <>
        <button
          className={`flex items-center px-3 py-2 rounded-full border ${
            selectedView === 'self' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'
          }`}
          onClick={() => onSelectView('self')}
        >
          <MyQuiz width={24} height={24} />
          <span
            className={`ml-2 text-sm font-medium ${
              selectedView === 'self' ? 'text-blue-900' : 'text-gray-900'
            }`}
          >
            My Quiz
          </span>
        </button>

        <button
          className={`flex items-center px-3 py-2 rounded-full border ${
            selectedView === 'manager' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'
          }`}
          onClick={() => onSelectView('manager')}
        >
          <RateEmployees width={24} height={24} />
          <span
            className={`ml-2 text-sm font-medium ${
              selectedView === 'manager' ? 'text-blue-900' : 'text-gray-900'
            }`}
          >
            By Manager
          </span>
        </button>
      </>
    )}
  </div>
</div>
  );
};

export default Tab;