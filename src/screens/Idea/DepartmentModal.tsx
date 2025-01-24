import React, { useState } from "react";

const DepartmentModal = ({
  visible,
  onClose,
  departments,
  selectedValue,
  selectEmployee,
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState(selectedValue);

  const handleApply = () => {
    if (selectedDepartment) {
      selectEmployee(selectedDepartment); // Apply selected department
      setSelectedDepartment(null);
      onClose();
    }
  };

  const toggleDepartmentSelection = (name) => {
    // If the department is already selected, deselect it
    if (selectedDepartment === name) {
      setSelectedDepartment(null);
    } else {
      // Otherwise, select the new department
      setSelectedDepartment(name);
    }
  };

  if (!visible) return null; // Don't render the modal if it's not visible

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg w-full max-w-md relative mx-2"
        onClick={(e) => e.stopPropagation()}
      >
        <h5 className="text-lg font-bold text-gray-900 mb-5 text-center">
          Select Department
        </h5>
        <div
          className="list-group mb-4 max-h-60 overflow-y-auto"
          style={{
            scrollSnapType: "x mandatory",
            scrollBehavior: "smooth",
            msOverflowStyle: "none", // Internet Explorer 10+
            scrollbarWidth: "none", // Firefox
          }}
        >
          {departments.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center py-2 border-b border-gray-200 cursor-pointer"
              onClick={() => toggleDepartmentSelection(item.name)}
            >
              <span className="text-base text-xs text-black">{item.name}</span>
              <div
                className={`w-4 h-4 rounded-full border-2 ${
                  selectedDepartment === item.name
                    ? "bg-blue-500 border-blue-500"
                    : "bg-white border-gray-300"
                }`}
              />
            </div>
          ))}
        </div>

        <button
          className={`w-full text-sm py-3 rounded-lg mt-5 ${
            selectedDepartment ? "bg-blue-500" : "bg-gray-400"
          } text-white`}
          onClick={handleApply}
          disabled={!selectedDepartment}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default DepartmentModal;
