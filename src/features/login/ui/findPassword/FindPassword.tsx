'use client';

import { useState } from 'react';
import { validateEmail } from '../../lib';
import { useRouter } from 'next/navigation';
import css from './findPassword.module.scss';
import { sendPasswordMail } from '../../api';
import { useDebounce } from '@/shared/lib/hooks';

export const FindPassword = () => {
  const router = useRouter();
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [isSend, setIsSend] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const debouncedEmail = useDebounce(email, 500);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setErrorMsg('이메일 형식이 올바르지 않습니다.');
      return;
    }

    if (!isSend) {
      const result = await sendPasswordMail({ id, email });
      if (result.ok) {
        setIsSend(true);
        alert(
          '해당 계정의 이메일로 비밀번호 재설정을 위한 인증메일을 전송하였습니다.\n인증 메일의 링크를 클릭하여 비밀번호를 재설정하세요.',
        );
        router.push('/');
      } else {
        setErrorMsg('이메일 형식이 올바르지 않습니다.');
      }
    }
  };

  return (
    <div className={css.login_div}>
      <span className={`${css.login_title} mb15`}>keylog</span>
      <span className={css.login_forgot_pw_infoText}>비밀번호 찾기</span>
      <form onSubmit={onSubmit} className={css.login_form}>
        <div className={`${css.login_input_div}`}>
          <div className={`${css.login_emoji} btlr`}>
            <i className={'fa-solid fa-user'}></i>
          </div>
          <input
            type="text"
            value={id}
            className={`${css.login_input_text} btrr`}
            placeholder="ID를 입력하세요."
            required
            onChange={e => {
              setId(e.target.value);
            }}
          ></input>
        </div>
        <div className={`${css.login_input_div} mb10`}>
          <div className={`${css.login_emoji} bb bblr`}>
            <i className={'fa-solid fa-envelope'}></i>
          </div>
          <input
            type="text"
            value={email}
            className={`${css.login_input_text} bb bbrr`}
            placeholder="회원가입시 사용한 이메일을 입력하세요."
            required
            onChange={e => {
              setEmail(e.target.value);
              validateEmail(debouncedEmail);
            }}
          ></input>
        </div>
        {errorMsg && <div className={`${css.validateErrMsg}`}>{errorMsg}</div>}
        <button type="submit" className={css.login_btn}>
          다음
        </button>
      </form>
    </div>
  );
};
