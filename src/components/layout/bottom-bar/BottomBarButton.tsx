import React from "react";
import clsx from "clsx";
import Button, { ButtonProps } from "../../primitives/Button";
// @ts-ignore
import styles from "./BottomBar.module.scss";

export interface BottomBarButtonProps extends Omit<ButtonProps, "variant"> {
  /** icon displayed above the label */
  icon?: React.ReactNode;
  /** label text */
  label: string;
  /** custom variant (primary/secondary/ghost) */
  variant?: "primary" | "secondary" | "ghost";
  /** whether this button is active/selected */
  active?: boolean;
}

/**
 * Bottom-bar item matching the design-system button primitive but
 * with flex sizing so that all items take equal width.
 */
const BottomBarButton: React.FC<BottomBarButtonProps> = (props) => {
  const {
    icon,
    label,
    className,
    variant = "ghost",
    active,
    children, // ignore – we render label separately
    ...rest
  } = props;

  return (
    <Button
      {...rest}
      variant={variant}
      className={clsx(styles.bottomBarItem, active && styles.active, className)}
      style={{ flex: 1, height: "100%" }}
    >
      {icon && <span className={styles.bottomBarIcon}>{icon}</span>}
      <span className={styles.bottomBarLabel}>{label}</span>
    </Button>
  );
};

export default BottomBarButton;
