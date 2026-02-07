"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronUp, MapPin } from "lucide-react";
import { toast } from "sonner";
import { createPlace } from "@/actions/places";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "@/i18n/navigation";

const BRANDS = [
  "맥도날드",
  "버거킹",
  "롯데리아",
  "맘스터치",
  "KFC",
  "노브랜드버거",
  "쉐이크쉑",
  "파이브가이즈",
  "다운타우너",
  "버거보이",
  "기타",
];

export function PlaceForm() {
  const t = useTranslations("places");
  const { user } = useAuth();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHandmade, setIsHandmade] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast.error(t("loginRequired"));
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.append("isHandmade", isHandmade.toString());
    formData.append("userId", user.id || "");

    const result = await createPlace(formData);

    if (result.error) {
      toast.error(t("form.error"));
    } else {
      toast.success(t("form.success"));
      setIsOpen(false);
      (e.target as HTMLFormElement).reset();
      setIsHandmade(false);
      router.refresh();
    }

    setIsSubmitting(false);
  };

  return (
    <div className="rounded-2xl bg-surface overflow-hidden">
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-surface-light/50 transition"
      >
        <div className="flex items-center gap-3">
          <MapPin size={20} className="text-primary" />
          <span className="font-semibold text-text">{t("addPlace")}</span>
        </div>
        {isOpen ? (
          <ChevronUp size={20} className="text-text-muted" />
        ) : (
          <ChevronDown size={20} className="text-text-muted" />
        )}
      </button>

      {/* Collapsible Form */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2 space-y-4">
            {/* Name */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-text">
                {t("form.name")} *
              </label>
              <input
                name="name"
                required
                className="w-full rounded-xl bg-surface-light px-4 py-3 text-text placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/50"
                placeholder={t("form.namePlaceholder")}
                disabled={isSubmitting}
              />
            </div>

            {/* Brand */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-text">
                {t("form.brand")}
              </label>
              <select
                name="brand"
                className="w-full rounded-xl bg-surface-light px-4 py-3 text-text outline-none focus:ring-2 focus:ring-primary/50"
                disabled={isSubmitting}
              >
                <option value="">{t("form.selectBrand")}</option>
                {BRANDS.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-text">
                {t("form.address")} *
              </label>
              <input
                name="address"
                required
                className="w-full rounded-xl bg-surface-light px-4 py-3 text-text placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/50"
                placeholder={t("form.addressPlaceholder")}
                disabled={isSubmitting}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-text">
                {t("form.phone")}
              </label>
              <input
                name="phone"
                type="tel"
                className="w-full rounded-xl bg-surface-light px-4 py-3 text-text placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/50"
                placeholder={t("form.phonePlaceholder")}
                disabled={isSubmitting}
              />
            </div>

            {/* Map URLs */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-text">
                  {t("form.naverMapUrl")}
                </label>
                <input
                  name="naverMapUrl"
                  type="url"
                  className="w-full rounded-xl bg-surface-light px-4 py-3 text-text placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="https://naver.me/..."
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-text">
                  {t("form.kakaoMapUrl")}
                </label>
                <input
                  name="kakaoMapUrl"
                  type="url"
                  className="w-full rounded-xl bg-surface-light px-4 py-3 text-text placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="https://kko.to/..."
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Handmade toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsHandmade(!isHandmade)}
                className={`relative h-6 w-11 rounded-full transition ${
                  isHandmade ? "bg-primary" : "bg-surface-light"
                }`}
              >
                <span
                  className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition ${
                    isHandmade ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="text-sm text-text">{t("form.isHandmade")}</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? t("form.submitting") : t("form.submit")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
