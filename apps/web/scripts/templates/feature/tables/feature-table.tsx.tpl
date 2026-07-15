"use client";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import type { {{PASCAL}}Dto } from "../types/{{FEATURE}}";
const columns: ColumnDef<{{PASCAL}}Dto>[] = [
{{TABLE_COLUMNS}}
  { id:"actions", cell:({row,table}) => { const meta=table.options.meta as any; return <div className="flex gap-2"><Button variant="ghost" onClick={()=>meta.onEdit(row.original)}>Editar</Button><Button variant="ghost" onClick={()=>meta.onDelete(row.original.id)}>Excluir</Button></div>; } },
];
export function {{PASCAL}}Table({data,onEdit,onDelete}:{data:{{PASCAL}}Dto[];onEdit:(item:{{PASCAL}}Dto)=>void;onDelete:(id:string)=>void}) { const table=useReactTable({data,columns,getCoreRowModel:getCoreRowModel(),meta:{onEdit,onDelete}}); return <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead>{table.getHeaderGroups().map(group=><tr key={group.id}>{group.headers.map(header=><th className="border-b border-border p-3" key={header.id}>{flexRender(header.column.columnDef.header,header.getContext())}</th>)}</tr>)}</thead><tbody>{table.getRowModel().rows.map(row=><tr key={row.id}>{row.getVisibleCells().map(cell=><td className="border-b border-border p-3" key={cell.id}>{flexRender(cell.column.columnDef.cell,cell.getContext())}</td>)}</tr>)}</tbody></table></div>; }
