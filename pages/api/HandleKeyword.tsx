import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

interface naverArticle {
  title: string;
  originallink: string;
  link: string;
  description: string;
  pubDate: string;
}

interface article {
  title: string;
  content: string;
}

export const getArticles = async (keyword: string) => {
  const cheerio = require('cheerio');
  let naverArticles: naverArticle[] = [];
  let articles: article[] = [];

  const searchParams = {
    params: { query: keyword, display: 30 },
    headers: {
      'X-Naver-Client-Id': process.env.X_NAVER_CLIENT_ID,
      'X-Naver-Client-Secret': process.env.X_NAVER_CLIENT_SECRET,
    },
  };

  //해당 키워드를 포함하고 네이버 뉴스에 제공된 기사만 parsing
  await axios.get('https://openapi.naver.com/v1/search/news.json', searchParams).then((res) => {
    const result = res.data.items;
    naverArticles = result.filter((article: naverArticle) => article.title.indexOf(keyword) !== -1 && article.link.indexOf('naver.com') !== -1);
  });

  //네이버 뉴스 카테고리별(일반, 연예, 스포츠)로 분류하여 크롤링
  for (let article of naverArticles) {
    await axios.get(article.link).then((res) => {
      console.log(res.data);
      if (article.link.indexOf('n.news.naver.com') !== -1) {
        // 일반기사
      } else if (article.link.indexOf('entertain.naver.com') !== -1) {
        // 연예기사
      } else if (article.link.indexOf('sports.news.naver.com') !== -1) {
        // 스포츠기사
      }
    });
    //3개의 기사만 크롤링
    if (articles.length === 3) {
      break;
    }
  }
};

export default async function HandleKeyword(request: NextApiRequest, response: NextApiResponse) {
  const googleTrends = require('google-trends-api');

  let res;
  let type = '';
  if (request.method === 'GET') {
    type = request.query.type as string;
  } else if (request.method === 'POST') {
    type = request.body.params.type;
  }

  switch (type) {
    case 'dailyTrends':
      res = await googleTrends.dailyTrends({ geo: 'KR' });
      break;
    case 'relatedQueries':
      const googleSuggests = require('get-google-suggestions');
      const searchKeyword = request.query.keyword;
      const suggestRes = await googleSuggests(searchKeyword);
      res = suggestRes;
      break;
    case 'interestOverTime':
      const keyWordArr = request.body.params.keyword;
      const today = new Date();
      const startTm = today.setDate(today.getDate() - 3);

      const interestRes = await googleTrends.interestOverTime({ keyword: keyWordArr, geo: 'KR', hl: 'ko', granularTimeResolution: true, startTime: new Date(startTm) });
      res = interestRes;
      break;
  }

  return response.status(200).json(res);
}
