import { NextApiRequest, NextApiResponse } from 'next';
import { hashPassword } from '@/utils/Bcypt';

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

  let sql = '';
  let result: { totalItems: number; items: any[]; insertId: string } = {
    totalItems: 0,
    items: [],
    insertId: '',
  };
  let userId: string;
  let userEmail: string;
  let userPassword: string;
  let userNickname: string;
  let userThmbImgUrl: string;
  let userBlogName: string;
  let rgsnDttm: string;
  let amntDttm: string;

  //회원가입 인증코드, 만료시간
  let verifyCodeId: string;
  let verifyCode: string;
  let expireTime: string;

  await connection.connect();

  switch (params.type) {
    case 'getUser':
      userId = params.id;
      userEmail = params.email;
      sql = `SELECT USER_ID
                  , USER_EMAIL
                  , USER_NICKNAME
                  , USER_PASSWORD
                  , USER_THMB_IMG_URL
                  , USER_BLOG_NAME 
               FROM USER 
              WHERE USER_ID = '${userId}'
 ${userEmail ? `AND USER_EMAIL = '${userEmail}'` : ''}   
              `;
      break;
    case 'signup':
      userId = params.id;
      userEmail = params.email;
      userNickname = params.nickname;
      userPassword = await hashPassword(params.password);
      userBlogName = params.blogName;
      rgsnDttm = params.rgsnDttm;
      amntDttm = params.amntDttm;
      sql = `INSERT INTO USER 
                         (USER_ID, USER_EMAIL, USER_NICKNAME, USER_PASSWORD, USER_BLOG_NAME, RGSN_DTTM, AMNT_DTTM) 
                  VALUES ('${userId}','${userEmail}', '${userNickname.replaceAll("'", "''")}', '${userPassword}', '${userBlogName.replaceAll("'", "''")}','${rgsnDttm}', '${amntDttm}')`;
      break;
    case 'updatePassword':
      userPassword = await hashPassword(params.password);
      userId = params.id;
      amntDttm = params.amntDttm;
      sql = `UPDATE USER 
                SET USER_PASSWORD = '${userPassword}'
                  , AMNT_DTTM = '${amntDttm}' 
              WHERE USER_ID = '${userId}'`;
      break;
    case 'uploadUserImg':
      userThmbImgUrl = params.imgUrl;
      userId = params.id;
      sql = `UPDATE USER 
                SET USER_THMB_IMG_URL = '${userThmbImgUrl}' 
              WHERE USER_ID = '${userId}'`;
      break;
    case 'deleteUserImg':
      userId = params.id;
      sql = `UPDATE USER 
                SET USER_THMB_IMG_URL = '' 
              WHERE USER_ID = '${userId}'`;
      break;
    case 'updateNicknameBlogName':
      userNickname = params.nickname;
      userBlogName = params.blogName;
      userId = params.id;
      sql = `UPDATE USER 
                SET USER_NICKNAME = '${userNickname.replaceAll("'", "''")}'
                  , USER_BLOG_NAME = '${userBlogName.replaceAll("'", "''")}' 
              WHERE USER_ID = '${userId}'`;
      break;
    case 'updateEmail':
      userEmail = params.email;
      userId = params.id;
      sql = `UPDATE USER 
                SET USER_EMAIL = '${userEmail}' 
              WHERE USER_ID = '${userId}'`;
      break;
    case 'getCurrentPassword':
      userId = params.id;
      sql = `SELECT USER_PASSWORD 
               FROM USER 
              WHERE USER_ID = '${userId}'`;
      break;
    case 'dropOut':
      userId = params.id;
      sql = `DELETE 
               FROM USER 
              WHERE USER_ID = '${userId}'`;
      break;
    case 'insertVerifyCode':
      verifyCode = params.verifyCode;
      expireTime = params.expireTime;
      rgsnDttm = params.rgsnDttm;
      sql = `INSERT INTO VERIFY_CODE
                         (VERIFY_CODE, EXPIRATION_TIME, RGSN_DTTM)
                  VALUES ('${verifyCode.replaceAll("'", "''")}', '${expireTime}', '${rgsnDttm}')`;
      break;
    case 'getVerifyCode':
      verifyCodeId = params.verifyCodeId;
      sql = `SELECT VERIFY_CODE_ID
                  , VERIFY_CODE
                  , EXPIRATION_TIME 
               FROM VERIFY_CODE
              WHERE VERIFY_CODE_ID = ${verifyCodeId}`;
      break;
    case 'deleteVerifyCode':
      verifyCodeId = params.verifyCodeId;
      sql = `DELETE 
               FROM VERIFY_CODE
              WHERE VERIFY_CODE_ID = ${verifyCodeId}`;
      break;
  }

  await new Promise((resolve, reject) => {
    connection.query(sql, (error: any, data: any, fields: any) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        if (!data.length) {
          result.insertId = data.insertId;
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

export default async function HandleUser(request: NextApiRequest, response: NextApiResponse) {
  let params;

  if (request.method === 'GET') {
    params = request.query;
  } else if (request.method === 'POST') {
    params = request.body.data;
  }
  const result = await handleMySql(params);

  response.status(200).json(result);
}
