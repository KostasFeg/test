// SectionWithTabs.tsx
import React from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import styles from "./Tabs.module.scss";
import type { NavNode } from "../shared/config/navigation.config";
import { actionRegistry } from "../registries/actionRegistry";

export const SectionWithTabs: React.FC<{ node: NavNode }> = ({ node }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleTabClick = async (child: NavNode, event: React.MouseEvent) => {
    if (child.onCallback) {
      event.preventDefault();
      await child.onCallback();

      // Navigate after callback if element exists (to show content)
      if (child.element) {
        navigate(child.slug);
      }
    }
    // If no callback, let NavLink handle navigation normally
    if ((child as any).kind === "action" && (child as any).action) {
      event.preventDefault();
      const handler = actionRegistry[(child as any).action];
      if (handler) {
        await handler((child as any).params, child);
      }
    }
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
