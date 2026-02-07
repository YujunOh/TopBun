import { getTranslations } from "next-intl/server";
import { getPlaces } from "@/actions/places";
import { PlaceCard } from "@/components/places/PlaceCard";
import { PlaceForm } from "@/components/places/PlaceForm";

export async function generateMetadata() {
  const t = await getTranslations("places");
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function PlacesPage() {
  const t = await getTranslations("places");
  const places = await getPlaces();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text">{t("title")}</h1>
        <p className="mt-2 text-text-muted">{t("subtitle")}</p>
      </div>

      <PlaceForm />

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-bold text-text">
          {t("registeredPlaces")} ({places.length})
        </h2>

        {places.length === 0 ? (
          <div className="rounded-2xl bg-surface p-8 text-center">
            <p className="text-text-muted">{t("noPlaces")}</p>
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
