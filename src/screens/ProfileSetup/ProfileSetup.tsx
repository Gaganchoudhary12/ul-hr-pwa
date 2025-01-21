import React, { useState, useEffect, useContext, useCallback } from "react";
import { UserContext } from "../../state/UserProvider";
import SignOutModal from "./SignOutModal.tsx";
import HeaderWithBackButton from "../../components/organism/HeaderWithBackButton.tsx/HeaderWithBackButton.tsx";
import Avatar from "react-avatar";
import { useNavigate } from "react-router-dom";

const ProfileSetupScreen = ({ route }) => {
  const navigate = useNavigate();
  const { user: userDetails, setUser: setGlobalUser } = useContext(UserContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState({
    employeeName: "",
    employeeEmail: "",
    employeeCode: "",
    department: "",
    jobTitle: "",
    reportingManager: "",
  });

  // Check authentication status and redirect if not authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (userDetails) {
      const {
        email,
        fullName,
        department,
        employeeNumber,
        jobTitle,
        reportingTo,
      } = userDetails;
      setUser({
        employeeEmail: email,
        employeeName: fullName,
        department,
        employeeCode: employeeNumber,
        jobTitle,
        reportingManager: reportingTo,
      });
    }
  }, [route, userDetails]);

  const handleSignOut = async () => {
    try {
      // Remove authentication state and user data
      await localStorage.removeItem("isAuthenticated");
      await localStorage.removeItem("user");
      setGlobalUser(null); // Clear user context
      setModalVisible(false);
      navigate("/login"); // Redirect to login
    } catch (error) {
      console.error("Error signing out.", error);
    }
  };

  const capitalize = (str) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <>
      <HeaderWithBackButton title="Your Profile" />
      <div className="flex-1 -mt-2 pb-10 pt-10 px-5 bg-white rounded-t-2xl">
        {/* Centered Avatar */}
        <div className="flex justify-center -mt-14">
          <Avatar name={user.employeeName} size="56" round color="#9087E5" />
        </div>

        {/* User Details */}
        {Object.entries(user).map(([key, value]) => (
          <div key={key} className="mb-5 mt-2 relative">
            <label className="absolute top-[-8px] left-2 px-1 py-0.5 text-xs font-normal text-gray-600 bg-white z-10">
              {capitalize(key.replace(/([A-Z])/g, " $1").trim())}
            </label>
            <input
              type="text"
              className="h-14 w-full border border-gray-300 rounded-lg bg-white pl-3 text-sm font-semibold text-gray-800 pt-2"
              value={value}
              readOnly
            />
          </div>
        ))}

        <div className="flex justify-center mt-8">
          <button
            onClick={() => setModalVisible(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-m hover:bg-blue-700"
          >
            Sign Out
          </button>
        </div>

        <SignOutModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onSignOut={handleSignOut}
        />
      </div>
    </>
  );
};

export default ProfileSetupScreen;
