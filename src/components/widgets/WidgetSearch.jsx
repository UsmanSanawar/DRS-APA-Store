// react
import React from "react";

// application
import { Search20Svg } from "../../svg";

const token = JSON.parse(localStorage.getItem("token"));
function WidgetSearch(props) {
  return (
    <div>
      <div className="widget-search">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="widget-search__body"
        >
          <input
            className="widget-search__input"
            value={props.searchString}
            onChange={(e) => props.setSearch(e.target.value)}
            placeholder="Blog search..."
            type="text"
            autoComplete="off"
            spellCheck="false"
          />
          <button className="widget-search__button" type="button">
            <Search20Svg />
          </button>
        </form>
      </div>

      <div>
        <div
          onClick={() => token && props.handleForm(true)}
          type="button"
          className={`btn btn-success my-4 w-100 ${token ? "" : 'disabled btn-disabled'}`}
        >
          {token ? "Create Blog Post" : "Login to create blog post"}
        </div>
      </div>
    </div>
  );
}

export default WidgetSearch;
