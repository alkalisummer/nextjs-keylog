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

  let commentId;
  let postId;
  let commentDepth;
  let commentOriginId;
  let commentCntn;
  let rgsrId;
  let rgsnDttm;
  let amntDttm;
  let sql = '';
  let result: { totalItems: number; items: any[]; commentId: string; refeshList: any } = {
    totalItems: 0,
    items: [],
    commentId: '',
    refeshList: {},
  };

  await connection.connect();

  switch (params.type) {
    case 'getCommentlist':
      postId = params.postId;
      sql = `SELECT A.COMMENT_ID
                  , A.COMMENT_DEPTH
                  , A.COMMENT_ORIGIN_ID
                  , A.COMMENT_CNTN
                  , A.RGSR_ID
                  , A.RGSN_DTTM 
                  , B.USER_NICKNAME
                  , B.USER_THMB_IMG_URL 
                  , COUNT(C.COMMENT_ID) AS REPLY_CNT
              FROM COMMENT A 
              LEFT JOIN USER B 
                ON A.RGSR_ID = B.USER_ID 
              LEFT JOIN COMMENT C
                ON A.COMMENT_ID = C.COMMENT_ORIGIN_ID
               AND C.COMMENT_DEPTH = 2
             WHERE A.POST_ID = '${postId}' 
             GROUP BY A.COMMENT_ID
             ORDER BY COMMENT_DEPTH ASC, RGSN_DTTM ASC`;
      break;
    case 'writeComment':
      postId = params.postId;
      commentDepth = 1;
      commentCntn = params.commentCntn;
      rgsrId = params.rgsrId;
      rgsnDttm = params.currentTime;
      amntDttm = params.currentTime;
      sql = `INSERT INTO COMMENT 
                         (POST_ID, COMMENT_DEPTH, COMMENT_CNTN, RGSR_ID, RGSN_DTTM, AMNT_DTTM ) 
                  VALUES ( '${postId}', '${commentDepth}','${commentCntn.replaceAll("'", "''")}','${rgsrId}', '${rgsnDttm}', '${amntDttm}')`;
      break;
    case 'updateComment':
      commentId = params.commentId;
      commentCntn = params.commentCntn;
      amntDttm = params.currentTime;
      sql = `UPDATE COMMENT 
                SET COMMENT_CNTN = '${commentCntn.replaceAll("'", "''")}'
                  , AMNT_DTTM = '${amntDttm}' 
              WHERE COMMENT_ID = '${commentId}'`;
      break;
    case 'deleteComment':
      commentId = params.commentId;
      sql = `DELETE 
               FROM COMMENT 
              WHERE COMMENT_ID = '${commentId}'`;
      break;
    case 'writeReply':
      postId = params.postId;
      commentOriginId = params.commentId;
      commentDepth = 2;
      commentCntn = params.commentCntn;
      rgsrId = params.rgsrId;
      rgsnDttm = params.currentTime;
      amntDttm = params.currentTime;
      sql = `INSERT INTO COMMENT 
                         (POST_ID, COMMENT_ORIGIN_ID, COMMENT_DEPTH, COMMENT_CNTN, RGSR_ID, RGSN_DTTM, AMNT_DTTM ) 
                  VALUES ( '${postId}', '${commentOriginId}', '${commentDepth}','${commentCntn.replaceAll("'", "''")}','${rgsrId}', '${rgsnDttm}', '${amntDttm}')`;
      break;
  }

  await new Promise((resolve, reject) => {
    connection.query(sql, (error: any, data: any, fields: any) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        if (!data.length) {
          result.commentId = data.insertId;
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

export default async function HandleComment(request: NextApiRequest, response: NextApiResponse) {
  let params;

  if (request.method === 'GET') {
    params = request.query;
  } else if (request.method === 'POST') {
    params = request.body.data;
  }
  const result = await handleMySql(params);
  //댓글 작성, 수정, 삭제 후  전체 댓글 리스트 재조회
  if (params.type === 'writeComment' || params.type === 'updateComment' || params.type === 'deleteComment' || params.type === 'writeReply') {
    params.type = 'getCommentlist';
    const commentList = await handleMySql(params).then((res) => res.items);
    result.refeshList = commentList;
  }

  response.status(200).json(result);
}
