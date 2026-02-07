import { getTranslations } from "next-intl/server";
import { getDeals, getDealBrands } from "@/actions/deals";
import { DealCard } from "@/components/deals/DealCard";
import { DealForm } from "@/components/deals/DealForm";
import { DealFilters } from "./DealFilters";

export async function generateMetadata() {
  const t = await getTranslations("deals");
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string; discount?: string; sort?: string }>;
}) {
  const t = await getTranslations("deals");
  const { brand, discount, sort } = await searchParams;
  
  const activeBrand = brand || 'all';
  const activeDiscount = discount || 'all';
  const activeSort = sort || 'importance';

  const [deals, brands] = await Promise.all([
    getDeals({ brand: activeBrand, discount: activeDiscount, sort: activeSort }),
    getDealBrands(),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text">{t("title")}</h1>
        <p className="mt-2 text-text-muted">{t("subtitle")}</p>
      </div>

      <DealForm />

      <DealFilters
        activeBrand={activeBrand}
        activeDiscount={activeDiscount}
        activeSort={activeSort}
        brands={brands}
      />

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-bold text-text">
          {t("activeDeals")} ({deals.length})
        </h2>

         {deals.length === 0 ? (
           <div className="rounded-2xl bg-surface p-12 text-center">
             <div className="mb-4 flex justify-center">
               <div className="rounded-full bg-primary/10 p-4">
                 <svg
                   className="h-8 w-8 text-primary"
                   fill="none"
                   stroke="currentColor"
                   viewBox="0 0 24 24"
                 >
                   <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2}
                     d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                   />
                 </svg>
               </div>
             </div>
             <h3 className="mb-2 text-lg font-semibold text-text">
               {t("noDeals")}
             </h3>
             <p className="mb-6 text-text-muted">{t("noDealsMessage")}</p>
             <button
               onClick={() => {
                 const formElement = document.querySelector(
                   "[data-testid='deal-form']"
                 );
                 formElement?.scrollIntoView({ behavior: "smooth" });
               }}
               className="inline-block rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
             >
               {t("noDealsAction")}
             </button>
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
