// react
import React, { useState, useEffect } from "react";

// third-party
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";

// application
import CategorySidebar from "./CategorySidebar";
import PageHeader from "../shared/PageHeader";
import ProductsView from "./ProductsView";
import { sidebarClose } from "../../store/sidebar";

import theme from "../../data/theme";

function ShopPageCategory(props) {
  const [Filters, setFilters] = useState({
    priceRange: [],
    manufacturers: [],
    category: null,
    searchString: "",
  });

  function onChange(key, value) {
    Filters[key] = value;
    setFilters({ ...Filters });
  }

  useEffect(() => {
    if (
      window.location.href.split("?").length > 1 &&
      window.location.href.split("?")[1]
    ) {
      setFilters({
        ...Filters,
        searchString: window.location.href.split("?")[1] || "",
      });
    }
  }, []);
  
  useEffect(() => {
    if (
      window.location.href.split("?").length > 1 &&
      window.location.href.split("?")[1]
    ) {
      setFilters({
        ...Filters,
        searchString: window.location.href.split("?")[1] || "",
      });
    }
  }, [window.location.href]);

  useEffect(() => {
    if (props.match.params && props.match.params.id) {
      setFilters({ ...Filters, category: props.match.params.id });
    }
  }, [props.match.params.id]);

  const { columns, viewMode, sidebarPosition } = props;
  const breadcrumb = [
    // { title: 'Home', url: '' },
    // { title: 'Screwdrivers', url: '' },
  ];
  let content;

  const offcanvas = columns === 3 ? "mobile" : "always";

  if (columns > 3) {
    content = (
      <div className="container">
        <div className="block">
          <ProductsView
            layout={viewMode}
            grid={`grid-${columns}-full`}
            limit={15}
            offcanvas={offcanvas}
          />
        </div>
        {
          <CategorySidebar
            {...props}
            onChange={onChange}
            sideFilters={Filters}
            offcanvas={offcanvas}
          />
        }
      </div>
    );
  } else {
    const sidebar = (
      <div className="shop-layout__sidebar">
        {
          <CategorySidebar
            {...props}
            onChange={onChange}
            sideFilters={Filters}
            offcanvas={offcanvas}
          />
        }
      </div>
    );

    content = (
      <div className="container">
        <div className={`shop-layout shop-layout--sidebar--${sidebarPosition}`}>
          {sidebarPosition === "start" && sidebar}
          <div className="shop-layout__content">
            <div className="block">
              <ProductsView
                sideFilters={Filters}
                {...props}
                // products={products}
                layout={viewMode}
                grid="grid-3-sidebar"
                limit={15}
                offcanvas={offcanvas}
              />
            </div>
          </div>
          {sidebarPosition === "end" && sidebar}
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>{`Shop Category Page — ${theme.name}`}</title>
      </Helmet>

      <PageHeader header="Screwdrivers" breadcrumb={breadcrumb} />

      {content}
    </React.Fragment>
  );
}

ShopPageCategory.propTypes = {
  /**
   * number of product columns (default: 3)
   */
  columns: PropTypes.number,
  /**
   * mode of viewing the list of products (default: 'grid')
   * one of ['grid', 'grid-with-features', 'list']
   */
  viewMode: PropTypes.oneOf(["grid", "grid-with-features", "list"]),
  /**
   * sidebar position (default: 'start')
   * one of ['start', 'end']
   * for LTR scripts "start" is "left" and "end" is "right"
   */
  sidebarPosition: PropTypes.oneOf(["start", "end"]),
};

ShopPageCategory.defaultProps = {
  columns: 3,
  viewMode: "grid",
  sidebarPosition: "start",
};

const mapStateToProps = (state) => ({
  sidebarState: state.sidebar,
});

const mapDispatchToProps = {
  sidebarClose,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopPageCategory);
