<div align="center">
<img width="300" alt="Intro" src="https://objectstorage.ap-chuncheon-1.oraclecloud.com/n/axnytihm1smd/b/keylog-bucket/o/IMG20250916161042.webp"/><br>
Next.js 기반으로 인기 키워드를 활용해 포스트를 작성하는 블로그 서비스입니다.<br/>
Google Trends의 실시간 트렌드를 바탕으로 사람들이 많이 검색하는 키워드와 관련 기사, 키워드별 일자별 관심도를 차트로 제공합니다.<br/>
AI Posting 기능은 최근 기사 내용을 분석하여 블로그 포스트를 자동 생성하고, 관련 이미지를 검색해 포스트에 간편하게 추가할 수 있습니다.
</div>
<br/>

## 👀 keylog 구경하기

- 📎 [https://keylog.dev](https://keylog.dev)

<br/>
<br/>

## 📅 개발 기간

- 1차 : 2023.07.02 ~ 2023.10.08
- 리팩토링 : 2025.07.01 ~ 2025.08.31
  - Next.js 업그레이드: 13.4.5 → 15.3.3
  - Pages Router → App Router 마이그레이션
  - FSD 아키텍처 기반 기능 단위 분할로 전반적 구조 재설계
  - React Query 기반 서버 상태 관리 및 Optimistic Update 도입
  - 백엔드 분리: 서버 컴포넌트의 직접 DB 접근을 NestJS(Fastify) + TypeORM + MySQL 기반 백엔드로 전환([NestJS Backend Repo](https://github.com/alkalisummer/nestjs-keylog))
  - Google Trends API 변경 대응: Deprecated된 npm 패키지를 fork하여 수정·기능 추가 후 신규 버전 배포([@alkalisummer/google-trends-js](https://www.npmjs.com/package/@alkalisummer/google-trends-js))
    <br/>
    <br/>

## 🧑🏻‍💻 기술스택

- <img src="https://img.shields.io/badge/React-v19.1.0-61DAFB?logo=React"/> <img src="https://img.shields.io/badge/TypeScript-v5.8.3-3178C6?logo=TypeScript"/> <img src="https://img.shields.io/badge/Next.js-v15.3.3-000000?logo=Next.js"/>
- <img src="https://img.shields.io/badge/React Query-v5.80.10-FF4154?logo=reactquery"/>
- <img src="https://img.shields.io/badge/Next Auth-v4.24.11-666666?logo=nextdotjs"/>
- <img src="https://img.shields.io/badge/React Hook Form-v7.59.0-EC5990?logo=reacthookform"/> <img src="https://img.shields.io/badge/Zod-v3.25.67-408AFF?logo=zod"/>
- <img src="https://img.shields.io/badge/Sass-v1.89.2-CC6699?logo=sass"/> <img src="https://img.shields.io/badge/MUI-v7.1.1-007FFF?logo=MUI"/> <img src="https://img.shields.io/badge/Echarts-v5.6.0-AA344D?logo=apacheecharts"/> <img src="https://img.shields.io/badge/TOAST UI Editor-v3.2.3-515ce6"/>
- <img src="https://img.shields.io/badge/Node.js-v24.1.0-339933?logo=Node.js"/>
- <img src="https://img.shields.io/badge/Oracle Cloud Instance--545454?logo=databricks"/> <img src="https://img.shields.io/badge/Oracle Cloud Bucket(S3)--545454?logo=databricks"/>
- <img src="https://img.shields.io/badge/OpenAI-v5.19.0-412991?logo=openai"/>

<br/>
<br/>

## 💡 프로젝트 기획 배경

최근 워드프레스, 티스토리, 네이버 블로그 등 다양한 플랫폼을 활용한 수익형 블로그가 성행한다는 영상을 우연히 접했습니다. 블로그로 수익을 내려면 많은 유입이 필요한데, 이를 위해서는 사람들이 많이 검색하는 키워드를 선정하는 것이 핵심이라고 생각했습니다.
그때 문득 ‘실시간으로 검색량이 많은 키워드를 바로 확인할수 있다면 어떨까?’라는 아이디어가 떠올랐고, 그 생각에서 키로그(Keylog)가 시작되었습니다.

<br/>
<br/>

## 📌 화면 구성

|                                              메인 페이지 - 급상승 키워드                                              |                                                  메인 - 포스팅 검색                                                   |
| :-------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------: |
| <img width="500" alt="image" src="https://github.com/user-attachments/assets/832c52af-dc6b-48db-863b-3272fdac52b7" /> | <img width="500" alt="image" src="https://github.com/user-attachments/assets/4be874b8-960e-479b-96c2-8462de28d9e3" /> |
|                                                   블로그 메인페이지                                                   |                                               블로그 게시글 상세페이지                                                |
| <img width="500" alt="image" src="https://github.com/user-attachments/assets/5f4ce146-362d-4c9e-8570-aabe8dbbc43a" /> | <img width="500" alt="image" src="https://github.com/user-attachments/assets/dc250f02-1126-4a40-9bb7-3c848daa6a16" /> |
|                                                  게시글 작성 페이지                                                   |                                                       계정 관리                                                       |
| <img width="500" alt="image" src="https://github.com/user-attachments/assets/0c93c905-178f-4b36-b55a-2333d89adf47" /> | <img width="500" alt="image" src="https://github.com/user-attachments/assets/926b0f88-9933-4f17-8cf7-63a7099cae42" /> |
|                                                     로그인 페이지                                                     |                                                    회원가입 페이지                                                    |
| <img width="500" alt="image" src="https://github.com/user-attachments/assets/c047cacf-4820-4155-85cf-f1501fb03381" /> | <img width="500" alt="image" src="https://github.com/user-attachments/assets/9d7a063e-65f1-483f-acbf-b95fb6110f29" /> |

<br/>
<br/>

## ✓ 주요 기능

#### 1. 자신만의 블로그 개설

|                                                      블로그 개설                                                      |                                               댓글, 좋아요, 퍼가기 기능                                               |
| :-------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------: |
| <img width="500" alt="image" src="https://github.com/user-attachments/assets/5f4ce146-362d-4c9e-8570-aabe8dbbc43a" /> | <img width="500" alt="image" src="https://github.com/user-attachments/assets/5f84208a-01f2-4f96-a03e-ac771f2db23c" /> |

- 키로그에 가입해 나만의 블로그를 만들고, 포스트를 작성해 다른 회원들과 댓글로 소통할 수 있습니다.

<br><br>

#### 2. 실시간 인기검색어 확인 및 관련 데이터 제공

|                                                메인 페이지 인기 검색어                                                |                                         게시글 작성 인기검색어 및 연관검색어                                          |
| :-------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------: |
| <img width="500" alt="image" src="https://github.com/user-attachments/assets/832c52af-dc6b-48db-863b-3272fdac52b7" /> | <img width="300" alt="image" src="https://github.com/user-attachments/assets/32d1c8d8-87a0-481f-8e73-1b238b5da5ec" /> |
|                                                      관심도 차트                                                      |                                                    관련 뉴스 정보                                                     |
| <img width="400" alt="image" src="https://github.com/user-attachments/assets/6801d4f9-1694-4717-8456-ad515fb3c4f2" />| <img width="300" alt="image" src="https://github.com/user-attachments/assets/5b1c7257-60f3-4911-9930-ad55d11fcf52" /> |

- 인기검색어 및 연관검색어: 구글 트렌드 API로 실시간 인기 키워드를 검색량 순으로 제공하며, 키워드 선택 시 연관 검색어를 함께 보여줍니다.<br>
- 관심도 차트: 현재 시각 기준 시간대별 해당 키워드의 관심도 지수(100점 만점)를 라인 그래프로 제공합니다. 최대 5개 키워드까지 같은 시간대에 상대적인 관심도 지표를 비교할 수 있습니다.<br>
- 관련 뉴스 정보: 선택한 키워드와 관련된 최신 뉴스 데이터를 제공합니다. 기사 클릭 시 원문이 새 창으로 열립니다.<br>

<br><br>

#### 3. AI Posting 및 이미지 검색

|                                                         AI 포스팅                                                         |                                                      이미지 검색                                                      |
| :-----------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------: |
| <img width="300" alt="autoposting" src="https://github.com/user-attachments/assets/3303bd63-174e-4f32-b0c8-969d09e00d22"> | <img width="500" alt="image" src="https://github.com/user-attachments/assets/c3e4b30e-13fb-4c8f-839f-6793449ccca5" /> |

- AI 포스팅: 네이버 뉴스 API로 특정 키워드의 최근 이틀 내의 기사들을 수집하고, OpenAI API와 전문 블로거용 프롬프트를 활용해 자동으로 블로그 게시글을 생성합니다. 클립보드 복사 기능으로 에디터에 바로 붙여넣을 수 있습니다.<br>
- 이미지 검색: 네이버 이미지 검색 API로 특정 키워드의 이미지를 10개씩 표시합니다. 무한 스크롤을 적용해 마지막 이미지가 뷰포트에 노출되면 다음 10개를 불러옵니다. URL 클립보드 복사 기능으로 이미지 URL을 복사해 에디터에 삽입할 수 있습니다.<br>

<br><br>

#### 4. 해시태그

|                                               새 글 작성 - 해시태그 저장                                               |                                                 상세페이지 - 해시태그                                                  |
| :--------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------: |
| <img width="1700" alt="image" src="https://github.com/user-attachments/assets/a9621db5-8921-43fb-8456-d23e04e47ee4" /> | <img width="1231" alt="image" src="https://github.com/user-attachments/assets/c9d8ead7-d4c0-4483-8200-942a89c85169" /> |
|                                                  블로그 해시태그 목록                                                  |                                                     해시태그 검색                                                      |
| <img width="300" alt="image" src="https://github.com/user-attachments/assets/0e6350c5-c3e8-4ea9-99c9-be543cc79bfd" />  | <img width="1000" alt="image" src="https://github.com/user-attachments/assets/5133fa62-78c8-44bd-8a33-82876719e532" /> |

- 글 저장 시 해시태그를 함께 저장하며, 블로그 좌측 하단 영역에서 태그별로 조회할 수 있습니다.<br>
- 게시글 상세페이지의 해시태그를 클릭하면 해당 태그로 조회된 모든 게시글을 확인할 수 있습니다.<br>

<br><br>

#### 5. 임시저장

|                                                      임시글 목록                                                      |
| :-------------------------------------------------------------------------------------------------------------------: |
| <img width="500" alt="image" src="https://github.com/user-attachments/assets/e5608523-569b-4e66-84dd-456262eead4c" /> |

- 게시글 임시 저장 기능을 제공합니다. 임시 글은 브라우저 로컬 스토리지가 아닌 DB에 저장되어, 기기와 상관없이 어디서든 불러올 수 있습니다.<br>
- 신규 작성 중인 임시 글은 임시 글 목록에서 확인할 수 있습니다.<br>

<br><br>

#### 6. 비밀번호 찾기

|                                                     비밀번호 찾기                                                     |                                                       메일 발송                                                       |                                                     비밀번호 변경                                                     |
| :-------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------: |
| <img width="500" alt="image" src="https://github.com/user-attachments/assets/3f90319d-814d-4762-bba9-d5124409eb70" /> | <img width="500" alt="image" src="https://github.com/user-attachments/assets/e343b7a5-9828-4ba3-870e-be1cbbde4d41" /> | <img width="500" alt="image" src="https://github.com/user-attachments/assets/8a23b873-c1b6-4edc-b88f-fdc9b139f38c" /> |

- ID와 가입 시 인증한 이메일이 일치하는 회원을 확인한 뒤, 비밀번호 변경 링크를 메일로 전송합니다.<br>
- 메일은 발송 시점 기준으로 30분 동안만 유효하며, crypto.randomBytes를 통해 생성한 보안 난수 기반 토큰을 함께 전달합니다.<br>
- 사용자가 링크를 클릭하면 비밀번호 변경 화면으로 이동하며, 이때 전달된 토큰과 만료 시간이 유효한지 검증한 뒤 비밀번호를 변경할 수 있습니다.<br>

<br><br>

## 📁 아키텍쳐

#### Frontend (Next.js)

```
src/
├── app/                         # App Router 영역
│   ├── [userId]/                # 사용자 블로그
│   │   ├── [postId]/page.tsx    # 게시글 상세
│   │   ├── layout.tsx
│   │   └── page.tsx             # 사용자 블로그 메인
│   ├── api/                     # API Route
│   │   ├── ai/route.ts
│   │   ├── articles/route.ts
│   │   ├── auth/
│   │   │   ├── [...nextauth]/*.ts
│   │   │   └── refreshToken/*.ts
│   │   ├── image-proxy/route.ts
│   │   ├── naverArticles/route.ts
│   │   └── trend/
│   │       ├── dailyTrends/*.ts
│   │       ├── interestOverTime/*.ts
│   │       └── searchImage/*.ts
│   ├── findPassword/            # 비밀번호 찾기
│   ├── resetPassword/[token]/   # 비밀번호 재설정
│   ├── login/                   # 로그인
│   ├── signup/                  # 회원가입
│   ├── write/                   # 글쓰기
│   ├── home/                    # 메인 홈
│   ├── provider/                # Providers
│   │   ├── query/
│   │   └── session/
│   ├── error.tsx
│   ├── global-error.tsx
│   ├── not-found.tsx
│   └── layout.tsx
├── entities/                    # 비지니스 엔티티 계층
│   ├── article/
│   ├── comment/
│   ├── hashtag/
│   ├── like/
│   ├── post/
│   └── trend/
├── features/                    # 기능 계층
│   ├── account/
│   ├── comment/
│   ├── like/
│   ├── login/
│   ├── logout/
│   ├── post/
│   └── signup/
├── shared/                      # 공용 레이어
│   ├── boundary/
│   ├── hooks/
│   ├── lib/
│   │   ├── client/
│   │   ├── constants/
│   │   ├── dompurify/
│   │   ├── echarts/
│   │   ├── oci/
│   │   ├── reactBits/
│   │   └── toastEditor/
│   └── ui/
├── styles/
│   ├── fonts/
│   ├── globals.css
│   └── scss/
└── widgets/                     # 페이지 위젯
    ├── article/
    ├── footer/
    ├── header/
    └── sidebar/
```
