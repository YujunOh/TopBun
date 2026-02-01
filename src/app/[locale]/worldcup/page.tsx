import { prisma } from '@/lib/prisma';
import type { BurgerDTO } from '@/lib/tournament';
import { WorldcupSetup } from './WorldcupSetup';

export default async function WorldcupPage() {
  const burgers = await prisma.burger.findMany({
    select: { id: true, name: true, nameEn: true, imageUrl: true, eloRating: true },
  });

  const dto: BurgerDTO[] = burgers.map(b => ({
    id: b.id,
    name: b.name,
    nameEn: b.nameEn,
    imageUrl: b.imageUrl,
    eloRating: b.eloRating,
  }));

  return <WorldcupSetup burgers={dto} />;
}
