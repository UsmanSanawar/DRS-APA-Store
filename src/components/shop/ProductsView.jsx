// react
// third-party
import classNames from "classnames";
import PropTypes from "prop-types";
import React, {Component} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {connect} from "react-redux";
import CircularLoader from "../../assets/loaders";
import {productObjectConverter} from "../../constant/helpers";
import RestService from "../../store/restService/restService";
import {sidebarOpen} from "../../store/sidebar";
import {Filters16Svg, LayoutGrid16x16Svg, LayoutGridWithDetails16x16Svg, LayoutList16x16Svg} from "../../svg";
// application
import ProductCard from "../shared/ProductCard";

class ProductsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      itemLength: 20,
      products: [],
      pagination: {currentPage: 1, totalCount: 10},
      allCategories: []
    };
  }

  setLayout = (layout) => {
    this.setState(() => ({layout}));
  };

  componentDidMount() {
    RestService.getAllCategories().then(res => {
      if(res.data.status === "success") {
        this.setState({
          allCategories: res.data.data
        })
      }
    })
    let filters = {...this.props.sideFilters, category: this.props.match.params.id}
    this.handleGetProducts(1, 10, filters);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.sideFilters !== this.props.sideFilters) {
      this.state.pagination.currentPage = 1;
      this.handleGetProducts(
        this.state.pagination.currentPage,
        this.state.itemLength,
        this.props.sideFilters,
        true
      );
    }
  }

  productAPI = (pageNumber, itemLength, filter) => {
    RestService.getProductsByPageAndFilter(pageNumber, itemLength, filter).then(
      (res) => {
        if (res.data.status === "success") {
          let data = res.data.data;
          let array = [];
          data.map((item) => {
            array.push(productObjectConverter(item));
          });


          this.setState({
            products: [...this.state.products, ...array].filter(
              (v, i, a) =>
                a.findIndex((t) => JSON.stringify(t) === JSON.stringify(v)) ===
                i
            ),
            pagination: JSON.parse(res.headers["x-pagination"]),
          });
        }
      }
    );
  };

  handleGetProducts = (pageNumber, itemLength, filter, didUpdate) => {
    if (didUpdate) {
      this.setState({
        products: [],
      });
      this.productAPI(pageNumber, itemLength, filter);
    } else {
      this.productAPI(pageNumber, itemLength, filter);
    }
  };

  fetchMoreData = () => {
    let page = 1;
    if (this.state.pagination.totalPages != this.state.pagination.currentPage) {
      page = this.state.pagination.currentPage + 1;
      this.handleGetProducts(
        parseInt(page),
        this.state.itemLength,
        this.props.sideFilters
      );
    }
  };

  render() {
    const {grid, offcanvas, sideFilters, layout: propsLayout, sidebarOpen} = this.props;
    const {page, layout: stateLayout, products, pagination, allCategories} = this.state;
    const layout = stateLayout || propsLayout;


    let viewModes = [
      {key: "grid", title: "Grid", icon: <LayoutGrid16x16Svg/>},
      {
        key: "grid-with-features",
        title: "Grid With Features",
        icon: <LayoutGridWithDetails16x16Svg/>,
      },
      {key: "list", title: "List", icon: <LayoutList16x16Svg/>},
    ];

    viewModes = viewModes.map((viewMode) => {
      const className = classNames("layout-switcher__button", {
        "layout-switcher__button--active": layout === viewMode.key,
      });

      return (
        <button
          key={viewMode.key}
          title={viewMode.title}
          type="button"
          className={className}
          onClick={() => this.setLayout(viewMode.key)}
        >
          {viewMode.icon}
        </button>
      );
    });

    const viewOptionsClasses = classNames("view-options", {
      "view-options--offcanvas--always": offcanvas === "always",
      "view-options--offcanvas--mobile": offcanvas === "mobile",
    });

    const handleCategory = () => {
      let {category} = sideFilters;
      let selectedCat = allCategories.filter(item => item.productCategoryId === parseInt(category))
      if (selectedCat.length > 0) {
        return selectedCat[0].name
      }
    }

    return (
      <div className="products-view">
        <div className="products-view__options">
          <div className={viewOptionsClasses}>
            <div className="view-options__filters-button">
              <button
                type="button"
                className="filters-button"
                onClick={() => sidebarOpen()}
              >
                <Filters16Svg className="filters-button__icon"/>
                <span className="filters-button__title">Filters</span>
                <span className="filters-button__counter">3</span>
              </button>
            </div>
            <div className="view-options__layout">
              <div className="layout-switcher">
                <div className="layout-switcher__list">{viewModes}</div>
              </div>
            </div>

            <div className="view-options__divider"/>
            <div className="view-options__control">
              <div>
                <span>Store</span>
                <span> {">"} </span>
                <span>Products</span>
                <span> {">"} </span>
                <span><b>{handleCategory() || ""}</b></span>
              </div>
              {/*<label htmlFor="view-options-sort">Sort By</label>*/}
              {/*<div>*/}
              {/*  <select*/}
              {/*    className="form-control form-control-sm"*/}
              {/*    name=""*/}
              {/*    id="view-options-sort"*/}
              {/*  >*/}
              {/*    <option value="">Default</option>*/}
              {/*    <option value="">Name (A-Z)</option>*/}
              {/*  </select>*/}
              {/*</div>*/}
            </div>
          </div>
        </div>

        <div
          className="products-view__list products-list"
          id="InfinityJinx"
          data-layout={layout !== "list" ? grid : layout}
          data-with-features={
            layout === "grid-with-features" ? "true" : "false"
          }
        >
          <InfiniteScroll
            style={{overflowX: "hidden"}}
            dataLength={this.state.products.length} //it needs to be setted to the current data we have
            next={this.fetchMoreData}
            hasMore={!(this.state.products.length === pagination.totalCount)}
            loader={
              <div style={{textAlign: "center", marginTop: 75}}>
                <CircularLoader/>
              </div>
            }
            // scrollableTarget={'InfinityJinx'}
            endMessage={
              <p style={{textAlign: "center", marginTop: 75}}>
                {/*<b>No further records found !</b>*/}
              </p>
            }
          >
            <div className="products-list__body">
              {products.map((product) => (
                <div key={product.id} className="products-list__item">
                  <ProductCard product={product}/>
                </div>
              ))}
            </div>
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

ProductsView.propTypes = {
  /**
   * array of product objects
   */
  products: PropTypes.array,
  /**
   * products list layout (default: 'grid')
   * one of ['grid', 'grid-with-features', 'list']
   */
  layout: PropTypes.oneOf(["grid", "grid-with-features", "list"]),
  /**
   * products list layout (default: 'grid')
   * one of ['grid-3-sidebar', 'grid-4-full', 'grid-5-full']
   */
  grid: PropTypes.oneOf(["grid-3-sidebar", "grid-4-full", "grid-5-full"]),
  /**
   * indicates when sidebar bar should be off canvas
   */
  offcanvas: PropTypes.oneOf(["always", "mobile"]),
};

ProductsView.defaultProps = {
  products: [],
  layout: "grid",
  grid: "grid-3-sidebar",
  offcanvas: "mobile",
};

const mapDispatchToProps = {
  sidebarOpen,
};

export default connect(() => ({}), mapDispatchToProps)(ProductsView);
