import React, { useState, useRef, useEffect } from "react";
import styles from "./Dropdown.module.scss";

export interface DropdownOption {
  value: string;
  label: string;
  icon?: string;
  description?: string;
}

export interface DropdownProps {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  size?: "small" | "medium" | "large";
}

const Dropdown: React.FC<DropdownProps> = ({
  value,
  options,
  onChange,
  label,
  placeholder = "Select an option...",
  disabled = false,
  className,
  size = "medium",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Find the selected option
  const selectedOption = options.find((option) => option.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setFocusedIndex((prev) => (prev + 1) % options.length);
          break;
        case "ArrowUp":
          event.preventDefault();
          setFocusedIndex((prev) =>
            prev <= 0 ? options.length - 1 : prev - 1
          );
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          if (focusedIndex >= 0) {
            handleSelect(options[focusedIndex].value);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setFocusedIndex(-1);
          triggerRef.current?.focus();
          break;
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, focusedIndex, options]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setFocusedIndex(-1);
    triggerRef.current?.focus();
  };

  const toggleOpen = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        // Focus the current selection when opening
        const currentIndex = options.findIndex(
          (option) => option.value === value
        );
        setFocusedIndex(currentIndex >= 0 ? currentIndex : 0);
      }
    }
  };

  return (
    <div
      className={`${styles.dropdownContainer} ${className || ""}`}
      ref={dropdownRef}
      data-size={size}
    >
      {label && <label className={styles.label}>{label}</label>}

      <div className={styles.dropdown} data-disabled={disabled}>
        <button
          ref={triggerRef}
          type="button"
          className={`${styles.trigger} ${isOpen ? styles.open : ""}`}
          onClick={toggleOpen}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={label ? undefined : "dropdown-trigger"}
        >
          <div className={styles.selectedContent}>
            {selectedOption ? (
              <>
                {selectedOption.icon && (
                  <span className={styles.icon}>{selectedOption.icon}</span>
                )}
                <span className={styles.text}>{selectedOption.label}</span>
              </>
            ) : (
              <span className={styles.placeholder}>{placeholder}</span>
            )}
          </div>

          <svg
            className={styles.chevron}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isOpen && (
          <div className={styles.menu} role="listbox">
            {options.map((option, index) => (
              <div
                key={option.value}
                className={`${styles.option} ${
                  option.value === value ? styles.selected : ""
                } ${index === focusedIndex ? styles.focused : ""}`}
                role="option"
                aria-selected={option.value === value}
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setFocusedIndex(index)}
              >
                {option.icon && (
                  <span className={styles.optionIcon}>{option.icon}</span>
                )}
                <div className={styles.optionContent}>
                  <span className={styles.optionLabel}>{option.label}</span>
                  {option.description && (
                    <span className={styles.optionDescription}>
                      {option.description}
                    </span>
                  )}
                </div>
                {option.value === value && (
                  <svg
                    className={styles.checkIcon}
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M13.5 4.5L6 12L2.5 8.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
