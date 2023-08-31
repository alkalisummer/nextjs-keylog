import React, { useState } from 'react';
import axios from 'axios';
import loginStyle from '../styles/Login.module.css';
import { useRouter } from 'next/router';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const checkId = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegEx.test(email)) {
      alert('아이디를 이메일 형식으로 입력해주세요.');
      return;
    }

    const params = { email: email };

    await axios.post('/api/ForgotPassword', { data: params }).then((res) => {
      const userCnt = res.data.totalItems;
      if (userCnt > 0) {
        alert('입력하신 이메일로 임시비밀번호가 발송되었습니다.\n로그인 후 비밀번호를 변경해주세요.');
        router.replace('/login');
      } else {
        document.querySelector('.errMsg')!.innerHTML = '<div class="mt5">가입된 이메일 정보가 없습니다.</div>';
      }
    });
  };

  return (
    <div className={loginStyle.login_div}>
      <span className={`${loginStyle.login_title} mb15`}>keylog</span>
      <span className={loginStyle.login_forgot_pw_infoText}>비밀번호를 찾고자하는 아이디(이메일)을 입력해주세요.</span>
      <form
        onSubmit={checkId}
        className={loginStyle.login_form}>
        <div className={`${loginStyle.login_input_div} mb10`}>
          <div className={`${loginStyle.login_emoji} btlr bb bblr`}>
            <i className={'fa-solid fa-user'}></i>
          </div>
          <input
            type='text'
            value={email}
            className={`${loginStyle.login_input_text} btrr bb bbrr`}
            placeholder='ID(Email)'
            required
            onChange={(e) => {
              setEmail(e.target.value);
            }}></input>
        </div>
        <div className={`errMsg ${loginStyle.validateErrMsg}`}></div>
        <button
          type='submit'
          className={loginStyle.login_btn}>
          다음
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
