/* ------------------------------------------------------------------
   DatePicker.tsx  ─  v2.0
   A zero-dependency* React calendar for “single” or “range” picking.

   * date-fns is the only runtime dependency (already in your project).
------------------------------------------------------------------- */

import React, { useState, useEffect, useMemo, useCallback, JSX } from "react";
import {
  addMonths,
  subMonths,
  addYears,
  subYears,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  format,
  addDays,
  isSameMonth,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import "./DatePicker.scss";

/* ------------------------------------------------------------------ */
/* Public types & props                                               */
/* ------------------------------------------------------------------ */
export type PickerMode = "single" | "range";
export interface DateRange {
  from: Date | null;
  to: Date | null;
}
export type DateValue = Date | DateRange;

export interface DatePickerProps {
  /** "single" (one date) | "range" (from/to).  Default = "range". */
  mode?: PickerMode;
  /** Controlled value (optional).  For "single" pass `Date`; for "range" pass `{from,to}`. */
  value?: DateValue;
  /** Fires whenever the selection changes. */
  onChange?: (value: DateValue) => void;

  /* --- UX niceties (all optional) --- */
  title?: string;                 // Heading text
  actionLabel?: string | false;   // Bottom button label – false hides the button
  minDate?: Date;
  maxDate?: Date;
  showTime?: boolean;             // Adds HH:mm input next to each date
  closeOnSelect?: boolean;        // “single” mode: close after picking. Default = true.
  disabledWeekdays?: number[];    // Array of 0–6 (Sun-Sat) to disable
}

/* ------------------------------------------------------------------ */
/* Utility helpers                                                    */
/* ------------------------------------------------------------------ */
const isBetween = (d: Date, min?: Date, max?: Date) =>
  (!min || d >= min) && (!max || d <= max);

const applyTime = (base: Date, hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date(base);
  d.setHours(h, m, 0, 0);
  return d;
};

/* ------------------------------------------------------------------ */
/* <DayCell>                                                          */
/* ------------------------------------------------------------------ */
interface DayCellProps {
  day: Date;
  monthStart: Date;
  mode: PickerMode;
  selected: Date | null;
  range: DateRange;
  onSelect: (d: Date) => void;
  isDisabled: (d: Date) => boolean;
}

const DayCell: React.FC<DayCellProps> = ({
  day,
  monthStart,
  mode,
  selected,
  range,
  onSelect,
  isDisabled,
}) => {
  const isToday = isSameDay(day, new Date());
  const isSelected =
    mode === "single"
      ? selected && isSameDay(day, selected)
      : range.from &&
        ((range.to && isWithinInterval(day, { start: range.from, end: range.to })) ||
          isSameDay(day, range.from) ||
          (range.to && isSameDay(day, range.to)));

  const inMonth = isSameMonth(day, monthStart);
  const isSaturday = day.getDay() === 6;
  const disabled = isDisabled(day);

  let cls = "drp-day";
  if (!inMonth) cls += " drp-day--muted";
  if (isSaturday) cls += " drp-day--saturday";
  if (isToday) cls += " drp-day--today";
  if (isSelected) cls += " drp-day--selected";
  if (disabled) cls += " drp-day--disabled";

  return (
    <div
      role="gridcell"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      className={cls}
      onClick={() => !disabled && onSelect(day)}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !disabled) {
          e.preventDefault();
          onSelect(day);
        }
      }}
    >
      {format(day, "d")}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* <DatePicker>                                                       */
