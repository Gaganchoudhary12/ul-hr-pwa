import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const MultiColumnDropdown = ({ open, setOpen, value, setValue }) => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const months = [
    { label: 'January', value: 'January' },
    { label: 'February', value: 'February' },
    { label: 'March', value: 'March' },
    { label: 'April', value: 'April' },
    { label: 'May', value: 'May' },
    { label: 'June', value: 'June' },
    { label: 'July', value: 'July' },
    { label: 'August', value: 'August' },
    { label: 'September', value: 'September' },
    { label: 'October', value: 'October' },
    { label: 'November', value: 'November' },
    { label: 'December', value: 'December' },
  ];

  const years = [{ label: '2025', value: '2025' }];

  useEffect(() => {
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'long' });
    const currentYear = now.getFullYear().toString();

    setSelectedMonth({ label: currentMonth, value: currentMonth });
    setSelectedYear({ label: currentYear, value: currentYear });
  }, []);

  useEffect(() => {
    if (open) {
      // Disable scrolling on the background when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scrolling on the background
      document.body.style.overflow = 'auto';
    }

    // Cleanup effect when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  const handleApply = () => {
    if (selectedMonth && selectedYear) {
      setValue(`${selectedMonth.label} ${selectedYear.label}`);
      setOpen(false); // Close the modal
    }
  };

  const handleCloseModal = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      setOpen(false); // Close the modal if overlay is clicked
    }
  };

  return (
    <div
      className={`modal fixed inset-0 z-50 ${open ? 'flex' : 'hidden'} justify-center items-center`}
      onClick={handleCloseModal}
    >
      <div className="modal-overlay absolute inset-0 bg-gray-900 bg-opacity-50"></div>
      <div
        className="modal-content relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex space-x-6">
          <div className="dropdown-wrapper flex flex-col w-1/2">
            <label className="text-sm font-medium text-gray-700 mb-2">Select Month</label>
            <Select
              value={selectedMonth}
              onChange={setSelectedMonth}
              options={months}
              placeholder="Select Month"
              className="dropdown"
              isSearchable={false}
            />
          </div>

          <div className="dropdown-wrapper flex flex-col w-1/2">
            <label className="text-sm font-medium text-gray-700 mb-2">Select Year</label>
            <Select
              value={selectedYear}
              onChange={setSelectedYear}
              options={years}
              placeholder="Select Year"
              className="dropdown"
              isSearchable={false}
            />
          </div>
        </div>

        <button
          className="apply-button mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
          onClick={handleApply}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default MultiColumnDropdown;