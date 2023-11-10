<div align="center">
<img width="300" alt="Intro" src="https://objectstorage.ap-chuncheon-1.oraclecloud.com/n/axnytihm1smd/b/kihoon-bucket/o/keylog_logo.png"/><br>
next.js 기반의 수익형 블로그 사이트입니다.<br/>
실시간으로 가장 많은 사람들이 검색하는 인기 키워드 및 관련기사 정보와 해당 키워드의 일자별 관심도 정보를 차트로 제공합니다.<br/>
AutoPosting 기능으로 해당 키워드로 작성된 최근 기사들의 내용을 요약하여 자동으로 포스트를 생성하고 관련 이미지를 검색하여 포스트에 추가할 수 있습니다.
</div>
<br/>

## 👀  keylog 구경하기
- 📎 [https://keylog.hopto.org](https://keylog.hopto.org)

<br/>
<br/>

## 📅 개발 기간
- 1차 : 2023.07.02 ~ 2023.10.08
- 리팩토링 : 2023.10.22 ~ 진행중
<br/>
<br/>

## 🧑🏻‍💻 기술스택
- <img src="https://img.shields.io/badge/React-v18.2.0-61DAFB?logo=React"/> <img src="https://img.shields.io/badge/TypeScript-v5.1.3-3178C6?logo=TypeScript"/> <img src="https://img.shields.io/badge/Next.js-v13.4.5-000000?logo=Next.js"/> 
- <img src="https://img.shields.io/badge/React--Redux-v8.1.3-764ABC?logo=Redux"/> <img src="https://img.shields.io/badge/Redux--Saga-v1.2.3-999999?logo=Redux-Saga"/> <img src="https://img.shields.io/badge/Axios-v1.40-5A29E4?logo=Axios"/>
- <img src="https://img.shields.io/badge/MUI-v5.14.5-007FFF?logo=MUI"/> <img src="https://img.shields.io/badge/Echarts-v5.4.3-AA344D?logo=Apache Echarts"/> <img src="https://img.shields.io/badge/TOAST UI Editor-v3.2.3-515ce6"/>
- <img src="https://img.shields.io/badge/Node.js-v18.15.0-339933?logo=Node.js"/> <img src="https://img.shields.io/badge/MySQL-v8.0.34-4479A1?logo=MySQL"/>
- <img src="https://img.shields.io/badge/Oracle Cloud-F80000?logo=Oracle"/>

<br/>
<br/>

## 📌 화면 구성

| 메인 페이지 | 게시물 검색페이지 |
| :-------: | :-------: | 
|<img width="500" alt="스크린샷 2023-11-10 14 56 59" src="https://github.com/alkalisummer/nextjs-keylog/assets/47405224/b68f52ec-5cac-47b8-b9cb-6b70e7c012d5">| <img width="500" alt="search" src="https://github.com/alkalisummer/nextjs-keylog/assets/47405224/626b853a-7156-4440-b6b5-44b6691df372">|
| 블로그 메인페이지 | 블로그 게시글 상세페이지 |
|<img width="500" alt="blogIndex" src="https://github.com/alkalisummer/nextjs-keylog/assets/47405224/d83a0a3f-2d1b-4061-9780-4d37cde94507">|<img width="500" alt="blogDetail" src="https://github.com/alkalisummer/nextjs-keylog/assets/47405224/0f4569eb-ae68-4243-a4c4-12148f27fd88">|
| 게시글 작성 페이지 | 계정 관리 |
|<img width="500" alt="write" src="https://github.com/alkalisummer/nextjs-keylog/assets/47405224/d81523ab-9a15-4e5a-9dc8-9f6d9cad6f2e">|<img width="500" alt="account" src="https://github.com/alkalisummer/nextjs-keylog/assets/47405224/db06a6a2-27d6-4eed-b8d0-0fcea0fa6f85">|
|로그인 페이지|회원가입 페이지|
|<img width="500" alt="login" src="https://github.com/alkalisummer/nextjs-keylog/assets/47405224/ad133215-428f-4fa9-8ad2-c1116e723ecb">|<img width="500" alt="signup" src="https://github.com/alkalisummer/nextjs-keylog/assets/47405224/5234b5a3-859e-4438-b21d-98d6d7a61426">|

<br/>
<br/>

## 💡 프로젝트 기획 배경
최근 부업으로 워드프레스와 티스토리, 네이버 블로그와 같은 블로그 플랫폼을 활용한 수익형 블로그가 성행한다는 유튜브 영상을 우연히 접했습니다. <br><br> 블로그로 수익을 창출하려면 많은 사람들이 유입되어야 광고가 많이 노출되고 이에 비례해서 수익도 증가합니다. 많은 사람들이 유입되기 위해서는 사람들이 흥미를 가지고 많이 검색을 하는 키워드를 선정하는 것이 가장 중요하다고 생각했습니다. <br><br> 어떤 키워드로 글을 작성해야 할 지 막막할때 $\color{#93edd2}'실시간으로\ 검색량\ 많은\ 키워드를\ 바로\ 알\ 수\ 있다면\ 어떨까'\$ 라는 작은 아이디어에서 키로그를 기획하게 되었습니다. 

<br/>
<br/>

## ✓ 주요 기능

#### 1. 자신만의 블로그 개설
키로그에 가입하여 자신만의 블로그를 개설할 수 있습니다. 블로그에 글을 포스팅하고 다른 회원들과 댓글로 해당 포스트에 대한 의견을 나눌 수 있습니다. 
| 블로그 개설 | 댓글, 좋아요, 퍼가기 기능 |
| :-------: | :-------: | 
|<img width="500" alt="블로그 개설" src="https://github.com/alkalisummer/nextjs-keylog/assets/47405224/c6f6f29f-b8d5-42c9-a985-82f04605d49a">| <img width="500" alt="댓글, 좋아요" src="https://github.com/alkalisummer/nextjs-keylog/assets/47405224/9d6d011d-b533-4fd4-9935-8c3a5fffedb5">|

<br><br>

#### 2. 실시간 인기검색어 확인 및 관련 데이터 제공

| 메인 페이지 인기 검색어 | 게시글 작성 인기검색어 및 연관검색어 |
| :-------: | :-------: | 
|<img width="500" alt="스크린샷 2023-11-10 16 54 29" src="https://github.com/alkalisummer/nextjs-keylog/assets/47405224/87d97ad6-e1fb-4b2c-aea6-1d9c5ede1b23">|<img width="500" alt="스크린샷 2023-11-10 16 49 36" src="https://github.com/alkalisummer/nextjs-keylog/assets/47405224/ba72b96e-6d63-4783-a67a-7e5fecc61220">|
| 관심도 변화 그래프 | 관련 뉴스 기사 |
| <img width="500" alt="스크린샷 2023-11-10 16 49 49" src="https://github.com/alkalisummer/nextjs-keylog/assets/47405224/15d4958e-f8bf-40a6-81e5-df2ec1fbb3b9"> | <img width="500" alt="스크린샷 2023-11-10 16 50 13" src="https://github.com/alkalisummer/nextjs-keylog/assets/47405224/04fdffd0-0fd8-4f27-bbd5-7eaee6baf508"> |

- 인기검색어 및 연관검색어 : 구글 트렌드 API와 네이버 데이터랩 API를 활용하여 실시간 인기 검색어 키워드를 검색량이 많은 순으로 제공하고 키워드 선택시 해당 키워드의 연관 검색어를 제공합니다.<br>
- 관심도 변화 그래프 : 관심도 변화 그래프에서는 네이버 데이터랩 API에서 산정한 해당키워드 관심도 지수(100점 만점)의 1년 추이를 제공합니다. 다른 키워드와의 관심도 비교도 가능합니다.<br>
- 관련 기사 정보 : 선택한 키워드로 작성된 최근 기사 데이터를 제공합니다. 기사를 클릭시 해당 기사 URL로 새 창이 열립니다.<br>

<br><br>

#### 3. AutoPosting 및 이미지 검색

| AutoPosting | 이미지 검색 |
| :-------: | :-------: | 
|![ezgif com-gif-maker](https://github.com/alkalisummer/nextjs-keylog/assets/47405224/1fb3aa96-6e99-4fa4-9a86-5e4d80a219c5)|<img width="500" alt="스크린샷 2023-11-10 17 54 13" src="https://github.com/alkalisummer/nextjs-keylog/assets/47405224/29bebd21-f707-4989-9666-96c03bcc2bec">|

- AutoPossting : 네이버 뉴스 API로 해당 키워드로 작성된 최근 기사의 정보를 크롤링하고 블로그 게시글을 자동으로 생성합니다. 클립보드 복사 기능을 제공하여 텍스트 에디터에 바로 붙여 넣을 수 있습니다.
- 이미지 검색 : 네이버 이미지 검색 API를 사용하여 키워드로 검색한 이미지를 30개씩 표출합니다. 무한 스크롤로 구현하여 스크롤이 최하단까지 도달하였을경우 새로운 이미지 30개를 표출합니다. URL 클립보드 복사 기능으로 이미지 url 을 복사하여 에디터에 삽입할 수 있습니다.

#### 4. 해시태그

|해시태그 목록| 해시태그 검색|
| :-------: | :-------: | 
|<img width="500" alt="스크린샷 2023-11-10 18 11 13" src="https://github.com/alkalisummer/nextjs-keylog/assets/47405224/1a43486c-ced8-40bd-8342-8f185f59edf7">|<img width="500" alt="스크린샷 2023-11-10 18 11 26" src="https://github.com/alkalisummer/nextjs-keylog/assets/47405224/03f91866-5832-4676-b770-075bbfc4ddd9">|

- 글 저장시 해시태그를 저장하고 블로그에서 좌측 하단영역에서 태그 목록별로 조회할 수 있습니다.
- 게시글 상세페이지의 해시태그를 클릭시 해당 해시태그로 조회된 모든 게시글을 검색합니다.


## 📁 아키텍쳐
#### 디렉토리 구조

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



    












