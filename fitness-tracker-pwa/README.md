# 🌸 건강친구 - Korean Fitness Tracker PWA

한국 스타일 피트니스 트래커 Progressive Web App (PWA)

## 특징

- **한국어 인터페이스**: 완전히 한국어로 된 사용자 인터페이스
- **오프라인 지원**: Service Worker 를 통한 오프라인 작동
- **모바일 최적화**: 반응형 디자인으로 모든 기기에서 작동
- **데이터 저장**: localStorage 를 통한 자동 데이터 저장
- **주간 차트**: 7 일간 활동 기록 시각화
- **동기 부여 명언**: 매일 바뀌는 한국 속담과 명언
- **PWA 설치 가능**: 홈 화면에 추가하여 앱처럼 사용

## 주요 기능

### 📊 활동 추적
- 걸음 수 기록
- 칼로리 소모량 추적
- 운동 시간 관리
- 물 섭취량 기록

### 🎯 목표 달성
- 일일 목표 설정 (기본 10,000 걸음)
- 원형 진행률 표시기
- 실시간 목표 달성률 확인

### 📈 주간 통계
- 지난 7 일간 활동 차트
- 요일별 비교 분석

### 💡 동기 부여
- 매일 바뀌는 motivational quote
- 한국 속담과 건강 명언

## 설치 및 실행

### 로컬 서버로 실행

```bash
cd fitness-tracker-pwa
npm start
```

그런 다음 브라우저에서 `http://localhost:8080` 으로 접속하세요.

### PWA 로 설치

1. Chrome 또는 Safari 브라우저에서 사이트 접속
2. 주소창의 "홈 화면에 추가" 또는 "설치" 버튼 클릭
3. 기기의 홈 화면에서 앱 실행

## 파일 구조

```
fitness-tracker-pwa/
├── index.html          # 메인 HTML 파일
├── styles.css          # 스타일시트 (한국적 디자인)
├── app.js              # 애플리케이션 로직
├── sw.js               # Service Worker (오프라인 지원)
├── manifest.json       # PWA 매니페스트
├── icon-192.png        # 앱 아이콘 (192x192)
├── icon-512.png        # 앱 아이콘 (512x512)
└── package.json        # npm 패키지 설정
```

## 디자인 컨셉

- **색상**: 부드러운 코랄 핑크 (#FF6B6B)와 민트 그린 (#4ECDC4)
- **폰트**: Noto Sans KR (구글 폰트)
- **아이콘**: 벚꽃 테마의 한국적 디자인
- **레이아웃**: 모바일 우선의 카드 기반 UI

## 기술 스택

- HTML5
- CSS3 (Custom Properties, Grid, Flexbox)
- Vanilla JavaScript (ES6+)
- Service Worker API
- LocalStorage API
- Web App Manifest

## 브라우저 호환성

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## 라이선스

MIT License

---

**건강친구** 와 함께 건강한 습관을 만들어가요! 💪🌸
