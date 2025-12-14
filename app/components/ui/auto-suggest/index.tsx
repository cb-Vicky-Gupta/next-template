"use client";

import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

/* ---------- Generic Option Type ---------- */
type OptionType = Record<string, any>;

/* ---------- Props ---------- */
interface AutoSuggestProps<T extends OptionType> {
  options: T[];
  labelKey?: keyof T;
  valueKey?: keyof T;
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onSelect?: (value: T[keyof T], label: string) => void;
  disabled?: boolean;
  className?: string;
  containerClass?: string;
  style?: React.CSSProperties;
  required?: boolean;
  showLoader?: boolean;
  filterDelay?: number;
}

/* ---------- Component ---------- */
function AutoSuggest<T extends OptionType>({
  options,
  labelKey = "label" as keyof T,
  valueKey = "value" as keyof T,
  value = "",
  placeholder = "Search...",
  onChange,
  onSelect,
  disabled = false,
  className,
  containerClass,
  style,
  required = false,
  showLoader = false,
  filterDelay = 300,
}: AutoSuggestProps<T>) {
  const [inputValue, setInputValue] = useState(value);
  const [filtered, setFiltered] = useState<T[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /* ---------- Sync Controlled Value ---------- */
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  /* ---------- Handle Input Change ---------- */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setInputValue(newVal);
    onChange?.(newVal);

    if (timerRef.current) clearTimeout(timerRef.current);

    if (!newVal.trim()) {
      setFiltered([]);
      setShowSuggestions(false);
      setLoading(false);
      return;
    }

    if (showLoader) setLoading(true);

    timerRef.current = setTimeout(() => {
      const result = options.filter((opt) =>
        String(opt[labelKey])
          .toLowerCase()
          .includes(newVal.toLowerCase())
      );

      setFiltered(result);
      setShowSuggestions(true);
      setLoading(false);
    }, filterDelay);
  };

  /* ---------- Handle Select ---------- */
  const handleSelect = (option: T) => {
    const label = String(option[labelKey]);
    setInputValue(label);
    setShowSuggestions(false);
    onSelect?.(option[valueKey], label);
  };

  /* ---------- Click Outside ---------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      style={style}
      className={twMerge("relative w-full", containerClass)}
    >
      <input
        type="text"
        value={inputValue}
        placeholder={placeholder}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        disabled={disabled}
        required={required}
        className={twMerge(
          "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100",
          className
        )}
      />

      {/* Loader */}
      {showLoader && loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
        </div>
      )}

      {/* Suggestions */}
      {showSuggestions && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {filtered.map((opt, idx) => (
            <button
              key={`${idx}-autosuggest`}
              type="button"
              onClick={() => handleSelect(opt)}
              className="block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-blue-50"
            >
              {String(opt[labelKey])}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default AutoSuggest;
