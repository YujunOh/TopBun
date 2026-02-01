# TopBun - 대한민국 No.1 버거 커뮤니티

한국 버거를 리뷰하고, 순위를 매기고, 이상형 월드컵으로 최애 버거를 찾아보세요!

## 기능

- **버거 리뷰** — 솔직한 버거 평가와 별점
- **ELO 랭킹** — 대결 기반 실시간 순위
- **이상형 월드컵** — 16강/8강/4강 토너먼트
- **티어표 메이커** — 드래그앤드롭으로 S~F 티어 분류
- **버거 빌더** — 재료를 쌓아 드림 버거 만들기
- **다국어** — 한국어/영어 지원

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: SQLite + Prisma ORM
- **i18n**: next-intl
- **DnD**: @dnd-kit

## 실행 방법

```bash
# 의존성 설치
npm install

# 데이터베이스 마이그레이션
npx prisma migrate dev

# 시드 데이터 (16개 한국 버거)
npx prisma db seed

# 개발 서버 시작
npm run dev
```

http://localhost:3000 에서 확인하세요!

## 프로젝트 구조

```
src/
├── app/[locale]/        # 페이지 라우트
│   ├── reviews/         # 버거 리뷰
│   ├── rankings/        # ELO 랭킹
│   ├── worldcup/        # 이상형 월드컵
│   ├── tierlist/        # 티어표
│   └── builder/         # 버거 빌더
├── components/          # 재사용 컴포넌트
├── actions/             # Server Actions
├── lib/                 # 유틸리티 (Prisma, ELO)
└── i18n/                # 국제화 설정
```

## License

MIT
