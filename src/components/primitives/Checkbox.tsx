import React, { forwardRef } from "react";
import clsx from "clsx";
// @ts-ignore – module SCSS typings not generated
import styles from "./Checkbox.module.scss";

export type CheckboxSize = "small" | "medium" | "large";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Label text for the checkbox */
  label?: string;
  /** Visual size of the checkbox – defaults to "medium" */
  size?: CheckboxSize;
  /** Whether the checkbox is in an indeterminate state */
  indeterminate?: boolean;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Additional CSS class name */
  className?: string;
}

/**
 * Design-System checkbox primitive.
 * Automatically picks up colors from CSS variables injected by design-system.ts.
 * Supports checked, unchecked, and indeterminate states with smooth animations.
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      size = "medium",
      indeterminate = false,
      disabled = false,
      className,
      checked,
      onChange,
      ...rest
    },
    ref
  ) => {
    // Handle indeterminate state
    React.useEffect(() => {
      if (ref && typeof ref === "object" && ref.current) {
        ref.current.indeterminate = indeterminate;
      }
    }, [indeterminate, ref]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!disabled && onChange) {
        onChange(event);
      }
    };

    return (
      <label
        className={clsx(
          styles.container,
          styles[size],
          disabled && styles.disabled,
          className
        )}
      >
        <div className={styles.inputWrapper}>
          <input
            ref={ref}
            type="checkbox"
            className={styles.input}
            checked={checked}
            disabled={disabled}
            onChange={handleChange}
            {...rest}
          />
          <div
            className={clsx(
              styles.checkbox,
              checked && styles.checked,
              indeterminate && styles.indeterminate
            )}
          >
            {/* Checkmark icon */}
            <svg
              className={styles.checkIcon}
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 8l3 3 7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Indeterminate icon */}
            <svg
              className={styles.indeterminateIcon}
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 8h8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {label && <span className={styles.label}>{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
