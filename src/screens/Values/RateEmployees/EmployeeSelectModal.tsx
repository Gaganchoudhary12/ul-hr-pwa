import React, { useState } from 'react';

const EmployeeSelectModal = ({ visible, onClose, employees, selectedValue, selectEmployee }) => {
  const [tempSelectedEmployee, setTempSelectedEmployee] = useState(null);

  const handleRateNow = () => {
    if (tempSelectedEmployee) {
      selectEmployee(tempSelectedEmployee);
      onClose();
    }
  };

  return (
    visible && (
      <div
        className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
        onClick={onClose}
      >
        <div
          className="bg-white p-6 rounded-lg  max-h-[50%] w-full overflow-auto mx-5"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-bold text-center text-gray-800 mb-6">Select your employee</h3>
          <ul className="list-none p-0 m-0">
            {employees.map((item) => (
              <li key={item._id} className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-sm font-normal text-black">{item.fullName}</span>
                <button
                  className={`w-4 h-4 rounded-full border-2 ${tempSelectedEmployee?.fullName === item.fullName ? 'bg-blue-500 border-blue-500' : 'bg-transparent border-gray-300'}`}
                  onClick={() => setTempSelectedEmployee(item)}
                />
              </li>
            ))}
          </ul>
          <button
            className={`w-full py-4 text-white text-sm rounded-lg mt-6 ${tempSelectedEmployee ? 'bg-blue-500' : 'bg-gray-400'}`}
            onClick={handleRateNow}
            disabled={!tempSelectedEmployee}
          >
            Rate Now
          </button>
        </div>
      </div>
    )
  );
};

export default EmployeeSelectModal;
