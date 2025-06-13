import { NextApiRequest, NextApiResponse } from 'next';

const conn = {
  // mysql 접속 설정
  host: process.env.CLOUD_MYSQL_HOST,
  port: process.env.CLOUD_MYSQL_PORT,
  user: process.env.CLOUD_MYSQL_USER,
  password: process.env.CLOUD_MYSQL_PASSWORD,
  database: process.env.CLOUD_MYSQL_DATABASE_NM,
};

export const handleMySql = async (params: any) => {
  const mysql = require('mysql');
  const connection = mysql.createConnection(conn);

  let hashtagArr: string[];
  let hashtagId: string;
  let hashtagName: string;
  let postId: string;
  let userId: string;
  let sql = '';
  let result: { totalItems: number; items: any[]; hashtagId: string } = {
    totalItems: 0,
    items: [],
    hashtagId: '',
  };

  await connection.connect();

  switch (params.type) {
    case 'getHashtag':
      postId = params.postId;
      userId = params.id;
      sql = `SELECT A.POST_ID      AS POST_ID
                  , A.HASHTAG_ID   AS HASHTAG_ID
                  , B.HASHTAG_NAME AS HASHTAG_NAME
                  , C.RGSN_DTTM    AS RGSN_DTTM
               FROM POST_TAG A
          LEFT JOIN HASHTAG B
                 ON A.HASHTAG_ID = B.HASHTAG_ID
          LEFT JOIN POST C
                 ON A.POST_ID = C.POST_ID
              WHERE 1=1
    ${postId ? `AND A.POST_ID = '${postId}'` : ''}        
    ${
      userId
        ? `AND C.RGSR_ID = '${userId}'
           AND C.TEMP_YN = 'N'
         ORDER BY RGSN_DTTM DESC`
        : ''
    }`;
      break;
    case 'getHashtagCnt':
      userId = params.id;
      sql = `SELECT A.HASHTAG_ID   AS HASHTAG_ID
                  , B.HASHTAG_NAME AS HASHTAG_NAME
                  , COUNT(*)       AS HASHTAG_CNT
               FROM POST_TAG A
          LEFT JOIN HASHTAG B
                 ON A.HASHTAG_ID = B.HASHTAG_ID
          LEFT JOIN POST C
                 ON A.POST_ID = C.POST_ID
              WHERE 1=1
    ${
      userId
        ? `AND C.RGSR_ID = '${userId}'
           AND C.TEMP_YN = 'N'
         GROUP BY A.HASHTAG_ID
         ORDER BY HASHTAG_NAME 
           `
        : ''
    }`;

      break;
    case 'checkHashtag':
      hashtagName = params.hashtagName;
      sql = `SELECT HASHTAG_ID
                  , HASHTAG_NAME 
               FROM HASHTAG
              WHERE UPPER(HASHTAG_NAME) = UPPER('${hashtagName}')`;
      break;
    case 'insertPostTag':
      hashtagId = params.hashtagId;
      postId = params.postId;
      sql = `INSERT INTO POST_TAG
                         (POST_ID, HASHTAG_ID)
                  VALUES ('${postId}', '${hashtagId}')`;
      break;
    case 'insertHashtag':
      hashtagName = params.hashtagName;
      sql = `INSERT INTO HASHTAG
                          (HASHTAG_NAME)
                   VALUES ('${hashtagName}')`;
      break;
    case 'deleteHashtag':
      postId = params.postId;
      hashtagId = params.hashtagId;
      sql = `DELETE 
               FROM POST_TAG
              WHERE POST_ID = ${postId}
                AND HASHTAG_ID = ${hashtagId}`;
      break;
  }

  await new Promise((resolve, reject) => {
    connection.query(sql, (error: any, data: any, fields: any) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        if (!data.length) {
          result.hashtagId = data.insertId;
        } else {
          let rowArr = [];
          for (let row of data) {
            rowArr.push(row);
          }
          result.totalItems = rowArr[0].TOTAL_ITEMS || rowArr.length;
          result.items = rowArr;
        }
        resolve(result);
      }
    });
  });

  connection.end();
  return result;
};

export default async function HandleHashtag(request: NextApiRequest, response: NextApiResponse) {
  let params;

  if (request.method === 'GET') {
    params = request.query;
  } else if (request.method === 'POST') {
    params = request.body.data;
  }
  const result = await handleMySql(params);

  response.status(200).json(result);
}
