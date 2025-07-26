import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import loginStyle from '@/styles/Login.module.css';

//mui notification
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';

const ResetPassword = () => {
  const router = useRouter();
  const { token } = router.query;

  //notification 팝업
  const [showNoti, setShowNoti] = useState(false);

  //비밀번호
  const [password, setPassword] = useState('');
  //비밀번호 확인
  const [pwDoubleCheckText, setPwDoubleCheckText] = useState('');

  const passwordCheck = (password: string) => {
    //8~16자의 영문 대/소문자, 숫자를 반드시 포함하여 구성(특수문자도 포함가능)
    const passwordRegEx = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\S]{8,16}$/;
    const isValidate = passwordRegEx.test(password);

    if (!isValidate) {
      document.querySelector('.passwordErrMsg')!.innerHTML = '<div class="mt5">비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 조합하여 입력하세요.</div>';
    } else {
      document.querySelector('.passwordErrMsg')!.innerHTML = '';
    }

    return isValidate;
  };

  const passwordDoubleCheck = (passwordText: string) => {
    const isValidate = password === passwordText ? true : false;
    if (!isValidate) {
      document.querySelector('.pwDobleCheckErrMsg')!.innerHTML = '<div class="mt5">비밀번호가 일치하지 않습니다.</div>';
    } else {
      document.querySelector('.pwDobleCheckErrMsg')!.innerHTML = '';
    }
    return isValidate;
  };

  const resetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //비밀번호 유효성 검사
    if (!passwordCheck(password)) {
      return;
    } else if (!passwordDoubleCheck(pwDoubleCheckText)) {
      return;
    }

    const params = { token: token, password: password };
    await axios.post('/api/CheckVerifyToken', { data: params }).then((res) => {
      const isValid = res.data.isValid;
      if (isValid) {
        setShowNoti(true);
      } else {
        document.querySelector('.tokenErrMsg')!.innerHTML = '<div class="mt5">인증토큰이 유효하지 않습니다. 비밀번호 찾기를 다시 진행해주세요.</div>';
      }
    });
  };

  const closeNoti = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowNoti(false);
    router.push('/');
  };

  return (
    <div className={loginStyle.login_div}>
      <span className={`${loginStyle.login_title} mb15`}>keylog</span>
      <span className={loginStyle.login_forgot_pw_infoText}>비밀번호 변경</span>
      <form onSubmit={resetPassword} className={loginStyle.login_form}>
        <div className={`${loginStyle.login_input_div}`}>
          <div className={`${loginStyle.login_emoji} btlr`}>
            <i className={'fa-solid fa-lock'}></i>
          </div>
          <input
            type='password'
            value={password}
            className={`${loginStyle.login_input_text} btrr`}
            placeholder='비밀번호'
            required
            onChange={(e) => {
              setPassword(e.target.value);
              passwordCheck(e.target.value);
            }}
          ></input>
        </div>
        <div className={`${loginStyle.login_input_div} mb10`}>
          <div className={`${loginStyle.login_emoji} bb bblr`}>
            <i className={'fa-solid fa-check'}></i>
          </div>
          <input
            type='password'
            value={pwDoubleCheckText}
            className={`${loginStyle.login_input_text} bb bbrr`}
            placeholder='비밀번호 확인'
            required
            onChange={(e) => {
              setPwDoubleCheckText(e.target.value);
              passwordDoubleCheck(e.target.value);
            }}
          ></input>
        </div>
        <div className={`tokenErrMsg ${loginStyle.validateErrMsg}`}></div>
        <div className={`passwordErrMsg ${loginStyle.validateErrMsg}`}></div>
        <div className={`pwDobleCheckErrMsg ${loginStyle.validateErrMsg}`}></div>
        <button type='submit' className={loginStyle.login_btn}>
          확인
        </button>
      </form>
      <Snackbar
        open={showNoti}
        message='비밀번호가 정상적으로 변경되었습니다. 다시 로그인해주세요.'
        onClose={closeNoti}
        action={
          <React.Fragment>
            <Button color='primary' size='small' onClick={closeNoti}>
              확인
            </Button>
          </React.Fragment>
        }
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      ></Snackbar>
    </div>
  );
};

export default ResetPassword;
