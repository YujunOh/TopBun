# OAuth 설정 가이드

TopBun 앱에서 소셜 로그인을 사용하려면 각 플랫폼에서 OAuth 앱을 등록하고 환경 변수를 설정해야 합니다.

---

## 📋 필수 환경 변수

`.env.local` 파일에 다음 변수들을 추가하세요:

```bash
# NextAuth
NEXTAUTH_URL=http://localhost:3000  # 프로덕션: https://yourdomain.com
NEXTAUTH_SECRET=your-random-secret-key-here  # openssl rand -base64 32

# OAuth Providers
NAVER_CLIENT_ID=your-naver-client-id
NAVER_CLIENT_SECRET=your-naver-client-secret

KAKAO_CLIENT_ID=your-kakao-client-id
KAKAO_CLIENT_SECRET=your-kakao-client-secret

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Cloudinary (이미지 업로드)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

---

## 1. 네이버 로그인

### 애플리케이션 등록
1. [네이버 개발자 센터](https://developers.naver.com/apps/#/register) 접속
2. **애플리케이션 등록** 클릭
3. 다음 정보 입력:
   - **애플리케이션 이름**: TopBun
   - **사용 API**: 네이버 로그인
   - **서비스 환경**: PC 웹
   - **서비스 URL**: `http://localhost:3000` (개발) / `https://yourdomain.com` (프로덕션)
   - **Callback URL**: 
     - 개발: `http://localhost:3000/api/auth/callback/naver`
     - 프로덕션: `https://yourdomain.com/api/auth/callback/naver`

### 제공 정보 설정
- **필수 제공 정보**: 이메일, 닉네임
- **선택 제공 정보**: 프로필 이미지

### 환경 변수 설정
```bash
NAVER_CLIENT_ID=애플리케이션_정보의_Client_ID
NAVER_CLIENT_SECRET=애플리케이션_정보의_Client_Secret
```

---

## 2. 카카오 로그인

### 애플리케이션 등록
1. [Kakao Developers](https://developers.kakao.com/console/app) 접속
2. **애플리케이션 추가하기** 클릭
3. 앱 이름 입력: **TopBun**

### 플랫폼 설정
1. 앱 설정 > 플랫폼 > **Web 플랫폼 등록**
2. 사이트 도메인:
   - 개발: `http://localhost:3000`
   - 프로덕션: `https://yourdomain.com`

### Redirect URI 설정
1. 제품 설정 > **카카오 로그인** 활성화
2. Redirect URI 등록:
   - 개발: `http://localhost:3000/api/auth/callback/kakao`
   - 프로덕션: `https://yourdomain.com/api/auth/callback/kakao`

### 동의 항목 설정
1. 제품 설정 > 카카오 로그인 > **동의 항목**
2. 다음 항목 설정:
   - **닉네임**: 필수 동의
   - **프로필 사진**: 선택 동의
   - **카카오계정(이메일)**: 필수 동의

### 환경 변수 설정
```bash
KAKAO_CLIENT_ID=앱_설정_앱_키의_REST_API_키
KAKAO_CLIENT_SECRET=제품_설정_카카오로그인_보안의_Client_Secret (활성화 후 생성)
```

**참고**: Client Secret은 카카오 로그인 > 보안 탭에서 **활성화**해야 생성됩니다.

---

## 3. Google 로그인

### 프로젝트 생성
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 생성: **TopBun**

### OAuth 동의 화면 구성
1. **APIs & Services** > **OAuth consent screen**
2. User Type: **External** 선택
3. 앱 정보 입력:
   - **앱 이름**: TopBun
   - **사용자 지원 이메일**: 본인 이메일
   - **개발자 연락처**: 본인 이메일
4. 범위 추가:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`

### OAuth 클라이언트 ID 생성
1. **APIs & Services** > **Credentials**
2. **CREATE CREDENTIALS** > **OAuth client ID**
3. 애플리케이션 유형: **웹 애플리케이션**
4. 이름: **TopBun Web Client**
5. 승인된 자바스크립트 원본:
   - `http://localhost:3000`
   - `https://yourdomain.com`
6. 승인된 리디렉션 URI:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google`

### 환경 변수 설정
```bash
GOOGLE_CLIENT_ID=생성된_클라이언트_ID
GOOGLE_CLIENT_SECRET=생성된_클라이언트_보안_비밀
```

---

## 4. GitHub 로그인

### OAuth App 등록
1. GitHub 프로필 > **Settings** > **Developer settings** 접속
2. **OAuth Apps** > **New OAuth App**
3. 앱 정보 입력:
   - **Application name**: TopBun
   - **Homepage URL**: 
     - 개발: `http://localhost:3000`
     - 프로덕션: `https://yourdomain.com`
   - **Application description**: 버거 리뷰 커뮤니티 앱
   - **Authorization callback URL**:
     - 개발: `http://localhost:3000/api/auth/callback/github`
     - 프로덕션: `https://yourdomain.com/api/auth/callback/github`

### 환경 변수 설정
```bash
GITHUB_CLIENT_ID=생성된_Client_ID
GITHUB_CLIENT_SECRET=Generate_a_new_client_secret_클릭하여_생성
```

**참고**: Client Secret은 생성 후 **한 번만** 표시되니 즉시 복사하세요.

---

## 5. Cloudinary 이미지 업로드

### 계정 생성 및 설정
1. [Cloudinary](https://cloudinary.com/) 가입
2. Dashboard에서 **Cloud name** 확인
3. Settings > Upload > **Upload presets** > **Add upload preset**
   - Preset name: `topbun_uploads`
   - Signing Mode: **Unsigned**
   - Folder: `topbun`

### 환경 변수 설정
```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=topbun_uploads
```

---

## 🚀 배포 시 체크리스트

### Vercel 환경 변수 설정
1. Vercel 프로젝트 > **Settings** > **Environment Variables**
2. 위의 모든 환경 변수를 **Production, Preview, Development** 모두에 추가
3. **중요**: `NEXTAUTH_URL`을 프로덕션 도메인으로 변경

### 각 플랫폼에 프로덕션 URL 추가
- **네이버**: 서비스 URL, Callback URL에 프로덕션 도메인 추가
- **카카오**: Web 플랫폼, Redirect URI에 프로덕션 도메인 추가
- **Google**: 승인된 원본, 리디렉션 URI에 프로덕션 도메인 추가
- **GitHub**: Homepage URL, Callback URL에 프로덕션 도메인 추가

---

## 🐛 트러블슈팅

### "Redirect URI mismatch" 오류
- 등록한 Redirect URI와 실제 콜백 URL이 **정확히 일치**하는지 확인
- 프로토콜(`http://` vs `https://`), 포트, 경로까지 정확해야 함

### 네이버 "본인확인 이메일 제공 동의가 필요합니다"
- 네이버 개발자 센터에서 **제공 정보 설정**에 이메일을 필수로 설정

### 카카오 "KOE320" (Client Secret 오류)
- 카카오 개발자 콘솔 > 카카오 로그인 > 보안에서 **Client Secret 활성화** 필요
- 코드 검증을 **활성화**로 설정

### GitHub 로그인 후 이메일 없음
- GitHub에서 이메일을 공개하지 않은 경우 발생
- `src/auth.ts`에서 `user.email || user.id + '@github.user'` 처리 필요

---

## 📚 참고 문서

- [NextAuth.js Providers](https://next-auth.js.org/providers/)
- [네이버 로그인 API](https://developers.naver.com/docs/login/api/)
- [카카오 로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/common)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps)
