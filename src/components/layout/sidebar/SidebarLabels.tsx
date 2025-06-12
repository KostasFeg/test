import React from "react";
import { SideBar } from "./SideBar";
import type { NavNode } from "../../../shared/config/navigation.config";

interface SidebarLabelsProps {
  items: NavNode[];
  className?: string;
}

/**
 * Sidebar rendered with full text labels (wide).
 * Forwards to shared `SideBar` with `labels` variant preset.
 */
const SidebarLabels: React.FC<SidebarLabelsProps> = ({ items, className }) => {
  return <SideBar items={items} variant="labels" className={className} />;
};

export default SidebarLabels;
