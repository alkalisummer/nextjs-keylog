'use client';

import Image from 'next/image';
import { Post } from '../../model';
import css from './postLists.module.scss';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/shared/lib/util';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface PostListsProps {
  posts: Post[];
  setTarget: (element: Element | null) => void;
}

export const PostLists = ({ posts, setTarget }: PostListsProps) => {
  const router = useRouter();
  return (
    <div className={css.module}>
      {posts.map((post, idx) => (
        <div
          key={post.postId}
          ref={posts.length - 1 === idx ? setTarget : null}
          className={css.post}
          onClick={() => router.push(`/${post}/posts/${post.postId}`)}
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
              <span className={css.postTitle}>{post.postTitle}</span>
              <p className={css.postContent}>{post.postCntn}</p>
              <div>
                <span className={css.postBottom}>
                  {formatDate({ date: post.rgsnDttm, seperator: '.' })}&nbsp;•&nbsp;
                </span>
                <span className={css.postBottom}>{`${post.commentCnt}개의 댓글`}</span>
              </div>
            </div>
          </div>
          <div className={css.postAuthor}>
            <div className="df ai_c">
              <img
                className={css.userImg}
                src={post.userThmbImgUrl ? post.userThmbImgUrl : '/../../icon/person.png'}
                alt="userImg"
              ></img>
              <span className={css.userText}>by</span>
              <span className={css.nickname}>{post.userNickname}</span>
            </div>
            <div className={css.likeText}>
              <FontAwesomeIcon icon={faHeart} className={css.likeIcon} />
              {post.likeCnt}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
