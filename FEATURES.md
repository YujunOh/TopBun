# TopBun Features Documentation

Complete guide to all features in the TopBun burger community platform.

---

## 🍔 Core Features

### 1. Burger Reviews
**Location**: `/reviews`

Submit and browse honest burger reviews with ratings.

**Features**:
- Add new burgers with images
- Write detailed reviews with 1-5 star ratings
- Browse all burgers with search and category filters
- View average ratings and review counts
- Localized burger names (Korean/English)

**Categories**:
- Classic (클래식)
- Premium (프리미엄)
- Handmade (수제)
- Korean (한국식)

---

### 2. ELO Rankings
**Location**: `/rankings`

Real-time burger rankings powered by head-to-head matchups.

**Features**:
- 1v1 burger battles
- ELO rating system (starts at 1200)
- Live leaderboard with win/loss records
- Win rate percentages
- Responsive card-based voting interface

**How it works**:
- Each vote updates both burgers' ELO scores
- Winning against higher-rated burgers = bigger point gains
- Rankings update in real-time

---

### 3. Burger World Cup (이상형 월드컵)
**Location**: `/worldcup`

Tournament-style bracket to find your favorite burger.

**Features**:
- 16-burger single-elimination tournament
- Round progression: Round of 16 → Quarterfinals → Semifinals → Finals
- Visual matchup cards with images
- Winner announcement with confetti
- Randomized bracket generation

**Rounds**:
1. Round of 16 (16강) - 8 matches
2. Quarterfinals (8강) - 4 matches
3. Semifinals (4강) - 2 matches
4. Finals (결승) - 1 match

---

### 4. Tier List Maker
**Location**: `/tierlist`

Drag-and-drop tier list creator for ranking burgers.

**Features**:
- 6 tiers: S, A, B, C, D, F
- Drag burgers between tiers
- Drag to reorder within tiers
- Color-coded tier rows
- Persistent state during session
- Mobile-friendly touch support

