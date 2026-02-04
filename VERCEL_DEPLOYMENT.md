# Vercel 배포 가이드

## 🚀 자동 배포 (권장)

### 1단계: Vercel CLI로 배포

```bash
# Vercel CLI 로그인 (처음 한 번만)
npx vercel login

# 프로젝트 배포 (프로덕션)
npx vercel --prod
```

**첫 배포시 질문들:**
- Set up and deploy? → **Y**
- Which scope? → 본인 계정 선택
- Link to existing project? → **N**
- Project name? → **topbun** (또는 원하는 이름)
- Directory? → **./** (엔터)
- Override settings? → **N**

### 2단계: 환경 변수 설정

Vercel 대시보드(https://vercel.com)에서:

1. 프로젝트 선택
2. **Settings** → **Environment Variables**
3. 다음 변수들 추가:

```
DATABASE_URL = postgresql://...  (Neon에서 복사)
NEXTAUTH_URL = https://your-app.vercel.app
NEXTAUTH_SECRET = (새로 생성: openssl rand -base64 32)
GITHUB_ID = ...
GITHUB_SECRET = ...
GOOGLE_CLIENT_ID = ...  (선택)
GOOGLE_CLIENT_SECRET = ...  (선택)
```

### 3단계: 데이터베이스 마이그레이션

```bash
# 로컬에서 production DATABASE_URL로 마이그레이션 실행
npx prisma migrate deploy
```

### 4단계: 재배포

```bash
# 환경 변수 추가 후 재배포
npx vercel --prod
```

---

## 📱 PWA 기능 확인

배포 완료 후:

1. **모바일에서 사이트 접속**
2. **Chrome 메뉴** → **'앱 설치'** 또는 **'홈 화면에 추가'**
3. **설치 완료!** 이제 네이티브 앱처럼 사용 가능

PWA 특징:
- ✅ 홈 화면 아이콘
- ✅ 전체 화면 모드
- ✅ 오프라인 캐싱
- ✅ 빠른 로딩
- ✅ 푸시 알림 지원 (향후 추가 가능)

---

## 🔄 GitHub 자동 배포 설정

### 1. GitHub Repository에 Push

```bash
git add .
git commit -m "feat: Add PWA support and production deployment"
git push origin main
```

### 2. Vercel과 GitHub 연동

1. Vercel 대시보드 → **Import Project**
2. GitHub repository 선택 (TopBun)
3. **Import** 클릭
4. 환경 변수 설정 (위와 동일)
5. **Deploy** 클릭

이제 `main` 브랜치에 push하면 **자동 배포**됩니다!

---

## 🗄️ Neon 데이터베이스 생성

### 1. Neon 가입

https://neon.tech 접속 → GitHub로 로그인

### 2. 프로젝트 생성

- Project name: **topbun-production**
- Region: **Asia Pacific (Singapore)** (한국과 가장 가까움)
- PostgreSQL version: **15**

### 3. Connection String 복사

Dashboard → **Connection Details** → **Connection string** 복사

예시:
```
postgresql://username:password@ep-xxx-xxx-xxx.ap-southeast-1.aws.neon.tech/neondb
```

이 값을 Vercel의 `DATABASE_URL`에 입력

### 4. 마이그레이션 실행

```bash
# .env 파일에 Neon DATABASE_URL 추가
DATABASE_URL="postgresql://..."

# 마이그레이션 실행
npx prisma migrate deploy

# 데이터 시딩 (선택)
npm run db:seed
```

---

## 🔐 OAuth 설정

### GitHub OAuth

1. https://github.com/settings/developers
2. **New OAuth App**
3. 설정:
   - Application name: **TopBun Production**
   - Homepage URL: **https://your-app.vercel.app**
   - Callback URL: **https://your-app.vercel.app/api/auth/callback/github**
4. **Client ID**와 **Client Secret** 복사
5. Vercel 환경 변수에 추가

### Google OAuth (선택)

1. https://console.cloud.google.com/apis/credentials
2. **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Application type: **Web application**
4. Authorized redirect URIs: **https://your-app.vercel.app/api/auth/callback/google**
5. Client ID와 Secret 복사
6. Vercel 환경 변수에 추가

---

## ✅ 배포 확인 체크리스트

- [ ] Vercel 배포 성공
- [ ] 홈페이지 로딩 확인
- [ ] OAuth 로그인 작동 (GitHub/Google)
- [ ] 데이터베이스 연결 확인 (버거 리스트 표시)
- [ ] 리뷰 작성 가능
- [ ] 월드컵 게임 작동
- [ ] PWA 설치 가능 (모바일 테스트)
- [ ] `/sitemap.xml` 접근 가능
- [ ] `/robots.txt` 접근 가능
- [ ] SEO 메타 태그 확인 (버거 상세 페이지)

---

## 🐛 문제 해결

### 빌드 실패

```bash
# 로컬에서 빌드 테스트
npm run build
```

에러 확인 후 수정

### 데이터베이스 연결 실패

- Vercel 환경 변수에서 `DATABASE_URL` 확인
- Neon 데이터베이스가 활성 상태인지 확인
- Connection string이 정확한지 확인

### OAuth 로그인 실패

- Callback URL이 정확한지 확인 (https://)
- `NEXTAUTH_URL`이 배포 URL과 일치하는지 확인
- `NEXTAUTH_SECRET`이 설정되었는지 확인

### PWA 설치 안됨

- HTTPS로 배포되었는지 확인 (Vercel은 자동 HTTPS)
- `/manifest.json` 접근 가능한지 확인
- Service Worker 등록 확인 (개발자 도구 → Application → Service Workers)

---

## 📊 배포 후 모니터링

### Vercel Dashboard

- **Analytics**: 방문자 수, 페이지 뷰
- **Logs**: 서버 로그, 에러 확인
- **Deployments**: 배포 히스토리

### Neon Dashboard

- **Usage**: 데이터베이스 크기, 연결 수
- **Monitoring**: 쿼리 성능
- **Backups**: 자동 백업 (Pro 플랜)

---

## 💰 비용

**무료 사용 가능:**
- Vercel Hobby: 100GB 트래픽/월 (무료)
- Neon Free: 3GB 스토리지 (무료)

**예상 사용량 (소규모 커뮤니티):**
- 월 1,000명 방문자: 무료 범위 내
- 월 10,000명 방문자: 무료 범위 내
- 월 100,000명 방문자: Vercel Pro 필요 ($20/월)

---

## 🎉 완료!

배포가 완료되었습니다! 이제:

1. ✅ **웹사이트**: https://your-app.vercel.app
2. ✅ **PWA 앱**: 모바일에서 설치 가능
3. ✅ **자동 배포**: GitHub push → 자동 배포

모바일 앱으로 사용하려면:
- Android: Chrome → 메뉴 → "앱 설치"
- iOS: Safari → 공유 → "홈 화면에 추가"

**축하합니다!** 🎊
