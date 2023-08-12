import { NextApiRequest, NextApiResponse } from 'next';

export default async function HandleKeyword(request: NextApiRequest, response: NextApiResponse) {
  const type = request.query.type;
  let res;

  switch (type) {
    case 'dailyTrends':
      const googleTrends = require('google-trends-api');
      res = await googleTrends.dailyTrends({ geo: 'KR' });
      break;
    case 'relatedQueries':
      const googleSuggests = require('get-google-suggestions');
      const searchKeyword = request.query.keyword;
      res = await googleSuggests(searchKeyword);
      break;
  }

  return response.status(200).json(res);
}
