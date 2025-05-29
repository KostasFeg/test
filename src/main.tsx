import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.scss";
import { MaintenancePage } from "./pages/MaintenancePage";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MaintenancePage />
  </React.StrictMode>
);
