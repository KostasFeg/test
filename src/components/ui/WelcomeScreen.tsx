import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Volume2,
  Rocket,
  ArrowRight,
  Palette,
  Settings2,
  Volleyball,
  Clover,
} from "lucide-react";
import { configManager } from "../../shared/config/config.manager";
import { shouldShowConfigEditor } from "../../shared/config/app.config";
import styles from "./WelcomeScreen.module.scss";

interface WelcomeScreenProps {
  className?: string;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  className = "",
}) => {
  const navigate = useNavigate();
  const [isQuickStarting, setIsQuickStarting] = useState(false);

  const handleQuickStart = async () => {
    setIsQuickStarting(true);

    // Create a minimal starter config
    const starterConfig = {
      name: "Lottery Portal Quick Start",
      description:
        "Essential lottery management configuration with core retail operations",
      config: {
        branding: {
          company: {
            name: "Lottery Operations",
            displayName: "Lottery Retailer Management Portal",
          },
          app: {
            name: "Lottery Management System",
            version: "1.0.0",
            description:
              "Comprehensive lottery retail operations and analytics platform",
          },
        },
        navigation: [
          {
            slug: "dashboard",
            label: "🎯 Operations Dashboard",
          },
          {
            slug: "lottery-reports",
            label: "🎲 Lottery Reports",
            display: "buttons",
            columns: 2,
            children: [
              {
                slug: "sales-summary",
                label: "Ticket Sales Summary",
              },
              {
                slug: "draw-analytics",
                label: "Draw Analytics",
              },
              {
                slug: "retailer-performance",
                label: "Retailer Performance",
              },
              {
                slug: "prize-payouts",
                label: "Prize Payouts",
              },
            ],
          },
          {
            slug: "game-management",
            label: "🎮 Game Management",
          },
          {
            slug: "retailer-tools",
            label: "🏪 Retailer Tools",
          },
        ],
        reports: {
          "sales-summary": {
            name: "Lottery Ticket Sales Report",
            filters: ["type", "game", "fromDate", "toDate"],
            options: {
              type: ["Daily", "Weekly", "Monthly"],
              game: ["All Games", "Lotto", "Scratch Cards", "Daily Numbers"],
              withTime: false,
              withAutoTime: true,
            },
          },
          "draw-analytics": {
            name: "Draw Performance Analytics",
            filters: ["game", "fromDate", "toDate"],
            options: {
              game: ["All Games", "Lotto", "Powerball", "Daily Pick"],
              withTime: false,
              withAutoTime: true,
            },
          },
          "retailer-performance": {
            name: "Retailer Performance Report",
            filters: ["scope", "metric", "fromDate", "toDate"],
            options: {
              scope: ["All Retailers", "Top Performers", "Region", "City"],
              metric: ["Sales Volume", "Commission", "Growth Rate"],
              withTime: false,
              withAutoTime: true,
            },
          },
          "prize-payouts": {
            name: "Prize Payout Summary",
            filters: ["type", "fromDate", "toDate"],
            options: {
              type: [
                "All Prizes",
                "Jackpots",
                "Secondary Prizes",
                "Instant Wins",
              ],
              withTime: false,
              withAutoTime: true,
            },
          },
        },
      },
    };

    try {
      configManager.setActiveConfig(starterConfig);

      // Small delay for visual feedback
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate to home (which will now have content)
      window.location.reload(); // Force full reload to initialize everything
    } catch (error) {
      console.error("Failed to set starter config:", error);
      setIsQuickStarting(false);
    }
  };

  const handleOpenConfigEditor = () => {
    navigate("/configuration");
  };

  return (
    <div className={`${styles.welcomeScreen} ${className}`}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logoContainer}>
            <img
              src="/peripherals/companyLogo.svg"
              alt="Intralot Logo"
              className={styles.companyLogo}
            />
          </div>
          <h1 className={styles.title}>Retailer Portal</h1>
        </div>

        {/* Quick Actions */}
        <div className={styles.actions}>
          <div className={styles.primaryAction}>
            <button
              className={styles.quickStartButton}
              onClick={handleQuickStart}
              disabled={isQuickStarting}
            >
              <Rocket size={20} />
              {isQuickStarting
                ? "Setting up your lottery system..."
                : "Quick Start Lottery Setup"}
              <ArrowRight size={16} />
            </button>
          </div>

          {shouldShowConfigEditor() && (
            <>
              <div className={styles.orDivider}>
                <span>or</span>
              </div>

              <div className={styles.customizeAction}>
                <button
                  className={styles.customizeButton}
                  onClick={handleOpenConfigEditor}
                >
                  <Palette size={20} />
                  Advanced Configuration
                  <Settings2 size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
