import React, { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Auth = () => {
  const { token } = useContext(AppContext);
  const navigate = useNavigate();

  // Redirect logic inside useEffect
  useEffect(() => {
    if (!token) {
      console.log("No user detected, redirecting to login...");
      navigate("/login"); // Redirect to login if no user is detected
    }
  }, [token, navigate]); // Re-run effect when `user` or `navigate` changes

  // If user data is available, render the protected content
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default Auth;
