// react
import React from 'react';

// third-party
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// application
import { ArrowRoundedLeft6x9Svg } from '../../svg';


function FilterCategories(props) {
    const { categories, sideFilters, } = props;

    const categoriesList = categories.map((category) => {
        let arrow;

        if (category.type === 'parent') {
            arrow = <ArrowRoundedLeft6x9Svg className="filter-categories__arrow" />;
        }

        return (
            <li key={category.id} className={`filter-categories__item filter-categories__item--${sideFilters.category != null && sideFilters.category == category.id ? 'current' : category.type}`}>
                {arrow}
                <p style={{cursor: "pointer"}} onClick={()=>props.onChange("category" ,category.id)}>{category.name}</p>
                <div className="filter-categories__counter">{category.count}</div>
            </li>
        );
    });

    return (
        <div className="filter-categories">
            <ul className="filter-categories__list">
                {categoriesList}
            </ul>
        </div>
    );
}

FilterCategories.propTypes = {
    categories: PropTypes.array,
};

export default FilterCategories;
