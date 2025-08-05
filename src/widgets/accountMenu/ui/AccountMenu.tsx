'use client';

import Link from 'next/link';
import Menu from '@mui/material/Menu';
import { Fragment, useState } from 'react';
import css from './accountMenu.module.scss';
import { useSession } from 'next-auth/react';
import MenuItem from '@mui/material/MenuItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKickstarter } from '@fortawesome/free-brands-svg-icons';
import { faFileSignature, faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

export const AccountMenu = () => {
  const { data: session, status } = useSession();
  const [trigger, setTrigger] = useState<null | HTMLElement>(null);
  const toggleOpen = Boolean(trigger);
  const openToggle = (event: React.MouseEvent<HTMLDivElement>) => {
    setTrigger(event.currentTarget);
  };
  const closeToggle = () => {
    setTrigger(null);
  };

  return (
    <Fragment>
      {status === 'authenticated' ? (
        <div className={css.module}>
          <div className={css.menu} onClick={openToggle}>
            <img className={css.userImg} src={session.user?.image ?? '/icon/person.png'} alt="userImage" />
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
              <Link href={`/${session.user?.id}`} className={css.menuLink}>
                <FontAwesomeIcon icon={faKickstarter} className={css.menuItemIco} />내 키로그
              </Link>
            </MenuItem>
            <MenuItem>
              <Link href={`/${session.user?.id}/tmpPosts`} className={css.menuLink}>
                <FontAwesomeIcon icon={faFileSignature} className={css.menuItemIco} />
                임시 글
              </Link>
            </MenuItem>
            <MenuItem
              onClick={() => {
                // setOpenModal(true);
                closeToggle();
              }}
            >
              <FontAwesomeIcon icon={faUser} className={css.menuItemIco} />
              계정 관리
            </MenuItem>
            <MenuItem onClick={() => {}}>
              <FontAwesomeIcon icon={faRightFromBracket} className={css.menuItemIco} />
              로그아웃
            </MenuItem>
          </Menu>
        </div>
      ) : (
        <></>
      )}
    </Fragment>
  );
};
