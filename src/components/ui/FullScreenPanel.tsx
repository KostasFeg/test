import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import styles from "./FullScreenPanel.module.scss";
import { X } from "lucide-react";
import clsx from "clsx";

interface FullScreenPanelProps {
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
}

const FullScreenPanel: React.FC<FullScreenPanelProps> = ({
  children,
  onClose,
  className,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number | null>(null);
  const [dragY, setDragY] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  const requestClose = () => {
    // Trigger closing animation
    if (!isClosing) {
      setIsClosing(true);
    }
  };

  // ESC key closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && requestClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Pointer events for drag-to-close
  const handlePointerDown = (e: React.PointerEvent) => {
    startY.current = e.clientY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (startY.current != null) {
      const delta = e.clientY - startY.current;
      if (delta > 0) setDragY(delta);
    }
  };

  const handlePointerUp = () => {
    if (dragY > 120) {
      // close
      requestClose();
    } else {
      // snap back
      setDragY(0);
    }
    startY.current = null;
  };

  const handleAnimationEnd = () => {
    if (isClosing) {
      onClose();
    }
  };

  const panel = (
    <div className={styles.backdrop} onClick={requestClose}>
      <div
        ref={panelRef}
        className={clsx(styles.panel, className, {
          [styles.closing]: isClosing,
        })}
        style={{ transform: `translateY(${dragY}px)` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={(e) => e.stopPropagation()}
        onAnimationEnd={handleAnimationEnd}
      >
        <button
          className={styles.closeBtn}
          onClick={requestClose}
          aria-label="Close configuration editor"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );

  return ReactDOM.createPortal(panel, document.body);
};

export default FullScreenPanel;
