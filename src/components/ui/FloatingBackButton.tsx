import React from "react";
import { useNavigate, useNavigationType } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const FloatingBackButton: React.FC = () => {
  const navigate = useNavigate();
  const navigationType = useNavigationType();

  // Only show if the user navigated here (not a direct load)
  const canGoBack = navigationType !== "POP";

  if (!canGoBack) return null;

  return (
    <button
      onClick={() => navigate(-1)}
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1000,
        background: "#fff",
        border: "none",
        borderRadius: "50%",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        width: 56,
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "box-shadow 0.2s",
      }}
      aria-label="Go back"
    >
      <ArrowLeft size={28} />
    </button>
  );
};

export default FloatingBackButton;
