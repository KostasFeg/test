import React from "react";
import { SideBar } from "./SideBar";
import type { NavNode } from "../../../shared/config/navigation.config";

interface SidebarButtonsProps {
  items: NavNode[];
  className?: string;
}

/**
 * Sidebar rendered as icon-only buttons (compact).
 * Simply forwards to the shared `SideBar` with the `buttons` variant preset.
 */
const SidebarButtons: React.FC<SidebarButtonsProps> = (props) => {
  const { items, className } = props;
  return <SideBar items={items} variant="buttons" className={className} />;
};

export default SidebarButtons;
