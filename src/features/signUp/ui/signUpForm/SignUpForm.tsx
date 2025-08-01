'use client';

import { useForm } from 'react-hook-form';
import css from './signUpForm.module.scss';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorMessage } from '@hookform/error-message';
import { SignUpSchema, SignUpForm as Form } from '../../model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
  const rotuer = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(SignUpSchema),
    mode: 'onChange',
  });

  const onSubmit = () => {};

  return (
    <div className={css.signup_div}>
      <span className={css.signup_title}>keylog</span>
      <form onSubmit={handleSubmit(onSubmit)} className={css.signup_form}>
        <div className={css.signup_input_div}>
          <div className={`${css.signup_emoji} ${errors.id ? '' : css.validateErr} btlr`}>
            <FontAwesomeIcon icon={faUser} />
          </div>
          <input
            type="text"
            className={`${css.signup_input_text} ${errors.id ? '' : css.validateErr} btrr`}
            placeholder="아이디"
            autoComplete="off"
            required
            {...register('id')}
          ></input>
          <ErrorMessage name="id" errors={errors} />
        </div>
        <div className={css.signup_input_div}>
          <div className={`${css.signup_emoji} ${errors.password ? '' : css.validateErr}`}>
            <FontAwesomeIcon icon={faLock} />
          </div>
          <input
            type="password"
            className={`${css.signup_input_text} ${errors.password ? '' : css.validateErr}`}
            placeholder="비밀번호"
            required
            autoComplete="off"
            {...register('password')}
          ></input>
          <ErrorMessage name="password" errors={errors} />
        </div>
        <div className={css.signup_input_div}>
          <div className={`${css.signup_emoji} ${errors.passwordCheck ? '' : css.validateErr}`}>
            <FontAwesomeIcon icon={faCheck} />
          </div>
          <input
            type="password"
            className={`${css.signup_input_text} ${errors.passwordCheck ? '' : css.validateErr}`}
            placeholder="비밀번호 확인"
            required
            autoComplete="off"
            {...register('passwordCheck')}
          ></input>
          <ErrorMessage name="passwordCheck" errors={errors} />
        </div>
        <div className={css.signup_input_div}>
          <div className={`${css.signup_emoji} ${errors.email ? '' : css.validateErr}`}>
            <FontAwesomeIcon icon={faEnvelope} />
          </div>
          <input
            type="text"
            className={`${css.signup_input_text} ${errors.email ? '' : css.validateErr} brn`}
            placeholder="이메일"
            autoComplete="off"
            required
            {...register('email')}
          ></input>
          <ErrorMessage name="email" errors={errors} />
          <div className={`${css.signup_vrfy_code_btn_div}`}>
            <button id="signup_vrfy_code_btn" className={`${css.signup_vrfy_code_btn}`} onClick={() => mailHandler()}>
              인증번호 요청
            </button>
          </div>
        </div>
        <div className={css.signup_input_div}>
          <div className={`${css.signup_emoji} ${errors.verifyCode ? '' : css.validateErr}`}>
            <FontAwesomeIcon icon={faUserCheck} />
          </div>
          <input
            type="text"
            className={`${css.signup_input_text} ${errors.verifyCode ? '' : css.validateErr}`}
            placeholder="인증번호"
            autoComplete="off"
            required
            {...register('verifyCode')}
          ></input>
          <ErrorMessage name="verifyCode" errors={errors} />
        </div>
        <div className={`${css.signup_input_div}`}>
          <div className={`${css.signup_emoji} ${errors.blogName ? '' : css.validateErr}`}>
            <FontAwesomeIcon icon={faStar} />
          </div>
          <input
            type="text"
            className={`${css.signup_input_text} ${errors.blogName ? '' : css.validateErr}`}
            maxLength={30}
            placeholder="블로그 이름"
            required
            autoComplete="off"
            {...register('blogName')}
          ></input>
          <ErrorMessage name="blogName" errors={errors} />
        </div>
        <div className={`${css.signup_input_div} mb10`}>
          <div className={`${css.signup_emoji} ${errors.nickname ? '' : css.validateErr} bb bblr`}>
            <FontAwesomeIcon icon={faAddressCard} />
          </div>
          <input
            type="text"
            className={`${css.signup_input_text} ${errors.nickname ? '' : css.validateErr} bb bbrr`}
            maxLength={20}
            placeholder="닉네임"
            required
            autoComplete="off"
            {...register('nickname')}
          ></input>
          <ErrorMessage name="nickname" errors={errors} />
        </div>
        <button type="submit" className={css.signup_btn}>
          가입하기
        </button>
      </form>
    </div>
  );
};
