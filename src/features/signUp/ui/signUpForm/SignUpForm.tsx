'use client';

import { useState } from 'react';
import { FieldError } from '@/shared/ui';
import { useForm } from 'react-hook-form';
import css from './signUpForm.module.scss';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignUpSchema, SignUpForm as Form } from '../../model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signUp, deleteVerifyCode } from '@/features/signup/api';
import { sendVerifyCodeMail } from '../../api/sendVerifyCodeMail';
import {
  faUser,
  faLock,
  faEnvelope,
  faStar,
  faAddressCard,
  faCheck,
  faUserCheck,
} from '@fortawesome/free-solid-svg-icons';

export const SignUpForm = () => {
  const router = useRouter();
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(SignUpSchema),
    mode: 'onBlur',
  });

  const sendVerifyCode = async () => {
    if (errors.email || isSendingCode) {
      return;
    }
    setIsSendingCode(true);
    const result = await sendVerifyCodeMail(getValues('email'));
    if (result.ok) {
      alert(result.message);
    }
    setIsSendingCode(false);
  };

  const onSubmit = async (data: Form) => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    const result = await signUp(data);

    if (result.ok) {
      // 인증코드 삭제
      deleteVerifyCode(data.verifyCode);
      alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
      router.push('/login');
    } else {
      alert(result.error);
      // 서버 사이드 validation 에러 처리
      if (result.data) {
        Object.entries(result.data).forEach(([field, messages]) => {
          setError(field as keyof Form, {
            type: 'server',
            message: messages[0],
          });
        });
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className={css.module}>
      <span className={css.title}>keylog</span>
      <form onSubmit={handleSubmit(onSubmit)} className={css.form}>
        <div className={css.inputDiv}>
          <div className={`${css.emoji} ${errors.id ? css.validateErr : ''}`}>
            <FontAwesomeIcon icon={faUser} className={css.icon} />
          </div>
          <input
            type="text"
            className={`${css.inputText} ${errors.id ? css.validateErr : ''}`}
            placeholder="아이디"
            autoComplete="off"
            {...register('id')}
          ></input>
        </div>
        <div className={css.inputDiv}>
          <div className={`${css.emoji} ${errors.password ? css.validateErr : ''}`}>
            <FontAwesomeIcon icon={faLock} className={css.icon} />
          </div>
          <input
            type="password"
            className={`${css.inputText} ${errors.password ? css.validateErr : ''}`}
            placeholder="비밀번호"
            autoComplete="off"
            {...register('password')}
          ></input>
        </div>
        <div className={css.inputDiv}>
          <div className={`${css.emoji} ${errors.passwordCheck ? css.validateErr : ''}`}>
            <FontAwesomeIcon icon={faCheck} className={css.icon} />
          </div>
          <input
            type="password"
            className={`${css.inputText} ${errors.passwordCheck ? css.validateErr : ''}`}
            placeholder="비밀번호 확인"
            autoComplete="off"
            {...register('passwordCheck')}
          ></input>
        </div>
        <div className={css.inputDiv}>
          <div className={`${css.emoji} ${errors.email ? css.validateErr : ''}`}>
            <FontAwesomeIcon icon={faEnvelope} className={css.icon} />
          </div>
          <input
            type="text"
            className={`${css.inputText} ${css.hasButton} ${errors.email ? css.validateErr : ''}`}
            placeholder="이메일"
            autoComplete="off"
            {...register('email')}
          ></input>
          <div className={`${css.verifyCodeBtnDiv}`}>
            <button id="signup_vrfy_code_btn" className={`${css.verifyCodeBtn}`} onClick={() => sendVerifyCode()}>
              인증코드 요청
            </button>
          </div>
        </div>
        <div className={css.inputDiv}>
          <div className={`${css.emoji} ${errors.verifyCode ? css.validateErr : ''}`}>
            <FontAwesomeIcon icon={faUserCheck} className={css.icon} />
          </div>
          <input
            type="text"
            className={`${css.inputText} ${errors.verifyCode ? css.validateErr : ''}`}
            placeholder="인증코드"
            autoComplete="off"
            {...register('verifyCode')}
          ></input>
        </div>
        <div className={`${css.inputDiv}`}>
          <div className={`${css.emoji} ${errors.blogName ? css.validateErr : ''}`}>
            <FontAwesomeIcon icon={faStar} className={css.icon} />
          </div>
          <input
            type="text"
            className={`${css.inputText} ${errors.blogName ? css.validateErr : ''}`}
            maxLength={30}
            placeholder="블로그 이름"
            autoComplete="off"
            {...register('blogName')}
          ></input>
        </div>
        <div className={css.inputDiv}>
          <div className={`${css.emoji} ${errors.nickname ? css.validateErr : ''}`}>
            <FontAwesomeIcon icon={faAddressCard} className={css.icon} />
          </div>
          <input
            type="text"
            className={`${css.inputText} ${errors.nickname ? css.validateErr : ''}`}
            maxLength={20}
            placeholder="닉네임"
            autoComplete="off"
            {...register('nickname')}
          ></input>
        </div>
        <button type="submit" className={css.btn} disabled={isSubmitting}>
          가입하기
        </button>
        <FieldError
          errors={[
            errors.id,
            errors.password,
            errors.passwordCheck,
            errors.email,
            errors.verifyCode,
            errors.blogName,
            errors.nickname,
          ]}
        />
      </form>
    </div>
  );
};
