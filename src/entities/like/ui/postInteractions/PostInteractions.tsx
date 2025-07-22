'use client';

import { Like } from '@/entities/like/model';
import css from './postInteractions.module.scss';

interface PostInteractionsProps {
  like: Like;
}

export const PostInteractions = ({ like }: PostInteractionsProps) => {
  return (
    <div className="post_scrap_div">
      <div className="post_scrap_ico w52" onClick={() => likeHandle(post.POST_ID)}>
        {likeYn ? <i className="fa-solid fa-heart"></i> : <i className="fa-regular fa-heart"></i>}
        <span className="post_like_cnt">{likeCnt}</span>
      </div>
      <div className="post_scrap_ico" onClick={() => scrapPost('facebook')}>
        <i className="fa-brands fa-facebook-f"></i>
      </div>
      <div className="post_scrap_ico" onClick={() => scrapPost('twitter')}>
        <i className="fa-brands fa-twitter"></i>
      </div>
      <div
        id="post_url_copy"
        data-clipboard-action="copy"
        data-clipboard-target="#currentUrl"
        className="post_scrap_ico"
        onClick={() => scrapPost('cilpboard')}
      >
        <i className="fa-solid fa-paperclip"></i>
      </div>
      <input id="currentUrl" className="post_scrap_url" type="text" value={currUrl} readOnly />
    </div>
  );
};
