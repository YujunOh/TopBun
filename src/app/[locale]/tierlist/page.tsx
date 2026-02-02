import { prisma } from '@/lib/prisma';
import { getLocale } from 'next-intl/server';
import { TierBoardClient } from '@/components/tierlist/TierBoardClient';

export default async function TierlistPage() {
  const locale = await getLocale();

  const burgers = await prisma.burger.findMany({
    select: { id: true, name: true, nameEn: true, imageUrl: true },
  });

  const dto = burgers.map((b) => ({
    id: b.id,
    name: locale === 'en' && b.nameEn ? b.nameEn : b.name,
    imageUrl: b.imageUrl,
  }));

  return <TierBoardClient burgers={dto} />;
}
