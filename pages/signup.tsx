import React, { useState } from 'react';
import signupStyle from '../styles/Signup.module.css';
import { timeToString } from '@/utils/CommonUtils';
import axios from 'axios';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [emailValidate, setEmailValidate] = useState<boolean>(true);

  const [password, setPassword] = useState('');
  const [passwordValidate, setPasswordValidate] = useState<boolean>(true);

  const [nickname, setNickname] = useState('');

  //8~16자의 영문 대/소문자, 숫자를 반드시 포함하여 구성(특수문자도 포함가능)

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //email, password 유효성 검사
    if (!emailCheck(email)) {
      return;
    } else if (!passwordCheck(password)) {
      return;
    }
    const currentTime = timeToString(new Date());
    const params = { type: 'signup', email: email, nickname: nickname, password: password, rgsn_dttm: currentTime, amnt_dttm: currentTime };

    axios.post('/api/HandlePost', { data: params }).then((res) => {
      debugger;
    });
  };

  const emailCheck = (email: string) => {
    const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValidate = emailRegEx.test(email);

    if (!isValidate) {
      setEmailValidate(false);
      document.querySelector('.emailErrMsg')!.innerHTML = '<span>이메일 형식이 올바르지 않습니다.</span>';
    } else {
      setEmailValidate(true);
      document.querySelector('.emailErrMsg')!.innerHTML = '';
    }

    return isValidate;
  };

  const passwordCheck = (password: string) => {
    const passwordRegEx = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\S]{8,16}$/;
    const isValidate = passwordRegEx.test(password);

    if (!isValidate) {
      setPasswordValidate(false);
      document.querySelector('.passwordErrMsg')!.innerHTML = '<span>비밀번호: 8~16자의 영문 대/소문자, 숫자를 사용해 주세요.</span>';
    } else {
      setPasswordValidate(true);
      document.querySelector('.passwordErrMsg')!.innerHTML = '';
    }

    return isValidate;
  };

  return (
    <div className={signupStyle.signup_div}>
      <span className={signupStyle.signup_title}>keylog</span>
      <form
        onSubmit={submitHandler}
        className={signupStyle.signup_form}>
        <div className={signupStyle.signup_input_div}>
          <div className={`${signupStyle.signup_emoji} ${emailValidate ? '' : signupStyle.validateErr} btlr`}>
            <i className={'fa-solid fa-envelope'}></i>
          </div>
          <input
            type='text'
            value={email}
            className={`${signupStyle.signup_input_text} ${emailValidate ? '' : signupStyle.validateErr} btrr`}
            placeholder='이메일'
            onChange={(e) => {
              setEmail(e.target.value);
              emailCheck(e.target.value);
            }}></input>
        </div>
        <div className={signupStyle.signup_input_div}>
          <div className={`${signupStyle.signup_emoji} ${passwordValidate ? '' : signupStyle.validateErr}`}>
            <i className='fa-solid fa-lock'></i>
          </div>
          <input
            type='password'
            value={password}
            className={`${signupStyle.signup_input_text} ${passwordValidate ? '' : signupStyle.validateErr}`}
            placeholder='비밀번호'
            onChange={(e) => {
              setPassword(e.target.value);
              passwordCheck(e.target.value);
            }}></input>
        </div>
        <div className={signupStyle.signup_input_div}>
          <div className={`${signupStyle.signup_emoji} bb bblr`}>
            <i className={'fa-solid fa-user'}></i>
          </div>
          <input
            type='text'
            value={nickname}
            className={`${signupStyle.signup_input_text} bb bbrr`}
            maxLength={20}
            placeholder='닉네임'
            onChange={(e) => setNickname(e.target.value)}></input>
        </div>
        <div className={`emailErrMsg ${signupStyle.validateErrMsg}`}></div>
        <div className={`passwordErrMsg ${signupStyle.validateErrMsg}`}></div>
        <button
          type='submit'
          className={signupStyle.signup_btn}>
          가입하기
        </button>
      </form>
    </div>
  );
};

export default Signup;
