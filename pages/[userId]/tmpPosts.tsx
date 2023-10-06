/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import BlogLayout from '../components/BlogLayout';
import Error from 'next/error';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { timeFormat } from '@/utils/CommonUtils';
import listStyle from '../../styles/List.module.css';
import cx from 'classnames';
import { GetServerSideProps } from 'next';
import { handleMySql as handlePost } from '../api/HandlePost';

interface user {
  id: string;
  email: string;
  image: string;
  nickname: string;
  blogName: string;
}

interface posts {
  totalItems: number;
  items: any[];
  postId: string;
}

interface recentPost {
  POST_ID: string;
  POST_TITLE: string;
  POST_THMB_IMG_URL: string;
  RGSN_DTTM: string;
}

interface popularPost {
  POST_ID: string;
  POST_TITLE: string;
  POST_THMB_IMG_URL: string;
  RGSN_DTTM: string;
  LIKE_CNT: number;
}

interface recentComment {
  POST_ID: string;
  COMMENT_ID: string;
  COMMENT_CNTN: string;
  USER_NICKNAME: string;
  RGSR_ID: string;
  RGSN_DTTM: string;
}

interface hashtag {
  HASHTAG_ID: string;
  HASHTAG_NAME: string;
  HASHTAG_CNT: string;
}

const TmpPosts = ({ tmpPosts, pageNum, userInfo, recentPosts, popularPosts, recentComments, hashtags }: { tmpPosts: posts; pageNum: number; userInfo: user; recentPosts: recentPost[]; popularPosts: popularPost[]; recentComments: recentComment[]; hashtags: hashtag[] }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const currentUserId = session?.user?.id;
  const { userId } = router.query;
  const [isValidate, setIsValisdate] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated' || currentUserId !== userId) {
      setIsValisdate(false);
    }
  }, [status]);

  let totalPageNum: number;

  const getTotalPostsArr = () => {
    const totalPostCnt = tmpPosts.totalItems;
    totalPageNum = totalPostCnt % 6 > 0 ? totalPostCnt / 6 + 1 : totalPostCnt / 6;
    let arr = [];

    for (let i = 1; i <= totalPageNum; i++) {
      arr.push(i);
    }

    return arr;
  };

  const handlePagination = (pageNum: number) => {
    const selectNum = pageNum ?? null;
    if (selectNum && selectNum <= totalPageNum) {
      router.push(`/${userId}?pageNum=${pageNum}`);
    }
  };

  const totalPostsArr = getTotalPostsArr();

  return (
    <>
      {isValidate ? (
        <BlogLayout userInfo={userInfo} recentPosts={recentPosts} popularPosts={popularPosts} recentComments={recentComments} hashtags={hashtags}>
          <div className={listStyle.home_div}>
            <div className={listStyle.home_header_div}>
              <img src={userInfo.image ? userInfo.image : '../../icon/person.png'} className={listStyle.home_profile_img} alt='profile img' />
              <span className={listStyle.home_blog_name}>{userInfo.blogName}</span>
              <span className={listStyle.home_header_title}>{userInfo.nickname}</span>
            </div>
            <div className={listStyle.home_main}>
              <div className={listStyle.home_post}>
                <div className={listStyle.home_header}>
                  <span className={listStyle.home_post_cnt}>{`임시 글(${tmpPosts.totalItems})`}</span>
                </div>

                {tmpPosts.items?.map((tmpPost: any) => {
                  return <TmpPostItem key={tmpPost.POST_ID} tmpPost={tmpPost} userId={userId} />;
                })}
              </div>
              <div className={listStyle.home_page_nav}>
                <span className={listStyle.home_page_nav_prev} onClick={(e) => handlePagination(Number(pageNum) - 1)}>
                  <span className={listStyle.home_page_nav_arr}>&lt;</span> &nbsp;&nbsp;Prev
                </span>
                {totalPostsArr.map((obj: number, idx: number) => {
                  return (
                    <span key={idx} className={Number(pageNum) === idx + 1 ? cx(listStyle.home_page_num, listStyle.home_page_slct_num) : listStyle.home_page_num} onClick={(e) => handlePagination(Number(e.currentTarget.textContent!))}>
                      {obj}
                    </span>
                  );
                })}
                <span className={listStyle.home_page_nav_next} onClick={(e) => handlePagination(Number(pageNum) + 1)}>
                  Next&nbsp;&nbsp; <span className={listStyle.home_page_nav_arr}>&gt;</span>
                </span>
              </div>
            </div>
          </div>
        </BlogLayout>
      ) : (
        <Error statusCode={401}></Error>
      )}
    </>
  );
};

