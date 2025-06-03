// EditableTable.tsx
// A highly reusable, generic TanStack Table wrapper in TypeScript with optional in-cell “±” controls
// ----------------------------------------------------------------------------------------------
// Usage example (put this wherever you need the table):
//
// import EditableTable, { EditedColumnOption } from "./EditableTable";
//
// const columns: ColumnDef<GameRow, any>[] = [
//   { header: "#", id: "rowNo", cell: info => info.row.index + 1, size: 40 },
//   { header: "Game", accessorKey: "game", size: 80 },
//   { header: "Name", accessorKey: "name", size: 220 },
//   { header: "Price", accessorKey: "price", size: 80, cell: info => info.getValue<number>().toLocaleString() },
//   { header: "Quantity", accessorKey: "quantity", size: 120 },
//   { header: "Amount", id: "amount", size: 100, cell: info => (info.row.original.price * info.row.original.quantity).toLocaleString() },
// ];
//
// const editable: EditedColumnOption<GameRow>[] = [{ key: "quantity", step: 1, min: 0 }];
//
// <EditableTable data={data} columns={columns} editableColumns={editable} onDataChange={setData} />
// ----------------------------------------------------------------------------------------------

import React, { useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import "./EditableTable.scss";

// ---------------------------------------------
// Types
// ---------------------------------------------
export type EditedColumnOption<T extends object> = {
  key: keyof T & string; // which field is editable
  step?: number; // increment/decrement, default 1
  min?: number; // floor value, default 0
  max?: number; // optional ceiling
};

export interface EditableTableProps<T extends Record<string, any>> {
  /** Static column definition – follows TanStack’s ColumnDef API */
  columns: ColumnDef<T, any>[];
  /** Initial/controlled data */
  data: T[];
  /** Array of editable column configs */
  editableColumns?: EditedColumnOption<T>[];
  /** Called whenever the internal data changes */
  onDataChange?: (rows: T[]) => void;
  /** Optional predicate to highlight rows (default: any editable column > its min) */
  highlightWhen?: (row: T) => boolean;
}

// ---------------------------------------------
// Component
// ---------------------------------------------
function EditableTable<T extends Record<string, any>>({
  columns,
  data,
  editableColumns = [],
  onDataChange,
  highlightWhen,
}: EditableTableProps<T>) {
  // Local mirror so we can mutate quantities etc. without forcing parent to be controlled
  const [localRows, setLocalRows] = useState<T[]>(() => [...data]);

  // Push data upstream whenever it changes
  useEffect(() => {
    onDataChange?.(localRows);
  }, [localRows, onDataChange]);

  // Map editable keys to config for quick lookup
  const editableMap = useMemo(() => {
    const map = new Map<string, EditedColumnOption<T>>();
    editableColumns.forEach((opt) => map.set(opt.key, opt));
    return map;
  }, [editableColumns]);

  // Helper: mutate value by delta for a specific row + field
  const updateField = (rowIdx: number, key: string, delta: number) => {
    setLocalRows((prev) =>
      prev.map((row, idx) => {
        if (idx !== rowIdx) return row;

        const opt = editableMap.get(key)!;
        const current = (row as any)[key] as number;
        const next = Math.max(opt.min ?? 0, Math.min(opt.max ?? Infinity, current + delta));
        return { ...row, [key]: next };
      })
    );
  };

  // Build the column defs, injecting plus/minus renderers where needed
  const columnsWithEditors = useMemo<ColumnDef<T, any>[]>(() => {
    return columns.map((col) => {
      if (!col.id && typeof col.accessorKey !== "string") return col; // skip non-string accessor keys

      const key = (col.id ?? col.accessorKey) as string;
      if (!editableMap.has(key)) return col;

      const opt = editableMap.get(key)!;

      return {
        ...col,
        cell: (info: any) => {
          const rowIdx = info.row.index;
          const value = info.getValue<number>();
          return (
            <div className="qty-wrapper">
              <button
                className="qty-btn"
                onClick={() => updateField(rowIdx, key, -(opt.step ?? 1))}
                disabled={value <= (opt.min ?? 0)}
                aria-label={`Decrease ${key}`}
              >
                &minus;
              </button>
              <span className="qty-value">{value}</span>
              <button
                className="qty-btn"
                onClick={() => updateField(rowIdx, key, opt.step ?? 1)}
                disabled={value >= (opt.max ?? Infinity)}
                aria-label={`Increase ${key}`}
              >
                &#43;
              </button>
            </div>
          );
        },
      } as ColumnDef<T, any>;
    });
  }, [columns, editableMap]);

  // Fallback highlight predicate: at least one editable column value > min
  const safeHighlight = highlightWhen ?? ((row: T) => {
    return editableColumns.some(({ key, min = 0 }) => (row as any)[key] > min);
  });

  // Table instance
  const table = useReactTable<T>({
    data: localRows,
    columns: columnsWithEditors,
    getCoreRowModel: getCoreRowModel(),
  });

  // Render
  return (
    <div className="table-wrapper">
      <table className="editable-table">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id} style={{ width: header.getSize() }}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className={safeHighlight(row.original) ? "selected" : undefined}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EditableTable;