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

export const SectionWithButtons: React.FC<{ node: NavNode }> = ({ node }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const basePath = useResolvedPath(".").pathname; // e.g. "/dreamtouch-operations"

  /* if we're *exactly* on "…/dreamtouch-operations" show menu, otherwise hide */
  const showMenu = pathname === basePath || pathname === `${basePath}/`;

  return (
    <>
      {showMenu && (
        <div className={styles.buttonGrid}>
          {node.children!.map((child) => (
            <button
              key={child.slug}
              className={styles.item}
              onClick={() => navigate(child.slug)}
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
