import React from "react";
import { RotateCcw } from "lucide-react";
import { configManager } from "../../shared/config/config.manager";
import styles from "./ClearConfigButton.module.scss";

interface ClearConfigButtonProps {
  className?: string;
  variant?: "button" | "link";
}

export const ClearConfigButton: React.FC<ClearConfigButtonProps> = ({
  className = "",
  variant = "button",
}) => {
  const handleClearConfig = () => {
    const confirmMessage =
      "This will clear your current configuration and return you to the welcome screen. You can always create a new configuration. Are you sure?";

    if (window.confirm(confirmMessage)) {
      configManager.clearActiveConfig();
      // Small delay to let config change propagate, then reload
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  if (variant === "link") {
    return (
      <button
        type="button"
        className={`${styles.clearConfigLink} ${className}`}
        onClick={handleClearConfig}
        title="Clear configuration and return to welcome"
      >
        <RotateCcw size={14} />
        Reset Configuration
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`${styles.clearConfigButton} ${className}`}
      onClick={handleClearConfig}
      title="Clear configuration and return to welcome"
    >
      <RotateCcw size={16} />
      Reset to Welcome
    </button>
  );
};

export default ClearConfigButton;
