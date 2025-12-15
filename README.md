# 🍽 NutrAI – 식단 기록 웹 (Demo)

목포대학교 융합소프트웨어 3학년 캡스톤 프로젝트 AI 식단추천 프로그램 프로토타입입니다.
NutrAI는 **식단 기록 · 리포트 · 식단 추천**을 중심으로 한
**클라이언트 사이드 기반 데모 웹 애플리케이션**입니다.

> ⚠️ 본 프로젝트는 **학습/포트폴리오/프로토타입 목적**의 데모이며,
> 인증 및 데이터 저장은 **localStorage**를 사용합니다.

---

## ✨ 주요 기능

### 🔐 회원가입 / 로그인

* 아이디(username) 기반 로그인
* 회원가입 시 입력 정보

  * 이름
  * 아이디 (중복 체크)
  * 이메일 (정보용, 로그인에는 사용하지 않음)
  * 비밀번호
* 로그인 성공 시 세션 유지 (localStorage)

### 🏠 홈 대시보드

* 오늘 섭취 칼로리 요약
* 목표 대비 섭취율
* 연속 기록(streak) 표시
* 사용자 프로필 수정 (모달)

### 📝 식단 기록

* 날짜별 식단 기록
* 아침 / 점심 / 저녁 / 간식 구분
* 칼로리 입력
* localStorage 저장

### 📊 리포트

* 최근 식단 기록 요약
* 섭취 추이 확인 (데모 UI)

### 🤖 식단 추천 (Demo)

* 사용자 목표/선호 기반 추천 UI
* 실제 AI 연동 없이 UX 중심 구현

---

## 🧱 기술 스택

| 구분          | 기술                      |
| ----------- | ----------------------- |
| Framework   | Next.js 16 (App Router) |
| Language    | TypeScript              |
| Styling     | Tailwind CSS            |
| State/Form  | React Hook Form + Zod   |
| Auth (Demo) | localStorage 기반         |
| Routing     | Next.js App Router      |
| Deployment  | (미정 / 로컬 데모)            |

---

## 📁 프로젝트 구조

```txt
food-web/
├─ app/
│  ├─ login/                # 로그인 페이지
│  ├─ signup/               # 회원가입
│  ├─ (app)/
│  │  ├─ dashboard/         # 홈 대시보드
│  │  ├─ logs/              # 식단 기록
│  │  ├─ reports/           # 리포트
│  │  └─ recommendations/  # 식단 추천
│
├─ components/
│  ├─ signup/               # 회원가입 단계 컴포넌트
│  ├─ profile/              # 프로필 수정 모달
│  └─ layout/               # TopBar 등 공통 UI
│
├─ lib/
│  ├─ auth.client.ts        # 인증/세션/유저 로직 (localStorage)
│  └─ schemas.ts            # Zod 스키마
│
├─ types/
│  └─ signup.ts             # SignupData 타입
│
└─ README.md
```

---

## 🔑 인증 구조 (중요)

> ⚠️ 서버 인증이 아닌 **클라이언트 데모 구조**입니다.

### 사용자 저장

* key: `food.users`
* 내용: 모든 가입 사용자 배열

### 세션 저장

* key: `food.session`
* 내용: 현재 로그인된 사용자

```ts
localStorage.setItem("food.users", JSON.stringify(users));
localStorage.setItem("food.session", JSON.stringify(user));
```

### 로그인 흐름

1. 아이디 + 비밀번호 입력
2. `loginWithUsername()` 실행
3. localStorage에 세션 저장
4. `/dashboard` 이동

---

## 🚧 제한 사항 (데모 특성)

* 서버 없음 (API / DB 미연동)
* 보안 고려 ❌ (비밀번호 평문 저장)
* 다중 사용자 동시 사용 ❌
* 실제 AI 추천 ❌ (UI만 구현)

---

## ▶️ 실행 방법

```bash
npm install
npm run dev
```

접속:
👉 [http://localhost:3000](http://localhost:3000)

---

## 🔮 향후 개선 아이디어

* 서버 API 연동 (Next.js API / NestJS)
* JWT 기반 인증
* 실제 AI 추천 모델 연동
* 리포트 차트 고도화
* 모바일 UI 최적화

---

## 📌 참고

이 프로젝트는 **실제 서비스가 아닌 학습용 데모**입니다.
구조 설계, 폼 처리, 상태 관리, UX 흐름을 중점적으로 구현했습니다.
