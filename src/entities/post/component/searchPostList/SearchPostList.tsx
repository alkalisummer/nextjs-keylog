'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Post } from '../../model';
import css from './searchPostList.module.scss';
import { formatDate } from '@/shared/lib/util';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface PostListsProps {
  posts: Post[];
  setTarget: (element: Element | null) => void;
}

export const SearchPostList = ({ posts, setTarget }: PostListsProps) => {
  return (
    <section className={css.module}>
      {posts.map((post, idx) => (
        <Link
          key={`${post.postId}-${idx}`}
          href={`/${post.authorId}/${post.postId}`}
          scroll={false}
          className={css.post}
          ref={posts.length - 1 === idx ? setTarget : null}
        >
          <div className={css.postSummary}>
            {post.postThmbImgUrl ? (
              <div className={css.postImgDiv}>
                <Image
                  className={css.postImg}
                  src={`${post.postThmbImgUrl}`}
                  alt="postImg"
                  width={100}
                  height={100}
                  priority={false}
                ></Image>
              </div>
            ) : (
              <></>
            )}
            <div className={css.postTitleContent}>
              <div className={css.postTitleContentTop}>
                <span className={css.postTitle}>{post.postTitle}</span>
                <p className={post.postThmbImgUrl ? css.postContentClamp : css.postContentWrapper}>{post.postCntn}</p>
              </div>
              <div className={css.postBottom}>
                <span>{formatDate({ date: post.rgsnDttm, seperator: '.' })}&nbsp;•&nbsp;</span>
                <span>{`${post.commentCnt}개의 댓글`}</span>
              </div>
            </div>
          </div>
          <div className={css.postAuthor}>
            <div className={css.userInfo}>
              <Image
                className={css.userImg}
                src={post.userThmbImgUrl ? post.userThmbImgUrl : '/icon/person.png'}
                alt="userImg"
                width={24}
                height={24}
                quality={100}
              ></Image>
              <span className={css.userText}>by</span>
              <span className={css.nickname}>{post.userNickname}</span>
            </div>
            <div className={css.likeText}>
              <FontAwesomeIcon icon={faHeart} className={css.likeIcon} />
              {post.likeCnt}
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
};
