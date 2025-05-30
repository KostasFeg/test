import React, { ReactNode } from "react";
import "./Modal.scss";

export interface PanelProps {
  /** Title displayed in the yellow header */
  title: string;
  /** Called when the user presses the exit button */
  onClose: () => void;
  /** Inner content — e.g. your BursterSelectionPanel */
  children: ReactNode;
  /** Optional: style overrides */
  style?: React.CSSProperties;
  className?: string;
}

export const Panel: React.FC<PanelProps> = ({
  title,
  onClose,
  children,
  style,
  className,
}) => {
  return (
    <div className={"panel-container " + (className || "")} style={style}>
      <header className="panel-header">
        <h3 className="panel-title">{title}</h3>
        <button
          className="panel-exit"
          aria-label="Close"
          onClick={onClose}
          type="button"
        >
          <svg viewBox="0 0 24 24">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </header>
      <section className="panel-body">{children}</section>
    </div>
  );
};

export default Panel;
