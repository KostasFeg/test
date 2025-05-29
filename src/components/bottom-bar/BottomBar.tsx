import React from "react";
import clsx from "clsx";
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

export const BottomBar: React.FC<BottomBarProps> = ({ items, className }) => (
  <footer className={clsx(styles.root, className)}>
    {items.map((item) => (
      <button key={item.label} className={styles.item} onClick={item.onClick}>
        {item.icon}
        <span>{item.label}</span>
      </button>
    ))}
  </footer>
);
