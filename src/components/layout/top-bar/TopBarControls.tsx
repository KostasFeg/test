import React from "react";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./TopBarControls.module.scss";

interface TopBarControlsProps {
  retailerId?: string;
}

export const TopBarControls: React.FC<TopBarControlsProps> = ({
  retailerId,
}) => {
  const navigate = useNavigate();

  const openConfigEditor = () => {
    navigate("/configuration");
  };

  return (
    <div className={styles.controls}>
      {/* Retailer ID */}
      {retailerId && (
        <span className={styles.retailerId}>retailerId: {retailerId}</span>
      )}

      {/* Config Editor Button */}
      <button
        className={styles.configButton}
        onClick={openConfigEditor}
        title="Open Configuration Editor"
        aria-label="Open Configuration Editor"
      >
        <Settings size={20} />
        <span>Config</span>
      </button>
    </div>
  );
};
