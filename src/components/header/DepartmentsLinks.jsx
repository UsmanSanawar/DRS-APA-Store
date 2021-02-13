// react
import React from "react";

// third-party
import { Link, Redirect } from "react-router-dom";

// application
import Menu from "./Menu";
import { ArrowRoundedRight6x9Svg } from "../../svg";

import { useSelector } from "react-redux";

function DepartmentsLinks(props) {
  // eslint-disable-next-line no-unused-vars
  let { storeView, menu, categories, handleButtonClick } = useSelector(
    ({ webView }) => webView
  );

  let newCategories = categories.filter(
    (item) => item.slug !== "/store/account_logout"
  );

  let linksList =
    newCategories &&
    newCategories.map((department, index) => {
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

      return (
        <li
          onClick={() => props.handleButtonClick("no")}
          // onMouseLeave={() => props.handleButtonClick("no")}
          className={`departments__item ${itemClass}`}
        >
          {console.log(department, "sssssssssssssss")}
          <Link to={"/store/products/" + department.productCategoryId}>
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
