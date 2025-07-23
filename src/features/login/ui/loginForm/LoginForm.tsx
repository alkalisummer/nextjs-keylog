'use client';

import css from './loginForm.module.scss';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/features/login/api';
import { clientCookies } from '@/shared/lib/util';
import { useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

export const LoginForm = () => {
  const router = useRouter();
  const cookies = clientCookies();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get('redirect') ?? '/';

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [saveId, setSaveId] = useState(false);

  useEffect(() => {
    const userId = cookies.get('userId');
    if (userId) {
      setId(userId);
      setSaveId(true);
    }
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await login(id, password);
    if (res?.ok) {
      saveId ? cookies.set('userId', id, { maxAge: 60 * 60 * 24 * 7 }) : cookies.remove('userId');
      router.push(redirect);
    } else {
      document.querySelector('.loginErrMsg')!.innerHTML =
        '<div class="mt5">아이디 또는 비밀번호를 잘못입력하였습니다.<br/>입력하신 내용을 다시 확인해주세요.</div>';
    }
  };

  return (
    <div className={css.module}>
      <span className={css.title}>keylog</span>
      <form onSubmit={onSubmit} className={css.form}>
        <div className={css.inputDiv}>
          <div className={`${css.emoji} btlr`}>
            <FontAwesomeIcon icon={faUser} className={css.icon} />
          </div>
          <input
            type="text"
            value={id}
            className={`${css.inputText} btrr`}
            placeholder="ID"
            required
            onChange={e => {
              setId(e.target.value);
            }}
          ></input>
        </div>
        <div className={`${css.inputDiv} mb10`}>
          <div className={`${css.emoji} bb bblr`}>
            <FontAwesomeIcon icon={faLock} className={css.icon} />
          </div>
          <input
            type="password"
            value={password}
            className={`${css.inputText} bb bbrr`}
            placeholder="Password"
            required
            onChange={e => {
              setPassword(e.target.value);
            }}
          ></input>
        </div>
        <div className={css.subDiv}>
          <label className={css.label}>
            <input
              type="checkbox"
              className={css.checkbox}
              checked={saveId}
              onChange={() => setSaveId(!saveId)}
            ></input>
            아이디 저장
          </label>
          <span className={css.forgotPwBtn} onClick={() => router.replace('/forgotPassword')}>
            비밀번호 찾기
          </span>
        </div>
        <div className={`loginErrMsg ${css.validateErrMsg}`}></div>
        <button type="submit" className={css.btn}>
          로그인
        </button>
        <div className={css.signupBtnDiv}>
          아직 회원이 아니신가요? &nbsp;
          <span className={css.signupBtn} onClick={() => router.replace('/signup')}>
            회원가입
          </span>
        </div>
      </form>
    </div>
  );
};
