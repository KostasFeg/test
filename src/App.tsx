import React, { useState } from "react";
import LoginPage from "./pages/LoginPage";
import MaintenancePage from "./pages/MaintenancePage";

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem("loggedIn") === "true";
  });

  const handleLoginSuccess = () => {
    localStorage.setItem("loggedIn", "true");
    setLoggedIn(true);
  };

  if (!loggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return <MaintenancePage />;
};

export default App; 