"use client";

import type React from "react";
import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import styles from "./MultiSelectCombobox.module.css";
import { Tooltip } from "@radix-ui/themes";

export type Option = {
  value: string;
  label: string;
};

interface MultiSelectComboboxProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  maxDisplayItems?: number;
  className?: string;
  disabled?: boolean;
}

export const MultiSelectCombobox: React.FC<MultiSelectComboboxProps> = ({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  maxDisplayItems = 1,
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const comboboxRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter and sort options based on search query and selection
  const filteredOptions = options
    .filter((option) => option.label.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const aSelected = selected.includes(a.value);
      const bSelected = selected.includes(b.value);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const removeItem = (value: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    onChange(selected.filter((item) => item !== value));
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Backspace" && searchQuery === "" && selected.length > 0) {
      removeItem(selected[selected.length - 1]);
    }
  };

  // Get display text for the combobox
  const getDisplayContent = () => {
    if (selected.length === 0) {
      return <span className={styles.placeholder}>{placeholder}</span>;
    }

    // Show individual pill only when exactly one item is selected
    if (selected.length === 1) {
      const value = selected[0];
      const option = options.find((opt) => opt.value === value);
      return (
        <div className={styles.selectedItems}>
          <span className={styles.selectedPill}>
            {option?.label || value}
            <button
              type="button"
              className={styles.removeButton}
              onClick={(e) => removeItem(value, e)}
              aria-label={`Remove ${option?.label || value}`}
            >
              ×
            </button>
          </span>
        </div>
      );
    }

    // Show count for all other cases
    return <span className={styles.selectedCount}>{selected.length} items selected</span>;
  };

  const OptionItem = ({
    option,
    isSelected,
    onSelect,
  }: {
    option: Option;
    isSelected: boolean;
    onSelect: () => void;
  }) => {
    const labelRef = useRef<HTMLSpanElement>(null);
    const [isTruncated, setIsTruncated] = useState(false);

    useEffect(() => {
      const checkTruncation = () => {
        if (labelRef.current) {
          const { scrollWidth, clientWidth } = labelRef.current;
          setIsTruncated(scrollWidth > clientWidth);
        }
      };

      checkTruncation();
      // Add resize observer to check truncation on window resize
      const resizeObserver = new ResizeObserver(checkTruncation);
      if (labelRef.current) {
        resizeObserver.observe(labelRef.current);
      }

      return () => resizeObserver.disconnect();
    }, [option.label]);

    const content = (
      <div
        className={`${styles.optionItem} ${isSelected ? styles.selected : ""}`}
        onClick={onSelect}
        role="option"
        aria-selected={isSelected}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {}}
          className={styles.checkbox}
          tabIndex={-1}
        />
        <span ref={labelRef} className={styles.optionLabel}>
          {option.label}
        </span>
      </div>
    );

    return isTruncated ? <Tooltip content={option.label}>{content}</Tooltip> : content;
  };

  return (
    <div
      ref={comboboxRef}
      className={`${styles.multiselectCombobox} ${className} ${disabled ? styles.disabled : ""}`}
    >
      <div
        className={`${styles.comboboxControl} ${isOpen ? styles.open : ""}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-disabled={disabled}
      >
        {getDisplayContent()}
        <div className={styles.controlButtons}>
          {selected.length > 0 && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={clearAll}
              aria-label="Clear all selections"
              title="Clear all selections"
            >
              ×
            </button>
          )}
          <span className={styles.dropdownArrow}>{isOpen ? "▲" : "▼"}</span>
        </div>
      </div>

      {isOpen && !disabled && (
        <div className={styles.dropdownContainer}>
          <div className={styles.searchContainer}>
            <input
              ref={searchInputRef}
              type="text"
              className={styles.searchInput}
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <ul className={styles.optionsList} role="listbox" aria-multiselectable="true">
            {filteredOptions.length === 0 ? (
              <li className={styles.noResults}>No results found</li>
            ) : (
              filteredOptions.map((option) => (
                <OptionItem
                  key={option.value}
                  option={option}
                  isSelected={selected.includes(option.value)}
                  onSelect={() => toggleOption(option.value)}
                />
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
