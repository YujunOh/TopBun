'use client';

import { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTranslations } from 'next-intl';
import { nanoid } from 'nanoid';

/* ── Ingredient definitions ─────────────────────────────────────────── */

interface IngredientDef {
  type: string;
  emoji: string;
  bg: string;
}

const INGREDIENTS: IngredientDef[] = [
  { type: 'bun-top', emoji: '\u{1F7E4}', bg: 'bg-amber-700' },
  { type: 'lettuce', emoji: '\u{1F96C}', bg: 'bg-green-500' },
  { type: 'tomato', emoji: '\u{1F345}', bg: 'bg-red-500' },
  { type: 'cheese', emoji: '\u{1F9C0}', bg: 'bg-yellow-400' },
  { type: 'beef-patty', emoji: '\u{1F969}', bg: 'bg-amber-800' },
  { type: 'chicken-patty', emoji: '\u{1F414}', bg: 'bg-orange-400' },
  { type: 'bacon', emoji: '\u{1F953}', bg: 'bg-red-700' },
  { type: 'onion', emoji: '\u{1F9C5}', bg: 'bg-purple-400' },
  { type: 'bun-bottom', emoji: '\u{1F7E4}', bg: 'bg-amber-700' },
];

const ingredientMap = new Map(INGREDIENTS.map((i) => [i.type, i]));

/* ── Stack item type ────────────────────────────────────────────────── */

interface StackItem {
  id: string;
  type: string;
}

/* ── Palette ingredient (draggable source) ──────────────────────────── */

function PaletteItem({ def, label }: { def: IngredientDef; label: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `palette-${def.type}`,
    data: { source: 'palette', ingredientType: def.type },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      data-testid={`ingredient-${def.type}`}
      className={`flex items-center gap-3 rounded-xl ${def.bg} px-4 py-3 cursor-grab active:cursor-grabbing select-none text-white font-medium shadow-md`}
    >
      <span className="text-2xl">{def.emoji}</span>
      <span className="text-sm">{label}</span>
    </div>
  );
}

/* ── Stack ingredient (sortable + removable) ────────────────────────── */

