'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useTranslations } from 'next-intl';
import { TierRow } from './TierRow';
import { TierItem } from './TierItem';

interface BurgerDTO {
  id: number;
  name: string;
  imageUrl: string;
}

const TIERS = [
  { id: 'S', label: 'S', color: 'bg-red-600' },
  { id: 'A', label: 'A', color: 'bg-orange-500' },
  { id: 'B', label: 'B', color: 'bg-yellow-500' },
  { id: 'C', label: 'C', color: 'bg-green-500' },
  { id: 'D', label: 'D', color: 'bg-blue-500' },
  { id: 'F', label: 'F', color: 'bg-gray-500' },
] as const;

type ContainerKey = 'S' | 'A' | 'B' | 'C' | 'D' | 'F' | 'unranked';
type Containers = Record<ContainerKey, string[]>;

function toItemId(burgerId: number) {
  return `burger-${burgerId}`;
}

export function TierBoard({ burgers }: { burgers: BurgerDTO[] }) {
  const t = useTranslations('tierlist');

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
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
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
      activeItems.splice(activeIndex, 1);

      // Find the index to insert at
      const overIndex = overItems.indexOf(over.id as string);
      const newIndex = overIndex >= 0 ? overIndex : overItems.length;

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

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold text-text">{t('title')}</h1>
      <p className="mb-8 text-text-muted">{t('subtitle')}</p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* Tier rows */}
        <div className="mb-8 flex flex-col gap-1">
          {TIERS.map((tier) => (
            <TierRow
              key={tier.id}
              tierId={tier.id}
              label={tier.label}
              color={tier.color}
              items={containers[tier.id]}
              burgerMap={burgerMap}
            />
          ))}
        </div>

        {/* Unranked pool */}
        <div data-testid="tier-unranked" className="rounded-2xl bg-surface p-4">
          <h2 className="mb-3 text-lg font-bold text-text">{t('unranked')}</h2>
          <TierRow
            tierId="unranked"
            label=""
            color="bg-transparent"
            items={containers.unranked}
            burgerMap={burgerMap}
          />
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
