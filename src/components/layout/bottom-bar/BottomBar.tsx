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
  const [tooltipPositions, setTooltipPositions] = useState<{
    [key: string]: "center" | "left" | "right";
  }>({});
  const [tooltipCoords, setTooltipCoords] = useState<{
    [key: string]: { x: number; y: number };
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
    if (!containerRef.current) return "center";

    const containerRect = containerRef.current.getBoundingClientRect();
    const buttonRect = buttonElement.getBoundingClientRect();
    const tooltipWidth = 180; // Approximate tooltip width

    const buttonCenter = buttonRect.left + buttonRect.width / 2;
    const containerLeft = containerRect.left;
    const containerRight = containerRect.right;

    // Calculate absolute coordinates for portal rendering
    const tooltipY = buttonRect.top - 120; // Increased from 85 to 120 for more clearance
    let tooltipX = buttonCenter - tooltipWidth / 2;
    let position: "center" | "left" | "right" = "center";

    // Check if tooltip would overflow on the left
    if (buttonCenter - tooltipWidth / 2 < containerLeft + 20) {
      position = "left";
      tooltipX = buttonRect.left + 10;
    }

    // Check if tooltip would overflow on the right
    if (buttonCenter + tooltipWidth / 2 > containerRight - 20) {
      position = "right";
      tooltipX = buttonRect.right - tooltipWidth - 10;
    }

    setTooltipCoords((prev) => ({
      ...prev,
      [tooltipKey]: { x: tooltipX, y: tooltipY },
    }));
    return position;
  };

  const handleTooltipShow = (
    label: string,
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.TouchEvent<HTMLButtonElement>
      | React.FocusEvent<HTMLButtonElement>
  ) => {
    // For touch and focus events, we'll use the current target directly
    const position = calculateTooltipPosition(event.currentTarget, label);
    setTooltipPositions((prev) => ({ ...prev, [label]: position }));
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
    const position = tooltipPositions[item.label];

    return createPortal(
      <div
        className={clsx(
          styles["footer-tooltip"],
          styles["footer-tooltip--portal"],
          styles["footer-tooltip--active"],
          position === "left" && styles["footer-tooltip--left"],
          position === "right" && styles["footer-tooltip--right"]
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
        <span className={styles["footer-tooltip--arrow"]}>
          <svg viewBox="0 0 18 18">
            <polygon points="0,0 18,0 9,18" fill="#fff" />
          </svg>
        </span>
      </div>,
      document.body
    );
  };

  return (
    <>
      <footer ref={containerRef} className={clsx(styles.root, className)}>
        {items.map((item, index) => (
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
              onMouseEnter={(e) => handleTooltipShow(item.label, e)}
              onMouseLeave={() => setActiveTooltip(null)}
              onTouchStart={(e) => handleTooltipShow(item.label, e)}
              onTouchEnd={() => setActiveTooltip(null)}
              onFocus={(e) => handleTooltipShow(item.label, e)}
              onBlur={() => setActiveTooltip(null)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          </div>
        ))}
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
