import React from "react";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./TopBarControls.module.scss";
import ClearConfigButton from "../../ui/ClearConfigButton";
import { shouldShowConfigEditor } from "../../../shared/config/app.config";

interface TopBarControlsProps {
  retailerId?: string;
}

export const TopBarControls: React.FC<TopBarControlsProps> = ({
  retailerId,
}) => {
  const navigate = useNavigate();

  const openConfigEditor = () => {
    // Import here to avoid circular dependency
    import("../../../shared/config/dynamic-config.service")
      .then(({ dynamicConfig }) => {
        const configRoute = dynamicConfig.getConfigurationRoute();
        navigate(configRoute);
      })
      .catch(() => {
        navigate("/configuration"); // Fallback
      });
  };

  return (
    <div className={styles.controls}>
      {/* Retailer ID */}
      {retailerId && (
        <span className={styles.retailerId}>retailerId: {retailerId}</span>
      )}

      {/* Config Editor Button - Only in development */}
      {shouldShowConfigEditor() && (
        <button
          className={styles.configButton}
          onClick={openConfigEditor}
          title="Open Configuration Editor"
          aria-label="Open Configuration Editor"
        >
          <Settings size={20} />
          <span>Config</span>
        </button>
      )}

      {/* Clear Config Button - Only in development */}
      {shouldShowConfigEditor() && <ClearConfigButton variant="link" />}
    </div>
  );
};
