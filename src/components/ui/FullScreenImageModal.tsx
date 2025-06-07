import React from "react";
import { createPortal } from "react-dom";
import { X, Printer } from "lucide-react";
import ImageScroller from "./ImageScroller";
import styles from "./FullScreenImageModal.module.scss";

export interface FullScreenImageModalProps {
  /** Whether the modal is visible */
  open: boolean;
  /** Called when the close button or ESC key is pressed */
  onClose?: () => void;
  /** Called when the print button is pressed */
  onPrint?: () => void;
  /** The content to render inside the ImageScroller */
  children: React.ReactNode;
  /** Additional class names for custom styling */
  className?: string;
  /** Print button text (default: "Print") */
  printButtonText?: string;
  /** Close button text (default: "Close") */
  closeButtonText?: string;
  /** Disable the print button */
  printDisabled?: boolean;
}

/**
 * FullScreenImageModal — A fullscreen modal specifically designed for displaying
 * content in an ImageScroller with built-in close and print buttons.
 *
 * Features:
 * - ImageScroller takes up 90% of modal height
 * - Close and print buttons at bottom (10% height)
 * - ESC key support
 * - Fully reusable and customizable
 */
const FullScreenImageModal: React.FC<FullScreenImageModalProps> = ({
  open,
  onClose,
  onPrint,
  children,
  className = "",
  printButtonText = "Print",
  closeButtonText = "Close",
  printDisabled = false,
}) => {
  // Mount a dedicated DOM node once and reuse it
  const modalRoot = React.useMemo(() => {
    let el = document.getElementById("fullscreen-image-modal-root");
    if (!el) {
      el = document.createElement("div");
      el.id = "fullscreen-image-modal-root";
      document.body.appendChild(el);
    }
    return el;
  }, []);

  // ESC-key and click outside handler
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      // Close when clicking on the modal backdrop (not the content)
      if (e.target === e.currentTarget && onClose) {
        onClose();
      }
    };

    if (open) {
      window.addEventListener("keyup", handleKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keyup", handleKey);
      // Restore body scroll
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // Handle print functionality
  const handlePrint = React.useCallback(() => {
    if (onPrint) {
      onPrint();
    } else {
      // Default print behavior
      window.print();
    }
  }, [onPrint]);

  if (!open) return null;

  const modalContent = (
    <div
      className={`${styles.modal} ${className}`}
      onClick={(e) => {
        // Close when clicking on the backdrop
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
    >
      {/* ImageScroller container - 90% height */}
      <div className={styles.scrollerContainer}>
        <ImageScroller fill className={styles.imageScroller}>
          {children}
        </ImageScroller>
      </div>

      {/* Button bar - 10% height */}
      <div className={styles.buttonBar}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label={closeButtonText}
          title={closeButtonText}
        >
          <X size={32} />
          <span>{closeButtonText}</span>
        </button>

        <button
          className={styles.printButton}
          onClick={handlePrint}
          disabled={printDisabled}
          aria-label={printButtonText}
          title={printButtonText}
        >
          <Printer size={32} />
          <span>{printButtonText}</span>
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, modalRoot);
};

export default FullScreenImageModal;
