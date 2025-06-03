// FullScreenModal.tsx — take 2 🔥
// Completely self-contained: no Tailwind required and rendered through a React portal
// so it always sits on top of everything else.

import React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export interface FullScreenModalProps {
  /** Whether the modal is visible */
  open: boolean;
  /** Called when the close icon or the ESC key is pressed */
  onClose?: () => void;
  /** Toggle the top-right close button (default: true) */
  showCloseButton?: boolean;
  /** Additional class names for custom styling (e.g. Tailwind) */
  className?: string;
  /** The content to render inside the fullscreen modal */
  children: React.ReactNode;
}

/**
 * FullScreenModal — an edge-to-edge modal that renders via `createPortal` so it’s
 * independent from parent stacking-contexts & `overflow:hidden` ancestors.
 */
const FullScreenModal: React.FC<FullScreenModalProps> = ({
  open,
  onClose,
  showCloseButton = true,
  className = "",
  children,
}) => {
  // Mount a dedicated DOM node once and reuse it
  const modalRoot = React.useMemo(() => {
    let el = document.getElementById("fullscreen-modal-root");
    if (!el) {
      el = document.createElement("div");
      el.id = "fullscreen-modal-root";
      document.body.appendChild(el);
    }
    return el;
  }, []);

  // ESC-key handler
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) onClose();
    };
    if (open) window.addEventListener("keyup", handleKey);
    return () => window.removeEventListener("keyup", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const modalContent = (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        
      }}
      className={className}
    >
      {showCloseButton && (
        <button
          aria-label="Close"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "transparent",
            border: 0,
            cursor: "pointer",
            padding: 8,
            borderRadius: "50%",
          }}
        >
          <X size={24} />
        </button>
      )}
      {children}
    </div>
  );

  return createPortal(modalContent, modalRoot);
};

export default FullScreenModal;
