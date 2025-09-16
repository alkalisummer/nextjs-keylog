<div align="center">
<img width="300" alt="Intro" src="https://objectstorage.ap-chuncheon-1.oraclecloud.com/n/axnytihm1smd/b/keylog-bucket/o/IMG20250916161042.webp"/><br>
next.js 기반의 인기 키워드를 활용한 블로그 포스트 사이트입니다.<br/> 
Google Trends 실시간 인기 트렌드를 기반으로 현재 가장 많은 사람들이 검색하는 인기 키워드 및 관련기사 정보와 해당 키워드의 일자별 관심도 정보를 차트로 제공합니다.<br/>
AI Posting 기능으로 해당 키워드로 작성된 최근 기사들의 내용을 분석하여 블로그 포스트를 자동으로 생성하고 관련 이미지를 검색하여 포스트에 추가할 수 있습니다.
</div>
<br/>

## 👀  keylog 구경하기
- 📎 [https://keylog.dev](https://keylog.dev)

<br/>
<br/>

## 📅 개발 기간
- 1차 : 2023.07.02 ~ 2023.10.08
- 리팩토링 : 2025.07.01 ~ 2025.08.31
  - next.js version upgrade : 13.4.5 -> 15.3.3
  - pages rotuer -> app router migration
  - FSD 아키텍처 기반으로 기능 단위 분할 설계를 통해 전반적인 구조를 재설계
  - React Query를 활용한 서버상태관리 및 mutation을 활용한 optimistic update 도입
  - 백엔드 분리: 서버 컴포넌트에서 DB에 직접 접근하던 구조를 Nest.js(Fastify) + TypeORM + MySQL 기반 백엔드 서버로 전환([Nestjs Backend Repo](https://github.com/alkalisummer/nestjs-keylog))
  - Google Trends API 변경에 대응하기 위해 Deprecated 된 npm 패키지를 fork하여 수정 및 신규 기능을 추가, 신규 버전으로 배포([@alkalisummer/google-trends-js](https://www.npmjs.com/package/@alkalisummer/google-trends-js))
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
최근 부업으로 워드프레스와 티스토리, 네이버 블로그와 같은 블로그 플랫폼을 활용한 수익형 블로그가 성행한다는 유튜브 영상을 우연히 접했습니다. <br><br> 블로그로 수익을 창출하려면 많은 사람들이 유입되어야 광고가 많이 노출되고 이에 비례해서 수익도 증가합니다. 많은 사람들이 유입되기 위해서는 사람들이 흥미를 가지고 많이 검색하는 키워드를 선정하는 것이 가장 중요하다고 생각합니다. <br><br> 어떤 키워드로 글을 작성해야 할 지 막막할때 $\color{#93edd2}'실시간으로\ 검색량이\ 많은\ 키워드를\ 바로\ 알\ 수\ 있다면\ 어떨까'\$ 라는 작은 아이디어에서 키로그를 기획하게 되었습니다. 

<br/>
<br/>

## 📌 화면 구성

| 메인 페이지 - 급상승 키워드 | 메인 - 포스팅 검색|
| :-------: | :-------: | 
| <img width="500" alt="image" src="https://github.com/user-attachments/assets/832c52af-dc6b-48db-863b-3272fdac52b7" /> | <img width="500" alt="image" src="https://github.com/user-attachments/assets/4be874b8-960e-479b-96c2-8462de28d9e3" /> |
| 블로그 메인페이지 | 블로그 게시글 상세페이지 |
|<img width="500" alt="image" src="https://github.com/user-attachments/assets/5f4ce146-362d-4c9e-8570-aabe8dbbc43a" />|<img width="500" alt="image" src="https://github.com/user-attachments/assets/dc250f02-1126-4a40-9bb7-3c848daa6a16" />|
| 게시글 작성 페이지 | 계정 관리 |
|<img width="500" alt="image" src="https://github.com/user-attachments/assets/0c93c905-178f-4b36-b55a-2333d89adf47" />|<img width="500" alt="image" src="https://github.com/user-attachments/assets/926b0f88-9933-4f17-8cf7-63a7099cae42" />|
|로그인 페이지|회원가입 페이지|
|<img width="500" alt="image" src="https://github.com/user-attachments/assets/c047cacf-4820-4155-85cf-f1501fb03381" />|<img width="500" alt="image" src="https://github.com/user-attachments/assets/9d7a063e-65f1-483f-acbf-b95fb6110f29" />|

<br/>
<br/>


## ✓ 주요 기능

#### 1. 자신만의 블로그 개설

| 블로그 개설 | 댓글, 좋아요, 퍼가기 기능 |
| :-------: | :-------: | 
|<img width="500" alt="image" src="https://github.com/user-attachments/assets/5f4ce146-362d-4c9e-8570-aabe8dbbc43a" />| <img width="500" alt="image" src="https://github.com/user-attachments/assets/5f84208a-01f2-4f96-a03e-ac771f2db23c" />|

- 키로그에 가입하여 자신만의 블로그를 개설할 수 있습니다. 블로그에 글을 포스팅하고 다른 회원들과 댓글로 해당 포스트에 대한 의견을 나눌 수 있습니다. 

<br><br>

#### 2. 실시간 인기검색어 확인 및 관련 데이터 제공

| 메인 페이지 인기 검색어 | 게시글 작성 인기검색어 및 연관검색어 |
| :-------: | :-------: | 
|<img width="500" alt="image" src="https://github.com/user-attachments/assets/832c52af-dc6b-48db-863b-3272fdac52b7" />|<img width="300" alt="image" src="https://github.com/user-attachments/assets/32d1c8d8-87a0-481f-8e73-1b238b5da5ec" />|
| 관심도 차트 | 관련 뉴스 정보 |
| <img width="300" alt="image" src="https://github.com/user-attachments/assets/1a38e3a4-e54e-4c2d-b9a0-4c7458f159ec" />| <img width="300" alt="image" src="https://github.com/user-attachments/assets/5b1c7257-60f3-4911-9930-ad55d11fcf52" />|

- 인기검색어 및 연관검색어 : 구글 트렌드 API를 활용하여 실시간 인기 검색어 키워드를 검색량이 많은 순으로 제공하고 키워드 선택시 해당 키워드의 연관 검색어를 제공합니다.<br>
- 관심도 차트 : 관심도 차트에서는 현재 시각 기준 시간대별 해당키워드 관심도 지수(100점 만점)를 라인 그래프로 제공합니다. 다른 키워드와의 관심도 비교도 5개까지 가능합니다.<br>
- 관련 뉴스 정보 : 선택한 키워드와 관련된 최신 뉴스 데이터를 제공합니다. 기사를 클릭시 해당 기사 URL로 새 창이 열립니다.<br>

<br><br>

#### 3. AutoPosting 및 이미지 검색
| AI 포스팅 | 이미지 검색 |
| :-------: | :-------: | 
|<img width="300" alt="autoposting" src="https://github.com/user-attachments/assets/3303bd63-174e-4f32-b0c8-969d09e00d22">|<img width="500" alt="image" src="https://github.com/user-attachments/assets/c3e4b30e-13fb-4c8f-839f-6793449ccca5" />|

- AI 포스팅 : 네이버 뉴스 API를 통해 특정 키워드 관련 최근 2일 이내의 최신 기사를 수집한 뒤, OpenAI API 및 전문 블로거용 프롬프트를 활용하여 자동으로 블로그 게시글을 생성합니다. 클립보드 복사 기능을 제공하여 텍스트 에디터에 바로 붙여 넣을 수 있습니다.<br>
- 이미지 검색 : 네이버 이미지 검색 API를 사용하여 특정 키워드로 검색한 이미지를 10개씩 표출합니다. 무한 스크롤로 구현하여 마지막 이미지가 viewport에 노출될 경우 새로운 이미지 10개를 불러와서 표출합니다. URL 클립보드 복사 기능으로 이미지 url 을 복사하여 에디터에 삽입할 수 있습니다.<br>

<br><br>

#### 4. 해시태그
| 새 글 작성 - 해시태그 저장 | 상세페이지 - 해시태그|
| :-------: | :-------: | 
|<img width="1700" alt="image" src="https://github.com/user-attachments/assets/a9621db5-8921-43fb-8456-d23e04e47ee4" />|<img width="1231" alt="image" src="https://github.com/user-attachments/assets/c9d8ead7-d4c0-4483-8200-942a89c85169" />|
| 블로그 해시태그 목록 | 해시태그 검색 |
|<img width="300" alt="image" src="https://github.com/user-attachments/assets/0e6350c5-c3e8-4ea9-99c9-be543cc79bfd" />|<img width="1000" alt="image" src="https://github.com/user-attachments/assets/5133fa62-78c8-44bd-8a33-82876719e532" />|

- 글 저장시 해시태그를 저장하고 블로그에서 좌측 하단영역에서 태그 목록별로 조회할 수 있습니다.<br>
- 게시글 상세페이지의 해시태그를 클릭시 해당 해시태그로 조회된 모든 게시글을 검색합니다.<br>

<br><br>

#### 5. 임시저장

|임시글 목록|
| :-------: | 
|<img width="500" alt="image" src="https://github.com/user-attachments/assets/e5608523-569b-4e66-84dd-456262eead4c" />|

- 게시글 임시저장기능을 제공합니다. 임시저장 글은 브라우저의 로컬 스토리지에 저장하는 것이 아닌 DB에 저장하기 때문에 작성하던 기기에 상관없이 어디서든 불러올 수 있습니다.<br>
- 신규작성중인 임시글은 임시글 목록에서 확인이 가능합니다.<br>

<br><br>

#### 6. 비밀번호 찾기
|비밀번호 찾기| 메일 발송 | 비밀번호 변경|
| :-------: | :-------: | :-------: |
|<img width="500" alt="image" src="https://github.com/user-attachments/assets/3f90319d-814d-4762-bba9-d5124409eb70" />|<img width="500" alt="image" src="https://github.com/user-attachments/assets/e343b7a5-9828-4ba3-870e-be1cbbde4d41" />|<img width="500" alt="image" src="https://github.com/user-attachments/assets/8a23b873-c1b6-4edc-b88f-fdc9b139f38c" />|

- ID와 회원가입시 사전에 인증한 이메일로 일치하는 회원이 존재하는지 확인 후 비밀번호를 변경할 수 있는 링크를 메일로 전송합니다.<br>
- 메일은 발송 시점 기준으로 30분 동안만 유효하며, crypto.randomBytes를 통해 생성한 보안 난수 기반 토큰을 함께 전달합니다.<br>
- 사용자가 링크를 클릭하면 비밀번호 변경 화면으로 이동하며, 이때 전달된 토큰과 만료 시간이 유효한지 검증한 뒤 비밀번호를 변경할 수 있습니다.<br>



<br><br>
## 📁 아키텍쳐
#### 프로젝트 구조

```
nextjs-keylog
 ┣ components 
 ┃ ┣ BlogLayout.tsx
 ┃ ┣ Hashtag.tsx
 ┃ ┣ IndexLayout.tsx
 ┃ ┣ LeftArea.tsx : 블로그 좌측 공통 컴포넌트
 ┃ ┣ Navbar.tsx : 블로그 상단 공통 컴포넌트
 ┃ ┣ PostLayout.tsx 
 ┃ ┣ RefreshTokenHandler.tsx
 ┃ ┗ RightArea.tsx : 블로그 우측 공통 컴포넌트
 ┣ config
 ┃ ┣ bucket_url_config.tsx : Oracle Cloud 이미지 버킷 접속 정보
 ┃ ┗ config : Oracle Cloud IAM API Key 
 ┣ hooks : custom hooks
 ┃ ┣ reduxHooks.tsx
 ┃ ┗ useDebounce.tsx
 ┣ pages : 프론트 엔드
 ┃ ┣ [userId]
 ┃ ┃ ┣ chatGpt
 ┃ ┃ ┃ ┗ index.tsx
 ┃ ┃ ┣ posts
 ┃ ┃ ┃ ┗ [id].tsx
 ┃ ┃ ┣ index.tsx
 ┃ ┃ ┗ tmpPosts.tsx
 ┃ ┣ api : 서버사이드 api 함수 
 ┃ ┃ ┣ auth : next-auth 설정 폴더
 ┃ ┃ ┃ ┣ [...nextauth].tsx
 ┃ ┃ ┃ ┗ auth.d.ts
 ┃ ┃ ┣ CheckCurrentPassword.tsx
 ┃ ┃ ┣ CheckVerifyCode.tsx
 ┃ ┃ ┣ CheckVerifyToken.tsx
 ┃ ┃ ┣ DeleteImgFile.tsx
 ┃ ┃ ┣ HandleComment.tsx
 ┃ ┃ ┣ HandleHashtag.tsx
 ┃ ┃ ┣ HandleKeyword.tsx
 ┃ ┃ ┣ HandleLike.tsx
 ┃ ┃ ┣ HandlePost.tsx
 ┃ ┃ ┣ HandleUser.tsx
 ┃ ┃ ┣ SendMailHandler.tsx
 ┃ ┃ ┗ UploadImgFile.tsx
 ┃ ┣ resetPassword
 ┃ ┃ ┗ [token].tsx
 ┃ ┣ 404.tsx
 ┃ ┣ 500.tsx
 ┃ ┣ _app.tsx
 ┃ ┣ _document.tsx
 ┃ ┣ _error.tsx
 ┃ ┣ forgotPassword.tsx
 ┃ ┣ index.tsx
 ┃ ┣ login.tsx
 ┃ ┣ search.tsx
 ┃ ┣ signup.tsx
 ┃ ┗ write.tsx
 ┣ public
 ┃ ┣ font
 ┃ ┣ icon
 ┃ ┣ favicon.ico
 ┃ ┗ vercel.svg
 ┣ reducer : redux, redux-saga 
 ┃ ┗ blogUser.ts
 ┣ store 
 ┃ ┣ index.ts
 ┃ ┗ redux.d.ts
 ┣ styles
 ┃ ┣ ChatGpt.css
 ┃ ┣ Error.css
 ┃ ┣ Index.css
 ┃ ┣ List.module.css
 ┃ ┣ Login.module.css
 ┃ ┣ Navbar.css
 ┃ ┣ Post.css
 ┃ ┣ Signup.module.css
 ┃ ┣ globals.css
 ┃ ┣ leftArea.css
 ┃ ┣ rightArea.css
 ┃ ┗ write.css
 ┣ utils : 텍스트 에디터, 암호화, chatgpt 프롬프트, 공통함수 관련 폴더
 ┃ ┣ Bcypt.tsx
 ┃ ┣ ChartOpt.tsx
 ┃ ┣ ChatGptHandle.tsx
 ┃ ┣ ChatGptPrompt.tsx
 ┃ ┣ CheckAuth.tsx
 ┃ ┣ CommonUtils.tsx
 ┃ ┣ DailyTrends.tsx
 ┃ ┣ ToastEditor.tsx
 ┃ ┗ TrendKeyword.tsx
 ┣ .env : DB 접속 정보, Oracle Cloud 접속정보, chatGPT API KEY, Naver API, 메일 발송 관련 Gmail App PW
 ┣ .eslintrc.json
 ┣ .gitignore
 ┣ README.md
 ┣ middleware.tsx
 ┣ next-env.d.ts
 ┣ next.config.js
 ┣ package-lock.json
 ┣ package.json
 ┗ tsconfig.json
```



    












