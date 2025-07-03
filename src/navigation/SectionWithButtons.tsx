// SectionWithButtons.tsx
import React from "react";
import {
  useLocation,
  useResolvedPath,
  Outlet,
  useNavigate,
} from "react-router-dom";
import styles from "./ButtonSection.module.scss";
import Button from "../components/primitives/Button";
import type { NavNode } from "../shared/config/navigation.config";
// Hybrid action fallback when navigation not yet enriched
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore – path resolver
import { actionRegistry } from "../registries/actionRegistry";

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

  const handleButtonClick = async (child: NavNode, e: React.MouseEvent) => {
    // If the node has a callback treat it as an action first
    if (child.onCallback) {
      e.preventDefault(); // stop default navigation behaviour
      await child.onCallback();

      // Navigate afterwards only when a component view exists
      if (child.element) {
        navigate(child.slug);
      }
      return; // done
    }

    // No callback – regular navigation to leaf route
    // Fallback: treat raw kind="action" nodes before navigation
    if ((child as any).kind === "action" && (child as any).action) {
      e.preventDefault();
      const handler = actionRegistry[(child as any).action];
      if (handler) {
        await handler((child as any).params, child);
      }
      return;
    }

    navigate(child.slug);
  };

  return (
    <div className={styles.wrapper}>
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
            <Button
              key={child.slug}
              variant="ghost"
              className={styles.item}
              onClick={(e) => handleButtonClick(child, e)}
            >
              {child.label}
            </Button>
          ))}
        </div>
      )}
      <div className={styles.outletContainer}>
        <Outlet />{" "}
        {/* child page takes the whole area when showMenu === false */}
      </div>
    </div>
  );
};
