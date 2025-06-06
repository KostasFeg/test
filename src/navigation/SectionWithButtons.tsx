// SectionWithButtons.tsx
import React from "react";
import {
  useLocation,
  useResolvedPath,
  Outlet,
  useNavigate,
} from "react-router-dom";
import styles from "./ButtonSection.module.scss";
import type { NavNode } from "../shared/config/navigation.config";

interface SectionWithButtonsProps {
  node: NavNode;
  columns?: number; // New optional parameter for column layout
}

export const SectionWithButtons: React.FC<SectionWithButtonsProps> = ({
  node,
  columns = 1, // Default to 1 column (current behavior)
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const basePath = useResolvedPath(".").pathname; // e.g. "/dreamtouch-operations"

  /* if we're *exactly* on "…/dreamtouch-operations" show menu, otherwise hide */
  const showMenu = pathname === basePath || pathname === `${basePath}/`;

  const handleButtonClick = async (child: NavNode) => {
    // Execute callback if provided
    if (child.onCallback) {
      await child.onCallback();
    }

    // Navigate only if no callback is provided, or if both callback and element exist
    // This allows for flexible behavior: callback-only, navigation-only, or both
    if (!child.onCallback || child.element) {
      navigate(child.slug);
    }
  };

  return (
    <>
      {showMenu && (
        <div
          className={styles.buttonGrid}
          style={
            {
              "--columns": columns,
              gridTemplateColumns:
                columns > 1 ? `repeat(${columns}, 1fr)` : undefined,
            } as React.CSSProperties & { "--columns": number }
          }
        >
          {node.children!.map((child) => (
            <button
              key={child.slug}
              className={styles.item}
              onClick={() => handleButtonClick(child)}
            >
              {child.label}
            </button>
          ))}
        </div>
      )}
      <Outlet /> {/* child page takes the whole area when showMenu === false */}
    </>
  );
};
