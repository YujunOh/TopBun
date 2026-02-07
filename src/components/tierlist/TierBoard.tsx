'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  pointerWithin,
  MeasuringStrategy,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { toPng } from 'html-to-image';
import { Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { TierRow } from './TierRow';
import { TierItem } from './TierItem';

interface BurgerDTO {
  id: number;
  name: string;
  imageUrl: string;
}

type ContainerKey = 'S' | 'A' | 'B' | 'C' | 'D' | 'F' | 'unranked';
type Containers = Record<ContainerKey, string[]>;
type TierConfig = { id: Exclude<ContainerKey, 'unranked'>; label: string; color: string };

function toItemId(burgerId: number) {
  return `burger-${burgerId}`;
}

export function TierBoard({ burgers }: { burgers: BurgerDTO[] }) {
  const t = useTranslations('tierlist');
  const [tiers, setTiers] = useState<TierConfig[]>([
    { id: 'S', label: 'S', color: 'bg-red-600' },
    { id: 'A', label: 'A', color: 'bg-orange-500' },
    { id: 'B', label: 'B', color: 'bg-yellow-500' },
    { id: 'C', label: 'C', color: 'bg-green-500' },
    { id: 'D', label: 'D', color: 'bg-blue-500' },
    { id: 'F', label: 'F', color: 'bg-gray-500' },
  ]);
  const [listTitle, setListTitle] = useState(t('defaultListTitle'));
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(listTitle);
  const [isSaving, setIsSaving] = useState(false);
  const tierBoardRef = useRef<HTMLDivElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  // Build burger lookup map
  const burgerMap = useMemo(() => {
    const map: Record<string, BurgerDTO> = {};
    for (const b of burgers) {
      map[toItemId(b.id)] = b;
    }
    return map;
  }, [burgers]);

  // Initial state: all burgers in unranked
  const [containers, setContainers] = useState<Containers>(() => ({
    S: [],
    A: [],
    B: [],
    C: [],
    D: [],
    F: [],
    unranked: burgers.map((b) => toItemId(b.id)),
  }));

  const [activeId, setActiveId] = useState<string | null>(null);

  // Sensors for pointer, touch, and keyboard
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 1 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 0, tolerance: 5 } }),
    useSensor(KeyboardSensor),
  );


  // Find which container an item belongs to
  const findContainer = useCallback(
    (id: string): ContainerKey | null => {
      // Check if id is a container key itself
      if (id in containers) return id as ContainerKey;
      // Otherwise find which container holds the item
      for (const [key, items] of Object.entries(containers)) {
        if (items.includes(id)) return key as ContainerKey;
      }
      return null;
    },
    [containers],
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string);

    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    setContainers((prev) => {
      const activeItems = [...prev[activeContainer]];
      const overItems = [...prev[overContainer]];

      const activeIndex = activeItems.indexOf(active.id as string);
      if (activeIndex < 0) return prev;
      activeItems.splice(activeIndex, 1);

      // Find the index to insert at
      const overIndex = overItems.indexOf(over.id as string);
      const newIndex = overIndex >= 0 ? overIndex : overItems.length;

      if (overItems[newIndex] === active.id) return prev;

      overItems.splice(newIndex, 0, active.id as string);

      return {
        ...prev,
        [activeContainer]: activeItems,
        [overContainer]: overItems,
      };
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string);

    if (!activeContainer || !overContainer) return;

    if (activeContainer === overContainer) {
      // Reorder within same container
      const items = containers[activeContainer];
      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over.id as string);

      if (oldIndex !== newIndex) {
        setContainers((prev) => ({
          ...prev,
          [activeContainer]: arrayMove(prev[activeContainer], oldIndex, newIndex),
        }));
      }
    }
    // Cross-container moves are already handled by handleDragOver
  }

  const activeBurger = activeId ? burgerMap[activeId] : null;

  const collisionDetection: CollisionDetection = (args) => {
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) return pointerCollisions;
    return closestCenter(args);
  };

  const measuring = {
    droppable: {
      strategy: MeasuringStrategy.WhileDragging,
    },
  };

  useEffect(() => {
    setTitleDraft(listTitle);
  }, [listTitle]);

  useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [isEditingTitle]);

  const handleTierLabelChange = useCallback((tierId: string, nextLabel: string) => {
    setTiers((prev) =>
      prev.map((tier) => (tier.id === tierId ? { ...tier, label: nextLabel } : tier)),
    );
  }, []);

  const commitTitle = useCallback(() => {
    const nextTitle = titleDraft.trim();
    setIsEditingTitle(false);
    if (!nextTitle) {
      setTitleDraft(listTitle);
      return;
    }
    if (nextTitle !== listTitle) {
      setListTitle(nextTitle);
    }
  }, [listTitle, titleDraft]);

  const handleSaveImage = useCallback(async () => {
    if (!tierBoardRef.current) return;
    setIsSaving(true);
    try {
      const dataUrl = await toPng(tierBoardRef.current, { cacheBust: true });
      const link = document.createElement('a');
      const safeTitle = listTitle.trim() || t('defaultListTitle');
      link.download = `${safeTitle}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setIsSaving(false);
    }
  }, [listTitle, t]);

  const handleShare = useCallback(async () => {
    const safeTitle = listTitle.trim() || t('defaultListTitle');
    const tierLines = tiers.map((tier) => {
      const names = containers[tier.id]
        .map((itemId) => burgerMap[itemId])
        .filter((burger): burger is BurgerDTO => Boolean(burger))
        .map((burger) => burger.name);
      const rowText = names.length > 0 ? names.join(', ') : '-';
      return `${tier.label}: ${rowText}`;
    });
    const shareText = [`🍔 ${safeTitle}`, ...tierLines].join('\n');

    if (navigator.share) {
      await navigator.share({ title: safeTitle, text: shareText });
      return;
    }

    await navigator.clipboard.writeText(shareText);
    toast(t('shareSuccess'));
  }, [burgerMap, containers, listTitle, t, tiers]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold text-text">{t('title')}</h1>
      <p className="mb-8 text-text-muted">{t('subtitle')}</p>

      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        measuring={measuring}
        autoScroll={false}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="rounded-2xl bg-surface/60 p-4">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
              onClick={handleSaveImage}
              disabled={isSaving}
            >
              <Download className="h-4 w-4" />
              {t('saveImage')}
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-text transition hover:bg-surface-light"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              {t('share')}
            </button>
          </div>

          <div ref={tierBoardRef} className="flex flex-col gap-4">
            {isEditingTitle ? (
              <input
                ref={titleInputRef}
                className="bg-transparent text-3xl font-bold text-text outline-none border-b-2 border-primary"
                value={titleDraft}
                onChange={(event) => setTitleDraft(event.target.value)}
                onBlur={commitTitle}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    commitTitle();
                  }
                  if (event.key === 'Escape') {
                    event.preventDefault();
                    setTitleDraft(listTitle);
                    setIsEditingTitle(false);
                  }
                }}
                aria-label={t('editTitle')}
              />
            ) : (
              <button
                type="button"
                className="group flex items-center gap-2 text-left text-3xl font-bold text-text hover:text-primary transition-colors"
                onClick={() => setIsEditingTitle(true)}
                aria-label={t('editTitle')}
                title={t('editTitle')}
              >
                {listTitle}
                <svg 
                  className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}

            <div className="flex flex-col gap-3">
              {tiers.map((tier) => (
                <TierRow
                  key={tier.id}
                  tierId={tier.id}
                  label={tier.label}
                  color={tier.color}
                  items={containers[tier.id]}
                  burgerMap={burgerMap}
                  onLabelChange={handleTierLabelChange}
                  editLabelText={t('editTierLabel')}
                />
              ))}
            </div>
          </div>

          <div data-testid="tier-unranked" className="mt-6 rounded-2xl bg-surface p-4">
            <h2 className="mb-3 text-lg font-bold text-text">{t('unranked')}</h2>
            <TierRow
              tierId="unranked"
              label=""
              color="bg-transparent"
              items={containers.unranked}
              burgerMap={burgerMap}
            />
          </div>
        </div>

        {/* Drag overlay */}
        <DragOverlay>
          {activeBurger ? (
            <TierItem
              id={activeId!}
              name={activeBurger.name}
              imageUrl={activeBurger.imageUrl}
              burgerId={activeBurger.id}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
