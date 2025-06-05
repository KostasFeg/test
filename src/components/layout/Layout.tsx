import React, { ReactNode } from "react";
import styles from "./Layout.module.scss";
import { TopBar } from "./top-bar/TopBar";
import { SideBar } from "./sidebar/SideBar";
import { BottomBar, BottomBarItem } from "./bottom-bar/BottomBar";
import clsx from "clsx";
import FloatingBackButton from "../ui/FloatingBackButton";
import { useUI } from "../../app/providers/UIProvider";
import { peripherals } from "../../mocksHelper";
import { NavNode } from "../../shared/config/navigation.config";

interface LayoutProps {
  sidebarItems: NavNode[];
  topLeft?: ReactNode;
  topCenter?: ReactNode;
  topRight?: ReactNode;
  children?: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  sidebarItems,
  topLeft,
  topCenter,
  topRight,
  children,
}) => {
  const { sidebarVariant, showBottomBar } = useUI();

  return (
    <div
      className={clsx(
        styles.root,
        sidebarVariant === "labels" && styles.labelsVariant,
        !showBottomBar && styles.noBottomBar
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

      {showBottomBar && (
        <BottomBar className={styles.bottombar} items={peripherals} />
      )}
      <FloatingBackButton />
    </div>
  );
};
