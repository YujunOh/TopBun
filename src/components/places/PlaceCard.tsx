"use client";

import { useTranslations } from "next-intl";
import { MapPin, Phone, Camera, Star, ExternalLink } from "lucide-react";
import Image from "next/image";

interface PlacePhoto {
  id: number;
  imageUrl: string;
  photoType: string;
}

interface Place {
  id: number;
  name: string;
  nameEn: string | null;
  brand: string | null;
  address: string;
  naverMapUrl: string | null;
  kakaoMapUrl: string | null;
  phone: string | null;
  isHandmade: boolean;
  rating: number;
  reviewCount: number;
  photos: PlacePhoto[];
  user: { name: string | null; image: string | null } | null;
  _count: { photos: number; events: number };
}

export function PlaceCard({ place }: { place: Place }) {
  const t = useTranslations("places");

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-surface transition hover:shadow-lg">
      {/* Handmade badge */}
      {place.isHandmade && (
        <div className="absolute left-3 top-3 z-10 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
          {t("handmade")}
        </div>
      )}

      {/* Photo gallery preview */}
      {place.photos.length > 0 ? (
        <div className="grid h-40 grid-cols-2 gap-0.5">
          {place.photos.slice(0, 4).map((photo, idx) => (
            <div key={photo.id} className={`relative ${place.photos.length === 1 ? "col-span-2" : ""}`}>
              <Image
                src={photo.imageUrl}
                alt={place.name}
                fill
                className="object-cover"
              />
              {idx === 3 && place._count.photos > 4 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="text-lg font-bold text-white">+{place._count.photos - 4}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center bg-surface-light">
          <Camera size={32} className="text-text-muted/30" />
        </div>
      )}

      <div className="p-4">
        {/* Brand */}
        {place.brand && (
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">
            {place.brand}
          </div>
        )}

        {/* Name */}
        <h3 className="mb-2 text-lg font-bold text-text">{place.name}</h3>

        {/* Address */}
        <div className="mb-2 flex items-start gap-2 text-sm text-text-muted">
          <MapPin size={16} className="mt-0.5 shrink-0" />
          <span className="line-clamp-2">{place.address}</span>
        </div>

        {/* Phone */}
        {place.phone && (
          <div className="mb-3 flex items-center gap-2 text-sm text-text-muted">
            <Phone size={16} />
            <span>{place.phone}</span>
          </div>
        )}

        {/* Stats */}
        <div className="mb-3 flex items-center gap-4 text-xs text-text-muted">
          {place.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-accent text-accent" />
              <span>{place.rating.toFixed(1)}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Camera size={14} />
            <span>{t("photoCount", { count: place._count.photos })}</span>
          </div>
        </div>

        {/* Map links */}
        <div className="flex gap-2">
          {place.naverMapUrl && (
            <a
              href={place.naverMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#03C75A] px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90"
            >
              <span>{t("naverMap")}</span>
              <ExternalLink size={12} />
            </a>
          )}
          {place.kakaoMapUrl && (
            <a
              href={place.kakaoMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#FEE500] px-3 py-2 text-xs font-semibold text-black transition hover:opacity-90"
            >
              <span>{t("kakaoMap")}</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>

        {/* User who posted */}
        {place.user && (
          <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3">
            {place.user.image ? (
              <Image
                src={place.user.image}
                alt={place.user.name || ""}
                width={20}
                height={20}
                className="rounded-full"
              />
            ) : (
              <div className="h-5 w-5 rounded-full bg-surface-light" />
            )}
            <span className="text-xs text-text-muted">{place.user.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}
