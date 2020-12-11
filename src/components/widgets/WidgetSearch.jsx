// react
import React from 'react';

// application
import { Search20Svg } from '../../svg';


function WidgetSearch(props) {
    return (
        <div className="widget-search">
            <form onSubmit={(e) => e.preventDefault()} className="widget-search__body">
                <input className="widget-search__input" value={props.searchString} onChange={(e) => props.setSearch(e.target.value)} placeholder="Blog search..." type="text" autoComplete="off" spellCheck="false" />
                <button className="widget-search__button" type="button">
                    <Search20Svg />
                </button>
            </form>
        </div>
    );
}

export default WidgetSearch;
