import React, { ButtonHTMLAttributes } from "react";
import styles from "./MenuButton.module.scss";

export interface MenuButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const MenuButton: React.FC<MenuButtonProps> = ({
  children,
  ...rest
}) => (
  <button className={styles.root} {...rest}>
    {children}
  </button>
);
