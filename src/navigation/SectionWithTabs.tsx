// SectionWithTabs.tsx
import React from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import styles from "./Tabs.module.scss";
import type { NavNode } from "../shared/config/navigation.config";

export const SectionWithTabs: React.FC<{ node: NavNode }> = ({ node }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleTabClick = async (child: NavNode, event: React.MouseEvent) => {
    // Execute callback if provided
    if (child.onCallback) {
      event.preventDefault(); // Prevent default NavLink behavior
      await child.onCallback();

      // Navigate after callback if element exists (to show content)
      if (child.element) {
        navigate(child.slug);
      }
    }
    // If no callback, let NavLink handle navigation normally
  };

  return (
    <>
      {/* inner menu */}
      <nav
        className={styles.tabBar}
        style={{ "--tab-count": node.children!.length } as React.CSSProperties}
      >
        {node.children!.map((child) => (
          <NavLink
            key={child.slug}
            to={child.slug}
            onClick={(event) => handleTabClick(child, event)}
            className={({ isActive }) =>
              isActive ? styles.active : styles.item
            }
          >
            {child.label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.tabContent}>
        {node.element && node.element()}
        <Outlet />
      </div>
    </>
  );
};
