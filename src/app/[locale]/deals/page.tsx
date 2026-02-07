import { getTranslations } from "next-intl/server";
import { getDeals } from "@/actions/deals";
import { DealCard } from "@/components/deals/DealCard";
import { DealForm } from "@/components/deals/DealForm";

export async function generateMetadata() {
  const t = await getTranslations("deals");
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function DealsPage() {
  const t = await getTranslations("deals");
  const deals = await getDeals();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text">{t("title")}</h1>
        <p className="mt-2 text-text-muted">{t("subtitle")}</p>
      </div>

      <DealForm />

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-bold text-text">
          {t("activeDeals")} ({deals.length})
        </h2>

        {deals.length === 0 ? (
          <div className="rounded-2xl bg-surface p-8 text-center">
            <p className="text-text-muted">{t("noDeals")}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
