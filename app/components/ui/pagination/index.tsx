"use client";
import React from "react";
import { twMerge } from "tailwind-merge";
export interface PaginationProps {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  onPageSelect: (page: number) => void;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  buttonClassName?: string;
}

const variantStyles: Record<
  NonNullable<PaginationProps["variant"]>,
  {
    base: string;
    active: string;
    disabled: string;
  }
> = {
  primary: {
    base: "border border-gray-300 hover:bg-blue-50",
    active: "bg-blue-600 text-white border-blue-600",
    disabled: "opacity-50 cursor-not-allowed",
  },
  secondary: {
    base: "border border-gray-200 bg-gray-100 hover:bg-gray-200",
    active: "bg-gray-700 text-white border-gray-700",
    disabled: "opacity-50 cursor-not-allowed",
  },
  outline: {
    base: "border border-gray-300 hover:bg-gray-100",
    active: "border-blue-600 text-blue-600",
    disabled: "opacity-40 cursor-not-allowed",
  },
};


const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const getVisiblePages = (
  current: number,
  total: number,
  delta = 2
): (number | "...")[] => {
  const range: (number | "...")[] = [];
  const start = Math.max(2, current - delta);
  const end = Math.min(total - 1, current + delta);

  if (start > 2) range.push("...");

  for (let i = start; i <= end; i++) range.push(i);

  if (end < total - 1) range.push("...");

  return [1, ...range, total].filter(
    (v, i, arr) => arr.indexOf(v) === i
  );
};


const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  currentPage,
  itemsPerPage,
  onPageSelect,
  variant = "primary",
  className,
  buttonClassName,
}) => {
  if (totalItems <= 0 || itemsPerPage <= 0) return null;

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const safePage = clamp(currentPage, 1, totalPages);

  if (totalPages <= 1) return null;

  const pages = getVisiblePages(safePage, totalPages);
  const styles = variantStyles[variant];

  const renderButton = (
    label: React.ReactNode,
    page: number,
    disabled = false,
    isActive = false
  ) => (
    <button
      key={String(label)}
      type="button"
      onClick={() => !disabled && onPageSelect(page)}
      disabled={disabled}
      aria-current={isActive ? "page" : undefined}
      className={twMerge(
        "min-w-9 rounded-md px-3 py-1.5 text-sm transition",
        styles.base,
        isActive && styles.active,
        disabled && styles.disabled,
        buttonClassName
      )}
    >
      {label}
    </button>
  );

  return (
    <nav
      className={twMerge(
        "flex items-center justify-center gap-1",
        className
      )}
      aria-label="Pagination"
    >
      
      {renderButton(
        "Prev",
        safePage - 1,
        safePage === 1
      )}

      {pages.map((page, idx) =>
        page === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            className="px-2 text-sm text-gray-400"
          >
            …
          </span>
        ) : (
          renderButton(
            page,
            page,
            false,
            page === safePage
          )
        )
      )}

    
      {renderButton(
        "Next",
        safePage + 1,
        safePage === totalPages
      )}
    </nav>
  );
};

export default Pagination;
