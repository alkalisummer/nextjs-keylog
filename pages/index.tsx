import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import axios from 'axios';
import { timeFormat } from '@/utils/CommonUtils';
import homeStyle from '../styles/Home.module.css';
import cx from 'classnames';
import { GetServerSideProps } from 'next';

const HomePage = ({ posts, pageNum }: { posts: { totalItems: number; items: any[]; postId: string }; pageNum: number }) => {
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
    <div className={homeStyle.home_div}>
      <div className={homeStyle.home_header_div}>
        <span className={homeStyle.home_header_title}>{`kyuuun`}</span>
      </div>
      <div className={homeStyle.home_post}>
        <div className={homeStyle.home_header}>
          <span className={homeStyle.home_post_cnt}>{`전체 글(${posts.totalItems})`}</span>
          <div className={homeStyle.home_header_btn}>
            <Link href={'/chatGpt'}>
              <button className={homeStyle.chatgpt_btn}>ChatGPT</button>
            </Link>
            <Link href={'/posts/create'}>
              <button className={homeStyle.create_btn}>글쓰기</button>
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
      <div className={homeStyle.home_page_nav}>
        <span
          className={homeStyle.home_page_nav_prev}
          onClick={(e) => handlePagination(Number(pageNum) - 1)}>
          <span className={homeStyle.home_page_nav_arr}>&lt;</span> &nbsp;&nbsp;Prev
        </span>
        {totalPostsArr.map((obj: number, idx: number) => {
          return (
            <span
              key={idx}
              className={Number(pageNum) === idx + 1 ? cx(homeStyle.home_page_num, homeStyle.home_page_slct_num) : homeStyle.home_page_num}
              onClick={(e) => handlePagination(Number(e.currentTarget.textContent!))}>
              {obj}
            </span>
          );
        })}
        <span
          className={homeStyle.home_page_nav_next}
          onClick={(e) => handlePagination(Number(pageNum) + 1)}>
          Next&nbsp;&nbsp; <span className={homeStyle.home_page_nav_arr}>&gt;</span>
        </span>
      </div>
    </div>
  );
};

const PostItem = ({ post }: any) => {
  const { POST_ID, POST_TITLE, POST_CNTN, POST_HTML_CNTN, AMNT_DTTM } = post || {};

  //html data 에서 이미지를 추출
  const cheerio = require('cheerio');
  const htmlCntn = Buffer.from(POST_HTML_CNTN).toString();
  const $ = cheerio.load(htmlCntn);
  const imageTags = $('img');
  const thumbImageArr = imageTags.map((index: number, el: any) => $(el).attr('src')).get()[0];
  return (
    <div className={homeStyle.home_post_title_content}>
      <Link href={`/posts/detail/${POST_ID}`}>
        {thumbImageArr ? (
          <div className={homeStyle.home_post_thumb}>
            <div className={homeStyle.home_thumb_content}>
              <span className={homeStyle.home_post_title}>{POST_TITLE}</span>
              <p className={homeStyle.home_post_content}>{POST_CNTN ? POST_CNTN : '작성된 내용이 없습니다.'}</p>
              <span className={homeStyle.home_post_created}>{timeFormat(AMNT_DTTM)}</span>
            </div>
            <div className={homeStyle.home_thumb_img_div}>
              <Image
                className={homeStyle.home_thumb_img}
                src={thumbImageArr}
                alt='thumbImg'
                width={150}
                height={150}
              />
            </div>
          </div>
        ) : (
          <div>
            <span className={homeStyle.home_post_title}>{POST_TITLE}</span>
            <p className={homeStyle.home_post_content}>{POST_CNTN ? POST_CNTN : '작성된 내용이 없습니다.'}</p>
            <span className={homeStyle.home_post_created}>{timeFormat(AMNT_DTTM)}</span>
          </div>
        )}
      </Link>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const pageNum = context.query.pageNum ? context.query.pageNum : 1;
  let posts = {};

  const param = { type: 'list', perPage: 6, currPageNum: pageNum ? pageNum : 1 };

  await axios.get('http://localhost:3000/api/HandlePost', { params: param }).then((res) => {
    posts = res.data;
  });

  return {
    props: {
      posts,
      pageNum: pageNum,
    },
  };
};

export default HomePage;
