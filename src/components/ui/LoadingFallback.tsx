import React from "react";
import Spinner from "./Spinner";

interface LoadingFallbackProps {
  size?: number;
  message?: string;
  height?: string;
}

const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  size = 56,
  message = "Loading...",
  height = "100%",
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height,
        gap: "16px",
      }}
    >
      <Spinner size={size} />
      {message && (
        <p
          style={{
            color: "#6b7280",
            fontSize: "14px",
            margin: 0,
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingFallback;
