import React, { useState } from "react";
import clsx from "clsx";
// @ts-ignore
import styles from "./BottomBar.module.scss";

export interface BottomBarItem {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

interface BottomBarProps {
  items: BottomBarItem[];
  className?: string;
}

export const BottomBar: React.FC<BottomBarProps> = ({ items, className }) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [animating, setAnimating] = useState<string | null>(null);
  // Mock status data
  const mockStatus = [
    { label: "Status", value: "Online" },
    { label: "Access", value: "Off" },
    { label: "Battery", value: "Good" },
    { label: "Signal", value: "Strong" },
  ];

  const handleButtonClick = (label: string, onClick?: () => void) => {
    setAnimating(label);
    onClick?.();
    setTimeout(() => setAnimating(null), 180);
  };

  return (
    <footer className={clsx(styles.root, className)}>
      {items.map((item) => (
        <div
          key={item.label}
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "100%",
          }}
        >
          <button
            className={clsx(
              styles.item,
              animating === item.label && styles["item--animating"]
            )}
            onClick={() => handleButtonClick(item.label, item.onClick)}
            onMouseEnter={() => setActiveTooltip(item.label)}
            onMouseLeave={() => setActiveTooltip(null)}
            onTouchStart={() => setActiveTooltip(item.label)}
            onTouchEnd={() => setActiveTooltip(null)}
            onFocus={() => setActiveTooltip(item.label)}
            onBlur={() => setActiveTooltip(null)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
          <div
            className={clsx(
              styles["footer-tooltip"],
              activeTooltip === item.label && styles["footer-tooltip--active"]
            )}
          >
            {mockStatus.map((status) => (
              <div key={status.label}>
                <strong>{status.label}:</strong> {status.value}
              </div>
            ))}
            <span className={styles["footer-tooltip--arrow"]}>
              <svg viewBox="0 0 18 18">
                <polygon points="0,0 18,0 9,18" fill="#fff" />
              </svg>
            </span>
          </div>
        </div>
      ))}
    </footer>
  );
};
