import React, { useState, useEffect } from 'react';
import loginStyle from '../styles/Login.module.css';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';

const Login = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const [saveId, setSaveId] = useState(true);
  const [cookies, setCookies] = useCookies(['userId']);

  const router = useRouter();

  useEffect(() => {
    if (cookies.userId && saveId) {
      setId(cookies.userId);
    }
  }, [cookies.userId, saveId]);

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const storage = globalThis?.sessionStorage;
    const link = storage.getItem('prevPath');

    const result = await signIn('credentials', {
      redirect: true,
      id: id.replaceAll(' ', ''),
      password: password,
      callbackUrl: link as string,
    }).then((res) => {
      if (!res?.error) {
        if (saveId) {
          setCookies('userId', id.replaceAll(' ', ''), { maxAge: 60 * 60 * 24 * 7 }); //아이디 저장 체크시 일주일동안 쿠키에 저장
        } else {
          setCookies('userId', '', { maxAge: 0 }); // 쿠키삭제
        }
      } else {
        document.querySelector('.loginErrMsg')!.innerHTML = '<div class="mt5">아이디 또는 비밀번호를 잘못입력하였습니다.<br/>입력하신 내용을 다시 확인해주세요.</div>';
      }
    });
  };

  const forgotPassword = async () => {
    router.push('/forgotPassword');
  };

  return (
    <div className={loginStyle.login_div}>
      <span className={loginStyle.login_title}>keylog</span>
      <form onSubmit={login} className={loginStyle.login_form}>
        <div className={loginStyle.login_input_div}>
          <div className={`${loginStyle.login_emoji} btlr`}>
            <i className={'fa-solid fa-user'}></i>
          </div>
          <input
            type='text'
            value={id}
            className={`${loginStyle.login_input_text} btrr`}
            placeholder='ID'
            required
            onChange={(e) => {
              setId(e.target.value);
            }}
          ></input>
        </div>
        <div className={`${loginStyle.login_input_div} mb10`}>
          <div className={`${loginStyle.login_emoji} bb bblr`}>
            <i className='fa-solid fa-lock'></i>
          </div>
          <input
            type='password'
            value={password}
            className={`${loginStyle.login_input_text} bb bbrr`}
            placeholder='Password'
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
        </div>
        <div className={loginStyle.login_sub_div}>
          <label className={loginStyle.login_label}>
            <input type='checkbox' className={loginStyle.login_checkbox} checked={saveId} onChange={() => setSaveId(!saveId)}></input>
            아이디 저장
          </label>
          <span className={loginStyle.login_forgot_pw_btn} onClick={() => forgotPassword()}>
            비밀번호 찾기
          </span>
        </div>
        <div className={`loginErrMsg ${loginStyle.validateErrMsg}`}></div>
        <button type='submit' className={loginStyle.login_btn}>
          로그인
        </button>
        <div className={loginStyle.signup_btn_div}>
          아직 회원이 아니신가요? &nbsp;
          <span className={loginStyle.signup_btn} onClick={() => router.replace('/signup')}>
            회원가입
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
