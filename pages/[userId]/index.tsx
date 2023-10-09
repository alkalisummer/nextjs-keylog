/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import BlogLayout from '../components/BlogLayout';
import { useRouter } from 'next/router';
import { timeFormat } from '@/utils/CommonUtils';
import listStyle from '../../styles/List.module.css';
import cx from 'classnames';
import { GetServerSideProps } from 'next';
import { handleMySql as handlePost } from '../api/HandlePost';
import CheckAuth from '@/utils/CheckAuth';

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

const ListPage = ({ posts, pageNum, userInfo, recentPosts, popularPosts, recentComments, hashtags }: { posts: posts; pageNum: number; userInfo: user; recentPosts: recentPost[]; popularPosts: popularPost[]; recentComments: recentComment[]; hashtags: hashtag[] }) => {
  const router = useRouter();
  const { userId, tagId } = router.query;
  let totalPageNum: number;

  const getTotalPostsArr = () => {
    const totalPostCnt = posts.totalItems;
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
              <span className={listStyle.home_post_cnt}>{`${tagId ? `'${posts.items[0].HASHTAG_NAME}' 태그의 글 목록` : '전체 글'}(${posts.totalItems})`}</span>
              {CheckAuth() ? (
                <div className={listStyle.home_header_btn}>
                  <Link href={`/${userId}/chatGpt`}>
                    <button className={listStyle.chatgpt_btn}>ChatGPT</button>
                  </Link>
                  <Link href={`/write?keyword=true`}>
                    <button className={listStyle.create_btn}>글쓰기</button>
                  </Link>
                </div>
              ) : (
                <></>
              )}
            </div>

            {posts.items?.map((post: any) => {
              return <PostItem key={post.POST_ID} post={post} userId={userId} />;
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
  );
};

const PostItem = ({ post, userId }: any) => {
  const { POST_ID, POST_TITLE, POST_CNTN, POST_THMB_IMG_URL, RGSN_DTTM } = post || {};
  return (
    <div className={listStyle.home_post_title_content}>
      <Link href={`/${userId}/posts/${POST_ID}`}>
        {POST_THMB_IMG_URL ? (
          <div className={listStyle.home_post_thumb}>
            <div className={listStyle.home_thumb_content}>
              <span className={listStyle.home_post_title}>{POST_TITLE}</span>
              <p className={listStyle.home_post_content}>{POST_CNTN ? POST_CNTN : '작성된 내용이 없습니다.'}</p>
              <span className={listStyle.home_post_created}>{timeFormat(RGSN_DTTM)}</span>
            </div>
            <div className={listStyle.home_thumb_img_div}>
              <img className={listStyle.home_thumb_img} src={POST_THMB_IMG_URL} alt='thumbImg' />
            </div>
          </div>
        ) : (
          <div>
            <span className={listStyle.home_post_title}>{POST_TITLE}</span>
            <p className={listStyle.home_post_content}>{POST_CNTN ? POST_CNTN : '작성된 내용이 없습니다.'}</p>
            <span className={listStyle.home_post_created}>{timeFormat(RGSN_DTTM)}</span>
          </div>
        )}
      </Link>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const pageNum = context.query.pageNum ? context.query.pageNum : 1;
  const userId = context.query.userId as string;
  const tagId = context.query.tagId as string;
  let posts = {};

  const params = { type: 'list', perPage: 6, currPageNum: pageNum, id: userId, tempYn: 'N', tagId: tagId };

  await handlePost(params)
    .then((res) => JSON.stringify(res))
    .then((res) => {
      posts = JSON.parse(res);
    });

  return {
    props: {
      posts,
      pageNum: pageNum,
    },
  };
};

export default ListPage;
