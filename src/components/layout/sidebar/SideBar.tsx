// SideBar.tsx
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import clsx from "clsx";
import styles from "./SideBar.module.scss";
import type { NavNode } from "../../../shared/config/navigation.config";
import { SidebarVariant } from "../../../shared/types/ui";

// Keep this for backward compatibility if needed
export type SideBarVariant = SidebarVariant;

interface SideBarProps {
  items: NavNode[]; // usually the *top-level* nodes (`nav` array)
  variant?: SideBarVariant; // defaults to "labels"
  className?: string;
}

/** One sidebar to rule them all 🔥 */
export const SideBar: React.FC<SideBarProps> = ({
  items,
  variant = "labels",
  className,
}) => {
  const location = useLocation(); // allows custom "isActive" logic below

  /**   * Consider parent nodes "active" while any descendant route is active.
   * That's why we can't rely solely on <NavLink>'s built-in end={true/false}.   */
  const isRouteActive = (node: NavNode) => {
    const path = `/${node.slug}`.replace(/\/+/g, "/");
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <aside className={clsx(styles.root, styles[variant], className)}>
      {items.map((node) => {
        const fullPath = `/${node.slug}`.replace(/\/+/g, "/") || "/";

        const content =
          variant === "buttons" ? (
            <>
              {/* icon can be undefined – guard it to avoid empty <span /> */}
              {node.icon && <span className={styles.icon}>{node.icon}</span>}
              <span className={styles.text}>{node.label}</span>
            </>
          ) : (
            node.label
          );

        return (
          <NavLink
            key={node.slug}
            to={fullPath}
            // with custom logic we don't need NavLink's 'end' prop
            className={clsx(
              styles.item,
              variant === "labels" ? styles.labelItem : styles.buttonItem,
              { [styles.active]: isRouteActive(node) }
            )}
          >
            {content}
          </NavLink>
        );
      })}
    </aside>
  );
};
