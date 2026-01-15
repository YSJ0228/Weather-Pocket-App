# 🌤️ Weather Pocket

<div align="center">

**세련되고 직관적인 날씨 앱**

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.18-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**🌐 [Live Demo](https://weather-pocket-app1.vercel.app/)**

[✨ 기능](#-주요-기능) • [🚀 시작하기](#-시작하기) • [🛠️ 기술 스택](#️-기술-스택) • [📱 스크린샷](#-스크린샷)

</div>

---

## 📖 소개

Weather Pocket은 현대적이고 사용자 친화적인 날씨 애플리케이션입니다. 
깔끔한 UI/UX와 직관적인 인터랙션을 통해 누구나 쉽게 날씨 정보를 확인할 수 있습니다.

## 📱 스크린샷

### 데스크톱
- 메인 화면 (날씨 정보 + 즐겨찾기)
<img width="1900" height="928" alt="image" src="https://github.com/user-attachments/assets/5d6c38b8-6936-4046-ab1f-1df0eef594f8" />
<img width="1900" height="928" alt="스크린샷 2026-01-15 오후 10 59 19" src="https://github.com/user-attachments/assets/f869e77a-7669-4f00-8f39-364ceb1e0d3b" />


- 지역 검색 및 즐겨찾기 관리
<img width="1917" height="929" alt="image" src="https://github.com/user-attachments/assets/d700b2aa-975b-43be-8c2f-34e35b83254b" />
<img width="1917" height="929" alt="image" src="https://github.com/user-attachments/assets/1bb5b9da-fea1-44c5-b3f1-ffabcfc71d22" />

- 설정 페이지
<img width="1917" height="929" alt="image" src="https://github.com/user-attachments/assets/c3ac0b2e-ec18-4fa7-a523-47d267d06df6" />


### 모바일
- 메인 화면 (날씨 정보 + 즐겨찾기)
<img width="383" height="840" alt="스크린샷 2026-01-15 오후 11 00 41" src="https://github.com/user-attachments/assets/63eb04cc-ca28-49b9-80d6-9738ed227cf0" />
<img width="383" height="840" alt="스크린샷 2026-01-15 오후 11 00 48" src="https://github.com/user-attachments/assets/47c0898d-cd7b-4778-972b-cd3c65019a8f" />

- 지역 검색 및 즐겨찾기 관리
<img width="386" height="840" alt="image" src="https://github.com/user-attachments/assets/083e15a5-4be3-4fb9-8678-9b4cef91a436" />
<img width="383" height="840" alt="image" src="https://github.com/user-attachments/assets/d430d239-e25b-4b14-8b0d-355d0d60e22a" />

- 설정 페이지
<img width="383" height="840" alt="image" src="https://github.com/user-attachments/assets/07f69ae1-a466-4fce-bd6d-a216a94963d0" />


---

### ✨ 주요 기능

#### 🌍 **실시간 날씨 정보**
- 📍 현재 위치 기반 자동 날씨 표시
- 🔍 전국 지역 검색 및 날씨 조회
- 🌡️ 체감 온도, 습도, 풍속, 강수 확률 등 상세 정보

#### ⭐ **즐겨찾기 관리**
- 최대 6개 지역 즐겨찾기 저장
- 지역명 커스터마이징 (별칭 설정)
- 즐겨찾기 카드에 현재/최고/최저 온도 표시
- 데스크톱: 호버 시 수정/삭제 버튼 표시 (슬라이딩 애니메이션)
- 모바일/태블릿: 수정/삭제 버튼 항상 표시

#### 📊 **다양한 날씨 데이터**
- ⏰ 시간별 날씨 예보 (24시간)
- 📅 주간 날씨 예보 (7일)
- 📈 일별 기온 변화 그래프
- 🌅 일출/일몰 시간
- ☀️ UV 지수, 미세먼지, 구름량

#### ⚙️ **설정 옵션**
- 🌡️ 기온 단위 선택 (°C / °F)
- ⏰ 시간 형식 선택 (12시간제 / 24시간제)
- 💾 설정 자동 저장 (localStorage)

#### 📱 **반응형 디자인**
- 💻 데스크톱, 태블릿, 모바일 완벽 지원
- 📲 모바일에서 슬라이드 패널로 즐겨찾기 표시
- 🎨 동적 배경색 (날씨에 따라 변화)
- 📐 최소 너비 설정 (360px)으로 레이아웃 안정성 보장
- 🔤 작은 화면에서 텍스트 줄바꿈 최적화
- 🎛️ 터치 친화적인 UI (충분한 터치 영역, 적절한 간격)

#### 🎨 **세련된 UI/UX**
- ✨ Glassmorphism 디자인
- 🎭 부드러운 애니메이션 및 트랜지션
- 🎯 직관적인 인터랙션
- 🔔 Toast 알림 (즐겨찾기 추가/제거/수정, 설정 변경)
- ⚠️ 친절한 에러 메시지
- 🖼️ Open Graph 이미지 (링크 공유 시 미리보기)
- 🎨 커스텀 파비콘 (브라우저 탭, iOS/macOS 홈 화면)
- 🏷️ SEO 최적화된 메타태그

---

## 🚀 시작하기

### 📋 사전 요구사항

- Node.js 18.x 이상
- npm 또는 yarn

### 📦 설치

```bash
# 저장소 클론
git clone https://github.com/YSJ0228/Weather-Pocket-App.git

# 프로젝트 디렉토리로 이동
cd Weather-Pocket-App

# 의존성 설치
npm install
```

### 🔑 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
# Kakao API 키 (필수)
VITE_KAKAO_API_KEY=your_kakao_api_key_here

# OpenWeatherMap API 키 (선택사항 - 폴백용)
VITE_WEATHER_API_KEY=your_openweathermap_api_key_here
```

#### API 키 발급 방법

1. **Kakao API 키** (필수)
   - [Kakao Developers](https://developers.kakao.com/) 접속
   - 애플리케이션 추가 → REST API 키 발급
   - 역지오코딩(좌표 → 주소 변환)에 사용

2. **OpenWeatherMap API 키** (선택사항)
   - [OpenWeatherMap](https://openweathermap.org/api) 접속
   - 무료 플랜으로 API 키 발급
   - Kakao API 실패 시 폴백으로 사용

> 💡 [Open-Meteo API](https://open-meteo.com/)는 API 키가 필요 없습니다.

### 🏃 실행

```bash
# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

개발 서버는 기본적으로 `http://localhost:5173`에서 실행됩니다.

---

## 🛠️ 기술 스택

### **Frontend**
- ⚛️ **React 19** - UI 라이브러리
- 📘 **TypeScript** - 타입 안정성
- ⚡ **Vite** - 빠른 빌드 도구
- 🎨 **Tailwind CSS** - 유틸리티 CSS 프레임워크

### **상태 관리 & 데이터 페칭**
- 🔄 **TanStack Query (React Query)** - 서버 상태 관리
- 🎯 **Context API** - 전역 상태 관리

### **API & 데이터**
- 🌐 **Open-Meteo API** - 날씨 데이터
- 📍 **Kakao Local API** - 역지오코딩 (좌표 → 주소)
- 🔄 **OpenWeatherMap Geocoding API** - 지오코딩 폴백
- 🗺️ **Geolocation API** - 사용자 위치

### **차트 & 시각화**
- 📊 **Chart.js** - 차트 라이브러리
- 📈 **react-chartjs-2** - React 차트 컴포넌트

### **아이콘 & 디자인**
- 🎯 **Lucide React** - 아이콘 라이브러리
- 🎭 **clsx & tailwind-merge** - 동적 스타일링

---

## 🤔 기술적 의사결정

### 아키텍처 선택

#### **FSD (Feature-Sliced Design) 아키텍처**
- **선택 이유**
  - 확장 가능하고 유지보수가 용이한 구조
  - 각 레이어(app, entities, features, shared, widgets)의 책임이 명확
  - 기능 단위로 코드를 분리하여 협업과 코드 파악이 쉬움
  - 대규모 프로젝트로 확장 시에도 구조 유지 가능

### 상태 관리

#### **TanStack Query (React Query)**
- **선택 이유**
  - 서버 상태 관리에 최적화 (캐싱, 자동 리페칭, 백그라운드 업데이트)
  - 보일러플레이트 코드 최소화
  - 로딩/에러 상태 자동 관리
  - `useQueries`를 통한 병렬 데이터 페칭으로 성능 최적화
- **사용 사례**: 날씨 데이터, 즐겨찾기 날씨 데이터 페칭

#### **Context API**
- **선택 이유**
  - 간단한 전역 상태 관리에 적합
  - Redux 등 외부 라이브러리 없이 React 내장 기능 활용
  - 번들 크기 최소화
- **사용 사례**: 기온 단위(°C/°F), 시간 형식(12h/24h) 설정

### API 및 데이터

#### **Open-Meteo API**
- **선택 이유**
  - 완전 무료, API 키 불필요
  - 높은 정확도와 다양한 기상 데이터 제공
  - CORS 제한 없음, 응답 속도 우수
  - 시간별/일별 예보, UV 지수, 강수 확률 등 풍부한 데이터
- **대안 고려**: OpenWeatherMap (API 키 필요, 무료 플랜 제한)

#### **Kakao Local API (역지오코딩)**
- **선택 이유**
  - 한국 주소 체계에 최적화
  - 정확한 행정구역명 제공 (시/구/동)
  - OpenWeatherMap Geocoding API를 폴백으로 사용하여 안정성 확보
  - 좌표 → 주소 변환에 특화

#### **korea_districts.json (한국 행정구역 데이터)**
- **선택 이유**
  - 오프라인 검색 가능 (API 호출 불필요)
  - 빠른 검색 성능
  - 서버 의존성 제거

### UI 라이브러리 및 스타일링

#### **Tailwind CSS**
- **선택 이유**
  - 유틸리티 우선 접근으로 빠른 개발
  - 일관된 디자인 시스템 유지
  - 사용하지 않는 스타일 자동 제거 (Purge)로 번들 크기 최소화
  - 반응형 디자인 구현 용이

#### **Lucide React**
- **선택 이유**
  - 가볍고 일관된 아이콘 세트
  - React 컴포넌트로 제공되어 사용 편리
  - 트리 쉐이킹 지원으로 번들 크기 최적화

### 차트 라이브러리

#### **Chart.js + react-chartjs-2**
- **선택 이유**
  - 널리 사용되는 안정적인 차트 라이브러리
  - 다양한 차트 타입 지원
  - 커스터마이징 용이
  - 반응형 차트 자동 지원
- **사용 사례**: 시간별 기온 그래프, 일별 온도 변화

### 타입 안정성

#### **TypeScript (Strict Mode)**
- **선택 이유**
  - 런타임 오류를 컴파일 타임에 감지
  - IDE 자동완성 및 리팩토링 지원
  - 팀 협업 시 코드 의도 명확화
  - API 응답 타입 정의로 안전한 데이터 처리

### 빌드 도구

#### **Vite**
- **선택 이유**
  - 매우 빠른 개발 서버 시작 및 HMR
  - ES 모듈 기반으로 최신 표준 활용
  - Rollup 기반 최적화된 프로덕션 빌드
  - Create React App 대비 5~10배 빠른 빌드 속도

### 데이터 저장

#### **localStorage**
- **선택 이유**
  - 간단한 클라이언트 사이드 저장소
  - 별도 백엔드 서버 불필요
  - 브라우저 간 세션 유지
- **사용 사례**: 즐겨찾기 목록, 사용자 설정(단위, 시간 형식)

---

## 📁 프로젝트 구조

```
weather-pocket/
├── src/
│   ├── app/                    # 앱 설정 및 프로바이더
│   │   ├── App.tsx
│   │   └── Providers.tsx
│   ├── entities/              # 비즈니스 엔티티
│   │   ├── favorite/         # 즐겨찾기 관련
│   │   └── weather/          # 날씨 데이터 관련
│   ├── features/             # 기능 단위 모듈
│   │   ├── search-district/ # 지역 검색
│   │   ├── time-format/     # 시간 형식 설정
│   │   └── unit-toggle/     # 단위 변환 설정
│   ├── shared/               # 공유 리소스
│   │   ├── api/             # API 클라이언트
│   │   ├── lib/             # 유틸리티 함수
│   │   └── ui/              # 공통 UI 컴포넌트
│   └── widgets/              # 복합 위젯
│       └── weather-dashboard/
├── public/                    # 정적 파일
└── package.json
```

---

## 🎯 주요 기능 상세

### 1. 날씨 정보 카드
- 현재 온도, 날씨 설명, 날씨 아이콘
- 어제 대비 온도 차이 표시
- 최고/최저 온도
- 체감 온도, 습도, 풍속, 강수 확률

### 2. 시간별 예보
- 24시간 날씨 예보
- 기온 변화 그래프
- 시간별 날씨 아이콘

### 3. 주간 예보
- 7일간 날씨 예보
- 일별 최고/최저 온도
- 강수 확률 및 날씨 상태

### 4. 상세 기상 통계
- UV 지수 (도넛 차트)
- 미세먼지 PM10 (도넛 차트)
- 구름량 (도넛 차트)
- 일출/일몰 시간

### 5. 즐겨찾기 시스템
- 최대 6개 지역 저장
- 지역명 수정 (인라인 편집)
- 호버 시 수정/삭제 버튼 표시
- 즐겨찾기 전체 삭제 (확인 모달)
- localStorage에 자동 저장

---

## 🔧 개발 가이드

### 코드 스타일
- ESLint를 사용한 코드 품질 관리
- TypeScript strict 모드 활성화
- 일관된 코드 포맷팅

### 커스텀 훅
- `useWeather` - 날씨 데이터 관리
- `useGeolocation` - 사용자 위치 정보
- `useFavorites` - 즐겨찾기 관리
- `useUnit` - 기온 단위 변환
- `useTimeFormat` - 시간 형식 관리
- `useDynamicBackground` - 동적 배경색

---

## 🌐 API 정보

### Open-Meteo API
- **엔드포인트**: `https://api.open-meteo.com/v1/forecast`
- **데이터**: 현재 날씨, 시간별/일별 예보, UV 지수, 미세먼지
- **특징**: 무료, API 키 불필요, 높은 정확도

### Kakao Local API
- **엔드포인트**: `https://dapi.kakao.com/v2/local/geo/coord2address.json`
- **용도**: 좌표 → 주소 변환 (역지오코딩)
- **특징**: 한국 주소 체계에 최적화, 정확한 행정구역명

### OpenWeatherMap Geocoding API
- **엔드포인트**: `https://api.openweathermap.org/geo/1.0`
- **용도**: 역지오코딩 폴백 (Kakao API 실패 시)
- **특징**: 글로벌 지역 지원

---

## 👨‍💻 개발자

**YSJ**
- GitHub: [@YSJ0228](https://github.com/YSJ0228)

---

## 🙏 감사의 말

- [Open-Meteo](https://open-meteo.com/) - 날씨 데이터 제공
- [Kakao Developers](https://developers.kakao.com/) - 역지오코딩 서비스
- [OpenWeatherMap](https://openweathermap.org/) - 지오코딩 폴백
- [Lucide](https://lucide.dev/) - 아이콘 제공
- [Tailwind CSS](https://tailwindcss.com/) - CSS 프레임워크
