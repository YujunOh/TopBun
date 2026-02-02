'use client';

import { useState, useCallback, useRef } from 'react';
import type { ReactElement } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  pointerWithin,
  rectIntersection,
  MeasuringStrategy,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type CollisionDetection,
  type DragStartEvent,
  type DragMoveEvent,
  type DragOverEvent,
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
import { useRouter } from '@/i18n/navigation';
import { X } from 'lucide-react';
import { nanoid } from 'nanoid';

/* ── Ingredient definitions ─────────────────────────────────────────── */

interface IngredientDef {
  type: string;
  bg: string;
}

const BUNS: IngredientDef[] = [
  { type: 'bun-top', bg: 'bg-gradient-to-b from-amber-300 to-amber-700' },
  { type: 'bun-bottom', bg: 'bg-gradient-to-b from-amber-400 to-amber-800' },
];

const VEGGIES: IngredientDef[] = [
  { type: 'lettuce', bg: 'bg-gradient-to-b from-green-300 to-green-600' },
  { type: 'tomato', bg: 'bg-gradient-to-b from-red-300 to-red-600' },
  { type: 'onion', bg: 'bg-gradient-to-b from-purple-300 to-purple-600' },
  { type: 'pickle', bg: 'bg-gradient-to-b from-lime-300 to-emerald-600' },
];

const CHEESE: IngredientDef[] = [
  { type: 'cheese', bg: 'bg-gradient-to-b from-yellow-300 to-yellow-500' },
];

const PATTIES: IngredientDef[] = [
  { type: 'smashed-patty', bg: 'bg-gradient-to-b from-amber-700 to-amber-950' },
  { type: 'grilled-patty', bg: 'bg-gradient-to-b from-stone-600 to-stone-900' },
  { type: 'chicken-patty', bg: 'bg-gradient-to-b from-orange-300 to-orange-600' },
  { type: 'veggie-patty', bg: 'bg-gradient-to-b from-green-500 to-green-800' },
];

const EXTRAS: IngredientDef[] = [
  { type: 'bacon', bg: 'bg-gradient-to-b from-rose-500 to-rose-800' },
  { type: 'egg', bg: 'bg-gradient-to-b from-yellow-200 to-yellow-500' },
];

const SAUCES: IngredientDef[] = [
  { type: 'ketchup', bg: 'bg-gradient-to-b from-red-400 to-red-700' },
  { type: 'mayo', bg: 'bg-gradient-to-b from-stone-100 to-stone-300' },
  { type: 'mustard', bg: 'bg-gradient-to-b from-yellow-400 to-yellow-700' },
  { type: 'bbq', bg: 'bg-gradient-to-b from-amber-700 to-amber-950' },
  { type: 'spicy-mayo', bg: 'bg-gradient-to-b from-orange-400 to-orange-700' },
  { type: 'garlic-sauce', bg: 'bg-gradient-to-b from-stone-200 to-stone-400' },
];

const INGREDIENTS: IngredientDef[] = [
  ...BUNS,
  ...VEGGIES,
  ...CHEESE,
  ...PATTIES,
  ...EXTRAS,
  ...SAUCES,
];

const ingredientMap = new Map(INGREDIENTS.map((i) => [i.type, i]));

/* ── Stack item type ────────────────────────────────────────────────── */

interface StackItem {
  id: string;
  type: string;
}

type InsertMarker = {
  id: string | null;
  position: 'before' | 'after' | 'end';
} | null;

/* ── Palette ingredient (draggable source) ──────────────────────────── */

function PaletteItem({ def, label }: { def: IngredientDef; label: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `palette-${def.type}`,
    data: { source: 'palette', ingredientType: def.type },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    touchAction: 'none',
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      data-testid={`ingredient-${def.type}`}
      className={`flex items-center gap-3 rounded-xl ${def.bg} px-4 py-3 cursor-grab active:cursor-grabbing select-none text-white font-medium shadow-md transition-transform`}
    >
      <span className={`h-6 w-10 rounded-full shadow-inner ${def.bg}`} />
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
    touchAction: 'none',
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      data-stack-id={item.id}
      className={`flex items-center gap-3 rounded-xl ${def?.bg ?? 'bg-gray-600'} px-4 py-3 cursor-grab active:cursor-grabbing select-none text-white font-medium shadow-md transition-transform`}
    >
      <span className={`h-5 w-8 rounded-full shadow-inner ${def?.bg ?? 'bg-gray-600'}`} />
      <span className="flex-1 text-sm">{label}</span>
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => onRemove(item.id)}
        className="ml-auto rounded-full bg-black/30 p-1 hover:bg-black/50 transition-colors"
        aria-label="Remove"
      >
        <X size={12} className="text-white" />
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
      <span className={`h-6 w-10 rounded-full shadow-inner ${def?.bg ?? 'bg-gray-600'}`} />
      <span className="text-sm">{label}</span>
    </div>
  );
}