const TmpPostItem = ({ tmpPost, userId }: any) => {
  const { POST_ID, POST_TITLE, POST_CNTN, POST_THMB_IMG_URL, RGSN_DTTM } = tmpPost || {};
  const router = useRouter();

  // 임시 게시글 삭제
  const deletePost = async (postId: string) => {
    document.getElementById(`post_id_${POST_ID}`)!.style.display = 'none';
    const cheerio = require('cheerio');
    const param = { type: 'read', postId: postId };
    let imgFileArr: string[] = [];

    // 임시 게시글에 포함된 이미지 삭제를 위해 게시글 이미지 추출
    await axios.get('/api/HandlePost', { params: param }).then((res) => {
      const post = res.data.items[0];

      const htmlCntn = Buffer.from(post.POST_HTML_CNTN).toString();
      const $ = cheerio.load(htmlCntn);
      //기존 이미지 파일 이름 추출
      const imageTags = $('img');
      imgFileArr = imageTags.map((index: number, el: any) => $(el).attr('alt')).get();
    });

    param.type = 'delete';
    await axios.get('/api/HandlePost', { params: param }).then(() => {
      if (imgFileArr.length > 0) {
        // 해당 게시글 이미지 삭제
        let removedImg = imgFileArr;
        if (removedImg.length > 0) {
          axios.post('/api/DeleteImgFile', { removedImg });
        }
      }
    });
  };

  return (
    <div id={`post_id_${POST_ID}`} className={listStyle.home_post_title_content}>
      {POST_THMB_IMG_URL ? (
        <div className={listStyle.home_post_thumb}>
          <div className={listStyle.home_thumb_content}>
            <span className={`${listStyle.home_post_title} pointer`} onClick={() => router.push(`/write?postId=${POST_ID}&keyword=true`)}>
              {POST_TITLE}
            </span>
            <p className={`${listStyle.home_post_content} pointer`} onClick={() => router.push(`/write?postId=${POST_ID}&keyword=true`)}>
              {POST_CNTN ? POST_CNTN : '작성된 내용이 없습니다.'}
            </p>
            <span className={listStyle.home_post_created}>{timeFormat(RGSN_DTTM)}</span>
          </div>
          <div className={listStyle.home_thumb_img_div}>
            <img className={`${listStyle.home_thumb_img} pointer`} src={POST_THMB_IMG_URL} alt='thumbImg' onClick={() => router.push(`write?postId=${POST_ID}&keyword=true`)} />
            <div className='w100 df jc_e mt17'>
              <span className={`${listStyle.home_post_del_btn} pointer`} onClick={() => deletePost(POST_ID)}>
                삭제
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <span className={`${listStyle.home_post_title} pointer`} onClick={() => router.push(`/write?postId=${POST_ID}&keyword=true`)}>
            {POST_TITLE}
          </span>
          <p className={`${listStyle.home_post_content} pointer`} onClick={() => router.push(`/write?postId=${POST_ID}&keyword=true`)}>
            {POST_CNTN ? POST_CNTN : '작성된 내용이 없습니다.'}
          </p>
          <div className={listStyle.home_post_bottom}>
            <span className={listStyle.home_post_created}>{timeFormat(RGSN_DTTM)}</span>
            <span className={`${listStyle.home_post_del_btn} pointer`} onClick={() => deletePost(POST_ID)}>
              삭제
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const pageNum = context.query.pageNum ? context.query.pageNum : 1;
  const userId = context.query.userId as string;
  let tmpPosts = {};

  const params = { type: 'list', perPage: 6, currPageNum: pageNum, id: userId, tempYn: 'Y' };

  await handlePost(params)
    .then((res) => JSON.stringify(res))
    .then((res) => {
      tmpPosts = JSON.parse(res);
    });

  return {
    props: {
      tmpPosts,
      pageNum: pageNum,
    },
  };
};

export default TmpPosts;
