"use client";

import dynamic from 'next/dynamic';

const TierBoard = dynamic(() => import('./TierBoard').then((mod) => mod.TierBoard), {
  ssr: false,
  loading: () => (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-4 h-6 w-40 rounded bg-white/10 animate-pulse" />
      <div className="h-48 rounded-2xl bg-surface animate-pulse" />
    </div>
  ),
});

interface TierBoardClientProps {
  burgers: { id: number; name: string; imageUrl: string }[];
}

export function TierBoardClient({ burgers }: TierBoardClientProps) {
  return <TierBoard burgers={burgers} />;
}
