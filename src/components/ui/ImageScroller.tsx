import React, { useRef } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import clsx from "clsx";
// @ts-ignore
import styles from "./ImageScroller.module.scss";

interface ImageScrollerProps {
  src: string;
  step?: number; // px per click, default 200
  className?: string; // extra utility classes
}

export default function ImageScroller({
  src,
  step = 200,
  className,
}: ImageScrollerProps) {
  const viewport = useRef<HTMLDivElement>(null);
  const scrollTimer = useRef<number | null>(null);

  const scroll = (dir: 1 | -1, amount = step) => {
    viewport.current?.scrollBy({ top: dir * amount, behavior: "smooth" });
  };

  // Continuous scroll logic
  const startContinuousScroll = (dir: 1 | -1) => {
    if (scrollTimer.current) return;
    const scrollStep = 12; // px per tick
    const tick = () => {
      viewport.current?.scrollBy({ top: dir * scrollStep, behavior: "smooth" });
      scrollTimer.current = setTimeout(tick, 20);
    };
    tick();
  };
  const stopContinuousScroll = () => {
    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current!);
      scrollTimer.current = null;
    }
  };

  return (
    <div className={clsx(styles["image-scroller-root"], className)}>
      {/* scrollable area */}
      <div ref={viewport} className={styles["image-scroller-viewport"]}>
        <img src={src} alt="" className={styles["image-scroller-img"]} />
      </div>

      {/* controls */}
      <button
        type="button"
        onClick={() => scroll(-1)}
        onMouseDown={() => startContinuousScroll(-1)}
        onMouseUp={stopContinuousScroll}
        onMouseLeave={stopContinuousScroll}
        onTouchStart={() => startContinuousScroll(-1)}
        onTouchEnd={stopContinuousScroll}
        onTouchCancel={stopContinuousScroll}
        className={clsx(
          styles["image-scroller-btn"],
          styles["image-scroller-btn--up"]
        )}
        aria-label="Scroll up"
      >
        <ArrowUp />
      </button>

      <button
        type="button"
        onClick={() => scroll(1)}
        onMouseDown={() => startContinuousScroll(1)}
        onMouseUp={stopContinuousScroll}
        onMouseLeave={stopContinuousScroll}
        onTouchStart={() => startContinuousScroll(1)}
        onTouchEnd={stopContinuousScroll}
        onTouchCancel={stopContinuousScroll}
        className={clsx(
          styles["image-scroller-btn"],
          styles["image-scroller-btn--down"]
        )}
        aria-label="Scroll down"
      >
        <ArrowDown />
      </button>
    </div>
  );
}
