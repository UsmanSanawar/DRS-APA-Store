// react
import React from "react";

// third-party
import { Link } from "react-router-dom";

// application
import Menu from "./Menu";
import { ArrowRoundedRight6x9Svg } from "../../svg";

import { useSelector } from "react-redux";

function DepartmentsLinks(props) {
  const { storeView, menu, categories } = useSelector(({ webView }) => webView);

  const linksList =
    categories &&
    categories.map((department, index) => {
      let arrow = null;
      let submenu = null;
      let itemClass = "";


      if (department.hasSubMenu) {
        arrow = <ArrowRoundedRight6x9Svg className="departments__link-arrow" />;
      }

      if (department.hasSubMenu) {
        itemClass = "departments__item--menu";
        submenu = (
          <div className="departments__menu">
            <Menu items={department.webSubMenu} />
          </div>
        );
      }

      return department.url === "/store/blog/posts" ? (
        <li key={index} className={`departments__item ${itemClass}`}>
          <Link to={department.url} onClick={() => props.history.push('/store/blog/posts')}>
            {department.name}
            {arrow}
          </Link>
          {submenu}
        </li>
      ) : (
        <li key={index} className={`departments__item ${itemClass}`}>
          <Link to={department.url}>
            {department.name}
            {arrow}
          </Link>
          {submenu}
        </li>
      );
    });

  return <ul className="departments__links">{linksList}</ul>;
}

export default DepartmentsLinks;
