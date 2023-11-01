/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import BlogLayout from '../../components/BlogLayout';
import { useRouter } from 'next/router';
import { timeFormat } from '@/utils/CommonUtils';
import listStyle from '../../styles/List.module.css';
import cx from 'classnames';
import { GetServerSideProps } from 'next';
import { handleMySql as handlePost } from '../api/HandlePost';
import CheckAuth from '@/utils/CheckAuth';
//error Page
import Error from '@/pages/_error';

//redux, redux-saga
import wrapper from '@/store/index';
import { fetchBlogUser } from '@/reducer/blogUser';
import { useAppSelector } from '@/hooks/reduxHooks';
import { END } from 'redux-saga';

interface posts {
  totalItems: number;
  items: any[];
  postId: string;
}

const ListPage = ({ posts, pageNum }: { posts: posts; pageNum: number }) => {
  const router = useRouter();
  const { userId, tagId } = router.query;
  let totalPageNum: number;
  const userInfo = useAppSelector((state) => state.blogUser.userInfo);

  if (!userInfo.id) {
    return <Error statusCode={404} />;
  }

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
    <BlogLayout>
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

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
  const pageNum = context.query.pageNum ? context.query.pageNum : 1;
  const userId = context.query.userId as string;
  const tagId = context.query.tagId as string;
  let posts = {};

  const params = { type: 'list', perPage: 6, currPageNum: pageNum, id: userId, tempYn: 'N', tagId: tagId };

  store.dispatch(fetchBlogUser(userId as string));
  //redux-saga를 사용하여 비동기로 가져오는 데이터의 응답결과를 기다려주는 역할
  store.dispatch(END);
  await store.sagaTask?.toPromise();

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
});

export default ListPage;
