/* eslint-disable @next/next/no-img-element */
import '@toast-ui/editor/dist/toastui-editor.css';
import BlogLayout from '../../../components/BlogLayout';
import Link from 'next/link';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { timeFormat, timeToString } from '@/utils/CommonUtils';
import PostLayout from '@/components/PostLayout';
import { GetServerSideProps } from 'next';

import { handleMySql as handlePostSql } from '@/pages/api/HandlePost';
import { handleMySql as handleCommentSql } from '@/pages/api/HandleComment';
import { handleMySql as handleLikeSql } from '@/pages/api/HandleLike';
import { handleMySql as handleHashtag } from '@/pages/api/HandleHashtag';
import CheckAuth from '@/utils/CheckAuth';
import ClipboardJS from 'clipboard';

//mui notification
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';

//사용자 세션
import { useSession } from 'next-auth/react';

//redux, redux-saga
import wrapper from '@/store/index';
import { fetchBlogUser } from '@/reducer/blogUser';
import { useAppSelector } from '@/hooks/reduxHooks';
import { END } from 'redux-saga';

//next-error
import Error from 'next/error';

interface post {
  POST_ID: string;
  POST_TITLE: string;
  AMNT_DTTM: string;
}

interface comment {
  COMMENT_ID: string;
  POST_ID: string;
  COMMENT_DEPTH: string;
  COMMENT_ORIGIN_ID: string;
  COMMENT_CNTN: string;
  RGSR_ID: string;
  USER_NICKNAME: string;
  USER_THMB_IMG_URL: string;
  RGSN_DTTM: string;
  AMNT_DTTM: string;
  REPLY_CNT: string;
}

interface reply {
  COMMENT_ID: string;
  COMMENT_ORIGIN_ID: string;
  COMMENT_CNTN: string;
  RGSR_ID: string;
  USER_NICKNAME: string;
  USER_THMB_IMG_URL: string;
  AMNT_DTTM: string;
}

interface like {
  USER_ID: string;
  LIKE_CNT: number;
}

interface postHashtag {
  POST_ID: string;
  HASHTAG_ID: string;
  HASHTAG_NAME: string;
}

