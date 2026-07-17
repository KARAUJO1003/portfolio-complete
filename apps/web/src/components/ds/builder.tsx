"use client";

import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useId } from "react";
import { cn } from "@/lib/utils";

export function BuilderLayout({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]", className)} {...props} />;
}

export function BuilderPanel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col gap-4 rounded-lg border border-border bg-card p-5", className)}
      {...props}
    />
  );
}

export function BuilderPreview({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("min-h-[620px] rounded-lg border border-border bg-card p-6", className)}
      {...props}
    />
  );
}

export function BuilderItem({ className, ...props }: React.HTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-md border border-border bg-background p-3 text-sm",
        className,
      )}
      {...props}
    />
  );
}

export function BuilderItemContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex min-w-0 flex-1 flex-col gap-1", className)} {...props} />;
}

export function BuilderItemTitle({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("font-medium", className)} {...props} />;
}

export function BuilderItemDescription({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("text-xs leading-5 text-muted-foreground", className)} {...props} />;
}

export function BuilderItemOptions({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-2 grid max-h-40 gap-2 overflow-y-auto border-t border-border pt-2", className)}
      {...props}
    />
  );
}

export function BuilderStatus({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-xs leading-5 text-muted-foreground", className)} {...props} />;
}

export function BuilderSortableList<T extends { id: string }>({
  items,
  onReorder,
  renderItem,
}: {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (item: T) => React.ReactNode;
}) {
  const dndId = useId();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    onReorder(arrayMove(items, oldIndex, newIndex));
  }

  return (
    <DndContext collisionDetection={closestCenter} id={dndId} sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <BuilderSortableRow key={item.id} id={item.id}>
              {renderItem(item)}
            </BuilderSortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

type BuilderSectionOption = { id: string; label: string };

export function BuilderSectionItemsPicker({
  items,
  section,
  onToggleAll,
  onToggleItem,
  onReorder,
}: {
  items: BuilderSectionOption[];
  section: { selectionMode: "all" | "selected"; itemIds: string[] };
  onToggleAll: () => void;
  onToggleItem: (id: string) => void;
  onReorder: (orderedIds: string[]) => void;
}) {
  const selectedItems = section.itemIds
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is BuilderSectionOption => Boolean(item));

  return (
    <BuilderItemOptions>
      <label className="flex items-center gap-2 text-xs font-medium">
        <input checked={section.selectionMode === "all"} type="checkbox" onChange={onToggleAll} />
        Usar todos os itens visiveis
      </label>
      {section.selectionMode === "selected" && (
        <>
          {items.map((option) => (
            <label key={option.id} className="flex items-center gap-2 text-xs text-muted-foreground">
              <input
                checked={section.itemIds.includes(option.id)}
                type="checkbox"
                onChange={() => onToggleItem(option.id)}
              />
              {option.label}
            </label>
          ))}
          {selectedItems.length > 1 && (
            <div className="mt-2 border-t border-border pt-2">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Ordem de exibicao
              </p>
              <BuilderSortableList
                items={selectedItems}
                renderItem={(item) => (
                  <div className="rounded-md border border-border bg-background px-3 py-2 text-xs">
                    {item.label}
                  </div>
                )}
                onReorder={(reordered) => onReorder(reordered.map((item) => item.id))}
              />
            </div>
          )}
        </>
      )}
    </BuilderItemOptions>
  );
}

function BuilderSortableRow({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 };

  return (
    <div ref={setNodeRef} className="relative" style={style}>
      <button
        aria-label="Arrastar para reordenar"
        className="absolute left-2 top-3 z-10 cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
        type="button"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>
      <div className="pl-7">{children}</div>
    </div>
  );
}
