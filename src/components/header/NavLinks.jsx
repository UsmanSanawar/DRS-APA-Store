// react
import React, { useEffect, useState } from "react";

// third-party
import classNames from "classnames";

// application
import Megamenu from "./Megamenu";

import { useDispatch, useSelector } from "react-redux";
import Menu from "./Menu";
import { ArrowRoundedDown9x6Svg } from "../../svg";

function NavLinks(props) {
  let { menu, categories } = useSelector(({ webView }) => webView);

  let index = menu.findIndex(item => item.slug === '/home');
  if (index > -1) {
    delete menu[index]
  }

  

  const onMenuClick = (item) => {
    props.history.replace({
      pathname: props.layout === "compact" ? `/store/products/${item.productCategoryId}` : item.slug,
    });
  };

  const handleMouseEnter = (event) => {
    const item = event.currentTarget;
    const megamenu = item.querySelector(".nav-links__megamenu");

    if (megamenu) {
      const container = megamenu.offsetParent;
      const containerWidth = container.getBoundingClientRect().width;
      const megamenuWidth = megamenu.getBoundingClientRect().width;
      const itemOffsetLeft = item.offsetLeft;
      const megamenuPosition = Math.round(
        Math.min(itemOffsetLeft, containerWidth - megamenuWidth)
      );

      megamenu.style.left = `${megamenuPosition}px`;
    }
  };

  const linksList = () => {
    let data = props.layout === "compact" ? categories : menu;
    data = data.filter(item => item.slug !== "/store/account_logout")
    return (
      data &&
      data.map((item, index) => {
        let arrow;
        let webSubMenu;

        if (item.hasSubMenu) {
          arrow = <ArrowRoundedDown9x6Svg className="nav-links__arrow" />;
        }

        if (item.hasSubMenu) {
          webSubMenu = (
            <div className="nav-links__menu">
              <Menu items={item.webSubMenu} onClick={onMenuClick} />
            </div>
          );
        }

        if (item.webSubMenu && item.webSubMenu.type === "megamenu") {
          webSubMenu = (
            <div
              className={`nav-links__megamenu nav-links__megamenu--size--${item.webSubMenu.menu.size}`}
            >
              <Megamenu menu={item.webSubMenu.menu} />
            </div>
          );
        }

        const classes = classNames("nav-links__item", {
          "nav-links__item--with-webSubMenu": item.webSubMenu,
        });
        if (!(item.slug === "/home") && !(item.slug === '/store')) {
          
        return (
          <li key={index} className={classes} onMouseEnter={handleMouseEnter}>
            <a
              href="JavaScript:void(0);"
              onClick={() => onMenuClick(item)}
              {...item.props}
            >
              <span>
                {item.webMenuTitle}
                {arrow}
              </span>
            </a>
            {webSubMenu}
          </li>
        );
      }
      })
    );
  };

  return (
    <ul
      className="nav-links__list"
      style={props.layout === "compact" ? { color: "#fff" } : {}}
    >
      {linksList()}
    </ul>
  );
}

export default NavLinks;
