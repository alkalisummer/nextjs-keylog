'use client';

import Link from 'next/link';
import Image from 'next/image';
import Menu from '@mui/material/Menu';
import { Fragment, useState } from 'react';
import css from './accountMenu.module.scss';
import { useSession } from 'next-auth/react';
import MenuItem from '@mui/material/MenuItem';
import { logout } from '@/features/logout/api';
import { AccountModal } from './accountModal/AccountModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKickstarter } from '@fortawesome/free-brands-svg-icons';
import { faFileSignature, faUser, faRightFromBracket, faPen } from '@fortawesome/free-solid-svg-icons';

export const AccountMenu = () => {
  const { data: session, status } = useSession();
  const [trigger, setTrigger] = useState<null | HTMLElement>(null);
  const [openModal, setOpenModal] = useState(false);

  const toggleOpen = Boolean(trigger);
  const openToggle = (event: React.MouseEvent<HTMLDivElement>) => {
    setTrigger(event.currentTarget);
  };

  const closeToggle = () => {
    setTrigger(null);
  };

  return (
    <Fragment>
      {status !== 'unauthenticated' ? (
        <div className={css.module}>
          <div className={css.menu} onClick={openToggle}>
            <Image
              className={css.userImg}
              src={session?.user?.image ? session.user.image : '/icon/person.png'}
              alt="userImage"
              width={40}
              height={40}
              quality={100}
              priority
              onError={e => (e.currentTarget.src = '/icon/person.png')}
            />
            <div>▾</div>
          </div>
          <Menu
            id="accountMenu"
            anchorEl={trigger}
            open={toggleOpen}
            onClose={closeToggle}
            slotProps={{
              list: {
                'aria-labelledby': 'basic-button',
                className: css.menuItem,
              },
            }}
          >
            <MenuItem>
              <Link href={`/${session?.user?.id ?? ''}`} className={css.menuLink} onClick={closeToggle}>
                <FontAwesomeIcon icon={faKickstarter} className={css.menuItemIco} />내 키로그
              </Link>
            </MenuItem>
            <MenuItem className={css.writeBtn}>
              <Link href={`/write?keyword=true`} className={css.menuLink} onClick={closeToggle}>
                <FontAwesomeIcon icon={faPen} className={css.menuItemIco} />새 글 작성
              </Link>
            </MenuItem>
            <MenuItem>
              <Link href={`/${session?.user?.id ?? ''}?tempYn=Y`} className={css.menuLink}>
                <FontAwesomeIcon icon={faFileSignature} className={css.menuItemIco} />
                임시 글
              </Link>
            </MenuItem>
            <MenuItem
              onClick={() => {
                setOpenModal(true);
                closeToggle();
              }}
            >
              <FontAwesomeIcon icon={faUser} className={css.menuItemIco} />
              계정 관리
            </MenuItem>
            <MenuItem onClick={logout}>
              <FontAwesomeIcon icon={faRightFromBracket} className={css.menuItemIco} />
              로그아웃
            </MenuItem>
          </Menu>
          <AccountModal openModal={openModal} setOpenModal={setOpenModal} />
        </div>
      ) : (
        <></>
      )}
    </Fragment>
  );
};
