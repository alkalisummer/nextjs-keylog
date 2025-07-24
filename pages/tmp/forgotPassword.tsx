import React, { useState } from 'react';
import axios from 'axios';
import loginStyle from '../styles/Login.module.css';
import { useRouter } from 'next/router';

const ForgotPassword = () => {
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [sendMailLoading, setSendMailLoading] = useState(false);
  const router = useRouter();

  const mailHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailCheck(email)) {
      return;
    }

    if (!sendMailLoading) {
      setSendMailLoading(true);
      sendMail();
    }
  };

  const sendMail = async () => {
    const params = { id: id.replaceAll(' ', ''), email: email.replaceAll(' ', ''), mode: 'forgotPassword' };
    await axios.post('/api/SendMailHandler', { data: params }).then((res) => {
      const userCnt = res.data.totalItems;
      if (userCnt > 0) {
        alert('해당 계정의 이메일로 비밀번호 재설정을 위한 인증메일을 전송하였습니다.\n인증 메일의 링크를 클릭하여 비밀번호를 재설정하세요.');
        router.replace('/');
      } else {
        document.querySelector('.errMsg')!.innerHTML = '<div class="mt5">해당 정보로 가입된 계정 정보가 없습니다.</div>';
      }
      setSendMailLoading(false);
    });
  };

  const emailCheck = async (email: string) => {
    const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let isValidate = emailRegEx.test(email);

    if (!isValidate) {
      document.querySelector('.emailErrMsg')!.innerHTML = '<div class="mt5">이메일 형식이 올바르지 않습니다.</div>';
    } else {
      document.querySelector('.emailErrMsg')!.innerHTML = '';
    }

    return isValidate;
  };

  return (
    <div className={loginStyle.login_div}>
      <span className={`${loginStyle.login_title} mb15`}>keylog</span>
      <span className={loginStyle.login_forgot_pw_infoText}>비밀번호 찾기</span>
      <form onSubmit={mailHandler} className={loginStyle.login_form}>
        <div className={`${loginStyle.login_input_div}`}>
          <div className={`${loginStyle.login_emoji} btlr`}>
            <i className={'fa-solid fa-user'}></i>
          </div>
          <input
            type='text'
            value={id}
            className={`${loginStyle.login_input_text} btrr`}
            placeholder='ID를 입력하세요.'
            required
            onChange={(e) => {
              setId(e.target.value);
            }}
          ></input>
        </div>
        <div className={`${loginStyle.login_input_div} mb10`}>
          <div className={`${loginStyle.login_emoji} bb bblr`}>
            <i className={'fa-solid fa-envelope'}></i>
          </div>
          <input
            type='text'
            value={email}
            className={`${loginStyle.login_input_text} bb bbrr`}
            placeholder='회원가입시 사용한 이메일을 입력하세요.'
            required
            onChange={(e) => {
              setEmail(e.target.value);
              emailCheck(e.target.value);
            }}
          ></input>
        </div>
        <div className={`errMsg ${loginStyle.validateErrMsg}`}></div>
        <div className={`emailErrMsg ${loginStyle.validateErrMsg}`}></div>
        <button type='submit' className={loginStyle.login_btn}>
          다음
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
