import React, { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import DatePicker, { DateValue } from "./DatePicker";
import "./SimpleDatePicker.scss";

export interface SimpleDatePickerProps {
  selected?: Date | null;
  onChange: (date: Date | null) => void;
  placeholderText?: string;
  minDate?: Date;
  maxDate?: Date;
  showTimeSelect?: boolean;
  dateFormat?: string;
  timeFormat?: string;
  className?: string;
}

const SimpleDatePicker: React.FC<SimpleDatePickerProps> = ({
  selected,
  onChange,
  placeholderText = "Select date",
  minDate,
  maxDate,
  showTimeSelect = false,
  dateFormat = "yyyy-MM-dd",
  timeFormat = "HH:mm",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateChange = (value: DateValue) => {
    // Since we're using "single" mode, value should be a Date
    if (value instanceof Date) {
      onChange(value);
    } else {
      onChange(null);
    }
    setIsOpen(false);
  };

  const formatDisplayValue = () => {
    if (!selected) return "";

    try {
      // Handle time display
      if (showTimeSelect) {
        const dateOnly = format(selected, dateFormat);
        const timeOnly = format(selected, timeFormat);
        return `${dateOnly} ${timeOnly}`;
      }
      return format(selected, dateFormat);
    } catch (error) {
      console.warn("Date formatting error:", error);
      return selected.toLocaleDateString();
    }
  };

  return (
    <div className={`simple-date-picker ${className}`} ref={containerRef}>
      <input
        type="text"
        value={formatDisplayValue()}
        placeholder={placeholderText}
        onClick={() => setIsOpen(!isOpen)}
        readOnly
        className="simple-date-picker__input"
      />

      {isOpen && (
        <div className="simple-date-picker__dropdown">
          <DatePicker
            mode="single"
            value={selected || undefined}
            onChange={handleDateChange}
            minDate={minDate}
            maxDate={maxDate}
            showTime={showTimeSelect}
            title="Select Date"
            closeOnSelect={true}
          />
        </div>
      )}
    </div>
  );
};

export default SimpleDatePicker;
