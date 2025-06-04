// SectionWithTabs.tsx
import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import styles from "./Tabs.module.scss";
import { NavNode } from "./App";

export const SectionWithTabs: React.FC<{ node: NavNode }> = ({ node }) => {
  const location = useLocation();

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
            className={({ isActive }) =>
              isActive ? styles.active : styles.item
            }
          >
            {child.label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.tabContent}>
        {node.element}
        <Outlet />
      </div>
    </>
  );
};
