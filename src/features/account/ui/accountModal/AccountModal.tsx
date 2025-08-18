'use client';

import { useEffect } from 'react';
import { Modal } from '@mui/material';
import { useSession } from 'next-auth/react';
import css from './accountModal.module.scss';
import { WithDraw } from '../withDraw/WithDraw';
import { EmailForm } from '../emailForm/EmailForm';
import { ImageForm } from '../imageForm/ImageForm';
import { ProfileForm } from '../profileForm/ProfileForm';
import { PasswordForm } from '../passwordForm/PasswordForm';

interface AccountModalProps {
  openModal: boolean;
  setOpenModal: (openModal: boolean) => void;
}

export const AccountModal = ({ openModal, setOpenModal }: AccountModalProps) => {
  const { status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated' && openModal) {
      setOpenModal(false);
    }
  }, [status, openModal, setOpenModal]);

  return (
    <Modal open={openModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <div className={css.module}>
        <button
          type="button"
          className={css.closeBtn}
          onClick={() => {
            setOpenModal(false);
          }}
        >
          ✕
        </button>
        <div className={css.content}>
          <ImageForm />
          <ProfileForm />
        </div>
        <div className={css.content}>
          <EmailForm />
        </div>
        <div className={css.content}>
          <PasswordForm />
        </div>
        <div className={css.content}>
          <WithDraw />
        </div>
      </div>
    </Modal>
  );
};
