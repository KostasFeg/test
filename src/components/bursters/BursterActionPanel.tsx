import React, { ReactNode, useCallback, useMemo, useState } from "react";
import BursterSelectionPanel from "./BursterSelectionPanel";
import "./BursterActionPanel.scss";

/* ---------------------------------------------------------------------------
 * Types
 * -------------------------------------------------------------------------*/

/** Context sent into every action handler / disabled predicate */
export interface BursterActionContext {
  /** All currently selected bins (rich metadata) */
  selected: any[];
  /** Total bursters (rows) in the grid */
  bursterCount: number;
  /** Bins per burster (columns) in the grid */
  binsPerBurster: number;
}

/** Config object for a single button / action */
export interface BursterAction<Extra = void> {
  /** Unique identifier */
  id: string;
  /** Label shown on the button */
  label: ReactNode;
  /** Optional variant used for styling (maps to modifier class) */
  variant?: "primary" | "danger" | "default";
  /** Disable button when this returns `true` */
  disabled?: (ctx: BursterActionContext) => boolean;
  /** Handler called when the user clicks the button */
  onExecute: (
    ctx: BursterActionContext,
    extra?: Extra
  ) => void | Promise<void>;
}

/** Props for the high-level panel */
export interface BursterActionPanelProps {
  /** Grid geometry props forwarded to BursterSelectionPanel */
  bursterCount?: number;
  binsPerBurster?: number;

  /** Action definitions in the order you'd like them rendered */
  actions: BursterAction<any>[];

  /** Optional controlled-mode for selection */
  value?: string[];
  onSelectionChange?: (sel: SelectedBin[]) => void;

  /** Custom className passthrough */
  className?: string;
}

// Locally define SelectedBin type
type SelectedBin = {
  burster: number;
  bin: number;
  id: string;
  index: number;
};

/* ---------------------------------------------------------------------------
 * Component
 * -------------------------------------------------------------------------*/

export const BursterActionPanel: React.FC<BursterActionPanelProps> = ({
  bursterCount = 5,
  binsPerBurster = 5,
  actions,
  value,
  onSelectionChange,
  className = "",
}) => {
  /* ---------------------------------- state -------------------------------- */

  // Uncontrolled selection fallback
  const [internalSel, setInternalSel] = useState<string[]>([]);
  const selectedIds = value ?? internalSel;

  const handleSelChange = (bins: SelectedBin[]) => {
    const ids = bins.map((b) => b.id);
    if (!value) setInternalSel(ids);
    onSelectionChange?.(bins);
  };

  // Build full SelectedBin[] from ids — reused in several spots
  const selectedBins: SelectedBin[] = useMemo(() => {
    return selectedIds.map((id) => {
      const [r, c] = id.split("-").map(Number);
      return {
        burster: r,
        bin: c,
        id,
        index: (r - 1) * binsPerBurster + c,
      };
    });
  }, [selectedIds, binsPerBurster]);

  // Shared context object passed to every action
  const ctx: BursterActionContext = useMemo(
    () => ({
      selected: selectedBins,
      bursterCount,
      binsPerBurster,
    }),
    [selectedBins, bursterCount, binsPerBurster]
  );

  /* --------------------------------- render -------------------------------- */

  return (
    <div className={`burster-action-panel ${className}`}>
      {/* Grid */}
      <BursterSelectionPanel
        columns={binsPerBurster}
        // value and onChange are not supported by BursterSelectionPanel, so selection is managed internally only
      />

      {/* Buttons */}
      <div className="burster-actions">
        {actions.map((a) => {
          const isDisabled = a.disabled ? a.disabled(ctx) : false;
          const variant = a.variant ?? "default";
          return (
            <button
              key={a.id}
              type="button"
              className={`burster-action-btn burster-action-btn--${variant}`}
              disabled={isDisabled}
              onClick={() => a.onExecute(ctx)}
            >
              {a.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BursterActionPanel;
