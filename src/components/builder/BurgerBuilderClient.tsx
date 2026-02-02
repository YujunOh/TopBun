"use client";

import dynamic from 'next/dynamic';

const BurgerBuilder = dynamic(() => import('./BurgerBuilder').then((mod) => mod.BurgerBuilder), {
  ssr: false,
  loading: () => (
    <div className="rounded-2xl bg-surface p-6 animate-pulse">
      <div className="h-4 w-40 rounded bg-white/10" />
      <div className="mt-4 h-40 rounded bg-white/5" />
    </div>
  ),
});

export function BurgerBuilderClient() {
  return <BurgerBuilder />;
}