function StackIngredient({
  item,
  label,
  onRemove,
}: {
  item: StackItem;
  label: string;
  onRemove: (id: string) => void;
}) {
  const def = ingredientMap.get(item.type);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: { source: 'stack', ingredientType: item.type },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center gap-3 rounded-xl ${def?.bg ?? 'bg-gray-600'} px-4 py-3 cursor-grab active:cursor-grabbing select-none text-white font-medium shadow-md`}
    >
      <span className="text-2xl">{def?.emoji}</span>
      <span className="flex-1 text-sm">{label}</span>
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => onRemove(item.id)}
        className="ml-auto rounded-full bg-black/30 px-2 py-0.5 text-xs hover:bg-black/50 transition-colors"
        aria-label="Remove"
      >
        ✕
      </button>
    </div>
  );
}

/* ── Overlay item (shown while dragging) ────────────────────────────── */

function OverlayItem({ type, label }: { type: string; label: string }) {
  const def = ingredientMap.get(type);
  return (
    <div
      className={`flex items-center gap-3 rounded-xl ${def?.bg ?? 'bg-gray-600'} px-4 py-3 text-white font-medium shadow-xl ring-2 ring-white/30`}
    >
      <span className="text-2xl">{def?.emoji}</span>
      <span className="text-sm">{label}</span>
    </div>
  );
}

/* ── Main BurgerBuilder component ───────────────────────────────────── */

export function BurgerBuilder() {
  const t = useTranslations('builder');

  const [stack, setStack] = useState<StackItem[]>([]);
  const [burgerName, setBurgerName] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor),
  );

  const getIngredientLabel = useCallback(
    (type: string) => {
      return t(`ingredients.${type}` as Parameters<typeof t>[0]);
    },
    [t],
  );

  /* ── Drop zone for the stack ──────────────────────────────────────── */

  const { setNodeRef: setStackRef, isOver: isOverStack } = useDroppable({
    id: 'stack-droppable',
  });

  /* ── Drag handlers ────────────────────────────────────────────────── */

  function handleDragStart(event: DragStartEvent) {
    const id = event.active.id as string;
    setActiveId(id);
    const data = event.active.data.current;
    setActiveType(data?.ingredientType ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    setActiveType(null);

    if (!over) return;

    const activeData = active.data.current;
    const source = activeData?.source;

    if (source === 'palette') {
      // Dragged from palette → add to stack
      const ingredientType = activeData?.ingredientType;
      if (!ingredientType) return;

      // Accept drop on stack droppable or on any stack item
      const overId = over.id as string;
      const isStackTarget =
        overId === 'stack-droppable' || stack.some((s) => s.id === overId);

      if (isStackTarget) {
        const newItem: StackItem = {
          id: `stack-${ingredientType}-${nanoid(6)}`,
          type: ingredientType,
        };

        // If dropped on a specific stack item, insert near it
        const overIndex = stack.findIndex((s) => s.id === overId);
        if (overIndex >= 0) {
          setStack((prev) => {
            const copy = [...prev];
            copy.splice(overIndex + 1, 0, newItem);
            return copy;
          });
        } else {
          setStack((prev) => [...prev, newItem]);
        }
      }
    } else if (source === 'stack') {
      // Reorder within stack
      const overId = over.id as string;
      const activeIdx = stack.findIndex((s) => s.id === (active.id as string));
      const overIdx = stack.findIndex((s) => s.id === overId);

      if (activeIdx >= 0 && overIdx >= 0 && activeIdx !== overIdx) {
        setStack((prev) => arrayMove(prev, activeIdx, overIdx));
      }
    }
  }

  function handleRemove(id: string) {
    setStack((prev) => prev.filter((s) => s.id !== id));
  }

  function handleReset() {
    setStack([]);
    setBurgerName('');
  }

  function handleComplete() {
    // Placeholder: could save, share, etc.
    alert(
      burgerName
        ? `${burgerName}: ${stack.map((s) => getIngredientLabel(s.type)).join(' + ')}`
        : stack.map((s) => getIngredientLabel(s.type)).join(' + '),
    );
  }

  const paletteIds = INGREDIENTS.map((i) => `palette-${i.type}`);
  const stackIds = stack.map((s) => s.id);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
        {/* ── Ingredient Palette ──────────────────────────────────── */}
        <div data-testid="ingredient-palette">
          <h2 className="mb-4 text-lg font-bold text-text">{t('palette')}</h2>
          <SortableContext items={paletteIds} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-2">
              {INGREDIENTS.map((def) => (
                <PaletteItem
                  key={def.type}
                  def={def}
                  label={getIngredientLabel(def.type)}
                />
              ))}
            </div>
          </SortableContext>
        </div>

        {/* ── Burger Stack ────────────────────────────────────────── */}
        <div data-testid="burger-stack">
          <h2 className="mb-4 text-lg font-bold text-text">{t('stack')}</h2>

          <SortableContext items={stackIds} strategy={verticalListSortingStrategy}>
            <div
              ref={setStackRef}
              className={`flex min-h-[200px] flex-col gap-2 rounded-2xl border-2 border-dashed p-4 transition-colors ${
                isOverStack
                  ? 'border-primary bg-primary/10'
                  : 'border-white/20 bg-surface'
              }`}
            >
              {stack.length === 0 && (
                <p className="m-auto text-sm text-text-muted">
                  Drag ingredients here
                </p>
              )}
              {stack.map((item) => (
                <StackIngredient
                  key={item.id}
                  item={item}
                  label={getIngredientLabel(item.type)}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </SortableContext>

          {/* ── Controls ──────────────────────────────────────────── */}
          <div className="mt-6 flex flex-col gap-3">
            <input
              type="text"
              value={burgerName}
              onChange={(e) => setBurgerName(e.target.value)}
              placeholder={t('burgerName')}
              className="rounded-xl border border-white/20 bg-surface px-4 py-2 text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleComplete}
                disabled={stack.length === 0}
                className="flex-1 rounded-xl bg-primary px-6 py-2.5 font-semibold text-white transition-colors hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t('complete')}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-xl border border-white/20 px-6 py-2.5 font-semibold text-text transition-colors hover:bg-surface-light"
              >
                {t('reset')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Drag Overlay ──────────────────────────────────────────── */}
      <DragOverlay>
        {activeId && activeType ? (
          <OverlayItem type={activeType} label={getIngredientLabel(activeType)} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