const PostDetailPage = ({ post, imgFileArr, htmlCntn, comments, like, postHashtags }: { post: post; imgFileArr: []; htmlCntn: string; comments: comment[]; like: like[]; postHashtags: postHashtag[] }) => {
  //사용자 세션
  const { data: session, status } = useSession();
  const router = useRouter();
  const { userId } = router.query;
  //링크 복사 - 현재 url 변수
  const [currUrl, setCurrUrl] = useState('');
  const [showClipNoti, setShowClipNoti] = useState(false);

  //댓글 작성 변수
  const [comment, setComment] = useState('');
  const [showCommentNoti, setShowCommentNoti] = useState(false);

  //댓글 리스트 변수
  const [commentArr, setCommentArr] = useState<comment[]>([]);

  //대댓글 리스트
  const [replyList, setReplyList] = useState<reply[]>([]);

  //좋아요 개수
  const [likeCnt, setLikeCnt] = useState(0);

  //사용자 좋아요 여부
  const [likeYn, setLikeYn] = useState(false);

  //블로그 사용자 정보
  const userInfo = useAppSelector((state) => state.blogUser.userInfo);

  console.log('서버:' + process.env.NODE_ENV);

  useEffect(() => {
    setCurrUrl(window.location.href);
    setCommentArr(comments.length > 0 ? comments : []);
    setLikeCnt(like.length > 0 ? like[0].LIKE_CNT : 0);
  }, [comments, like]);

  useEffect(() => {
    if (status === 'authenticated') {
      const currentUserId = session?.user?.id;
      const findUser = like.filter((likeUser) => likeUser.USER_ID === currentUserId);
      if (findUser.length > 0) {
        setLikeYn(true);
      } else {
        setLikeYn(false);
      }
    }
  }, [status, session?.user?.id, like]);

  if (!userInfo.id) {
    return <Error statusCode={404} />;
  }

  const handleDelete = async () => {
    const param = { type: 'delete', postId: post.POST_ID };
    await axios.get('/api/HandlePost', { params: param }).then(() => {
      // 해당 게시글 이미지 삭제
      let removedImg = imgFileArr;
      if (removedImg.length > 0) {
        axios.post('/api/DeleteImgFile', { removedImg });
      }
      router.back();
    });
  };

  //sns 공유, url 클립보드 복사
  const scrapPost = (type: string) => {
    switch (type) {
      case 'facebook':
        window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href), '_blank', 'width=600,height=400');
        break;
      case 'twitter':
        window.open('http://twitter.com/share?url=' + encodeURIComponent(window.location.href) + '&text=' + encodeURIComponent(post.POST_TITLE), '_blank', 'width=600,height=400');
        break;
      case 'cilpboard':
        const clipboard = new ClipboardJS('#post_url_copy');
        const urlInput = document.getElementById('currentUrl');
        urlInput!.style.display = 'initial';

        clipboard.on('success', function (e) {
          urlInput!.style.display = 'none';
          e.clearSelection();
        });

        setShowClipNoti(true);
        break;
    }
  };

  const closeClipNoti = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowClipNoti(false);
  };

  const closeCommentNoti = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowCommentNoti(false);
  };

  const saveComment = async (commentType: string, commentId: string) => {
    if (status === 'unauthenticated') {
      setShowCommentNoti(true);
      return;
    }

    const postId = post.POST_ID;
    const rgsrId = session?.user?.id;
    const currentTime = timeToString(new Date());
    let params;

    if (commentType === 'comment') {
      if (comment.length === 0) {
        alert('댓글 내용을 작성하세요.');
        return;
      }
      params = { type: 'writeComment', postId: postId, commentCntn: comment, rgsrId: rgsrId, currentTime: currentTime };
    } else {
      const target = document.getElementById(`${commentType}_${commentId}`)?.children[0] as HTMLTextAreaElement;
      const updateCntn = target.value;
      if (updateCntn.replaceAll(' ', '').length === 0) {
        alert('댓글 내용을 작성하세요.');
        return;
      } else if (commentType === 'reply_modify' || commentType === 'comment_modify') {
        params = { type: 'updateComment', postId: postId, commentId: commentId, commentCntn: updateCntn, currentTime: currentTime };
      } else if (commentType === 'reply_insert' || commentType === 'comment_insert') {
        params = { type: 'writeReply', postId: postId, commentId: commentId, commentCntn: updateCntn, rgsrId: rgsrId, currentTime: currentTime };
      }
    }

    await axios.post('/api/HandleComment', { data: params }).then((res) => {
      const result = JSON.parse(JSON.stringify(res.data));
      setCommentArr(result.refeshList);
      if (commentType === 'comment') {
        setComment('');
      } else if (commentType === 'comment_insert') {
        document.getElementById(`${commentType}_${commentId}`)!.style.display = 'none';
        showReplyHandle(commentId);
      } else {
        showCommentInput(commentId, '', commentType);
      }

      setTimeout(() => {
        // 댓글 작성후 해당 댓글 위치로 스크롤 이동
        if (result.commentId) {
          document.getElementById(`comment_${result.commentId}`)?.scrollIntoView({ behavior: 'smooth' });
        } else {
          document.getElementById(`comment_${commentId}`)?.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    });
  };

  const showCommentInput = (commentId: string, commentCntn: string, commentType: string) => {
    const targetComment = document.getElementById(`${commentType}_${commentId}`)!;
    const targetTextarea = targetComment.children[0] as HTMLTextAreaElement;

    const targetCommentCntn = targetComment.nextElementSibling as HTMLElement;

    const targetCommentPrevDiv = targetComment.previousSibling as HTMLElement;
    const targetCommentBtnDiv = targetCommentPrevDiv.children[1] as HTMLElement;

    const showState = targetComment.style.display;

    if (!showState || showState === 'none') {
      targetTextarea.value = commentCntn;
      // 기존 표출되던 내용과 버튼은 숨김
      if (commentType !== 'reply_insert' && commentType !== 'comment_insert') {
        targetCommentBtnDiv.style.display = 'none';
      }
      if (commentType === 'comment_insert') {
        targetCommentPrevDiv.innerHTML = `<i class='fa-regular fa-square-minus'></i>&nbsp;&nbsp;숨기기`;
      } else {
        targetCommentCntn.style.display = 'none';
      }
      targetComment.style.display = 'flex';
    } else {
      targetComment.style.display = 'none';
      if (commentType === 'comment_insert') {
        targetCommentPrevDiv.innerHTML = `<i class='fa-regular fa-square-plus'></i>&nbsp;&nbsp;답글 달기`;
      } else {
        targetCommentCntn.style.display = 'initial';
      }
      if (commentType !== 'reply_insert' && commentType !== 'comment_insert') {
        targetCommentBtnDiv.style.display = 'initial';
      }
    }
  };

  const deleteComment = async (commentId: string, originCommentId: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      const postId = post.POST_ID;
      const params = { type: 'deleteComment', postId: postId, commentId: commentId };

      await axios.post('/api/HandleComment', { data: params }).then((res) => {
        const result = JSON.parse(JSON.stringify(res.data));
        setCommentArr(result.refeshList);
        if (originCommentId) {
          const commentReplyCnt = result.refeshList.filter((comment: { COMMENT_ID: string }) => comment.COMMENT_ID === originCommentId)[0].REPLY_CNT;
          if (parseInt(commentReplyCnt) === 0) {
            document.getElementById(`comment_${originCommentId}_reply_div`)!.style.display = 'none';
            document.querySelector(`#comment_id_${originCommentId}`)!.innerHTML = `<i class='fa-regular fa-square-plus'></i>&nbsp;&nbsp;답글 달기`;
          }
        }
      });
    }
  };

  const showReplyHandle = async (commentId: string) => {
    const targetComment = document.getElementById(`comment_${commentId}_reply_div`)!;
    const showState = targetComment.style.display;
    if (showState === 'none' || showState === '') {
      targetComment.style.display = 'initial';
      document.querySelector(`#comment_id_${commentId}`)!.innerHTML = `<i class='fa-regular fa-square-minus'></i>&nbsp;&nbsp;숨기기`;
    } else {
      const replyCnt = commentArr.filter((reply) => reply.COMMENT_ORIGIN_ID === commentId).length;
      targetComment.style.display = 'none';
      document.querySelector(`#comment_id_${commentId}`)!.innerHTML = `<i class='fa-regular fa-square-plus'></i>&nbsp;&nbsp;${replyCnt}개의 답글`;
    }
  };

  const likeHandle = async (postId: string) => {
    if (status === 'unauthenticated') {
      setShowCommentNoti(true);
      return;
    }

    const userId = session?.user?.id;
    const currentTime = timeToString(new Date());
    const params = { type: 'getLikeCnt', postId: postId, userId: userId, currentTime: currentTime };
    await axios.get('/api/HandleLike', { params: params }).then(async (result) => {
      const res = result.data;
      // 좋아요를 한 사용자 중에 현재 사용자 id의 존재 유무
      const likeYn = res.totalItems !== 0 && res.items.filter((obj: like) => obj.USER_ID === userId).length > 0 ? true : false;
      if (!likeYn) {
        params.type = 'increaseLikeCnt';
        await axios.get('/api/HandleLike', { params: params }).then((res) => {
          const result = res.data.refreshCnt;
          setLikeCnt(result[0].LIKE_CNT);
          setLikeYn(true);
        });
      } else {
        params.type = 'decreaseLikeCnt';
        await axios.get('/api/HandleLike', { params: params }).then((res) => {
          const result = res.data.refreshCnt;
          setLikeCnt(result.length > 0 ? result[0].LIKE_CNT : 0);
          setLikeYn(false);
        });
      }
    });
  };

  return (
    <BlogLayout>
      <PostLayout>
        <div className='post_div'>
          <div className='post_title_created'>
            <span className='post_title'>{post.POST_TITLE}</span>
            <div className='post_created'>
              <span className='mg-r-10 pointer'>{timeFormat(post.AMNT_DTTM)}</span>
              {CheckAuth() ? (
                <>
                  |
                  <Link href={`/write?postId=${post.POST_ID}`}>
                    <span className='mg-r-10 mg-l-10'>수정</span>
                  </Link>
                  |
                  <span className='mg-l-10 pointer' onClick={() => handleDelete()}>
                    삭제
                  </span>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className='toastui-editor-contents post_content' dangerouslySetInnerHTML={{ __html: htmlCntn }}></div>
          <div className='post_scrap_div'>
            <div className='post_scrap_ico w52' onClick={() => likeHandle(post.POST_ID)}>
              {likeYn ? <i className='fa-solid fa-heart'></i> : <i className='fa-regular fa-heart'></i>}
              <span className='post_like_cnt'>{likeCnt}</span>
            </div>
            <div className='post_scrap_ico' onClick={() => scrapPost('facebook')}>
              <i className='fa-brands fa-facebook-f'></i>
            </div>
            <div className='post_scrap_ico' onClick={() => scrapPost('twitter')}>
              <i className='fa-brands fa-twitter'></i>
            </div>
            <div id='post_url_copy' data-clipboard-target='#currentUrl' className='post_scrap_ico' onClick={() => scrapPost('cilpboard')}>
              <i className='fa-solid fa-paperclip'></i>
            </div>
            <input id='currentUrl' className='dn op0' type='text' value={currUrl} readOnly />
          </div>
          <div className='post_detail_hashtag_div'>
            {postHashtags.length > 0 &&
              postHashtags.map((tag) => (
                <span className='post_detail_hashtag' key={tag.HASHTAG_ID} onClick={() => router.push(`/search?tagId=${tag.HASHTAG_ID}&tagName=${tag.HASHTAG_NAME}`)}>
                  {`# ${tag.HASHTAG_NAME}`}
                </span>
              ))}
          </div>
          <div className='post_comment_div'>
            <span className='post_comment_cnt'>{`${commentArr.length}개의 댓글`}</span>
            <textarea className='post_comment_textarea' value={comment} onChange={(e) => setComment(e.target.value)} placeholder='댓글을 작성하세요.' maxLength={290}></textarea>
            <div className='df jc_e'>
              <button className='post_comment_save_btn' onClick={() => saveComment('comment', '')}>
                댓글 작성
              </button>
            </div>
          </div>
          <div className='post_comment_list_div'>
            {commentArr
              .filter((comment) => parseInt(comment.COMMENT_DEPTH) === 1)
              .map((comment, idx) => (
                <div key={comment.COMMENT_ID} id={`comment_${comment.COMMENT_ID}`} className={`post_comment ${commentArr.length - 1 === idx ? 'bbn' : 'bb2'}`}>
                  <div className='df jc_sb mb10'>
                    <div className='df jc_sb'>
                      <img className='post_comment_user_image' src={comment.USER_THMB_IMG_URL ? comment.USER_THMB_IMG_URL : '../../../../icon/person.png'} alt='user12Image'></img>
                      <div className='df fd_c jc_c ml15'>
                        <span className='post_comment_user_id' onClick={() => router.push(`/${comment.RGSR_ID}`)}>
                          {comment.USER_NICKNAME}
                        </span>
                        <span className='post_comment_rgsn_dttm'>{timeFormat(comment.RGSN_DTTM)}</span>
                      </div>
                    </div>
                    {session?.user?.id === comment.RGSR_ID ? (
                      <div>
                        <span className='post_comment_txt' onClick={() => showCommentInput(comment.COMMENT_ID, comment.COMMENT_CNTN, 'comment_modify')}>
                          수정
                        </span>
                        &nbsp;&nbsp;&nbsp;
                        <span className='post_comment_txt' onClick={() => deleteComment(comment.COMMENT_ID, '')}>
                          삭제
                        </span>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div id={`comment_modify_${comment.COMMENT_ID}`} className='post_comment_modify_div'>
                    <textarea className='post_comment_textarea' placeholder='댓글을 작성하세요.' maxLength={290}></textarea>
                    <div className='df jc_e'>
                      <button className='post_comment_cancel_btn' onClick={() => showCommentInput(comment.COMMENT_ID, '', 'comment_modify')}>
                        취소
                      </button>
                      <button className='post_comment_save_btn' onClick={() => saveComment('comment_modify', comment.COMMENT_ID)}>
                        댓글 작성
                      </button>
                    </div>
                  </div>
                  <p className='post_comment_cntn'>{comment.COMMENT_CNTN}</p>
                  <span id={`comment_id_${comment.COMMENT_ID}`} className='post_comment_reply' onClick={parseInt(comment.REPLY_CNT) > 0 ? () => showReplyHandle(comment.COMMENT_ID) : () => showCommentInput(comment.COMMENT_ID, '', 'comment_insert')}>
                    <i className='fa-regular fa-square-plus'></i>&nbsp;&nbsp;
                    {parseInt(comment.REPLY_CNT) > 0 ? `${comment.REPLY_CNT}개의 답글` : `답글 달기`}
                  </span>
                  <div id={`comment_insert_${comment.COMMENT_ID}`} className='post_comment_modify_div'>
                    <textarea className='post_comment_textarea' placeholder='댓글을 작성하세요.' maxLength={290}></textarea>
                    <div className='df jc_e'>
                      <button className='post_comment_cancel_btn' onClick={() => showCommentInput(comment.COMMENT_ID, '', 'comment_insert')}>
                        취소
                      </button>
                      <button className='post_comment_save_btn' onClick={() => saveComment('comment_insert', comment.COMMENT_ID)}>
                        댓글 작성
                      </button>
                    </div>
                  </div>
                  <div id={`comment_${comment.COMMENT_ID}_reply_div`} className='post_reply_div'>
                    {commentArr
                      .filter((reply) => reply.COMMENT_ORIGIN_ID === comment.COMMENT_ID)
                      .map((reply, idx) => (
                        <div key={reply.COMMENT_ID} id={`comment_${reply.COMMENT_ID}`} className={`post_reply ${replyList.length - 1 === idx ? 'bbn' : 'bb2'}`}>
                          <div className='df jc_sb'>
                            <div className='df jc_sb'>
                              <img className='post_comment_user_image' src={reply.USER_THMB_IMG_URL ? reply.USER_THMB_IMG_URL : '../../../../icon/person.png'} alt='userImage'></img>
                              <div className='df fd_c jc_c ml15'>
                                <span className='post_comment_user_id' onClick={() => router.push(`/${reply.RGSR_ID}`)}>
                                  {reply.USER_NICKNAME}
                                </span>
                                <span className='post_comment_rgsn_dttm'>{timeFormat(reply.RGSN_DTTM)}</span>
                              </div>
                            </div>
                            {session?.user?.id === reply.RGSR_ID ? (
                              <div>
                                <span className='post_comment_txt' onClick={() => showCommentInput(reply.COMMENT_ID, reply.COMMENT_CNTN, 'reply_modify')}>
                                  수정
                                </span>
                                &nbsp;&nbsp;&nbsp;
                                <span className='post_comment_txt' onClick={() => deleteComment(reply.COMMENT_ID, comment.COMMENT_ID)}>
                                  삭제
                                </span>
                              </div>
                            ) : (
                              <></>
                            )}
                          </div>
                          <div id={`reply_modify_${reply.COMMENT_ID}`} className='post_comment_modify_div'>
                            <textarea className='post_comment_textarea' placeholder='댓글을 작성하세요.' maxLength={290}></textarea>
                            <div className='df jc_e'>
                              <button className='post_comment_cancel_btn' onClick={() => showCommentInput(reply.COMMENT_ID, '', 'reply_modify')}>
                                취소
                              </button>
                              <button className='post_comment_save_btn' onClick={() => saveComment('reply_modify', reply.COMMENT_ID)}>
                                댓글 작성
                              </button>
                            </div>
                          </div>
                          <p className='post_comment_cntn'>{reply.COMMENT_CNTN}</p>
                        </div>
                      ))}
                    <div id={`reply_insert_${comment.COMMENT_ID}`} className='post_comment_modify_div'>
                      <textarea className='post_comment_textarea' placeholder='댓글을 작성하세요.' maxLength={290}></textarea>
                      <div className='df jc_e'>
                        <button className='post_comment_cancel_btn' onClick={() => showCommentInput(comment.COMMENT_ID, '', 'reply_insert')}>
                          취소
                        </button>
                        <button className='post_comment_save_btn' onClick={() => saveComment('reply_insert', comment.COMMENT_ID)}>
                          댓글 작성
                        </button>
                      </div>
                    </div>
                    <div className='post_reply_btn_div'>
                      <button className='post_reply_btn' onClick={() => showCommentInput(comment.COMMENT_ID, '', 'reply_insert')}>
                        답글달기
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <Snackbar
          open={showClipNoti}
          message='링크가 복사되었습니다.'
          onClose={closeClipNoti}
          action={
            <React.Fragment>
              <Button color='primary' size='small' onClick={closeClipNoti}>
                확인
              </Button>
            </React.Fragment>
          }
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        ></Snackbar>
        <Snackbar
          open={showCommentNoti}
          message={`로그인이 필요한 서비스 입니다. \n 로그인 화면으로 이동하시겠습니까?`}
          onClose={closeCommentNoti}
          sx={{ whiteSpace: 'pre-line', maxWidth: '350px' }}
          style={{ alignItems: 'center', textAlign: 'center' }}
          action={
            <React.Fragment>
              <Button color='primary' size='small' onClick={() => router.push('/login')}>
                확인
              </Button>
              <Button color='inherit' size='small' onClick={closeCommentNoti}>
                취소
              </Button>
            </React.Fragment>
          }
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        ></Snackbar>
      </PostLayout>
    </BlogLayout>
  );
};

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
  let post;
  let comments;
  let like;
  let postHashtags;
  let imgFileArr: string[] = [];
  let htmlCntn = '';
  const userId = context.query.userId;

  const cheerio = require('cheerio');

  const params = {
    type: 'read',
    postId: context.query.id,
  };

  store.dispatch(fetchBlogUser(userId as string));
  //redux-saga를 사용하여 비동기로 가져오는 데이터의 응답결과를 기다려주는 역할
  store.dispatch(END);
  await store.sagaTask?.toPromise();

  await handlePostSql(params)
    .then((res) => JSON.stringify(res))
    .then((res) => {
      post = JSON.parse(res).items[0];
      //html 데이터 추출
      htmlCntn = Buffer.from(post.POST_HTML_CNTN).toString();
      const $ = cheerio.load(htmlCntn);
      //기존 이미지 파일 이름 추출
      const imageTags = $('img');
      imgFileArr = imageTags.map((index: number, el: any) => $(el).attr('alt')).get();
    });

  params.type = 'getCommentlist';

  await handleCommentSql(params)
    .then((res) => JSON.stringify(res))
    .then((res) => {
      comments = JSON.parse(res).items;
    });

  params.type = 'getLikeCnt';
  await handleLikeSql(params)
    .then((res) => JSON.stringify(res))
    .then((res) => {
      like = JSON.parse(res).items;
    });

  params.type = 'getHashtag';
  await handleHashtag(params)
    .then((res) => JSON.stringify(res))
    .then((res) => {
      postHashtags = JSON.parse(res).items;
    });

  return { props: { post, imgFileArr, htmlCntn, comments, like, postHashtags } };
});

export default React.memo(PostDetailPage);