/* ── Main BurgerBuilder component ───────────────────────────────────── */

export function BurgerBuilder() {
  const t = useTranslations('builder');
  const router = useRouter();

  const [stack, setStack] = useState<StackItem[]>([]);
  const [burgerName, setBurgerName] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [manualOverStack, setManualOverStack] = useState(false);
  const [insertMarker, setInsertMarker] = useState<InsertMarker>(null);
  const [saucesOpen, setSaucesOpen] = useState(true);
  const stackRef = useRef<HTMLDivElement | null>(null);

  const SUMMARY_KEY = 'topbun-builder-summary';

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 0, tolerance: 5 } }),
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
    data: { type: 'stack' },
  });

  const setStackNodeRef = (node: HTMLDivElement | null) => {
    setStackRef(node);
    stackRef.current = node;
  };

  const isRectOverStack = (rect: DOMRect | { left: number; right: number; top: number; bottom: number }) => {
    if (!stackRef.current) return false;
    const stackRect = stackRef.current.getBoundingClientRect();
    return !(
      rect.right < stackRect.left ||
      rect.left > stackRect.right ||
      rect.bottom < stackRect.top ||
      rect.top > stackRect.bottom
    );
  };

  const updateInsertMarker = (next: InsertMarker) => {
    setInsertMarker((prev) => {
      if (!prev && !next) return prev;
      if (prev && next && prev.id === next.id && prev.position === next.position) return prev;
      return next;
    });
  };

  const computeInsertMarker = (rect: DOMRect | { top: number; bottom: number }) => {
    if (!stackRef.current) return null;
    const items = Array.from(
      stackRef.current.querySelectorAll<HTMLElement>('[data-stack-id]'),
    );

    if (items.length === 0) {
      return { id: null, position: 'end' } as const;
    }

    const activeCenter = rect.top + (rect.bottom - rect.top) / 2;
    let closestId: string | null = null;
    let closestDistance = Infinity;
    let position: 'before' | 'after' = 'after';

    for (const item of items) {
      const id = item.dataset.stackId ?? null;
      if (!id) continue;
      const itemRect = item.getBoundingClientRect();
      const itemCenter = itemRect.top + itemRect.height / 2;
      const distance = Math.abs(activeCenter - itemCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestId = id;
        position = activeCenter < itemCenter ? 'before' : 'after';
      }
    }

    if (!closestId) return { id: null, position: 'end' } as const;
    return { id: closestId, position } as const;
  };

  /* ── Drag handlers ────────────────────────────────────────────────── */

  function handleDragStart(event: DragStartEvent) {
    const id = event.active.id as string;
    setActiveId(id);
    const data = event.active.data.current;
    setActiveType(data?.ingredientType ?? null);
    setManualOverStack(false);
    updateInsertMarker(null);
  }

  function handleDragMove(event: DragMoveEvent) {
    const source = event.active.data.current?.source;
    if (source !== 'palette') return;
    const activeRect = event.active.rect.current.translated ?? event.active.rect.current.initial;
    if (!activeRect) return;
    const nextOver = isRectOverStack(activeRect);
    setManualOverStack((prev) => (prev === nextOver ? prev : nextOver));
    if (!nextOver) {
      updateInsertMarker(null);
      return;
    }

    updateInsertMarker(computeInsertMarker(activeRect));
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) {
      updateInsertMarker(null);
      return;
    }

    const activeData = active.data.current;
    const source = activeData?.source;

    if (source === 'palette') {
      return;
    }

    updateInsertMarker(null);

    if (source !== 'stack') return;

    const overId = over.id as string;
    if (overId === 'stack-droppable') return;

    const activeRect = active.rect.current.translated ?? active.rect.current.initial;
    const marker = activeRect ? computeInsertMarker(activeRect) : null;
    if (marker && marker.id) {
      updateInsertMarker(marker);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    setActiveType(null);
    setManualOverStack(false);
    updateInsertMarker(null);

    const activeData = active.data.current;
    const source = activeData?.source;

    if (source === 'palette') {
      const ingredientType = activeData?.ingredientType;
      if (!ingredientType) return;

      const overId =
        (over?.id as string | undefined) ??
        ((isOverStack || manualOverStack) ? 'stack-droppable' : undefined);
      if (!overId) return;

      const activeRect = active.rect.current.translated ?? active.rect.current.initial;
      const marker = activeRect ? computeInsertMarker(activeRect) : null;

      setStack((prev) => {
        const isStackTarget = overId === 'stack-droppable' || prev.some((s) => s.id === overId);
        if (!isStackTarget) return prev;

        const newItem: StackItem = {
          id: `stack-${ingredientType}-${nanoid(6)}`,
          type: ingredientType,
        };

        const overIndex = prev.findIndex((s) => s.id === overId);
        if (overIndex >= 0) {
          const copy = [...prev];
          const insertIndex = marker?.id === overId && marker.position === 'before'
            ? overIndex
            : overIndex + 1;
          copy.splice(insertIndex, 0, newItem);
          return copy;
        }

        return [...prev, newItem];
      });
    } else if (source === 'stack') {
      if (!over) return;
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
    const layers = stack.map((s) => ({
      type: s.type,
      label: getIngredientLabel(s.type),
    }));
    const summary = {
      name: burgerName.trim() || t('defaultName'),
      layers,
      createdAt: new Date().toISOString(),
    };
    sessionStorage.setItem(SUMMARY_KEY, JSON.stringify(summary));
    router.push('/builder/complete');
  }

  const stackIds = stack.map((s) => s.id);

  const collisionDetection: CollisionDetection = (args) => {
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) return pointerCollisions;
    const rectCollisions = rectIntersection(args);
    if (rectCollisions.length > 0) return rectCollisions;
    return closestCenter(args);
  };

  const measuring = {
    droppable: {
      strategy: MeasuringStrategy.Always,
    },
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      measuring={measuring}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
        {/* ── Ingredient Palette ──────────────────────────────────── */}
        <div data-testid="ingredient-palette">
          <h2 className="mb-4 text-lg font-bold text-text">{t('palette')}</h2>
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                {t('sections.buns')}
              </h3>
              <div className="mt-2 flex flex-col gap-2">
                {BUNS.map((def) => (
                  <PaletteItem
                    key={def.type}
                    def={def}
                    label={getIngredientLabel(def.type)}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                {t('sections.patties')}
              </h3>
              <div className="mt-2 flex flex-col gap-2">
                {PATTIES.map((def) => (
                  <PaletteItem
                    key={def.type}
                    def={def}
                    label={getIngredientLabel(def.type)}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                {t('sections.cheese')}
              </h3>
              <div className="mt-2 flex flex-col gap-2">
                {CHEESE.map((def) => (
                  <PaletteItem
                    key={def.type}
                    def={def}
                    label={getIngredientLabel(def.type)}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                {t('sections.veggies')}
              </h3>
              <div className="mt-2 flex flex-col gap-2">
                {VEGGIES.map((def) => (
                  <PaletteItem
                    key={def.type}
                    def={def}
                    label={getIngredientLabel(def.type)}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                {t('sections.extras')}
              </h3>
              <div className="mt-2 flex flex-col gap-2">
                {EXTRAS.map((def) => (
                  <PaletteItem
                    key={def.type}
                    def={def}
                    label={getIngredientLabel(def.type)}
                  />
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                  {t('sections.sauces')}
                </h3>
                <button
                  type="button"
                  onClick={() => setSaucesOpen((prev) => !prev)}
                  className="text-xs font-semibold text-accent hover:opacity-80"
                >
                  {saucesOpen ? t('collapse') : t('expand')}
                </button>
              </div>
              {saucesOpen && (
                <div className="mt-2 flex flex-col gap-2">
                  {SAUCES.map((def) => (
                    <PaletteItem
                      key={def.type}
                      def={def}
                      label={getIngredientLabel(def.type)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Burger Stack ────────────────────────────────────────── */}
        <div data-testid="burger-stack">
          <h2 className="mb-4 text-lg font-bold text-text">{t('stack')}</h2>

          <div
            ref={setStackNodeRef}
            className={`flex min-h-[200px] flex-col gap-2 rounded-2xl border-2 border-dashed p-4 transition-colors ${
              isOverStack || manualOverStack
                ? 'border-primary bg-primary/10'
                : 'border-white/20 bg-surface'
            }`}
          >
            <SortableContext items={stackIds} strategy={verticalListSortingStrategy}>
              {stack.length === 0 && (
                <p className="m-auto text-sm text-text-muted">
                  {t('emptyStack')}
                </p>
              )}
              {stack.flatMap((item) => {
                const before = insertMarker?.id === item.id && insertMarker.position === 'before';
                const after = insertMarker?.id === item.id && insertMarker.position === 'after';
                const nodes: ReactElement[] = [];

                if (before) {
                  nodes.push(
                    <div
                      key={`${item.id}-before`}
                      className="h-2 rounded-full bg-accent/80"
                    />
                  );
                }

                nodes.push(
                  <StackIngredient
                    key={item.id}
                    item={item}
                    label={getIngredientLabel(item.type)}
                    onRemove={handleRemove}
                  />
                );

                if (after) {
                  nodes.push(
                    <div
                      key={`${item.id}-after`}
                      className="h-2 rounded-full bg-accent/80"
                    />
                  );
                }

                return nodes;
              })}
              {insertMarker?.position === 'end' && (
                <div className="h-2 rounded-full bg-accent/80" />
              )}
            </SortableContext>
          </div>

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
