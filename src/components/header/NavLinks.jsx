// react
import React,{useEffect, useState} from 'react';

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
import RestService from '../../store/restService/restService';

 
function NavLinks(props) {

    const {storeView, menu, categories} = useSelector(({ webView }) =>  webView);

    console.log(props, menu, 'menu menu menu',categories);
    

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

        let data = props.layout == 'compact' ? categories : menu;

       return data && data.map((item, index) => {
            let arrow;
            let webSubMenu;

            if (item.hasSubMenu) {
                arrow = <ArrowRoundedDown9x6Svg className="nav-links__arrow" />;
            }

            if(item.hasSubMenu ){
                webSubMenu = (
                    <div className="nav-links__menu">
                        <Menu items={item.webSubMenu} />
                    </div>
                );
            }

            if (item.webSubMenu && item.webSubMenu.type === 'megamenu') {
                webSubMenu = (
                    <div className={`nav-links__megamenu nav-links__megamenu--size--${item.webSubMenu.menu.size}`}>
                        <Megamenu menu={item.webSubMenu.menu} />
                    </div>
                );
            }

            const classes = classNames('nav-links__item', {
                'nav-links__item--with-webSubMenu': item.webSubMenu,
            });

            return (
                <li key={index} className={classes} onMouseEnter={handleMouseEnter}>
                    <AppLink to={item.slug} {...item.props} >
                        <span>
                            {item.webMenuTitle}
                            {arrow}
                        </span>
                    </AppLink>
                    {webSubMenu}
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
