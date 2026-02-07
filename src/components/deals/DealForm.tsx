"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronUp, Tag, Star } from "lucide-react";
import { toast } from "sonner";
import { createDeal } from "@/actions/deals";
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
  "기타",
];

export function DealForm() {
  const t = useTranslations("deals");
  const { user } = useAuth();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [importance, setImportance] = useState(3);

  const today = new Date().toISOString().split("T")[0];
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast.error(t("loginRequired"));
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.append("importance", importance.toString());
    formData.append("userId", user.id || "");

    const result = await createDeal(formData);

    if (result.error) {
      toast.error(t("form.error"));
    } else {
      toast.success(t("form.success"));
      setIsOpen(false);
      (e.target as HTMLFormElement).reset();
      setImportance(3);
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
          <Tag size={20} className="text-primary" />
          <span className="font-semibold text-text">{t("addDeal")}</span>
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
            {/* Title */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-text">
                {t("form.title")} *
              </label>
              <input
                name="title"
                required
                className="w-full rounded-xl bg-surface-light px-4 py-3 text-text placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/50"
                placeholder={t("form.titlePlaceholder")}
                disabled={isSubmitting}
              />
            </div>

            {/* Brand */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-text">
                {t("form.brand")} *
              </label>
              <select
                name="brand"
                required
                className="w-full rounded-xl bg-surface-light px-4 py-3 text-text outline-none focus:ring-2 focus:ring-primary/50"
                disabled={isSubmitting}
              >
                {BRANDS.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-text">
                {t("form.description")} *
              </label>
              <textarea
                name="description"
                required
                rows={3}
                className="w-full rounded-xl bg-surface-light px-4 py-3 text-text placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/50"
                placeholder={t("form.descriptionPlaceholder")}
                disabled={isSubmitting}
              />
            </div>

            {/* Discount Rate & Prices */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-sm font-semibold text-text">
                  {t("form.discountRate")}
                </label>
                <input
                  name="discountRate"
                  type="number"
                  min="1"
                  max="100"
                  className="w-full rounded-xl bg-surface-light px-4 py-3 text-text placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="20"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-text">
                  {t("form.originalPrice")}
                </label>
                <input
                  name="originalPrice"
                  type="number"
                  min="0"
                  className="w-full rounded-xl bg-surface-light px-4 py-3 text-text placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="10000"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-text">
                  {t("form.dealPrice")}
                </label>
                <input
                  name="dealPrice"
                  type="number"
                  min="0"
                  className="w-full rounded-xl bg-surface-light px-4 py-3 text-text placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="8000"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-semibold text-text">
                  {t("form.startDate")} *
                </label>
                <input
                  name="startDate"
                  type="date"
                  required
                  defaultValue={today}
                  className="w-full rounded-xl bg-surface-light px-4 py-3 text-text outline-none focus:ring-2 focus:ring-primary/50"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-text">
                  {t("form.endDate")} *
                </label>
                <input
                  name="endDate"
                  type="date"
                  required
                  defaultValue={nextWeek}
                  className="w-full rounded-xl bg-surface-light px-4 py-3 text-text outline-none focus:ring-2 focus:ring-primary/50"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Importance */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-text">
                {t("form.importance")}
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setImportance(star)}
                    className="p-1 transition hover:scale-110"
                  >
                    <Star
                      size={24}
                      className={
                        star <= importance
                          ? "fill-accent text-accent"
                          : "text-text-muted/30"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Source */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-text">
                {t("form.source")}
              </label>
              <input
                name="source"
                className="w-full rounded-xl bg-surface-light px-4 py-3 text-text placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/50"
                placeholder={t("form.sourcePlaceholder")}
                disabled={isSubmitting}
              />
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
