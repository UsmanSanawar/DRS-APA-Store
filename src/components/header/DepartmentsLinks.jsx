// react
import React from 'react';

// third-party
import { Link } from 'react-router-dom';

// application
import Megamenu from './Megamenu';
import Menu from './Menu';
import { ArrowRoundedRight6x9Svg } from '../../svg';

import { useDispatch, useSelector } from 'react-redux';

// data stubs
import departments from '../../data/headerDepartments';


function DepartmentsLinks() {


    const {storeView, menu, categories} = useSelector(({ webView }) =>  webView);

    const linksList = categories && categories.map((department, index) => {
        let arrow = null;
        let submenu = null;
        let itemClass = '';

        if (department.hasSubMenu) {
            arrow = <ArrowRoundedRight6x9Svg className="departments__link-arrow" />;
        }

        if (department.hasSubMenu) {
            itemClass = 'departments__item--menu';
            submenu = (
                <div className="departments__menu">
                    <Menu items={department.webSubMenu} />
                </div>
            );
        }

        return (
            <li key={index} className={`departments__item ${itemClass}`}>
                <Link to={department.url}>
                    {department.name}
                    {arrow}
                </Link>
                {submenu}
            </li>
        );
    });

    return (
        <ul className="departments__links">
            {linksList}
        </ul>
    );
}

export default DepartmentsLinks;
