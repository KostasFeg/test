import React, { ReactNode } from "react";
import styles from "./Layout.module.scss";
import { TopBar } from "./top-bar/TopBar";
import SidebarButtons from "./sidebar/SidebarButtons";
import SidebarLabels from "./sidebar/SidebarLabels";
import { BottomBar, BottomBarItem } from "./bottom-bar/BottomBar";
import clsx from "clsx";
import FloatingBackButton from "../ui/FloatingBackButton";
import { useUI } from "../../app/providers/UIProvider";
import { peripherals } from "../../mocksHelper";
import { NavNode } from "../../shared/config/navigation.config";
import { useBranding } from "../../hooks/useBranding";

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
  const { logo } = useBranding();

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

      {sidebarVariant === "buttons" ? (
        <SidebarButtons className={styles.sidebar} items={sidebarItems} />
      ) : (
        <SidebarLabels className={styles.sidebar} items={sidebarItems} />
      )}

      <main className={styles.main}>{children}</main>

      {showBottomBar && (
        <>
          <div className={styles.logo}>
            <img
              src={logo.src}
              alt={logo.alt}
              style={{
                width: logo.width ? `${logo.width}px` : undefined,
                height: logo.height ? `${logo.height}px` : undefined,
              }}
            />
          </div>
          <BottomBar className={styles.bottombar} items={peripherals} />
        </>
      )}
      <FloatingBackButton />
    </div>
  );
};
