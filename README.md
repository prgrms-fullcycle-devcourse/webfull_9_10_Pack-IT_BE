# 패킷 : Pack-IT Backend

AI 기술을 활용하여 서툰 진심을 따뜻한 편지로 빚어내고 전달하는 '패킷' 서비스의 백엔드 API 서버입니다.

## 🛠 기술 스택

| 기술 | 버전 | 용도 |
| :--- | :--- | :--- |
| [Node.js](https://nodejs.org/) | 20.x | 런타임 환경 |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | 프로그래밍 언어 |
| [Express](https://expressjs.com/) | 4.x | 웹 프레임워크 |
| [PostgreSQL](https://www.postgresql.org/) | 16.x | 관계형 데이터베이스 |
| [Prisma](https://www.prisma.io/) | 5.x | ORM (데이터베이스 제어) |
| [Passport.js](https://www.passportjs.org/) | 0.7.x | 카카오 소셜 로그인 인증 |
| [Zod](https://zod.dev/) | 3.x | API 요청 데이터 검증 |
| [Google Gemini SDK](https://ai.google.dev/) | 0.x | AI 편지 초안 변환 엔진 |
| [Redis](https://redis.io/) | 7.x | 캐싱 및 세션 관리 |
| [NanoID](https://github.com/ai/nanoid) | 5.x | 편지 공유용 고유 식별자 생성 |
| [pnpm](https://pnpm.io/) | 9.x | 패키지 매니저 |

## 🚀 시작하기

```bash
# 1. 의존성 패키지 설치
pnpm install

# 2. 환경변수 설정 (.env.example 파일을 복사하여 .env 생성 및 값 입력)
cp .env.example .env

# 3. 데이터베이스 스키마 동기화 (테이블 생성)
npx prisma db push

# 4. 개발 서버 실행
pnpm run dev
```

서버가 정상적으로 실행되면 `http://localhost:8080` 에서 API 를 확인할 수 있습니다.

## 📂 폴더 구조

```text
src/
├── config/           # 환경변수, 데이터베이스, Passport 등 초기 설정
├── controllers/      # 클라이언트 요청(Request) 처리 및 응답(Response) 반환
├── routes/           # API 엔드포인트 URL 라우팅
├── services/         # 비즈니스 로직 및 외부 API(Gemini) 연동 수행
├── schemas/          # Zod 를 활용한 데이터 유효성 검사 스키마
├── middlewares/      # JWT 인증, 에러 핸들링 등 공통 처리 로직
├── prisma/           # 데이터베이스 스키마 모델 정의 (schema.prisma)
├── types/            # 공통 TypeScript 타입 및 인터페이스 정의
└── utils/            # 날짜 변환, 포맷팅 등 재사용 가능한 유틸리티 함수
```

## 📝 코딩 컨벤션

협업과 유지보수를 위해 아래의 네이밍 규칙을 엄격하게 적용합니다.

### 네이밍 규칙

| 종류 | 규칙 | 예시 |
| :--- | :--- | :--- |
| **파일 및 폴더명** | camelCase | `letterController.ts`, `savedLetters` |
| **변수 및 함수** | camelCase | `getUser()`, `isPublished` |
| **클래스 및 타입 (DTO)** | PascalCase | `CreateLetterDto`, `UserType` |
| **데이터베이스 컬럼 (DB)** | snake_case | `user_id`, `created_at` |
| **API 엔드포인트 (URL)** | kebab-case | `/api/saved-letters` |
| **상수 (고정값)** | UPPER_SNAKE_CASE | `MAX_LETTER_LENGTH` |


## 🔐 환경변수 (.env)

| 변수명 | 설명 | 예시 |
| :--- | :--- | :--- |
| `PORT` | 서버 실행 포트 | `8080` |
| `DATABASE_URL` | PostgreSQL 접속 주소 | `postgresql://USER:PASSWORD@localhost:5432/itda` |
| `JWT_SECRET` | 잇다(IT-DA) 전용 JWT 암호화 키 | `your_super_secret_jwt_key` |
| `KAKAO_CLIENT_ID` | 카카오 소셜 로그인 REST API 키 | `1234abcd5678efgh...` |
| `GEMINI_API_KEY` | Google Gemini API 접근 키 | `AIzaSyB...` |

## 💻 스크립트 명령어

```bash
pnpm run dev      # 개발용 서버 실행 (ts-node-dev 활용, 코드 변경 시 자동 재시작)
pnpm run build    # 배포를 위한 JavaScript 파일로 컴파일
pnpm run start    # 컴파일된 프로덕션 서버 실행
pnpm run studio   # 브라우저에서 데이터베이스를 직접 관리하는 Prisma Studio 실행
```