/* ------------------------------------------------------------------ */
const DatePicker: React.FC<DatePickerProps> = ({
  mode = "range",
  value,
  onChange,

  /* UX props */
  title = "Select Date",
  actionLabel = false,
  minDate,
  maxDate,
  showTime = false,
  closeOnSelect = true,
  disabledWeekdays = [],
}) => {
  /* ───────────────── internal state ───────────────── */
  const [viewDate, setViewDate] = useState<Date>(new Date());

  /** selected (single mode) */
  const [selected, setSelected] = useState<Date | null>(
    mode === "single" && value instanceof Date ? value : null
  );

  /** range (range mode) */
  const [range, setRange] = useState<DateRange>(
    mode === "range" && value && !(value instanceof Date)
      ? (value as DateRange)
      : { from: null, to: null }
  );

  /** sync controlled value */
  useEffect(() => {
    if (!value) return;
    if (mode === "single" && value instanceof Date) {
      setSelected(value);
      setViewDate(value);
    }
    if (mode === "range" && !(value instanceof Date)) {
      setRange(value);
      if (value.from) setViewDate(value.from);
    }
  }, [value, mode]);

  const isDisabled = useCallback(
    (d: Date) =>
      !isBetween(d, minDate, maxDate) || disabledWeekdays.includes(d.getDay()),
    [minDate, maxDate, disabledWeekdays]
  );

  /* ───────────────── navigation ───────────────── */
  const nav = {
    prevMonth: () => setViewDate((d) => subMonths(d, 1)),
    nextMonth: () => setViewDate((d) => addMonths(d, 1)),
    prevYear:  () => setViewDate((d) => subYears(d, 1)),
    nextYear:  () => setViewDate((d) => addYears(d, 1)),
  };

  /* ───────────────── selection logic ───────────────── */
  const commitChange = (val: DateValue) => {
    onChange?.(val);
    if (mode === "single" && closeOnSelect) {
      /* you could hide a popover here – left blank intentionally */
    }
  };

  const onSelect = (day: Date) => {
    if (mode === "single") {
      setSelected(day);
      commitChange(day);
      return;
    }

    /* range mode */
    if (!range.from || (range.from && range.to)) {
      const next = { from: day, to: null };
      setRange(next);
      commitChange(next);
    } else if (day < range.from) {
      const next = { from: day, to: null };
      setRange(next);
      commitChange(next);
    } else {
      const next = { ...range, to: day };
      setRange(next);
      commitChange(next);
    }
  };

  /* ───────────────── grid generation ───────────────── */
  const { startDate, endDate, monthStart } = useMemo(() => {
    const monthStart = startOfMonth(viewDate);
    return {
      monthStart,
      startDate: startOfWeek(monthStart, { weekStartsOn: 0 }),
      endDate: endOfWeek(endOfMonth(monthStart), { weekStartsOn: 0 }),
    };
  }, [viewDate]);

  const grid = useMemo(() => {
    const rows: JSX.Element[] = [];
    let day = startDate;
    while (day <= endDate) {
      const cells: JSX.Element[] = [];
      for (let i = 0; i < 7; i++) {
        cells.push(
          <DayCell
            key={day.toISOString()}
            day={day}
            monthStart={monthStart}
            mode={mode}
            selected={selected}
            range={range}
            onSelect={onSelect}
            isDisabled={isDisabled}
          />
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="drp-week" key={day.toISOString()}>
          {cells}
        </div>
      );
    }
    return rows;
  }, [startDate, endDate, monthStart, mode, selected, range, isDisabled, onSelect]);

  /* ───────────────── JSX ───────────────── */
  return (
    <div className="drp-container" role="application">
      <h2 className="drp-title">{title}</h2>

      {/* Inputs */}
      <div className="drp-inputs">
        {mode === "single" ? (
          <label className="drp-label" style={{ width: "100%" }}>
            Date:
            <input
              className="drp-input"
              readOnly
              value={selected ? format(selected, "yyyy-MM-dd") : ""}
            />
            {showTime && selected && (
              <input
                type="time"
                className="drp-time-input"
                value={format(selected, "HH:mm")}
                onChange={(e) => {
                  const next = applyTime(selected, e.target.value);
                  setSelected(next);
                  commitChange(next);
                }}
              />
            )}
          </label>
        ) : (
          <>
            <label className="drp-label">
              From:
              <input
                className="drp-input"
                readOnly
                value={range.from ? format(range.from, "yyyy-MM-dd") : ""}
              />
              {showTime && range.from && (
                <input
                  type="time"
                  className="drp-time-input"
                  value={format(range.from, "HH:mm")}
                  onChange={(e) => {
                    const nextFrom = applyTime(range.from!, e.target.value);
                    const next = { ...range, from: nextFrom };
                    setRange(next);
                    commitChange(next);
                  }}
                />
              )}
            </label>
            <label className="drp-label">
              To:
              <input
                className="drp-input"
                readOnly
                value={range.to ? format(range.to, "yyyy-MM-dd") : ""}
              />
              {showTime && range.to && (
                <input
                  type="time"
                  className="drp-time-input"
                  value={format(range.to, "HH:mm")}
                  onChange={(e) => {
                    const nextTo = applyTime(range.to!, e.target.value);
                    const next = { ...range, to: nextTo };
                    setRange(next);
                    commitChange(next);
                  }}
                />
              )}
            </label>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="drp-nav">
        <button className="drp-nav-btn" onClick={nav.prevYear}  aria-label="Previous year">&laquo;</button>
        <button className="drp-nav-btn" onClick={nav.prevMonth} aria-label="Previous month">&lsaquo;</button>
        <span   className="drp-nav-current">{format(viewDate, "MMMM yyyy")}</span>
        <button className="drp-nav-btn" onClick={nav.nextMonth} aria-label="Next month">&rsaquo;</button>
        <button className="drp-nav-btn" onClick={nav.nextYear}  aria-label="Next year">&raquo;</button>
      </div>

      {/* Weekday header */}
      <div className="drp-weekdays">
        {"Sun Mon Tue Wed Thu Fri Sat".split(" ").map((d) => (
          <div className="drp-weekday" key={d}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div role="grid" className="drp-days">
        {grid}
      </div>

      {/* Optional bottom button */}
      {actionLabel && (
        <button className="drp-action-btn">{actionLabel}</button>
      )}
    </div>
  );
};

export default DatePicker;
