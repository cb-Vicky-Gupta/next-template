"use client";

import React from "react";
import { twMerge } from "tailwind-merge";

export interface TabItem {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  value?: string; 
  defaultValue?: string; 
  onChange?: (value: string) => void;

  variant?: "underline" | "pill" | "solid" | "ghost";

  className?: string;
  tabClassName?: string;
}

const variantStyles = {
  underline: {
    wrapper: "border-b border-gray-200",
    tab: "px-4 py-2 text-sm text-gray-500 hover:text-gray-900",
    active:
      "text-indigo-600 border-b-2 border-indigo-600 font-medium",
  },
  pill: {
    wrapper: "bg-gray-100 p-1 rounded-full",
    tab: "px-4 py-1.5 text-sm rounded-full text-gray-600 hover:text-gray-900",
    active: "bg-white text-indigo-600 shadow font-medium",
  },
  solid: {
    wrapper: "bg-gray-100 rounded-lg",
    tab: "px-4 py-2 text-sm text-gray-600 hover:bg-gray-200",
    active: "bg-indigo-600 text-white font-medium",
  },
  ghost: {
    wrapper: "",
    tab: "px-4 py-2 text-sm text-gray-500 hover:text-gray-900",
    active: "text-indigo-600 font-semibold",
  },
};

const Tabs: React.FC<TabsProps> = ({
  tabs,
  value,
  defaultValue,
  onChange,
  variant = "underline",
  className,
  tabClassName,
}) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(
    defaultValue ?? tabs[0]?.value
  );

  const activeValue = isControlled ? value : internalValue;

  const handleClick = (val: string) => {
    if (!isControlled) setInternalValue(val);
    onChange?.(val);
  };

  const styles = variantStyles[variant];

  return (
    <div
      className={twMerge(
        "flex items-center gap-1",
        styles.wrapper,
        className
      )}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.value === activeValue;

        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            onClick={() => handleClick(tab.value)}
            className={twMerge(
              "transition focus:outline-none",
              styles.tab,
              isActive && styles.active,
              tab.disabled && "opacity-40 cursor-not-allowed",
              tabClassName
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
