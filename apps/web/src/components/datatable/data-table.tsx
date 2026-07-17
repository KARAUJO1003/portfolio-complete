"use client";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { cn } from "@/lib/utils";

type DataTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  emptyLabel?: string;
  isLoading?: boolean;
};

export function DataTable<TData>({
  data,
  columns,
  emptyLabel = "Nenhum registro encontrado.",
  isLoading = false,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead className="bg-muted/70">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-3 py-2 text-left font-medium">
                  <button
                    className={cn(
                      "inline-flex items-center gap-2 text-left",
                      header.column.getCanSort() && "cursor-pointer hover:text-foreground",
                    )}
                    type="button"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === "asc" && <span className="text-xs text-muted-foreground">↑</span>}
                    {header.column.getIsSorted() === "desc" && <span className="text-xs text-muted-foreground">↓</span>}
                  </button>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, rowIndex) => (
              // eslint-disable-next-line react/no-array-index-key
              <tr key={rowIndex} className="border-t border-border">
                {columns.map((_column, columnIndex) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <td key={columnIndex} className="px-3 py-2 align-top">
                    <div className="h-4 w-full max-w-40 animate-pulse rounded bg-muted" />
                  </td>
                ))}
              </tr>
            ))
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t border-border transition-colors hover:bg-muted/30">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-2 align-top">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-3 py-8 text-center text-muted-foreground" colSpan={columns.length}>
                {emptyLabel}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
