import { getTranslations } from "next-intl/server";
import { getPlaces, getPlaceBrands } from "@/actions/places";
import { PlaceCard } from "@/components/places/PlaceCard";
import { PlaceForm } from "@/components/places/PlaceForm";
import { PlaceFilters } from "./PlaceFilters";

export async function generateMetadata() {
  const t = await getTranslations("places");
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function PlacesPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string; type?: string; sort?: string }>;
}) {
  const t = await getTranslations("places");
  const { brand, type, sort } = await searchParams;
  
  const activeBrand = brand || 'all';
  const activeType = type || 'all';
  const activeSort = sort || 'rating';

  const [places, brands] = await Promise.all([
    getPlaces({ brand: activeBrand, type: activeType, sort: activeSort }),
    getPlaceBrands(),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text">{t("title")}</h1>
        <p className="mt-2 text-text-muted">{t("subtitle")}</p>
      </div>

      <PlaceForm />

      <PlaceFilters
        activeBrand={activeBrand}
        activeType={activeType}
        activeSort={activeSort}
        brands={brands}
      />

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-bold text-text">
          {t("registeredPlaces")} ({places.length})
        </h2>

         {places.length === 0 ? (
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
                     d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                   />
                   <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2}
                     d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                   />
                 </svg>
               </div>
             </div>
             <h3 className="mb-2 text-lg font-semibold text-text">
               {t("noPlaces")}
             </h3>
             <p className="mb-6 text-text-muted">{t("noPlacesMessage")}</p>
             <button
               onClick={() => {
                 const formElement = document.querySelector(
                   "[data-testid='place-form']"
                 );
                 formElement?.scrollIntoView({ behavior: "smooth" });
               }}
               className="inline-block rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
             >
               {t("noPlacesAction")}
             </button>
           </div>
         ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
