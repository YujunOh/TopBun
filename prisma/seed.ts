import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.review.deleteMany();
  await prisma.burger.deleteMany();

  const burgers = [
    // 맥도날드 (McDonald's) - 5개
    { name: '빅맥', nameEn: 'Big Mac', brand: '맥도날드', brandEn: "McDonald's", description: '두 장의 순 쇠고기 패티와 특별한 빅맥 소스', descriptionEn: 'Two beef patties with special Big Mac sauce', category: 'classic', burgerType: 'franchise' },
    { name: '쿼터파운더 치즈', nameEn: 'Quarter Pounder with Cheese', brand: '맥도날드', brandEn: "McDonald's", description: '두툼한 패티와 치즈의 조합', descriptionEn: 'Thick patty and cheese combo', category: 'classic', burgerType: 'franchise' },
    { name: '1955 버거', nameEn: '1955 Burger', brand: '맥도날드', brandEn: "McDonald's", description: '두툼한 패티와 스모키한 소스', descriptionEn: 'Thick patty with smoky sauce', category: 'premium', burgerType: 'franchise' },
    { name: '맥스파이시 상하이 버거', nameEn: 'McSpicy Shanghai', brand: '맥도날드', brandEn: "McDonald's", description: '매콤한 치킨 패티의 인기 메뉴', descriptionEn: 'Spicy chicken patty favorite', category: 'korean', burgerType: 'franchise' },
    { name: '더블 쿼터파운더 치즈', nameEn: 'Double Quarter Pounder with Cheese', brand: '맥도날드', brandEn: "McDonald's", description: '패티 2장의 묵직한 만족감', descriptionEn: 'Double patty satisfaction', category: 'premium', burgerType: 'franchise' },

    // 버거킹 (Burger King) - 5개
    { name: '와퍼', nameEn: 'Whopper', brand: '버거킹', brandEn: 'Burger King', description: '불에 직접 구운 100% 순 쇠고기 패티', descriptionEn: 'Flame-grilled 100% beef patty', category: 'classic', burgerType: 'franchise' },
    { name: '치즈와퍼', nameEn: 'Cheese Whopper', brand: '버거킹', brandEn: 'Burger King', description: '치즈가 더해진 클래식 와퍼', descriptionEn: 'Classic Whopper with cheese', category: 'classic', burgerType: 'franchise' },
    { name: '콰트로 치즈와퍼', nameEn: 'Quattro Cheese Whopper', brand: '버거킹', brandEn: 'Burger King', description: '4가지 치즈가 들어간 와퍼', descriptionEn: 'Whopper with 4 types of cheese', category: 'premium', burgerType: 'franchise' },
    { name: '몬스터X', nameEn: 'Monster X', brand: '버거킹', brandEn: 'Burger King', description: '패티와 치즈가 두 겹인 묵직한 버거', descriptionEn: 'Double patty and cheese heavyweight burger', category: 'premium', burgerType: 'franchise' },
    { name: '통새우 와퍼', nameEn: 'Whole Shrimp Whopper', brand: '버거킹', brandEn: 'Burger King', description: '통새우가 들어간 프리미엄 와퍼', descriptionEn: 'Premium whopper with whole shrimp', category: 'premium', burgerType: 'franchise' },

    // 롯데리아 (Lotteria) - 5개
    { name: '불고기버거', nameEn: 'Bulgogi Burger', brand: '롯데리아', brandEn: 'Lotteria', description: '달콤한 불고기 소스의 한국 대표 버거', descriptionEn: 'Sweet bulgogi sauce Korean classic', category: 'korean', burgerType: 'franchise' },
    { name: '모짜렐라 인 더 버거', nameEn: 'Mozzarella In The Burger', brand: '롯데리아', brandEn: 'Lotteria', description: '모짜렐라 치즈가 들어간 대표 버거', descriptionEn: 'Signature burger with mozzarella', category: 'korean', burgerType: 'franchise' },
    { name: '한우불고기버거', nameEn: 'Hanwoo Bulgogi Burger', brand: '롯데리아', brandEn: 'Lotteria', description: '한우 패티로 만든 프리미엄 불고기버거', descriptionEn: 'Premium bulgogi burger with Korean beef', category: 'premium', burgerType: 'franchise' },
    { name: '새우버거', nameEn: 'Shrimp Burger', brand: '롯데리아', brandEn: 'Lotteria', description: '바삭한 새우 패티의 시그니처', descriptionEn: 'Signature crispy shrimp patty', category: 'classic', burgerType: 'franchise' },
    { name: '데리버거', nameEn: 'Teriyaki Burger', brand: '롯데리아', brandEn: 'Lotteria', description: '데리야끼 소스의 달콤한 버거', descriptionEn: 'Sweet teriyaki sauce burger', category: 'korean', burgerType: 'franchise' },

    // 맘스터치 (Mom's Touch) - 5개
    { name: '싸이버거', nameEn: 'Cy Burger', brand: '맘스터치', brandEn: "Mom's Touch", description: '바삭한 치킨 패티의 전설', descriptionEn: 'Legendary crispy chicken patty', category: 'korean', burgerType: 'franchise' },
    { name: '인크레더블 버거', nameEn: 'Incredible Burger', brand: '맘스터치', brandEn: "Mom's Touch", description: '패티와 베이컨이 풍부한 버거', descriptionEn: 'Rich patty and bacon burger', category: 'premium', burgerType: 'franchise' },
    { name: '딥치즈버거', nameEn: 'Deep Cheese Burger', brand: '맘스터치', brandEn: "Mom's Touch", description: '진한 치즈소스의 버거', descriptionEn: 'Burger with deep cheese sauce', category: 'korean', burgerType: 'franchise' },
    { name: '화이트갈릭버거', nameEn: 'White Garlic Burger', brand: '맘스터치', brandEn: "Mom's Touch", description: '마늘 크림소스의 풍미', descriptionEn: 'Garlic cream sauce flavor', category: 'korean', burgerType: 'franchise' },
    { name: '언빌리버블버거', nameEn: 'Unbelievable Burger', brand: '맘스터치', brandEn: "Mom's Touch", description: '두꺼운 치킨 패티의 진수', descriptionEn: 'Essence of thick chicken patty', category: 'premium', burgerType: 'franchise' },

    // KFC - 5개
    { name: '징거버거', nameEn: 'Zinger Burger', brand: 'KFC', brandEn: 'KFC', description: '매콤한 치킨 패티의 시그니처', descriptionEn: 'Signature spicy chicken patty', category: 'korean', burgerType: 'franchise' },
    { name: '타워버거', nameEn: 'Tower Burger', brand: 'KFC', brandEn: 'KFC', description: '해시브라운이 들어간 높은 버거', descriptionEn: 'Tall burger with hash brown', category: 'premium', burgerType: 'franchise' },
    { name: '불징거버거', nameEn: 'Fire Zinger Burger', brand: 'KFC', brandEn: 'KFC', description: '더 매콤해진 징거버거', descriptionEn: 'Spicier Zinger burger', category: 'korean', burgerType: 'franchise' },
    { name: '치짜버거', nameEn: 'Chizza Burger', brand: 'KFC', brandEn: 'KFC', description: '피자와 버거의 콜라보', descriptionEn: 'Pizza and burger collaboration', category: 'korean', burgerType: 'franchise' },
    { name: '오리지널치킨버거', nameEn: 'Original Chicken Burger', brand: 'KFC', brandEn: 'KFC', description: '오리지널 치킨의 맛을 버거로', descriptionEn: 'Original chicken taste in burger', category: 'classic', burgerType: 'franchise' },

    // 노브랜드버거 (No Brand Burger) - 5개
    { name: 'NBB 시그니처', nameEn: 'NBB Signature', brand: '노브랜드버거', brandEn: 'No Brand Burger', description: '가성비 최고의 시그니처 버거', descriptionEn: 'Best value signature burger', category: 'korean', burgerType: 'franchise' },
    { name: 'NBB 어메이징', nameEn: 'NBB Amazing', brand: '노브랜드버거', brandEn: 'No Brand Burger', description: '가성비 좋은 더블 패티 버거', descriptionEn: 'Value double patty burger', category: 'premium', burgerType: 'franchise' },
    { name: 'NBB 치즈버거', nameEn: 'NBB Cheeseburger', brand: '노브랜드버거', brandEn: 'No Brand Burger', description: '심플한 치즈버거', descriptionEn: 'Simple cheeseburger', category: 'classic', burgerType: 'franchise' },
    { name: 'NBB 베이컨버거', nameEn: 'NBB Bacon Burger', brand: '노브랜드버거', brandEn: 'No Brand Burger', description: '베이컨이 들어간 버거', descriptionEn: 'Burger with bacon', category: 'classic', burgerType: 'franchise' },
    { name: 'NBB 머쉬룸버거', nameEn: 'NBB Mushroom Burger', brand: '노브랜드버거', brandEn: 'No Brand Burger', description: '버섯소스의 풍미', descriptionEn: 'Mushroom sauce flavor', category: 'classic', burgerType: 'franchise' },

    // 프리미엄 브랜드
    { name: '쉑버거', nameEn: 'ShackBurger', brand: '쉐이크쉑', brandEn: 'Shake Shack', description: '앵거스 비프 패티와 쉑소스', descriptionEn: 'Angus beef patty with ShackSauce', category: 'premium', burgerType: 'franchise' },
    { name: '스모크쉑', nameEn: 'SmokeShack', brand: '쉐이크쉑', brandEn: 'Shake Shack', description: '베이컨과 체리 페퍼가 들어간 버거', descriptionEn: 'Burger with bacon and cherry peppers', category: 'premium', burgerType: 'franchise' },
    { name: '치즈버거', nameEn: 'Cheeseburger', brand: '파이브가이즈', brandEn: 'Five Guys', description: '신선한 재료로 만든 수제 치즈버거', descriptionEn: 'Fresh handmade cheeseburger', category: 'premium', burgerType: 'franchise' },

    // 수제버거 브랜드
    { name: '다운타우너 클래식', nameEn: 'Downtowner Classic', brand: '다운타우너', brandEn: 'Downtowner', description: '서울 대표 수제버거', descriptionEn: "Seoul's signature handmade burger", category: 'handmade', burgerType: 'handmade' },
    { name: '버거보이 스매시', nameEn: 'Burger Boy Smash', brand: '버거보이', brandEn: 'Burger Boy', description: '스매시 패티의 정석', descriptionEn: 'The standard of smash patties', category: 'handmade', burgerType: 'handmade' },
    { name: '매드포갈릭 버거', nameEn: 'Mad for Garlic Burger', brand: '매드포갈릭', brandEn: 'Mad for Garlic', description: '마늘 소스가 일품인 수제버거', descriptionEn: 'Handmade burger with garlic sauce', category: 'handmade', burgerType: 'handmade' },
    { name: '슈퍼두퍼 치즈', nameEn: 'Super Duper Cheese', brand: '슈퍼두퍼', brandEn: 'Super Duper', description: '더블 치즈의 진한 맛', descriptionEn: 'Rich double cheese flavor', category: 'handmade', burgerType: 'handmade' },
    { name: '브루클린 버거', nameEn: 'Brooklyn Burger', brand: '브루클린 더 버거 조인트', brandEn: 'Brooklyn The Burger Joint', description: '뉴욕 스타일 수제버거', descriptionEn: 'New York style handmade burger', category: 'handmade', burgerType: 'handmade' },
  ];

  for (const burger of burgers) {
    await prisma.burger.create({ data: burger });
  }

  console.log(`Seeded ${burgers.length} burgers`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
