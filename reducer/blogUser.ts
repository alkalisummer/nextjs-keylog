import { call, put, takeEvery } from 'redux-saga/effects';
import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from '@reduxjs/toolkit';
import { handleMySql as handleUser } from '@/pages/api/HandleUser';
import { handleMySql as handlePost } from '@/pages/api/HandlePost';
import { handleMySql as handleComment } from '@/pages/api/HandleComment';
import { handleMySql as handleHashtag } from '@/pages/api/HandleHashtag';

// 액션 타입
const FETCH_BLOG_USER = 'FETCH_BLOG_USER';
const FETCH_BLOG_USER_SUCCESS = 'FETCH_BLOG_USER_SUCCESS';
const FETCH_BLOG_USER_FAIL = 'FETCH_BLOG_USER_FAIL';

// 액션 생성 함수
export const fetchBlogUser = (userId: string) => ({ type: FETCH_BLOG_USER, id: userId, payload: {} });

//초기값
const initialState = {
  userInfo: {},
  recentPosts: [],
  popularPosts: [],
  recentComments: [],
  hashtagCnt: [],
};

interface actionType {
  type: string;
  id: string;
  payload: any;
}

type userResultType = {
  USER_ID: string;
  USER_EMAIL: string;
  USER_THMB_IMG_URL: string;
  USER_NICKNAME: string;
  USER_BLOG_NAME: string;
};

type recentPostResultType = {
  recentPosts: [];
};

type popularPostResultType = {
  popularPosts: [];
};

type commentResultType = {
  recentComments: [];
};

type hashtagResultType = {
  hashtags: [];
};

export const getUserInfo = async (userId: string) => {
  const params = { type: 'getUser', id: userId };
  let user;
  try {
    user = await handleUser(params).then((res) => {
      return res.totalItems === 0 ? {} : JSON.parse(JSON.stringify(res.items[0]));
    });
  } catch (error) {
    console.log(error);
  }

  return user;
};

export const getRecentPost = async (userId: string) => {
  const params = { type: 'getRecentPost', id: userId };
  let recentPosts;
  await handlePost(params).then((res) => {
    const result = JSON.parse(JSON.stringify(res));
    recentPosts = result.items;
  });
  return recentPosts;
};

export const getPopularPost = async (userId: string) => {
  const params = { type: 'getPopularPost', id: userId };
  let popularPosts;
  await handlePost(params).then((res) => {
    const result = JSON.parse(JSON.stringify(res));
    popularPosts = result.items;
  });
  return popularPosts;
};

export const getRecentComment = async (userId: string) => {
  const params = { type: 'getRecentComment', id: userId };
  const recentComments = await handleComment(params).then((res) => {
    const result = JSON.parse(JSON.stringify(res));
    return result.items;
  });
  return recentComments;
};

export const getHashtags = async (userId: string) => {
  const params = { type: 'getHashtagCnt', id: userId };
  const hashtags = await handleHashtag(params).then((res) => {
    const result = JSON.parse(JSON.stringify(res));
    return result.items;
  });
  return hashtags;
};

function* fetchBlogUserInfo(action: actionType) {
  // 블로그 사용자 ID
  const userId = action.id;
  try {
    const user: userResultType = yield call(getUserInfo, userId);
    const recentPosts: recentPostResultType = yield call(getRecentPost, userId);
    const popularPosts: popularPostResultType = yield call(getPopularPost, userId);
    const recentComments: commentResultType = yield call(getRecentComment, userId);
    const hashtagCnt: hashtagResultType = yield call(getHashtags, userId);

    const userInfo = {
      id: user.USER_ID ?? null,
      email: user.USER_EMAIL ?? null,
      image: user.USER_THMB_IMG_URL ?? null,
      nickname: user.USER_NICKNAME ?? null,
      blogName: user.USER_BLOG_NAME ?? null,
    };

    yield put({ type: FETCH_BLOG_USER_SUCCESS, payload: { userInfo, recentPosts, popularPosts, recentComments, hashtagCnt } });
  } catch (error) {
    if (error) {
      yield put({ type: FETCH_BLOG_USER_FAIL, payload: error });
    }
  }
}

export function* blogUserSaga() {
  yield takeEvery(FETCH_BLOG_USER, fetchBlogUserInfo);
}

//Reducer
const blogUser = (state = initialState, action: actionType) => {
  switch (action.type) {
    case FETCH_BLOG_USER:
    case FETCH_BLOG_USER_SUCCESS:
      return applyFetchBlogUser(state, action.payload);
    case FETCH_BLOG_USER_FAIL:
      return applyFetchBlogUserFail(state, action.payload);
    default:
      return state;
  }
};

const rootReducer = (state: any, action: any) => {
  switch (action.type) {
    case HYDRATE:
      return action.payload;
    default: {
      const combineReducer = combineReducers({
        blogUser,
      });
      return combineReducer(state, action);
    }
  }
};

export default rootReducer;

// Reducer Function
const applyFetchBlogUser = (state: any, payload: any) => {
  state.userInfo = payload.userInfo ?? null;
  state.recentPosts = payload.recentPosts ?? null;
  state.popularPosts = payload.popularPosts ?? null;
  state.recentComments = payload.recentComments ?? null;
  state.hashtagCnt = payload.hashtagCnt ?? null;

  return state;
};

const applyFetchBlogUserFail = (state: any, payload: any) => {
  const error = JSON.parse(JSON.stringify(payload));
  return {
    state,
    error,
  };
};
