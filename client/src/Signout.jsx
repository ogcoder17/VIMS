import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/Signout.css";

const SignOut = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Clear local storage items related to authentication
    localStorage.removeItem("userId");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("accessToken");
    
    // Redirect to login page
    navigate("/");
  };

  return (
    <div className="signout-container">
      <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600" onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
};

export default SignOut;