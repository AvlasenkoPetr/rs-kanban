import React, { useEffect, useState } from 'react';

import styles from './Header.module.scss';
import { useTranslation } from 'react-i18next';
import { useCustomDispatch, useCustomSelector } from '../../customHooks/customHooks';
import { fetchApi } from '../../store/fetchApi';
import { setBoards, toggleLanguage } from '../../store/mainPageSlice';
import { logOut } from '../../store/authorizeSlice';
import { useNavigate } from 'react-router-dom';
import { HeaderButton } from './HeaderButton/HeaderButton';
import { AddBoardButton, INewBoardBody } from '../AddBoardButton/AddBoardButton';
import { Modal } from '../Modal/Modal';

const Header: React.FC = () => {
  const dark = '1';
  const light = '0.5';
  const selector = useCustomSelector((state) => state);
  const dispatch = useCustomDispatch();
  const navigation = useNavigate();
  const { t, i18n } = useTranslation();
  const { refetch } = fetchApi.useGetAllBoardsQuery('');
  const [addBoard, {}] = fetchApi.useCreateNewBoardMutation();
  const [scroll, setScroll] = useState(dark);

  const listenScrollEvent = () => {
    if (window.scrollY > 100) {
      setScroll(light);
    } else {
      setScroll(dark);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', listenScrollEvent);
    i18n.changeLanguage(selector.mainPageSlice.lang);
  }, [selector.mainPageSlice.lang]);

  const changeLanguage = () => {
    dispatch(toggleLanguage(selector.mainPageSlice.lang === 'en' ? 'ru' : 'en'));
    localStorage.setItem('lang', selector.mainPageSlice.lang === 'en' ? 'ru' : 'en');
  };

  const logout = () => {
    localStorage.removeItem('user');
    dispatch(setBoards(null));
    dispatch(logOut());
    refetch();
    navigation('/welcome');
  };

  const profilePage = () => {
    navigation('/editprofile');
  };

  return (
    <header className={styles.container} style={{ opacity: scroll }}>
      <div className={styles.container__buttons_group}>
        <HeaderButton cb={profilePage}>{t('mainPage.buttons.editProfile')}</HeaderButton>
        <AddBoardButton>
          <HeaderButton>{t('mainPage.buttons.createBoard')}</HeaderButton>
        </AddBoardButton>
      </div>
      <div className={styles.container__buttons_group}>
        <HeaderButton cb={changeLanguage}>{t('mainPage.buttons.language')}</HeaderButton>
        <HeaderButton cb={logout}>{t('mainPage.buttons.logout')}</HeaderButton>
      </div>
    </header>
  );
};

export default Header;
