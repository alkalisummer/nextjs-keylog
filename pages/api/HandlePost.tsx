import { NextApiRequest, NextApiResponse } from 'next';
import { handleMySql as handleHashtag } from './HandleHashtag';

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

  let post;
  let postId;
  let postOriginId;
  let rgsrId;
  let sql = '';
  let result: { totalItems: number; items: any[]; postId: string; popularPosts: any[]; hashtagArr: string[] } = {
    totalItems: 0,
    items: [],
    postId: '',
    popularPosts: [],
    hashtagArr: [],
  };

  await connection.connect();

  switch (params.type) {
    case 'list':
      rgsrId = params.id;
      const perPage = params.perPage;
      const currPageNum = params.currPageNum;
      const sttRowNum = perPage * (currPageNum - 1) + 1;
      const endRowNum = perPage * currPageNum;
      const searchWord = params.searchWord;
      const tempYn = params.tempYn;
      const tagId = params.tagId;
      sql = `SELECT * 
               FROM (SELECT ROW_NUMBER() OVER(ORDER BY A.RGSN_DTTM DESC) AS PAGE_INDX
                          , COUNT(*) OVER()                              AS TOTAL_ITEMS
                          , A.POST_ID                                    AS POST_ID
                          , A.POST_TITLE                                 AS POST_TITLE
                          , A.POST_CNTN                                  AS POST_CNTN
                          , A.POST_THMB_IMG_URL                          AS POST_THMB_IMG_URL
                          , A.RGSR_ID                                    AS RGSR_ID
                          , A.RGSN_DTTM                                  AS RGSN_DTTM
                          , B.USER_NICKNAME                              AS USER_NICKNAME
                          , B.USER_THMB_IMG_URL                          AS USER_THMB_IMG_URL
                          , COUNT(DISTINCT C.COMMENT_ID)                 AS COMMENT_CNT
                          , COUNT(DISTINCT D.LIKEACT_ID)                 AS LIKE_CNT
                       FROM POST A 
                  LEFT JOIN USER B 
                         ON A.RGSR_ID = B.USER_ID
                  LEFT JOIN COMMENT C
                         ON A.POST_ID = C.POST_ID
                  LEFT JOIN LIKEACT D 
                         ON A.POST_ID = D.POST_ID  
                  LEFT JOIN POST_TAG E
                         ON A.POST_ID = E.POST_ID
                      WHERE 1=1
                        AND (A.POST_ORIGIN_ID IS NULL OR A.POST_ORIGIN_ID = '')
            ${rgsrId ? `AND A.RGSR_ID = '${rgsrId}'` : ''} 
        ${searchWord ? `AND (A.POST_TITLE LIKE '%${searchWord}%' OR A.POST_CNTN LIKE '%${searchWord}%')` : ''}
            ${tempYn ? `AND A.TEMP_YN = '${tempYn}'` : ''}   
             ${tagId ? `AND E.HASHTAG_ID = '${tagId}'` : ''}
        GROUP BY A.POST_ID
                   ORDER BY A.RGSN_DTTM 
                   ) AS A 
              WHERE PAGE_INDX >= ${sttRowNum} 
                AND PAGE_INDX <= ${endRowNum}
              ORDER BY PAGE_INDX;`;
      break;
    case 'read':
      postId = params.postId;
      sql = `SELECT POST_ID
                  , POST_TITLE
                  , POST_HTML_CNTN
                  , RGSR_ID
                  , TEMP_YN
                  , AMNT_DTTM 
              FROM POST 
             WHERE POST_ID = ${postId}`;
      break;
    case 'insert':
      post = params.post;
      sql = `INSERT INTO POST 
                         ( POST_TITLE, POST_CNTN, POST_HTML_CNTN, POST_THMB_IMG_URL, RGSR_ID, TEMP_YN, POST_ORIGIN_ID, RGSN_DTTM, AMNT_DTTM )
                  VALUES ( '${post.post_title.replaceAll("'", "''")}', '${post.post_cntn.replaceAll("'", "''")}','${post.post_html_cntn.replaceAll("'", "''")}'
                       , '${post.post_thmb_img_url}','${post.rgsr_id}', '${post.temp_yn}', ${post.post_origin_id},'${post.rgsn_dttm}', '${post.amnt_dttm}')`;
      break;
    case 'update':
      post = params.post;
      sql = `UPDATE POST 
                SET POST_TITLE = '${post.post_title.replaceAll("'", "''")}'
                  , POST_CNTN = '${post.post_cntn.replaceAll("'", "''")}'
                  , POST_HTML_CNTN = '${post.post_html_cntn.replaceAll("'", "''")}'
                  , POST_THMB_IMG_URL= '${post.post_thmb_img_url}'
                  , TEMP_YN = '${post.temp_yn}'
                  , AMNT_DTTM='${post.amnt_dttm}' 
              WHERE POST_ID='${post.post_id}'`;
      break;
    case 'delete':
      postId = params.postId;
      sql = `DELETE 
               FROM POST 
              WHERE POST_ID = ${postId}`;
      break;
    case 'dropOut':
      rgsrId = params.email;
      sql = `DELETE 
               FROM POST 
              WHERE RGSR_ID = '${rgsrId}'`;
      break;
    case 'getRecentPost':
      rgsrId = params.id;
      sql = `SELECT POST_ID
                  , POST_TITLE
                  , POST_THMB_IMG_URL
                  , RGSN_DTTM
               FROM POST
              WHERE RGSR_ID = '${rgsrId}'
                AND TEMP_YN = 'N'
              ORDER BY RGSN_DTTM DESC
              LIMIT 3`;
      break;
    case 'getPopularPost':
      rgsrId = params.id;
      sql = `SELECT A.*
               FROM (SELECT A.POST_ID           AS POST_ID
                          , A.POST_TITLE        AS POST_TITLE
                          , A.POST_THMB_IMG_URL AS POST_THMB_IMG_URL
                          , A.RGSN_DTTM         AS RGSN_DTTM
                          , COUNT(B.LIKEACT_ID) AS LIKE_CNT
                       FROM POST A
                       LEFT JOIN LIKEACT B 
                         ON A.POST_ID = B.POST_ID
                      WHERE A.RGSR_ID  = '${rgsrId}'
                        AND A.TEMP_YN = 'N'
                      GROUP BY A.POST_ID) AS A
              WHERE A.LIKE_CNT > 0 
              ORDER BY A.LIKE_CNT DESC, A.RGSN_DTTM DESC
              LIMIT 3`;
      break;
    case 'deleteTempPost':
      postOriginId = params.postOriginId;
      sql = `DELETE FROM POST WHERE POST_ORIGIN_ID = '${postOriginId}'`;
      break;
    case 'getLastTempPost':
      postOriginId = params.postId;
      sql = `SELECT POST_ID
                  , POST_TITLE
                  , POST_HTML_CNTN
                  , TEMP_YN
                  , RGSN_DTTM
              FROM POST 
             WHERE POST_ORIGIN_ID = '${postOriginId}'
             ORDER BY RGSN_DTTM DESC 
             LIMIT 1`;
      break;
  }

  await new Promise((resolve, reject) => {
    connection.query(sql, (error: any, data: any, fields: any) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        if (!data.length) {
          result.postId = data.insertId;
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

export default async function HandlePost(request: NextApiRequest, response: NextApiResponse) {
  let params;

  if (request.method === 'GET') {
    params = request.query;
  } else if (request.method === 'POST') {
    params = request.body.data;
  }
  const result = await handleMySql(params);
  if (params.type === 'getRecentPost') {
    params.type = 'getPopularPost';
    result.popularPosts = (await handleMySql(params)).items;
  }

  if (params.type === 'getLastTempPost') {
    if (result.items.length > 0) {
      params.type = 'getHashtag';
      console.log(result.items[0]);
      params.postId = result.items[0].POST_ID;
      result.hashtagArr = (await handleHashtag(params)).items;
    }
  }

  // hashtag 등록, 수정
  const hashtagArr = params.post?.hashtag_arr as string[];
  const originTagArr = (await handleHashtag({ type: 'getHashtag', postId: params.post?.post_id })).items;

  const insertTag = async (tagName: string, postId: string) => {
    let tagParams = { type: '', hashtagName: tagName, hashtagId: '', postId: postId };
    tagParams.type = 'checkHashtag';
    const tagData = await handleHashtag(tagParams);
    let tagId = tagData.items[0]?.HASHTAG_ID;

    //기존에 없는 해시태그라면 신규 등록
    if (tagData.totalItems === 0) {
      tagParams.type = 'insertHashtag';
      tagId = (await handleHashtag(tagParams)).hashtagId;
    }

    tagParams.type = 'insertPostTag';
    tagParams.hashtagId = tagId;
    await handleHashtag(tagParams);
  };

  const deleteTag = async (tagId: string, postId: string) => {
    let tagParams = { type: 'deleteHashtag', hashtagId: tagId, postId: postId };
    await handleHashtag(tagParams);
  };

  if (hashtagArr && hashtagArr.length > 0) {
    for (let hashtag of hashtagArr) {
      if (params.type === 'insert') {
        //해시태그 신규등록
        await insertTag(hashtag, result.postId);
      } else if (params.type === 'update') {
        // 기존에 없는 해시태그라면 신규 등록
        const findTag = originTagArr.filter((tag) => tag.HASHTAG_NAME === hashtag);
        if (findTag.length === 0) {
          await insertTag(hashtag, params.post?.post_id);
        }
      }
    }
  }

  //삭제된 해시태그 제거
  if (params.type === 'update' && originTagArr && originTagArr.length > 0) {
    for (let orginTag of originTagArr) {
      const findTag = hashtagArr.filter((tag) => tag === orginTag.HASHTAG_NAME);
      if (findTag.length === 0) {
        deleteTag(orginTag.HASHTAG_ID, params.post?.post_id);
      }
    }
  }

  response.status(200).json(result);
}
