import React from "react";
import styles from "./Spinner.module.scss";

interface SpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 48,
  color = "#1d4ed8",
  className,
}) => (
  <div
    className={styles.spinnerWrapper + (className ? ` ${className}` : "")}
    style={{ width: size, height: size }}
    aria-label="Loading"
    role="status"
  >
    <svg
      className={styles.spinner}
      width={size}
      height={size}
      viewBox="0 0 50 50"
    >
      <circle
        className={styles.path}
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke={color}
        strokeWidth="5"
      />
    </svg>
  </div>
);

export default Spinner;
