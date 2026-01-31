import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const libsql = createClient({
  url: process.env.DATABASE_URL || 'file:./dev.db'
});

const adapter = new PrismaLibSql(libsql);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Delete existing data
  await prisma.review.deleteMany();
  await prisma.burger.deleteMany();

  const burgers = [
    { name: '싸이버거', nameEn: 'Cy Burger', brand: '맘스터치', brandEn: "Mom's Touch", description: '바삭한 치킨 패티의 전설', descriptionEn: 'Legendary crispy chicken patty', category: 'korean' },
    { name: '와퍼', nameEn: 'Whopper', brand: '버거킹', brandEn: 'Burger King', description: '불에 직접 구운 100% 순 쇠고기 패티', descriptionEn: 'Flame-grilled 100% beef patty', category: 'classic' },
    { name: '빅맥', nameEn: 'Big Mac', brand: '맥도날드', brandEn: "McDonald's", description: '두 장의 순 쇠고기 패티와 특별한 빅맥 소스', descriptionEn: 'Two beef patties with special Big Mac sauce', category: 'classic' },
    { name: '불고기버거', nameEn: 'Bulgogi Burger', brand: '롯데리아', brandEn: 'Lotteria', description: '달콤한 불고기 소스의 한국 대표 버거', descriptionEn: 'Sweet bulgogi sauce Korean classic', category: 'korean' },
    { name: '쉑버거', nameEn: 'ShackBurger', brand: '쉐이크쉑', brandEn: 'Shake Shack', description: '앵거스 비프 패티와 쉑소스', descriptionEn: 'Angus beef patty with ShackSauce', category: 'premium' },
    { name: '치즈버거', nameEn: 'Cheeseburger', brand: '파이브가이즈', brandEn: 'Five Guys', description: '신선한 재료로 만든 수제 치즈버거', descriptionEn: 'Fresh handmade cheeseburger', category: 'premium' },
    { name: 'NBB 시그니처', nameEn: 'NBB Signature', brand: '노브랜드버거', brandEn: 'No Brand Burger', description: '가성비 최고의 시그니처 버거', descriptionEn: 'Best value signature burger', category: 'korean' },
    { name: '다운타우너 클래식', nameEn: 'Downtowner Classic', brand: '다운타우너', brandEn: 'Downtowner', description: '서울 대표 수제버거', descriptionEn: 'Seoul\'s signature handmade burger', category: 'handmade' },
    { name: '버거보이 스매시', nameEn: 'Burger Boy Smash', brand: '버거보이', brandEn: 'Burger Boy', description: '스매시 패티의 정석', descriptionEn: 'The standard of smash patties', category: 'handmade' },
    { name: '매드포갈릭 버거', nameEn: 'Mad for Garlic Burger', brand: '매드포갈릭', brandEn: 'Mad for Garlic', description: '마늘 소스가 일품인 수제버거', descriptionEn: 'Handmade burger with garlic sauce', category: 'handmade' },
    { name: '슈퍼두퍼 치즈', nameEn: 'Super Duper Cheese', brand: '슈퍼두퍼', brandEn: 'Super Duper', description: '더블 치즈의 진한 맛', descriptionEn: 'Rich double cheese flavor', category: 'handmade' },
    { name: '쿼터파운더 치즈', nameEn: 'Quarter Pounder', brand: '맥도날드', brandEn: "McDonald's", description: '두툼한 패티와 치즈의 조합', descriptionEn: 'Thick patty and cheese combo', category: 'classic' },
    { name: '통새우 와퍼', nameEn: 'Whole Shrimp Whopper', brand: '버거킹', brandEn: 'Burger King', description: '통새우가 들어간 프리미엄 와퍼', descriptionEn: 'Premium whopper with whole shrimp', category: 'classic' },
    { name: '리치 치즈버거', nameEn: 'Rich Cheeseburger', brand: '맘스터치', brandEn: "Mom's Touch", description: '진한 치즈소스의 버거', descriptionEn: 'Burger with rich cheese sauce', category: 'korean' },
    { name: '브루클린 버거', nameEn: 'Brooklyn Burger', brand: '브루클린 더 버거 조인트', brandEn: 'Brooklyn The Burger Joint', description: '뉴욕 스타일 수제버거', descriptionEn: 'New York style handmade burger', category: 'handmade' },
    { name: '스모크하우스 버거', nameEn: 'Smokehouse Burger', brand: '자니로켓츠', brandEn: "Johnny Rockets", description: '스모키한 풍미의 클래식 버거', descriptionEn: 'Smoky flavored classic burger', category: 'premium' },
  ];

  for (const burger of burgers) {
    await prisma.burger.create({ data: burger });
  }

  console.log(`Seeded ${burgers.length} burgers`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
