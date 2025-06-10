import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
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
  const [tooltipCoords, setTooltipCoords] = useState<{
    [key: string]: { x: number; y: number; buttonCenter: number };
  }>({});
  const containerRef = useRef<HTMLElement>(null);

  // Mock status data
  const mockStatus = [
    { label: "Status", value: "Online" },
    { label: "Access", value: "Off" },
    { label: "Battery", value: "Good" },
    { label: "Signal", value: "Strong" },
  ];

  const calculateTooltipPosition = (
    buttonElement: HTMLElement,
    tooltipKey: string
  ) => {
    const buttonRect = buttonElement.getBoundingClientRect();
    const tooltipWidth = 200;
    const margin = 20;

    // Dead simple: center tooltip above button
    const buttonCenter = buttonRect.left + buttonRect.width / 2;
    const tooltipY = buttonRect.top - 100;
    let tooltipX = buttonCenter - tooltipWidth / 2;

    // Only adjust if going off screen
    if (tooltipX < margin) tooltipX = margin;
    if (tooltipX + tooltipWidth > window.innerWidth - margin) {
      tooltipX = window.innerWidth - tooltipWidth - margin;
    }

    setTooltipCoords((prev) => ({
      ...prev,
      [tooltipKey]: { x: tooltipX, y: tooltipY, buttonCenter },
    }));
    return "center";
  };

  const handleTooltipShow = (
    label: string,
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.TouchEvent<HTMLButtonElement>
      | React.FocusEvent<HTMLButtonElement>
  ) => {
    calculateTooltipPosition(event.currentTarget, label);
    setActiveTooltip(label);
  };

  const handleButtonClick = (label: string, onClick?: () => void) => {
    setAnimating(label);
    onClick?.();
    setTimeout(() => setAnimating(null), 180);
  };

  const renderTooltip = (item: BottomBarItem) => {
    if (activeTooltip !== item.label || !tooltipCoords[item.label]) return null;

    const coords = tooltipCoords[item.label];

    // Dead simple arrow positioning - just point to button center
    const arrowLeft = coords.buttonCenter - coords.x;

    return createPortal(
      <div
        className={clsx(
          styles["footer-tooltip"],
          styles["footer-tooltip--active"]
        )}
        style={{
          position: "fixed",
          left: `${coords.x}px`,
          top: `${coords.y}px`,
          zIndex: 9999,
        }}
      >
        {mockStatus.map((status) => (
          <div key={status.label}>
            <strong>{status.label}:</strong> {status.value}
          </div>
        ))}
        <div
          className={styles["footer-tooltip--arrow"]}
          style={{ left: `${arrowLeft}px` }}
        />
      </div>,
      document.body
    );
  };

  return (
    <>
      <footer ref={containerRef} className={clsx(styles.bottomBar, className)}>
        <div className={styles.content}>
          <nav className={styles.navigation}>
            {items.map((item, index) => (
              <button
                key={item.label}
                data-label={item.label}
                className={clsx(
                  styles.bottomBarItem,
                  animating === item.label && styles["bottomBarItem--animating"]
                )}
                onClick={() => handleButtonClick(item.label, item.onClick)}
                onMouseEnter={(e) => handleTooltipShow(item.label, e)}
                onMouseLeave={() => setActiveTooltip(null)}
                onTouchStart={(e) => handleTooltipShow(item.label, e)}
                onTouchEnd={() => setActiveTooltip(null)}
                onFocus={(e) => handleTooltipShow(item.label, e)}
                onBlur={() => setActiveTooltip(null)}
              >
                <span className={styles.bottomBarIcon}>{item.icon}</span>
                <span className={styles.bottomBarLabel}>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </footer>

      {/* Render tooltips as portals */}
      {items.map((item) => (
        <React.Fragment key={`tooltip-${item.label}`}>
          {renderTooltip(item)}
        </React.Fragment>
      ))}
    </>
  );
};