**Tier Colors**:
- S: Red (#ef4444)
- A: Orange (#f97316)
- B: Yellow (#eab308)
- C: Green (#22c55e)
- D: Blue (#3b82f6)
- F: Purple (#a855f7)

---

### 5. Burger Builder
**Location**: `/builder`

Interactive burger stacking game.

**Features**:
- Stack ingredients to build custom burgers
- 8 ingredient types: bun top, patty, cheese, lettuce, tomato, onion, pickle, bun bottom
- Visual stacking with realistic layering
- Save and share your creations
- Completion screen with summary

**Ingredients**:
- Top Bun (윗빵)
- Beef Patty (패티)
- Cheese (치즈)
- Lettuce (양상추)
- Tomato (토마토)
- Onion (양파)
- Pickle (피클)
- Bottom Bun (아랫빵)

---

### 6. Deals (할인정보)
**Location**: `/deals`

Share and discover burger promotions and discounts.

**Features**:
- Submit deal information with details
- Track discount rates (10-50%+)
- Original price vs. deal price comparison
- Start and end dates for promotions
- Importance levels (1-5)
- Source links to official promotions
- Automatic expiration (hides past deals)
- Empty state with call-to-action

**Deal Information**:
- Title and description
- Brand name
- Discount percentage
- Price comparison
- Valid date range
- Promotion source URL

---

### 7. Burger Coach (버거코치)
**Location**: `/places`

Discover burger restaurants and locations.

**Features**:
- Add burger place information
- Handmade vs. franchise classification
- Address and phone number
- Map integration (Naver Map, Kakao Map)
- Photo uploads for locations
- Rating system (0-5 stars)
- Review count tracking
- Empty state with call-to-action

**Place Types**:
- Handmade (수제버거)
- Franchise (프랜차이즈)

**Map Integration**:
- Naver Map links
- Kakao Map links
- Direct navigation from cards

---

### 8. Community
**Location**: `/community`

Social features for burger enthusiasts.

**Features**:
- Create text posts
- Like/unlike posts
- Comment on posts
- View post details
- User attribution
- Timestamp display
- Responsive grid layout

---

### 9. Profile
**Location**: `/profile`

User account management and activity tracking.

**Features**:
- View user information
- Edit profile details
- Activity history
- Contribution statistics
- OAuth integration ready

**Supported OAuth Providers** (setup required):
- Naver
- Kakao
- Google
- GitHub

See `OAUTH_SETUP.md` for configuration instructions.

---

## 🎨 UI/UX Features

### Dark Mode
**Access**: Theme toggle in navigation bar

**Modes**:
- Light mode
- Dark mode
- System preference (auto-detects OS theme)

**Implementation**:
- CSS variables for theme colors
- Persistent preference (localStorage)
- Smooth transitions between themes
- All pages fully themed

---

### Search & Filters
**Location**: Reviews page

**Features**:
- Real-time search with debounce (300ms)
- Search by burger name (Korean/English)
- Search by brand name
- Category filtering
- Case-insensitive matching
- Results count display

---

### Internationalization (i18n)
**Languages**: Korean (ko), English (en)

**Features**:
- Language switcher in navigation
- All UI text translated
- Localized burger names
- Localized brand names
- Date/time formatting
- Number formatting
- Persistent language preference

**Translation Coverage**:
- Navigation
- All page content
- Form labels and placeholders
- Error messages
- Success messages
- Empty states

---

### Progressive Web App (PWA)
**Features**:
- Installable on mobile devices
- App icons (192x192, 512x512)
- Offline-ready manifest
- Add to home screen
- Native app-like experience

**Icons**:
- `/icon-192.png` - 192x192px
- `/icon-512.png` - 512x512px

---

### Loading States
**Implementation**: Skeleton screens

**Pages with loading states**:
- Reviews
- Rankings
- Deals
- Places
- Profile

**Features**:
- Animated pulse effect
- Matches actual content layout
- Smooth transition to real content

---

### Error Boundaries
**Coverage**: All major pages

**Features**:
- Graceful error handling
- User-friendly error messages
- "Try Again" action buttons
- Prevents full app crashes
- Localized error text

**Pages with error boundaries**:
- Deals
- Places
- Profile
- Community posts

---

### Empty States
**Design**: Friendly, actionable messages

**Features**:
- Icon illustrations
- Helpful messaging
- Call-to-action buttons
- Scroll-to-form functionality
- Localized text

**Pages with empty states**:
- Deals (no active promotions)
- Places (no registered locations)
- Reviews (no burgers)

---

## 🔧 Technical Features

### Database
**ORM**: Prisma
**Database**: PostgreSQL (production), SQLite (development)

**Models**:
- Burger
- Review
- Deal
- BurgerPlace
- PlacePhoto
- BurgerEvent
- Post
- Comment
- PostLike
- User

**Optimizations**:
- Indexed fields for performance
- Efficient queries with includes
- Server-side filtering
- Pagination ready

---

### Server Actions
**Pattern**: Next.js Server Actions

**Available Actions**:
- `getDeals()` - Fetch active deals
- `createDeal()` - Submit new deal
- `getPlaces()` - Fetch burger places
- `createPlace()` - Add new location
- `createPlacePhoto()` - Upload place photos
- `createEvent()` - Add burger events

**Validation**:
- Required field checks
- Date range validation
- Type safety with TypeScript
- Error handling with try/catch

---

### Form Handling
**Features**:
- Client-side validation
- Server-side validation
- Loading states during submission
- Success/error feedback
- FormData API
- Revalidation after mutations

---

### Image Optimization
**Implementation**: Next.js Image component

**Features**:
- Automatic format optimization (WebP)
- Responsive images
- Lazy loading
- Blur placeholder support
- Proper alt text for accessibility

---

### Responsive Design
**Breakpoints**: Tailwind CSS defaults

**Features**:
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interactions
- Adaptive navigation
- Optimized for all screen sizes

**Grid Layouts**:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns

---

## 📊 Data & Seeding

### Seed Data
**Command**: `npx prisma db seed`

**Included Data**:
- 16 Korean burgers (맥도날드, 버거킹, 롯데리아, etc.)
- 8 sample deals (10-50% discounts)
- 10 burger places (5 franchise + 5 handmade)
- Realistic Korean addresses and phone numbers

**Brands**:
- 맥도날드 (McDonald's)
- 버거킹 (Burger King)
- 롯데리아 (Lotteria)
- 맘스터치 (Mom's Touch)
- KFC

---

## 🚀 Deployment

### Vercel Deployment
**Live URL**: https://topbun.vercel.app

**Environment Variables Required**:
```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://topbun.vercel.app

# OAuth (optional)
NAVER_CLIENT_ID=...
NAVER_CLIENT_SECRET=...
KAKAO_CLIENT_ID=...
KAKAO_CLIENT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_ID=...
GITHUB_SECRET=...
```

See `OAUTH_SETUP.md` for OAuth provider setup instructions.

---

## 🧪 Testing

### Build Verification
```bash
npm run build
```

**Checks**:
- TypeScript compilation
- ESLint warnings
- Route generation
- Static page optimization

### Type Checking
```bash
npx tsc --noEmit
```

---

## 📝 Code Quality

### ESLint Configuration
**File**: `.eslintrc.overrides.json`

**Documented Exceptions**:
- `set-state-in-effect` patterns for sessionStorage/localStorage sync
- Intentional patterns in AuthProvider, ThemeProvider, SearchInput

### TypeScript
**Strict Mode**: Enabled

**Features**:
- Full type coverage
- No implicit any
- Strict null checks
- Type-safe server actions

---

## 🎯 Future Enhancements

### Planned Features
- [ ] Filters for Deals page (brand, discount rate, sort)
- [ ] Filters for Places page (brand, type, sort)
- [ ] Pagination for Deals and Places
- [ ] Toast notifications for form submissions
- [ ] Integration tests
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Social sharing
- [ ] Advanced analytics

---

## 📚 Additional Documentation

- `README.md` - Project overview and setup
- `OAUTH_SETUP.md` - OAuth provider configuration
- `.sisyphus/plans/topbun-v2-improvements.md` - Development roadmap

---

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

**Tech Stack**:
- Next.js 16
- TypeScript
- Tailwind CSS v4
- Prisma
- PostgreSQL

---

## 📄 License

MIT License - See LICENSE file for details

---

**Last Updated**: 2026-02-07
**Version**: 2.0
**Status**: Production Ready ✅
