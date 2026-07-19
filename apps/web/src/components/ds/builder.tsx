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
import { GripVertical, InboxIcon } from "lucide-react";
import { useId } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@/components/ui/select";
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

/**
 * Chrome de "janela de navegador" para deixar claro que o preview e uma
 * simulacao do site publico. Pontos em escala de cinza (nao vermelho/amarelo/
 * verde de macOS) para seguir o principio de monocromia do admin.
 * Ver docs/admin-visual-references.md, secao Portfolio Builder.
 */
export function BuilderBrowserBar({ className, url, ...props }: React.HTMLAttributes<HTMLDivElement> & { url: string }) {
  return (
    <div
      className={cn("flex items-center gap-2.5 border-b border-border bg-surface-raised px-3 py-2", className)}
      {...props}
    >
      <div className="flex shrink-0 gap-1.5">
        <span className="size-1.5 rounded-full bg-border" />
        <span className="size-1.5 rounded-full bg-border" />
        <span className="size-1.5 rounded-full bg-border" />
      </div>
      <div className="min-w-0 flex-1 truncate rounded-md bg-background px-2.5 py-1 text-center font-mono text-[11px] text-muted-foreground">
        {url}
      </div>
    </div>
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

type BuilderVersionSummary = { id: string; name: string; status: string };

/**
 * Junta o Select de versao + botao "Nova" + o indicador de qual versao esta
 * ao vivo no site publico num unico componente. Antes disso era so um Badge
 * solto que refletia o status da versao CARREGADA (nao necessariamente a
 * publicada) - facil de confundir "o que estou editando" com "o que esta no
 * ar". Ver docs/admin-redesign-tasks.md, Fase 7.
 */
export function BuilderVersionSwitcher({
  currentVersion,
  liveVersion,
  onNew,
  onSelect,
  versions,
}: {
  currentVersion?: BuilderVersionSummary | null;
  liveVersion?: BuilderVersionSummary | null;
  onNew: () => void;
  onSelect: (id: string) => void;
  versions: BuilderVersionSummary[];
}) {
  const isNew = !currentVersion;
  const isEditingLive = Boolean(currentVersion && liveVersion && currentVersion.id === liveVersion.id);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">Versao</span>
        {liveVersion ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
            Ao vivo: {liveVersion.name}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">Nada publicado ainda</span>
        )}
      </div>
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <Select value={currentVersion?.id ?? ""} onValueChange={(next) => onSelect(next ?? "")}>
          <SelectTrigger>
            <SelectValue>{() => (currentVersion ? `${currentVersion.name} (${currentVersion.status})` : "Nova versao")}</SelectValue>
          </SelectTrigger>
          <SelectPopup>
            <SelectItem value="">Nova versao</SelectItem>
            {versions.map((version) => (
              <SelectItem key={version.id} value={version.id}>
                {version.name} ({version.status})
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
        <Button type="button" variant="ghost" onClick={onNew}>
          Nova
        </Button>
      </div>
      {isNew ? (
        <p className="text-xs leading-5 text-muted-foreground">Uma versao nova sera criada ao salvar.</p>
      ) : !isEditingLive && liveVersion ? (
        <p className="rounded-md border border-warning/30 bg-warning/10 px-2.5 py-1.5 text-xs leading-5 text-warning">
          Voce esta editando um rascunho - o site publico ainda mostra &quot;{liveVersion.name}&quot;.
        </p>
      ) : isEditingLive ? (
        <p className="text-xs leading-5 text-muted-foreground">Esta e a versao publicada atualmente.</p>
      ) : null}
    </div>
  );
}

/** Estado vazio para os previews dos builders quando nao ha nenhum conteudo cadastrado ainda. */
export function BuilderEmptyState({ description, title }: { description: string; title: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="grid size-11 place-items-center rounded-full border border-border bg-surface-muted text-muted-foreground">
        <InboxIcon className="size-5" />
      </div>
      <div className="max-w-xs">
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
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
