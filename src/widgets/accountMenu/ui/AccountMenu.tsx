'use client';

import { Fragment } from 'react';
import Menu from '@mui/material/Menu';
import css from './accountMenu.module.scss';
import { useSession } from 'next-auth/react';
import MenuItem from '@mui/material/MenuItem';

export const AccountMenu = () => {
  const { data: session, status } = useSession();

  return (
    <Fragment>
      {status === 'authenticated' ? (
        <div className={css.module}>
          <img
            className={css.navMenuImg}
            src={session.user?.image ? session.user?.image : '/icon/person.png'}
            alt="userImage"
          />
          <div>▾</div>
        </div>
      ) : (
        <></>
      )}
    </Fragment>
  );
};
