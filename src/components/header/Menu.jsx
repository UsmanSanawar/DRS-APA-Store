// react
import React from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";

// application
import AppLink from "../shared/AppLink";
import { ArrowRoundedRight6x9Svg } from "../../svg";

import { useDispatch } from "react-redux";

function Menu(props) {
  const { layout, withIcons, items, onClick } = props;

  const dispatch = useDispatch();

  const renderLink = (item, content) => {
    let link;

    if (item.slug) {
      link = (
        <AppLink
          {...item.props}
          to={{
            pathname: item.slug,
            state: {
              categoryId: item.productCategoryId,
            },
          }}
          onClick={() => onClick(item)}
        >
          {content}
        </AppLink>
      );
    } else if (item.url) {
      link = (
        <AppLink {...item.props} to={item.url} onClick={() => onClick(item)}>
          {content}
        </AppLink>
      );
    } else {
      link = (
        <button type="button" onClick={() => onClick(item)}>
          {content}
        </button>
      );
    }

    return link;
  };

  const toggleView = (item) => {
    if (item.title === "Store") {
      dispatch({ type: "STORE_VIEW", storeView: true });
    } else if (item.title === "Home") {
      dispatch({ type: "STORE_VIEW", storeView: false });
    }
  };

  const itemsList = items.map((item, index) => {
    let arrow;
    let webSubMenu;
    let icon;

    if (item.hasSubMenu === true) {
      arrow = <ArrowRoundedRight6x9Svg className="menu__arrow" />;
    }

    if (item.hasSubMenu === true) {
      webSubMenu = (
        <div className="menu__webSubMenu">
          <Menu items={item.webSubMenu} />
        </div>
      );
    }

    if (withIcons && item.icon) {
      icon = (
        <div className="menu__icon">
          <img src={item.icon} srcSet={item.icon_srcset} alt="" />
        </div>
      );
    }

    return (
      <li key={index}>
        {renderLink(
          item,
          item.webSubMenuTitle ? (
            <React.Fragment>
              <div onClick={() => toggleView(item)}>
                {icon}
                {item.webSubMenuTitle}
                {arrow}
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {icon}
              {item.title}
              {arrow}
            </React.Fragment>
          )
        )}
        {webSubMenu}
      </li>
    );
  });

  const classes = classNames(`menu menu--layout--${layout}`, {
    "menu--with-icons": withIcons,
  });

  return <ul className={classes}>{itemsList}</ul>;
}

Menu.propTypes = {
  /** one of ['classic', 'topbar'] (default: 'classic') */
  layout: PropTypes.oneOf(["classic", "topbar"]),
  /** default: false */
  withIcons: PropTypes.bool,
  /** array of menu items */
  items: PropTypes.array,
  /** callback function that is called when the item is clicked */
  onClick: PropTypes.func,
};

Menu.defaultProps = {
  layout: "classic",
  withIcons: false,
  items: [],
  onClick: () => {},
};

export default Menu;
