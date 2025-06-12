import React, { forwardRef } from "react";
import clsx from "clsx";
// @ts-ignore – module SCSS typings not generated
import styles from "./Button.module.scss";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style of the button – defaults to "primary" */
  variant?: ButtonVariant;
}

/**
 * Design-System button primitive.
 * Automatically picks up colours from CSS variables injected by design-system.ts.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className, children, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(styles.root, styles[variant], className)}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
