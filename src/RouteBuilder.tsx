// RouteBuilder.tsx
import React, { JSX } from "react";
import { Route, Navigate } from "react-router-dom";
import { NavNode } from "./App";
import { SectionWithTabs } from "./SectionWithTabs";
import { SectionWithButtons } from "./SectionWithButtons";

export function buildRoutes(nodes: NavNode[], base = ""): JSX.Element[] {
  return nodes.map((node) => {
    const hasKids = !!node.children?.length;
    const fullPath = `${base}/${node.slug}`.replace(/\/+/g, "/");

    /* -------------------------------------------------- parents -------- */
    if (hasKids) {
      // pick wrapper according to the new "display" flag
      const Wrapper =
        node.display === "buttons" ? SectionWithButtons : SectionWithTabs;

      return (
        <Route
          key={fullPath || "/"}
          path={node.slug || "/"}
          element={<Wrapper node={node} />}
        >
          {/* nested children (recursion FTW) */}
          {buildRoutes(node.children!, fullPath)}

          {/* auto-redirect only for TAB sections -------------------------- */}
          {node.display !== "buttons" && (
            <Route
              index
              element={<Navigate to={node.children![0].slug} replace />}
            />
          )}
        </Route>
      );
    }

    /* ---------------------------------------------------- leaves ------- */
    return (
      <Route
        key={fullPath}
        path={node.slug}
        element={node.element || <Navigate to="." />}
      />
    );
  });
}
