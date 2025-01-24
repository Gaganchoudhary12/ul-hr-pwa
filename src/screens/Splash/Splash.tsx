import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../state/UserProvider";
import logoGif from "../../assets/logo.gif";

const Splash = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const isAuthenticated = localStorage.getItem("isAuthenticated");
      if (isAuthenticated === "true") {
        navigate("/home");
      } else {
        setTimeout(() => {
          navigate("/login");
        }, 2500);
      }
    };
    checkLoginStatus();
  }, [setUser, navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="flex justify-center items-center">
        <img
          src={logoGif}
          alt="Logo"
          className="object-cover"
          style={{width: 188,height:110}}
        />
      </div>
    </div>
  );
};

export default Splash;
