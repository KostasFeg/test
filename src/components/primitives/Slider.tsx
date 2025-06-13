import React, { forwardRef, useState, useEffect } from "react";
import clsx from "clsx";
// @ts-ignore – module SCSS typings not generated
import styles from "./Slider.module.scss";

export interface SliderProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value" | "size"
  > {
  /** Current value of the slider */
  value: number;
  /** Minimum value (default: 0) */
  min?: number;
  /** Maximum value (default: 100) */
  max?: number;
  /** Step increment (default: 1) */
  step?: number;
  /** Callback when value changes */
  onChange: (value: number) => void;
  /** Optional label for the slider */
  label?: string;
  /** Show value display (default: true) */
  showValue?: boolean;
  /** Value formatter function */
  formatValue?: (value: number) => string;
  /** Size variant */
  size?: "small" | "medium" | "large";
  /** Disabled state */
  disabled?: boolean;
}

/**
 * Design-System slider primitive.
 * Automatically picks up colors from CSS variables injected by design-system.ts.
 */
const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      value,
      min = 0,
      max = 100,
      step = 1,
      onChange,
      label,
      showValue = true,
      formatValue = (val) => val.toString(),
      size = "medium",
      disabled = false,
      className,
      ...rest
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = useState(false);

    // Calculate percentage for styling
    const percentage = ((value - min) / (max - min)) * 100;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value);
      onChange(newValue);
    };

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);

    useEffect(() => {
      const handleGlobalMouseUp = () => setIsDragging(false);
      document.addEventListener("mouseup", handleGlobalMouseUp);
      return () => document.removeEventListener("mouseup", handleGlobalMouseUp);
    }, []);

    return (
      <div
        className={clsx(
          styles.sliderContainer,
          styles[size],
          {
            [styles.disabled]: disabled,
            [styles.dragging]: isDragging,
          },
          className
        )}
      >
        {label && (
          <label className={styles.label}>
            {label}
            {showValue && (
              <span className={styles.valueDisplay}>{formatValue(value)}</span>
            )}
          </label>
        )}

        <div className={styles.sliderWrapper}>
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleChange}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            disabled={disabled}
            className={styles.slider}
            {...rest}
          />

          <div className={styles.track}>
            <div className={styles.fill} style={{ width: `${percentage}%` }} />
          </div>

          <div className={styles.thumb} style={{ left: `${percentage}%` }} />
        </div>
      </div>
    );
  }
);

Slider.displayName = "Slider";

export default Slider;
