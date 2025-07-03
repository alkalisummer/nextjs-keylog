import { Post } from '../../model';
import css from './postCard.module.scss';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/shared/lib/util';

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
          className="index_search_post"
          onClick={() => router.push(`/${post}/posts/${post.postId}`)}
        >
          <div className="index_search_post_summary">
            {post.postThmbImgUrl ? (
              <div className="index_search_post_img_div">
                <img className="index_search_post_img" src={post.postThmbImgUrl} alt="postImg"></img>
              </div>
            ) : (
              <></>
            )}
            <div className="index_search_post_title_cntn">
              <span className="index_search_post_title">{post.postTitle}</span>
              <p className="index_search_post_cntn">{post.postCntn}</p>
              <div>
                <span className="index_search_post_bottom">
                  {formatDate({ date: post.rgsnDttm, seperator: '.' })}&nbsp;•&nbsp;
                </span>
                <span className="index_search_post_bottom">{`${post.commentCnt}개의 댓글`}</span>
              </div>
            </div>
          </div>
          <div className="index_search_post_author">
            <div className="df ai_c">
              <img
                className="index_search_user_img"
                src={post.userThmbImgUrl ? post.userThmbImgUrl : '/../../icon/person.png'}
                alt="userImg"
              ></img>
              <span className="index_search_user_text">by</span>
              <span className="index_search_user_text">{post.userNickname}</span>
            </div>
            <span className="index_like_text">
              <i className="fa-solid fa-heart mr10"></i>
              {post.likeCnt}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
