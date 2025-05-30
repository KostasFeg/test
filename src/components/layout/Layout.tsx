import React, { ReactNode } from "react";
import styles from "./Layout.module.scss";
import { TopBar } from "../top-bar/TopBar";
import { SideBar, SideBarLabels, SideBarButtons } from "../sidebar/SideBar";
import { BottomBar, BottomBarItem } from "../bottom-bar/BottomBar";
import clsx from "clsx";

export type SideBarVariant = "labels" | "buttons";

interface LayoutProps {
  sidebarVariant?: SideBarVariant;
  sidebarItems: SideBarLabels | SideBarButtons;
  bottomItems?: BottomBarItem[];
  topLeft?: ReactNode;
  topCenter?: ReactNode;
  topRight?: ReactNode;
  children?: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  sidebarVariant = "labels",
  sidebarItems,
  bottomItems,
  topLeft,
  topCenter,
  topRight,
  children,
}) => {
  return (
    <div
      className={clsx(
        styles.root,
        sidebarVariant === "labels" && styles.labelsVariant,
        !bottomItems && styles.noBottomBar
      )}
    >
      <TopBar
        className={styles.topbar}
        left={topLeft}
        center={topCenter}
        right={topRight}
      />

      <SideBar
        className={styles.sidebar}
        variant={sidebarVariant}
        items={sidebarItems}
      />

      <main className={styles.main}>{children}</main>

      {bottomItems && (
        <BottomBar className={styles.bottombar} items={bottomItems} />
      )}
    </div>
  );
};
