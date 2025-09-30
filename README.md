# Lucky Lotto - 복권 대행 구매 사이트

React + TypeScript + Vite + Tailwind CSS로 구축된 복권 대행 구매 사이트입니다.

## 🚀 기술 스택

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4.x
- **Backend**: Supabase (예정)
- **Package Manager**: npm

## 📋 주요 기능

- **복권 게임 카드**: 메가밀리언, 파워볼 정보 표시
- **퀵 액션 버튼**: 빠른 구매 및 서비스 접근
- **서비스 카드**: 고객센터, 구매가이드 등 서비스 안내
- **가이드 섹션**: 구매가이드/당첨가이드 탭 전환
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원

## 🛠️ 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 미리보기
npm run preview
```

## 📝 커밋 규칙 (Conventional Commits)

이 프로젝트는 [Conventional Commits](https://www.conventionalcommits.org/) 규칙을 따릅니다.

### 커밋 메시지 형식

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Type 종류

| Type | 설명 | 예시 |
|------|------|------|
| `feat` | 새로운 기능 추가 | `feat: 로그인 기능 추가` |
| `fix` | 버그 수정 | `fix: 헤더 레이아웃 오류 수정` |
| `docs` | 문서 수정 | `docs: README 업데이트` |
| `style` | 코드 스타일 변경 (기능 변경 없음) | `style: CSS 클래스 정리` |
| `refactor` | 코드 리팩토링 | `refactor: 컴포넌트 분리` |
| `perf` | 성능 개선 | `perf: 이미지 최적화` |
| `test` | 테스트 추가/수정 | `test: 유닛 테스트 추가` |
| `chore` | 빌드, 설정 파일 수정 | `chore: 패키지 의존성 업데이트` |
| `ci` | CI/CD 설정 변경 | `ci: GitHub Actions 설정` |
| `build` | 빌드 시스템 변경 | `build: Vite 설정 수정` |

### Scope (선택사항)

- `header`: 헤더 관련
- `main`: 메인 페이지 관련
- `guide`: 가이드 섹션 관련
- `service`: 서비스 카드 관련
- `lottery`: 복권 카드 관련
- `layout`: 레이아웃 관련
- `config`: 설정 파일 관련

### 커밋 예시

```bash
# 새로운 기능
feat(guide): 당첨가이드 탭 기능 추가

# 버그 수정
fix(header): 모바일 메뉴 버튼 클릭 오류 수정

# 스타일 변경
style(main): 복권 카드 레이아웃 조정

# 리팩토링
refactor(service): ServiceCard 컴포넌트 분리

# 문서 수정
docs: 커밋 규칙 가이드 추가

# 설정 변경
chore: Tailwind CSS 4.x 업그레이드
```

### 커밋 메시지 작성 가이드

1. **제목은 50자 이내**로 작성
2. **첫 글자는 소문자**로 시작
3. **마침표(.)로 끝내지 않음**
4. **명령문 형태**로 작성 (예: "add" not "added")
5. **Body는 72자마다 줄바꿈**
6. **Breaking Change는 `!` 표시** (예: `feat!: API 변경`)

### 예시

```bash
# 좋은 예시
feat(guide): 구매가이드 8단계 프로세스 추가
fix(header): 로그인 버튼 스타일 수정
docs: README에 설치 가이드 추가

# 나쁜 예시
update guide
Fix bug
Add new feature
```

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   └── Layout.tsx      # 레이아웃 컴포넌트 (헤더, 푸터)
├── pages/              # 페이지 컴포넌트
│   └── Main.tsx        # 메인 페이지
├── lib/                # 유틸리티 및 설정
│   └── supabase.ts     # Supabase 클라이언트 설정
├── types/              # TypeScript 타입 정의
│   └── index.ts        # 공통 타입
├── App.tsx             # 루트 컴포넌트
├── main.tsx            # 애플리케이션 진입점
└── index.css           # 글로벌 스타일

public/
├── guide_*.png         # 가이드 아이콘들
├── guide2_*.png        # 당첨가이드 아이콘들
├── lotto_logo_*.png    # 복권 로고들
├── nmi_*.png           # 퀵 액션 아이콘들
└── icon_supoort.png    # 서비스 카드 스프라이트 이미지
```

## 🎨 디자인 시스템

- **색상**: Tailwind CSS 기본 팔레트 사용
- **타이포그래피**: 시스템 폰트 스택
- **아이콘**: PNG 이미지 및 SVG 아이콘
- **레이아웃**: Flexbox 및 Grid 활용
- **반응형**: Mobile-first 접근법

## 📱 반응형 브레이크포인트

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🔧 개발 도구

- **ESLint**: 코드 품질 관리
- **TypeScript**: 타입 안정성
- **Vite**: 빠른 개발 서버 및 빌드
- **Tailwind CSS**: 유틸리티 기반 스타일링
