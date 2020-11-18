// react
import React, { useState } from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';

// application
import { Check9x7Svg } from '../../svg';


function FilterCheckbox(props) {
    const { items } = props;

  const [manufacturer, setmanufaturer] = useState([])
    function onCheckboxChange(event, id) {
        if (event.target.checked) {
                manufacturer.push(id)                
        } else {
            if (manufacturer.includes(id)) {
                let index = manufacturer.indexOf(id);
                if (index > -1) {
                    manufacturer.splice(index, 1);                    
                }
            }
        }

        setmanufaturer(manufacturer)

        props.onChange("manufacturers", manufacturer)
    }

    const itemsList = items.map((item) => {
        let count;

        if (item.count) {
            count = <span className="filter-list__counter">{item.count}</span>;
        }

        return (
            <label
                key={item.id}
                className={classNames('filter-list__item', {
                    'filter-list__item--disabled': item.disabled,
                })}
            >
                <span className="filter-list__input input-check">
                    <span className="input-check__body">
                        <input className="input-check__input" onChange={(event) => onCheckboxChange(event, item.id)}  type="checkbox" defaultChecked={item.checked} disabled={item.disabled} />
                        <span className="input-check__box" />
                        <Check9x7Svg className="input-check__icon" />
                    </span>
                </span>
                <span className="filter-list__title">{item.label}</span>
                {count}
            </label>
        );
    });

    return (
        <div className="filter-list">
            <div className="filter-list__list">
                {itemsList}
            </div>
        </div>
    );
}

FilterCheckbox.propTypes = {
    items: PropTypes.array,
};

export default FilterCheckbox;
