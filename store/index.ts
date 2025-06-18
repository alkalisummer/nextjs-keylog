import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootReducer, { blogUserSaga } from '../reducer/blogUser';
import { all } from 'redux-saga/effects';
import { createWrapper } from 'next-redux-wrapper';

function* rootSaga() {
  // 배열안의 사가들을 동시 실행
  yield all([blogUserSaga()]);
}

const createStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(sagaMiddleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

  //Next.js 서버 사이드에서도 사가를 구동하기 위해 sagaTask를 정의
  store.sagaTask = sagaMiddleware.run(rootSaga);

  return store;
};

export type AppStore = ReturnType<typeof createStore>; // store 타입
export type RootState = ReturnType<AppStore['getState']>; // RootState 타입
export type AppDispatch = AppStore['dispatch']; // dispatch 타입

const wrapper = createWrapper<AppStore>(createStore, { debug: process.env.NODE_ENV === 'development' });

export default wrapper;
