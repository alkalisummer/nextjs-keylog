import React from 'react';

interface article {
  image: {
    imageUrl: string;
    newsUrl: string;
    source: string;
  };
  snippet: string;
  source: string;
  timeAgo: string;
  title: string;
  url: string;
}

interface articlesSummary {
  title: string;
  snippet: string;
}

const ArticlePrompt = (articles: article[], keyword: string) => {
  const articlesStringify = JSON.stringify(
    articles.map((obj: articlesSummary) => {
      return { title: obj.title, summary: obj.snippet };
    })
  );

  const promptMsg = `너는 전문적인 블로거이다. 내가 '${keyword}'라는 키워드로 작성된 뉴스기사 데이터들을 JSON 객체 배열 데이터로 제공해줄테니 이 데이터를 참고해서 사람들이 흥미를 가질만한 주제와 내용으로 블로그 글을 작성해라. 블로그 글은 제목, 목차, 내용으로 구성하되 HTML 데이터로 만든다. 제목은 h1태그를 사용하고 목차는 목차는 h2 태그를 사용하여 작성한다. HTML데이터 외에 불필요한 응답은 생략한다. 뉴스기사 데이터는 다음과 같다.`;
  const articlsPromptMessage = { role: 'user', content: promptMsg.concat(' ', articlesStringify) };

  return articlsPromptMessage;
};

export default ArticlePrompt;
