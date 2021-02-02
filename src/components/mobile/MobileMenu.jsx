// react
import React from 'react';

// third-party
import classNames from 'classnames';
import { connect, useSelector } from 'react-redux';

// application
import MobileLinks from './MobileLinks';
import { Cross20Svg } from '../../svg';
import { currencyChange } from '../../store/currency';
import { localeChange } from '../../store/locale';
import { mobileMenuClose } from '../../store/mobile-menu';
// data stubs
import currencies from '../../data/shopCurrencies';


function MobileMenu(props) {
  const {
    mobileMenuState,
    closeMobileMenu,
    changeLocale,
    changeCurrency,
    layout
  } = props;

  const { categories, menu } = useSelector(({ webView }) => webView);

  let menulinks = layout === 'compact' ? categories : menu;

  const classes = classNames('mobilemenu', {
    'mobilemenu--open': mobileMenuState.open,
  });

  let token = localStorage.getItem('token');
  if (!token) {
    menulinks = menulinks.filter(item => item.slug !== "/store/account_logout")
  }

  const handleItemClick = (item) => {
    if (item.data) {
      if (item.data.type === 'language') {
        changeLocale(item.data.locale);
        closeMobileMenu();
      }
      if (item.data.type === 'currency') {
        const currency = currencies.find((x) => x.currency.code === item.data.code);

        if (currency) {
          changeCurrency(currency.currency);
          closeMobileMenu();
        }
      }
    }
  };

  return (
    <div className={classes}>
      {/* eslint-disable-next-line max-len */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */}
      <div className="mobilemenu__backdrop" onClick={closeMobileMenu} />
      <div className="mobilemenu__body">
        <div className="mobilemenu__header">
          <div className="mobilemenu__title">Menu</div>
          <button type="button" className="mobilemenu__close" onClick={closeMobileMenu}>
            <Cross20Svg />
          </button>
        </div>
        <div className="mobilemenu__content">
          <MobileLinks links={menulinks} onItemClick={handleItemClick} />
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  mobileMenuState: state.mobileMenu,
});

const mapDispatchToProps = {
  closeMobileMenu: mobileMenuClose,
  changeLocale: localeChange,
  changeCurrency: currencyChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileMenu);
