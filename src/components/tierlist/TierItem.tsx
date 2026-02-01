'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TierItemProps {
  id: string;
  name: string;
  imageUrl: string;
  burgerId: number;
}

export function TierItem({ id, name, imageUrl, burgerId }: TierItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

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
      data-testid={`burger-card-${burgerId}`}
      className="flex flex-col items-center gap-1 rounded-xl bg-surface-light p-2 cursor-grab active:cursor-grabbing select-none"
    >
      <img
        src={imageUrl}
        alt={name}
        className="h-14 w-14 rounded-lg object-cover"
        draggable={false}
      />
      <span className="max-w-[72px] truncate text-xs font-medium text-text">
        {name}
      </span>
    </div>
  );
}
