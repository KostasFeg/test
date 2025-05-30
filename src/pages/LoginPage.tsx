import React, { useState } from "react";
import nhLotteryLogo from "./nhlottery-logo.png";

const LoginPage: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "user" && password === "pass") {
      setError("");
      onLoginSuccess();
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: 32,
          borderRadius: 8,
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          minWidth: 320,
        }}
      >
        <img src={nhLotteryLogo} alt="NH Lottery Logo" style={{ width: 180, margin: "0 auto 8px auto", display: "block" }} />
        <h2 style={{ margin: 0, textAlign: "center" }}>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ padding: 8, fontSize: 16, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ padding: 8, fontSize: 16, borderRadius: 4, border: "1px solid #ccc" }}
        />
        {error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}
        <button
          type="submit"
          style={{
            background: "#1d4ed8",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "10px 0",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage; 