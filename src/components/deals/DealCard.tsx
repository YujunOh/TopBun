"use client";

import { useTranslations } from "next-intl";
import { Calendar, Percent, Star, Clock } from "lucide-react";
import Image from "next/image";

interface Deal {
  id: number;
  title: string;
  description: string;
  brand: string;
  discountRate: number | null;
  originalPrice: number | null;
  dealPrice: number | null;
  imageUrl: string | null;
  startDate: Date;
  endDate: Date;
  importance: number;
  source: string | null;
  user: { name: string | null; image: string | null } | null;
}

function getDaysRemaining(endDate: Date): number {
  const now = new Date();
  const diff = new Date(endDate).getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
  });
}

export function DealCard({ deal }: { deal: Deal }) {
  const t = useTranslations("deals");
  const daysRemaining = getDaysRemaining(deal.endDate);
  const isUrgent = daysRemaining <= 3;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-surface transition hover:shadow-lg">
      {/* Urgency badge */}
      {isUrgent && daysRemaining > 0 && (
        <div className="absolute right-3 top-3 z-10 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
          D-{daysRemaining}
        </div>
      )}

      {/* Discount badge */}
      {deal.discountRate && (
        <div className="absolute left-3 top-3 z-10 rounded-full bg-primary px-3 py-1 text-sm font-bold text-white">
          {deal.discountRate}% OFF
        </div>
      )}

      {/* Image */}
      {deal.imageUrl && (
        <div className="relative h-40 w-full">
          <Image
            src={deal.imageUrl}
            alt={deal.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="p-4">
        {/* Brand */}
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
          {deal.brand}
        </div>

        {/* Title */}
        <h3 className="mb-2 text-lg font-bold text-text">{deal.title}</h3>

        {/* Description */}
        <p className="mb-3 line-clamp-2 text-sm text-text-muted">
          {deal.description}
        </p>

        {/* Price info */}
        {(deal.originalPrice || deal.dealPrice) && (
          <div className="mb-3 flex items-baseline gap-2">
            {deal.originalPrice && (
              <span className="text-sm text-text-muted line-through">
                {deal.originalPrice.toLocaleString()}원
              </span>
            )}
            {deal.dealPrice && (
              <span className="text-lg font-bold text-primary">
                {deal.dealPrice.toLocaleString()}원
              </span>
            )}
          </div>
        )}

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
          {/* Period */}
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>
              {formatDate(deal.startDate)} - {formatDate(deal.endDate)}
            </span>
          </div>

          {/* Importance stars */}
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < deal.importance ? "fill-accent text-accent" : "text-text-muted/30"}
              />
            ))}
          </div>
        </div>

        {/* Source */}
        {deal.source && (
          <div className="mt-2 text-xs text-text-muted">
            {t("source")}: {deal.source}
          </div>
        )}

        {/* User who posted */}
        {deal.user && (
          <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3">
            {deal.user.image ? (
              <Image
                src={deal.user.image}
                alt={deal.user.name || ""}
                width={20}
                height={20}
                className="rounded-full"
              />
            ) : (
              <div className="h-5 w-5 rounded-full bg-surface-light" />
            )}
            <span className="text-xs text-text-muted">{deal.user.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}
