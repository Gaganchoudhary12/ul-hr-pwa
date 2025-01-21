import React, { useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../state/UserProvider";
import { useLogin } from "../../services/login.ts";
import { ReactComponent as MicrosoftLogo } from "../../assets/microsoftLogo.svg";
import { ReactComponent as LoginImage } from "../../assets/loginimage.svg";
import { ReactComponent as Logo } from "../../assets/unicultLogo.svg";
import { ReactComponent as Warning } from "../../assets/WarningIcon.svg";
import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: "6ea2b4bf-26fd-42b5-96ed-97c3afac7f6c",
    authority:
      "https://login.microsoftonline.com/d677be2e-87d7-42ef-8543-d02f41c4ca61",
    redirectUri: "https://unicult.vercel.app/home",
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

const Login = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const { userLogin } = useLogin();
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") {
      navigate("/home");
    }
  }, [navigate]);

  const handleLogin = useCallback(async () => {
    setLoading(true);
    await msalInstance.initialize();
    try {
      const loginResponse = await msalInstance.loginPopup({
        scopes: ["User.Read", "profile", "openid", "email"],
      });
      const { data, isError } = await userLogin(
        loginResponse.account.idTokenClaims.email
      );
      if (!isError) {
        setUser(data); // Update user context
        localStorage.setItem("isAuthenticated", "true"); // Set auth flag
        navigate("/home");
      } else {
        console.error("Login failed.");
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  }, [navigate, setUser, userLogin]);
  
  const closeModal = useCallback(() => setModalVisible(false), []);

  return (
    <div className="flex flex-col justify-center items-center bg-white h-screen">
      <div className="text-center mt-5">
        <Logo width="120" height="42" />
        <p className="text-xs font-light mt-2 text-black">
          Powered by Universityliving
        </p>
      </div>

      <div className="flex flex-col justify-center items-center">
        <LoginImage className="w-3/4 h-3/4" />
        <p className="text-lg font-light text-center mt-2 text-gray-600">
          Discover the Key to a More Positive and Productive Workplace
        </p>
      </div>

      <div className="flex flex-col items-center pb-16">
        {loading ? (
          <p className="text-blue-600 text-lg">Signing in...</p>
        ) : (
          <>
            <button
              onClick={handleLogin}
              className="flex items-center justify-center w-80 h-11 bg-white border border-blue-500 rounded-lg mt-5 cursor-pointer"
            >
              <MicrosoftLogo width="24" height="24" />
              <span className="text-blue-500 text-base font-medium ml-2">
                Sign in with Microsoft
              </span>
            </button>

            <button
              onClick={() => setModalVisible(true)}
              className="text-sm text-blue-500 mt-5 cursor-pointer"
            >
              Get help with signing in?
            </button>
          </>
        )}
      </div>

      {modalVisible && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg text-center">
            <Warning width="48" height="48" />
            <div className="w-72 mt-4">
              <h3 className="text-xl font-semibold">
                Having Trouble in Signup
              </h3>
              <p className="text-sm text-gray-500 mb-5">
                If you need more info or have any questions, just reach out to
                our admin or email us at care@universityliving.com. We're here
                to help!
              </p>
            </div>
            <button
              onClick={closeModal}
              className="bg-blue-500 w-72 rounded-lg mt-2 py-2 text-white cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
