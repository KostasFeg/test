import React, { ReactNode } from "react";
import clsx from "clsx";
import styles from "./TopBar.module.scss";

interface SectionProps {
  children?: ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ children, className }) => (
  <div className={clsx(styles.section, className)}>{children}</div>
);

export interface TopBarProps {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  className?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  left,
  center,
  right,
  className,
}) => (
  <header className={clsx(styles.root, className)}>
    <Section>{left}</Section>
    <Section>{center}</Section>
    <Section>{right}</Section>
  </header>
);
