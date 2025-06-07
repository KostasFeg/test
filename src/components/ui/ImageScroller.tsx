// ImageScroller.tsx  – full file
import React, {
  useRef,
  useCallback,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import clsx from "clsx";
import styles from "./ImageScroller.module.scss";

export interface ImageScrollerProps {
  children: ReactNode;
  step?: number;
  continuousSpeed?: number;
  className?: string;
  /** If true the scroller removes its internal max-width / height limits and fills its parent */
  fill?: boolean;
}

export default function ImageScroller({
  children,
  step = 240,
  continuousSpeed = 8,
  className,
  fill = false,
}: ImageScrollerProps) {
  /* ───────── refs + state ───────── */
  const viewport = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | undefined>(undefined);
  const downTime = useRef<number>(0);
  const movedInContinuous = useRef(false);
  const [needsScroll, setNeedsScroll] = useState(false);
  const [shouldCenter, setShouldCenter] = useState(false);

  /* ───────── helpers ───────── */
  const now = () =>
    typeof performance !== "undefined" ? performance.now() : Date.now();

  const scrollBy = useCallback(
    (delta: number, smooth = true) =>
      viewport.current?.scrollBy({
        top: delta,
        behavior: smooth ? "smooth" : "auto",
      }),
    []
  );

  const updateScrollNeeded = useCallback(() => {
    const el = viewport.current;
    if (el) {
      // Use a small tolerance to account for fractional pixels and browser differences
      const tolerance = 2;
      const needsScrolling = el.scrollHeight > el.clientHeight + tolerance;
      const shouldCenterContent = !needsScrolling && fill;

      // Only update state if there's actually a change to prevent unnecessary re-renders
      setNeedsScroll((prev) =>
        prev !== needsScrolling ? needsScrolling : prev
      );
      setShouldCenter((prev) =>
        prev !== shouldCenterContent ? shouldCenterContent : prev
      );
    }
  }, [fill]);

  /* run on mount + whenever window size changes */
  useEffect(() => {
    updateScrollNeeded();
    window.addEventListener("resize", updateScrollNeeded);
    return () => window.removeEventListener("resize", updateScrollNeeded);
  }, [updateScrollNeeded]);

  /* also re-check when images inside finish loading */
  useEffect(() => {
    const el = viewport.current;
    if (!el) return;

    const imgs = el.querySelectorAll("img");
    const handleImageLoad = () => {
      // Small delay to ensure layout has settled
      setTimeout(updateScrollNeeded, 50);
    };

    imgs.forEach((img) => {
      if (img.complete) {
        // Image already loaded, check immediately
        handleImageLoad();
      } else {
        img.addEventListener("load", handleImageLoad);
      }
    });

    return () => {
      imgs.forEach((img) => img.removeEventListener("load", handleImageLoad));
    };
  }, [children, updateScrollNeeded]);

  /* observe content size changes for better centering detection */
  useEffect(() => {
    const el = viewport.current;
    if (!el) return;

    const resizeObserver = new ResizeObserver(() => {
      // Delay the check to allow for layout changes
      setTimeout(updateScrollNeeded, 100);
    });

    // Also use MutationObserver to detect when content is added/removed
    const mutationObserver = new MutationObserver(() => {
      setTimeout(updateScrollNeeded, 50);
    });

    // Observe the viewport itself
    resizeObserver.observe(el);

    // Watch for DOM changes in the viewport
    mutationObserver.observe(el, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    // Also observe the first child if it exists
    const firstChild = el.firstElementChild;
    if (firstChild) {
      resizeObserver.observe(firstChild);
    }

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [children, updateScrollNeeded]);

  /* ───────── continuous scroll machinery ───────── */
  const stopContinuous = useCallback(() => {
    if (rafId.current !== undefined) cancelAnimationFrame(rafId.current);
    rafId.current = undefined;
  }, []);

  const startContinuous = useCallback(
    (dir: 1 | -1) => {
      stopContinuous();
      const stepPerFrame = dir * continuousSpeed;
      const tick = () => {
        if (!viewport.current) return;
        viewport.current.scrollTop += stepPerFrame;
        movedInContinuous.current = true;
        rafId.current = requestAnimationFrame(tick);
      };
      rafId.current = requestAnimationFrame(tick);
    },
    [continuousSpeed, stopContinuous]
  );

  const handlePointerDown = (dir: 1 | -1) => {
    downTime.current = now();
    movedInContinuous.current = false;
    startContinuous(dir);
  };

  const handlePointerUpCancel = (dir: 1 | -1) => {
    stopContinuous();
    if (!movedInContinuous.current && now() - downTime.current < 180) {
      scrollBy(dir * step, true);
    }
  };

  useEffect(() => stopContinuous, [stopContinuous]);

  /* ───────── markup ───────── */
  return (
    <div
      className={clsx(
        styles["image-scroller-root"],
        fill && styles["image-scroller-root--fill"],
        className
      )}
    >
      <div
        ref={viewport}
        className={clsx(
          styles["image-scroller-viewport"],
          fill && styles["image-scroller-viewport--fill"],
          shouldCenter && styles["image-scroller-viewport--center"]
        )}
        onScroll={updateScrollNeeded}
      >
        {children}
      </div>

      {/* ▲ up */}
      <button
        type="button"
        aria-label="Scroll up"
        className={clsx(
          styles["image-scroller-btn"],
          styles["image-scroller-btn--up"],
          !needsScroll && styles["image-scroller-btn--hidden"]
        )}
        onPointerDown={() => handlePointerDown(-1)}
        onPointerUp={() => handlePointerUpCancel(-1)}
        onPointerLeave={() => handlePointerUpCancel(-1)}
        onPointerCancel={() => handlePointerUpCancel(-1)}
      >
        <ArrowUp />
      </button>

      {/* ▼ down */}
      <button
        type="button"
        aria-label="Scroll down"
        className={clsx(
          styles["image-scroller-btn"],
          styles["image-scroller-btn--down"],
          !needsScroll && styles["image-scroller-btn--hidden"]
        )}
        onPointerDown={() => handlePointerDown(1)}
        onPointerUp={() => handlePointerUpCancel(1)}
        onPointerLeave={() => handlePointerUpCancel(1)}
        onPointerCancel={() => handlePointerUpCancel(1)}
      >
        <ArrowDown />
      </button>
    </div>
  );
}
