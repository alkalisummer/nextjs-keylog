'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@mui/material';
import { useSession } from 'next-auth/react';
import styles from './accountModal.module.scss';

interface AccountModalProps {
  openModal: boolean;
  setOpenModal: (openModal: boolean) => void;
}

export const AccountModal = ({ openModal, setOpenModal }: AccountModalProps) => {
  const { data: session, status } = useSession();
  const [showNameInput, setShowNameInput] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showPwInput, setShowPwInput] = useState(false);
  const [showNoti, setShowNoti] = useState(false);
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [blogName, setBlogName] = useState('');
  const [email, setEmail] = useState('');

  const cancelPwUpdate = () => {
    setShowPwInput(false);
    setCurrPassword('');
    setNewPassword('');
    setCheckPassword('');
  };

  useEffect(() => {
    if (status !== 'authenticated' && openModal) {
      setOpenModal(false);
    }
  }, [status]);

  return (
    <Modal open={openModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <div className={styles.module}>
        <button
          className={styles.closeBtn}
          onClick={() => {
            setOpenModal(false);
            setShowNameInput(false);
            cancelPwUpdate();
          }}
        >
          ✕
        </button>
      </div>
    </Modal>
  );
};
