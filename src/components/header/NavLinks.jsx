// react
import React from 'react';

// third-party
import classNames from 'classnames';

// application
import AppLink from '../shared/AppLink';
import Megamenu from './Megamenu';

import { useDispatch, useSelector } from 'react-redux';
import Menu from './Menu';
import { ArrowRoundedDown9x6Svg } from '../../svg';

// data stubs
import navLinks from '../../data/headerNavigation';
import navLinks2 from '../../data/headerNavigation2';


function NavLinks(props) {
    const webView = useSelector(({ webView }) =>  webView);
    console.log(webView, 'webView webView webView');

    const handleMouseEnter = (event) => {
        const item = event.currentTarget;
        const megamenu = item.querySelector('.nav-links__megamenu');

        if (megamenu) {
            const container = megamenu.offsetParent;
            const containerWidth = container.getBoundingClientRect().width;
            const megamenuWidth = megamenu.getBoundingClientRect().width;
            const itemOffsetLeft = item.offsetLeft;
            const megamenuPosition = Math.round(
                Math.min(itemOffsetLeft, containerWidth - megamenuWidth),
            );

            megamenu.style.left = `${megamenuPosition}px`;
        }
    };

    const linksList = () =>{

        let data = webView.storeView ? navLinks2 : navLinks;

       return data.map((item, index) => {
            let arrow;
            let submenu;

            if (item.submenu) {
                arrow = <ArrowRoundedDown9x6Svg className="nav-links__arrow" />;
            }

            if (item.submenu && item.submenu.type === 'menu') {
                submenu = (
                    <div className="nav-links__menu">
                        <Menu items={item.submenu.menu} webView={webView} />
                    </div>
                );
            }

            if (item.submenu && item.submenu.type === 'megamenu') {
                submenu = (
                    <div className={`nav-links__megamenu nav-links__megamenu--size--${item.submenu.menu.size}`}>
                        <Megamenu menu={item.submenu.menu} />
                    </div>
                );
            }

            const classes = classNames('nav-links__item', {
                'nav-links__item--with-submenu': item.submenu,
            });

            return (
                <li key={index} className={classes} onMouseEnter={handleMouseEnter}>
                    <AppLink to={item.url} {...item.props} >
                        <span>
                            {item.title}
                            {arrow}
                        </span>
                    </AppLink>
                    {submenu}
                </li>
            );
        });

    }

    return (
        <ul className="nav-links__list" style={props.layout == "compact" ? {color: "#fff"} : {}}>
            {linksList()}
        </ul>
    );
}

export default NavLinks;
