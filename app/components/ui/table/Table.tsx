"use client";

import  { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import Pagination from "@/app/components/ui/pagination";

/* ---------- Types ---------- */

export interface TableColumn<T> {
  label: string;
  field: keyof T;
  width?: string;
  sortable?: boolean;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];

  pagination?: boolean;
  totalItems?: number;
  currentPage?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;

  enableColumnSelect?: boolean;
  className?: string;
}

/* ---------- Component ---------- */

function Table<T extends Record<string, any>>({
  columns,
  rows,
  pagination = false,
  totalItems = 0,
  currentPage = 1,
  itemsPerPage = 10,
  onPageChange,
  enableColumnSelect = false,
  className,
}: TableProps<T>) {
  /* ---------- Column Selection ---------- */
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.map((c) => String(c.field))
  );

  const allSelected = visibleColumns.length === columns.length;

  const toggleAllColumns = () => {
    setVisibleColumns(allSelected ? [] : columns.map((c) => String(c.field)));
  };

  const toggleColumn = (field: string) => {
    setVisibleColumns((prev) =>
      prev.includes(field)
        ? prev.filter((f) => f !== field)
        : [...prev, field]
    );
  };

  const filteredColumns = useMemo(
    () => columns.filter((c) => visibleColumns.includes(String(c.field))),
    [columns, visibleColumns]
  );

  /* ---------- Render ---------- */

  return (
    <div className="w-full">
      {/* Column Selector */}
      {enableColumnSelect && (
        <div className="mb-3 flex flex-wrap items-center gap-4 text-sm">
          <label className="flex items-center gap-2 font-medium">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAllColumns}
            />
            Select All
          </label>

          {columns.map((col) => (
            <label key={String(col.field)} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={visibleColumns.includes(String(col.field))}
                onChange={() => toggleColumn(String(col.field))}
              />
              {col.label}
            </label>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table
          className={twMerge(
            "min-w-full border border-gray-200 text-sm",
            className
          )}
        >
          <thead className="bg-gray-100">
            <tr>
              {filteredColumns.map((col) => (
                <th
                  key={String(col.field)}
                  className="px-4 py-2 text-left font-semibold border-b"
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={filteredColumns.length}
                  className="px-4 py-6 text-center text-gray-500"
                >
                  No data found
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr
                  key={i}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {filteredColumns.map((col) => (
                    <td
                      key={String(col.field)}
                      className="px-4 py-2"
                      style={{ width: col.width }}
                    >
                      {String(row[col.field] ?? "-")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalItems > 0 && onPageChange && (
        <div className="mt-4 flex justify-end">
          <Pagination
            totalItems={totalItems}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageSelect={onPageChange}
            variant="outline"
          />
        </div>
      )}
    </div>
  );
}

export default Table;
