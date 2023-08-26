/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useRouter } from 'next/router';
import { timeFormat } from '@/utils/CommonUtils';
import listStyle from '../styles/List.module.css';
import cx from 'classnames';
import { GetServerSideProps } from 'next';
import { handleMySql } from '../api/HandlePost';

const ListPage = ({ posts, pageNum }: { posts: { totalItems: number; items: any[]; postId: string }; pageNum: number }) => {
  const router = useRouter();
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
      router.push(`/?pageNum=${pageNum}`);
    }
  };

  const totalPostsArr = getTotalPostsArr();

  return (
    <div className={listStyle.home_div}>
      <div className={listStyle.home_header_div}>
        <img
          src='/icon/myImg.jpeg'
          className={listStyle.home_profile_img}
          alt='profile img'
        />
        <span className={listStyle.home_header_title}>{`kyuuun`}</span>
      </div>
      <div className={listStyle.home_post}>
        <div className={listStyle.home_header}>
          <span className={listStyle.home_post_cnt}>{`전체 글(${posts.totalItems})`}</span>
          <div className={listStyle.home_header_btn}>
            <Link href={'/chatGpt'}>
              <button className={listStyle.chatgpt_btn}>ChatGPT</button>
            </Link>
            <Link href={'/posts/create'}>
              <button className={listStyle.create_btn}>글쓰기</button>
            </Link>
          </div>
        </div>
        {posts.items?.map((post: any) => {
          return (
            <PostItem
              key={post.POST_ID}
              post={post}
            />
          );
        })}
      </div>
      <div className={listStyle.home_page_nav}>
        <span
          className={listStyle.home_page_nav_prev}
          onClick={(e) => handlePagination(Number(pageNum) - 1)}>
          <span className={listStyle.home_page_nav_arr}>&lt;</span> &nbsp;&nbsp;Prev
        </span>
        {totalPostsArr.map((obj: number, idx: number) => {
          return (
            <span
              key={idx}
              className={Number(pageNum) === idx + 1 ? cx(listStyle.home_page_num, listStyle.home_page_slct_num) : listStyle.home_page_num}
              onClick={(e) => handlePagination(Number(e.currentTarget.textContent!))}>
              {obj}
            </span>
          );
        })}
        <span
          className={listStyle.home_page_nav_next}
          onClick={(e) => handlePagination(Number(pageNum) + 1)}>
          Next&nbsp;&nbsp; <span className={listStyle.home_page_nav_arr}>&gt;</span>
        </span>
      </div>
    </div>
  );
};

const PostItem = ({ post }: any) => {
  const { POST_ID, POST_TITLE, POST_CNTN, POST_THMB_IMG_URL, AMNT_DTTM } = post || {};
  return (
    <div className={listStyle.home_post_title_content}>
      <Link href={`/posts/detail/${POST_ID}`}>
        {POST_THMB_IMG_URL ? (
          <div className={listStyle.home_post_thumb}>
            <div className={listStyle.home_thumb_content}>
              <span className={listStyle.home_post_title}>{POST_TITLE}</span>
              <p className={listStyle.home_post_content}>{POST_CNTN ? POST_CNTN : '작성된 내용이 없습니다.'}</p>
              <span className={listStyle.home_post_created}>{timeFormat(AMNT_DTTM)}</span>
            </div>
            <div className={listStyle.home_thumb_img_div}>
              <img
                className={listStyle.home_thumb_img}
                src={POST_THMB_IMG_URL}
                alt='thumbImg'
              />
            </div>
          </div>
        ) : (
          <div>
            <span className={listStyle.home_post_title}>{POST_TITLE}</span>
            <p className={listStyle.home_post_content}>{POST_CNTN ? POST_CNTN : '작성된 내용이 없습니다.'}</p>
            <span className={listStyle.home_post_created}>{timeFormat(AMNT_DTTM)}</span>
          </div>
        )}
      </Link>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const pageNum = context.query.pageNum ? context.query.pageNum : 1;
  let posts = {};

  const param = { type: 'list', perPage: 6, currPageNum: pageNum };

  await handleMySql(param)
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