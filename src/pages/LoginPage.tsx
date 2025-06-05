import React, { useState } from "react";
import nhLotteryLogo from "./nhlottery-logo.png";
import { RetailerLevel } from "../permissions/access-model";
import styles from "./LoginPage.module.scss";
import { User } from "../shared/types/auth";

interface LoginPageProps {
  onLoginSuccess: (user: User, isOffline?: boolean) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Mock offline login for development
      if (username === "admin" && password === "admin") {
        const user: User = {
          retailerId: "32324d",
          level: RetailerLevel.ADMINISTRATOR,
          name: "Administrator User",
        };
        onLoginSuccess(user, true); // true = offline mode
        return;
      }

      if (username === "manager" && password === "manager") {
        const user: User = {
          retailerId: "32324d",
          level: RetailerLevel.AGENT_MANAGER,
          name: "Manager User",
        };
        onLoginSuccess(user, true);
        return;
      }

      if (username === "clerk" && password === "clerk") {
        const user: User = {
          retailerId: "32324d",
          level: RetailerLevel.AGENT_CLERK,
          name: "Clerk User",
        };
        onLoginSuccess(user, true);
        return;
      }

      // TODO: Replace with actual API call
      // try {
      //   const response = await fetch('/api/login', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ username, password })
      //   });
      //
      //   if (response.ok) {
      //     const data = await response.json();
      //     const user: User = {
      //       retailerId: data.retailerId,
      //       level: data.level,
      //       name: data.name
      //     };
      //     onLoginSuccess(user, false); // false = online mode
      //   } else {
      //     setError('Invalid credentials');
      //   }
      // } catch (apiError) {
      //   setError('Login service unavailable');
      // }

      setError(
        "Invalid credentials. Try admin/admin, manager/manager, or clerk/clerk"
      );
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginPageContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <img
          src={nhLotteryLogo}
          alt="NH Lottery Logo"
          className={styles.logo}
        />
        <h2 className={styles.heading}>Retailer Portal Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
          required
          disabled={isLoading}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
          disabled={isLoading}
        />

        {error && <div className={styles.error}>{error}</div>}

        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <div className={styles.demoInfo}>
          <p>Demo Credentials:</p>
          <p>
            <strong>admin/admin</strong> - Full access
          </p>
          <p>
            <strong>manager/manager</strong> - Manager access
          </p>
          <p>
            <strong>clerk/clerk</strong> - Limited access
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
