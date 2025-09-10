'use client';

import { signIn } from 'next-auth/react';
import { FieldError } from '@/shared/ui';
import css from './loginForm.module.scss';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clientCookies } from '@/shared/lib/util';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { LoginSchema, LoginForm as Form } from '@/features/login/model';

export const LoginForm = () => {
  const router = useRouter();
  const cookies = clientCookies();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get('redirect') ?? '/';
  const reason = searchParams?.get('reason') ?? '';
  const userId = cookies.get('userId');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(LoginSchema),
    mode: 'onSubmit',
    defaultValues: {
      id: userId ?? '',
      password: '',
    },
  });
  const [saveId, setSaveId] = useState(false);

  useEffect(() => {
    userId && setSaveId(true);
    if (reason === 'session_expired') {
      alert('세션이 만료되었습니다. 다시 로그인해주세요.');
    }
  }, []);

  const onSubmit = async (data: Form) => {
    const loginRes = await signIn('credentials', {
      id: data.id,
      password: data.password,
      redirect: false,
    });

    if (loginRes?.ok) {
      saveId ? cookies.set('userId', data.id, { maxAge: 60 * 60 * 24 * 7 }) : cookies.remove('userId');
      router.push(redirect);
    } else {
      if (loginRes?.status === 401) {
        setError('password', { message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
      }
    }
  };

  return (
    <div className={css.module}>
      <span className={css.title}>keylog</span>
      <form onSubmit={handleSubmit(onSubmit)} className={css.form}>
        <div className={css.inputDiv}>
          <div className={css.emoji}>
            <FontAwesomeIcon icon={faUser} className={css.icon} />
          </div>
          <input type="text" {...register('id')} className={css.inputText} placeholder="ID" required></input>
        </div>
        <div className={css.inputDiv}>
          <div className={css.emoji}>
            <FontAwesomeIcon icon={faLock} className={css.icon} />
          </div>
          <input
            type="password"
            {...register('password')}
            className={css.inputText}
            placeholder="Password"
            required
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
          <span className={css.forgotPwBtn} onClick={() => router.replace('/findPassword')}>
            비밀번호 찾기
          </span>
        </div>
        <FieldError errors={[errors.id, errors.password]} />
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
