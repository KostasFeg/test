import React from "react";
import clsx from "clsx";
import styles from "./SideBar.module.scss";

export type SideBarLabels = {
  label: string;
  active?: boolean;
  onClick?: () => void;
}[];
export type SideBarButtons = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}[];

interface SideBarBaseProps {
  className?: string;
  variant: "labels" | "buttons";
  items: SideBarLabels | SideBarButtons;
}

export const SideBar: React.FC<SideBarBaseProps> = ({
  variant,
  items,
  className,
}) => {
  if (variant === "labels") {
    return (
      <aside className={clsx(styles.root, className)}>
        {(items as SideBarLabels).map((item) => (
          <button
            key={item.label}
            className={clsx(styles.labelItem, { ["active"]: item.active })}
            onClick={item.onClick}
          >
            {item.label}
          </button>
        ))}
      </aside>
    );
  }

  return (
    <aside className={clsx(styles.root, className)}>
      <div className={styles.buttonColumn}>
        {(items as SideBarButtons).map((item) => (
          <button key={item.label} onClick={item.onClick}>
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
};
