import React, { useState, useEffect } from "react";
import clsx from "clsx";
import "./BursterSelectionPanel.scss";

/**
 * A single burster entry as returned from your API
 */
export interface Burster {
  /** running # as shown in the UI (1-25, etc.) */
  id: number;
  /** product id */
  pid: number;
  /** product name */
  name: string;
  /** price per unit / msrp */
  pricePer: number;
  /** discounted / sale price */
  priceSale: number;
  /** how many are currently in stock – null ⇒ unknown, 0 ⇒ out */
  qty: number | null;
  /** the full/maximum quantity for this burster */
  fullQty: number;
  /**
   * stock state to drive colouring & icon
   *   • "out"   – red,   ✖ overlay
   *   • "low"   – yellow, ⚠ overlay
   *   • "normal" (default) – blue  📦 overlay
   */
  status: "out" | "low" | "normal";
}

/**
 * Random demo data generator so the component can render itself if no list is
 * supplied. 25 items by default to match the reference grid.
 */
function generateRandomBursters(count = 25): Burster[] {
  const names = ["WELMON", "BONCAS", "RUSSET", "SOMXON", "MAVES", "TREMO"];

  return Array.from({ length: count }, (_, i) => {
    const qtyRoll = Math.random();
    const fullQty = Math.floor(Math.random() * 300) + 100; // full size between 100-400
    const qty = qtyRoll < 0.15 ? 0 : Math.floor(Math.random() * fullQty) + 1; // 15% chance of OUT

    let status: Burster["status"] = "normal";
    if (qty === 0) status = "out";
    else if (qty < 50) status = "low";

    const pricePer = +(Math.random() * 10 + 1).toFixed(2);
    const priceSale = +(pricePer * (0.4 + Math.random() * 0.4)).toFixed(2); // 40‑80% of pricePer

    return {
      id: i + 1,
      pid: 1000 + Math.floor(Math.random() * 1000),
      name: names[Math.floor(Math.random() * names.length)],
      pricePer,
      priceSale,
      qty: qty === 0 ? 0 : qty,
      fullQty,
      status,
    } as Burster;
  });
}

/**
 * Default demo dataset – lazily generated once at module load.
 */
export const defaultBursters: Burster[] = generateRandomBursters();

export interface BursterSelectionPanelProps {
  /** list of bursters to show – defaults to `defaultBursters` */
  bursters?: Burster[];
  /** how many columns for the css-grid (default 5) */
  columns?: number;
  /** callback when user selects a burster */
  onSelect?: (burster: Burster) => void;
}

/**
 * BursterSelectionPanel – renders the grid shown in the reference screenshot.
 * Includes a subtle "pop" animation when a tile is selected.
 */
export const BursterSelectionPanel: React.FC<BursterSelectionPanelProps> = ({
  bursters = defaultBursters,
  columns = 5,
  onSelect,
}) => {
  const [selected, setSelected] = useState<number | null>(null);

  const handleClick = (burster: Burster) => {
    setSelected((prev) => (prev === burster.id ? null : burster.id));
    onSelect?.(burster);
  };

  return (
    <div
      className="burster-panel"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {bursters.map((b) => {
        // Calculate fullness percentage for normal bursters
        const targetFullness =
          b.status === "normal" && b.qty !== null && b.fullQty > 0
            ? Math.max(0, Math.min(1, b.qty / b.fullQty))
            : 0;
        // Animate fullness
        const [animatedFullness, setAnimatedFullness] = useState(0);
        useEffect(() => {
          let frame: number;
          let start: number | null = null;
          const duration = 700; // ms
          const animate = (timestamp: number) => {
            if (start === null) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            setAnimatedFullness(progress * targetFullness);
            if (progress < 1) {
              frame = requestAnimationFrame(animate);
            } else {
              setAnimatedFullness(targetFullness);
            }
          };
          setAnimatedFullness(0);
          frame = requestAnimationFrame(animate);
          return () => cancelAnimationFrame(frame);
        }, [targetFullness, b.id]);
        return (
          <div
            key={b.id}
            className={clsx("burster", {
              "burster--selected": b.id === selected,
              "burster--out": b.status === "out",
              "burster--low": b.status === "low",
            })}
            onClick={() => handleClick(b)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleClick(b);
            }}
          >
            {/* Fullness indicator for normal bursters */}
            {b.status === "normal" && b.qty !== null && b.fullQty > 0 && (
              <div
                className="burster__fullness-indicator"
                style={{
                  height: `100%`,
                  transform: `scaleY(${animatedFullness})`,
                  background: `linear-gradient(135deg, #38d39f 0%, #23a867 100%)`,
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  top: 0,
                  borderRadius: animatedFullness === 1 ? "6px" : "0 0 6px 6px",
                  zIndex: 0,
                  transition:
                    "transform 0.7s cubic-bezier(0.4,0,0.2,1), border-radius 0.3s",
                  pointerEvents: "none",
                  opacity: 0.92,
                  willChange: "transform, border-radius",
                }}
              />
            )}
            <div
              className="burster__header"
              style={{ position: "relative", zIndex: 2 }}
            >
              <span
                className="burster__number"
                style={{ position: "relative", zIndex: 2 }}
              >
                #{b.id}
              </span>
              {b.status === "out" && (
                <span className="burster__label">OUT</span>
              )}
              {b.status === "low" && (
                <span className="burster__label">LOW</span>
              )}
            </div>

            <div
              className="burster__body"
              style={{ position: "relative", zIndex: 1 }}
            >
              {/* Body shows either qty or an icon depending on the status */}
              {b.status === "normal" && b.qty !== null && (
                <span className="burster__qty">{b.qty}</span>
              )}
              {b.status === "out" && <span className="burster__icon">✖</span>}
              {b.status === "low" && <span className="burster__icon">⚠</span>}
              {b.status === "normal" && b.qty === null && (
                <span className="burster__icon">📦</span>
              )}
            </div>

            <div
              className="burster__footer"
              style={{ position: "relative", zIndex: 1 }}
            >
              <p className="burster__meta">
                PID: {b.pid}
                <br />
                NAME: {b.name}
              </p>
              <p className="burster__price">
                {b.pricePer.toFixed(2)} —{" "}
                <strong>{b.priceSale.toFixed(2)}</strong>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BursterSelectionPanel;
