import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.scss";
import App from "./app/App";
// Initialize the config manager to inject CSS variables
import "./shared/config/config.manager";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
