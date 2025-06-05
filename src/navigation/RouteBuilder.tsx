// RouteBuilder.tsx
import React, { Suspense } from "react";
import { Route, Navigate } from "react-router-dom";
import type { NavNode } from "../shared/config/navigation.config";
import { SectionWithTabs } from "./SectionWithTabs";
import { SectionWithButtons } from "./SectionWithButtons";
import LoadingFallback from "../components/ui/LoadingFallback";

export function buildRoutes(nodes: NavNode[], base = ""): React.ReactElement[] {
  return nodes.map((node) => {
    const hasKids = !!node.children?.length;
    const fullPath = `${base}/${node.slug}`.replace(/\/+/g, "/");
    const Wrapper =
      node.display === "buttons" ? SectionWithButtons : SectionWithTabs;

    /* -------- parent routes (tabs or buttons) ------------------------- */
    if (hasKids) {
      return (
        <Route
          key={fullPath || "/"}
          path={node.slug || "/"}
          element={<Wrapper node={node} />}
        >
          {buildRoutes(node.children!, fullPath)}
          {/* auto-redirect only for tabs */}
          {node.display !== "buttons" && (
            <Route
              index
              element={<Navigate to={node.children![0].slug} replace />}
            />
          )}
        </Route>
      );
    }

    /* -------- leaf routes --------------------------------------------- */
    return (
      <Route
        key={fullPath}
        path={node.slug}
        element={
          node.element ? (
            <Suspense
              fallback={<LoadingFallback size={48} message="Loading page..." />}
            >
              {node.element()}
            </Suspense>
          ) : (
            <Navigate to="." />
          )
        }
      />
    );
  });
}
