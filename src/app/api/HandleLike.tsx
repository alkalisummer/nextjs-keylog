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

  let likeactId: string;
  let userId: string;
  let postId: string;
  let rgsnDttm: string;
  let amntDttm: string;
  let sql = '';
  let result: { totalItems: number; items: any[]; likeactId: string; refreshCnt: any } = {
    totalItems: 0,
    items: [],
    likeactId: '',
    refreshCnt: {},
  };

  await connection.connect();

  switch (params.type) {
    case 'getLikeCnt':
      postId = params.postId;
      sql = `SELECT USER_ID
                  , COUNT(*) OVER (PARTITION BY POST_ID) AS LIKE_CNT
               FROM LIKEACT
              WHERE POST_ID = '${postId}'`;
      break;
    case 'increaseLikeCnt':
      postId = params.postId;
      userId = params.userId;
      rgsnDttm = params.currentTime;
      amntDttm = params.currentTime;
      sql = `INSERT INTO LIKEACT
                         (POST_ID, USER_ID, RGSN_DTTM, AMNT_DTTM)
                  VALUES ('${postId}', '${userId}', '${rgsnDttm}', '${amntDttm}')`;
      break;
    case 'decreaseLikeCnt':
      postId = params.postId;
      userId = params.userId;
      sql = `DELETE 
               FROM LIKEACT 
              WHERE POST_ID = '${postId}'
                AND USER_ID = '${userId}'`;
      break;
  }

  await new Promise((resolve, reject) => {
    connection.query(sql, (error: any, data: any, fields: any) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        if (!data.length) {
          result.likeactId = data.insertId;
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

export default async function HandleLike(request: NextApiRequest, response: NextApiResponse) {
  let params;

  if (request.method === 'GET') {
    params = request.query;
  } else if (request.method === 'POST') {
    params = request.body.data;
  }
  const result = await handleMySql(params);
  //댓글 작성, 수정, 삭제 후  전체 댓글 리스트 재조회
  if (params.type === 'increaseLikeCnt' || params.type === 'decreaseLikeCnt') {
    params.type = 'getLikeCnt';
    const likeCnt = await handleMySql(params).then((res) => res.items);
    result.refreshCnt = likeCnt;
  }

  response.status(200).json(result);
}
