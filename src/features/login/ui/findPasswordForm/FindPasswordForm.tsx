'use client';

import { FieldError } from '@/shared/ui';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { sendPasswordMail } from '../../api';
import { FindPasswordSchema } from '../../model';
import css from './findPasswordForm.module.scss';
import { zodResolver } from '@hookform/resolvers/zod';
import { FindPasswordForm as PasswordForm } from '../../model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';

export const FindPasswordForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordForm>({
    resolver: zodResolver(FindPasswordSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: PasswordForm) => {
    const { id, email } = data;
    const result = await sendPasswordMail({ id, email });
    if (result.ok) {
      alert(
        '해당 계정의 이메일로 비밀번호 재설정을 위한 인증메일을 전송하였습니다.\n인증 메일의 링크를 클릭하여 비밀번호를 재설정하세요.',
      );
      router.push('/');
    } else {
      alert(result.message);
    }
  };

  return (
    <div className={css.module}>
      <span className={css.loginTitle}>keylog</span>
      <span className={css.loginForgotPwInfoText}>비밀번호 찾기</span>
      <form onSubmit={handleSubmit(onSubmit)} className={css.loginForm}>
        <div className={css.loginInputDiv}>
          <div className={css.loginEmoji}>
            <FontAwesomeIcon icon={faUser} className={css.icon} />
          </div>
          <input
            type="text"
            {...register('id')}
            className={css.loginInputText}
            placeholder="ID를 입력하세요."
            required
          ></input>
        </div>
        <div className={css.loginInputDiv}>
          <div className={css.loginEmoji}>
            <FontAwesomeIcon icon={faEnvelope} className={css.icon} />
          </div>
          <input
            type="text"
            {...register('email')}
            className={css.loginInputText}
            placeholder="회원가입시 사용한 이메일을 입력하세요."
            required
          ></input>
        </div>
        <FieldError error={errors.email} />
        <button type="submit" className={css.loginBtn}>
          다음
        </button>
      </form>
    </div>
  );
};

export default FindPasswordForm;
