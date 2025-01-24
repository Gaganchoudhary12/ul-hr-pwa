import React from "react";
import { ReactComponent as WarningIcon } from "../../assets/WarningIcon.svg"; // Adjust the path if necessary

const SignOutModal = ({ visible, onClose, onSignOut }) => {
  return (
    visible && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg shadow-lg w-96 p-6 mx-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <WarningIcon height={48} width={48} className="mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900">Sign Out</h2>
            <p className="text-sm font-normal text-gray-600 mt-2 mb-5">
              Are you sure you want to sign out?
            </p>

            <div className="flex justify-center space-x-4">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium bg-orange-600 text-white rounded-lg"
                onClick={onSignOut}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default SignOutModal;
