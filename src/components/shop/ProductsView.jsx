// react
import React, { Component } from 'react';

// third-party
import classNames from 'classnames';
import PropTypes, {array} from 'prop-types';
import { connect } from 'react-redux';
import InfiniteScroll from "react-infinite-scroll-component";

// application
import Pagination from '../shared/Pagination';
import ProductCard from '../shared/ProductCard';
import {
    Filters16Svg,
    LayoutGrid16x16Svg,
    LayoutGridWithDetails16x16Svg,
    LayoutList16x16Svg,
} from '../../svg';
import { sidebarOpen } from '../../store/sidebar';
import RestService from "../../store/restService/restService";
import CircularLoader from "../../assets/loaders";


class ProductsView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pageNumber: 1,
            itemLength: 10,
            products: [],
            headers: {},
            filters: {}
        };
    }

    setLayout = (layout) => {
        this.setState(() => ({ layout }));
    };

    componentDidMount() {
        this.handleGetProducts(1, 10, this.props.sideFilters);
    }

    componentDidUpdate(prevProps, prevState) {


        if (prevProps.sideFilters != this.props.sideFilters) {
            this.state.pageNumber = 1;
            this.handleGetProducts(this.state.pageNumber, this.state.itemLength, this.props.sideFilters, true);  
            
            this.setState({
                pageNumber: this.state.pageNumber
            })
        }
    }
    

    productAPI = (pageNumber, itemLength, filter) => {
        RestService.getProductsByPageAndFilter(pageNumber, itemLength, filter).then(res => {

            if (res) {
                this.setState({
                    headers: JSON.parse(res.headers["x-pagination"])
                })
            }

            if (res.data.status === "success") {
                let data = res.data.data;
                let array = [];
                data.map(item => {
                    let images = [];
                    if (item.productPhotos.length > 0) {

                        item.productPhotos.map(image => {
                            images.push(`http://192.3.213.101:3450/Uploads/${image.name}`)
                        })
                    }

                    array.push(
                        {
                            id: item.productId,
                            name: item.productName,
                            price: item.price,
                            model: item.manufacturerName,
                            compareAtPrice: null, //need be added to DTO
                            images: images,
                            badges: [''],
                            rating: item.totalRating,
                            reviews: item.totalReviewsCount,
                            availability: item.stockStatusName,
                            features: [
                                { name: 'Length', value: item.length + " " + item.lengthUnitName },
                                { name: 'Width', value: item.width + " " + item.lengthUnitName },
                                { name: 'Height', value: item.height + " " + item.lengthUnitName },
                                { name: 'Weight', value: item.weight + " " + (item.weightUnitName != null? item.weightUnitName : "") },
                            ],
                            options: item.productOptions,
                        })
                })

                this.setState({
                    products: [...this.state.products, ...array].filter((v,i,a)=>a.findIndex(t=>(JSON.stringify(t) === JSON.stringify(v)))===i)
                })
            }
        })

    }


    handleGetProducts = (pageNumber, itemLength, filter, didUpdate) => {

        if (didUpdate) {
            this.setState({
                products: []
            })
            this.productAPI(pageNumber, itemLength, filter);
    
        } else {
            this.productAPI(pageNumber, itemLength, filter);
        }

        
    }

    // handlePageChange = (page) => {
    //     this.setState(() => ({ page }));
    // };

    fetchMoreData = () => {


        let page = 1
        if (this.state.headers.totalPages != this.state.pageNumber) {
            page = this.state.pageNumber + 1;
            
            this.handleGetProducts(parseInt(page), this.state.itemLength, this.props.sideFilters);
        }
        
        this.setState({
            pageNumber: page
        })
    }

    render() {

        console.log("render this.State", this.state)

        const {
            grid,
            offcanvas,
            layout: propsLayout,
            sidebarOpen,
        } = this.props;

        const { page, layout: stateLayout, products, headers } = this.state;
        const layout = stateLayout || propsLayout;

        let viewModes = [
            { key: 'grid', title: 'Grid', icon: <LayoutGrid16x16Svg /> },
            { key: 'grid-with-features', title: 'Grid With Features', icon: <LayoutGridWithDetails16x16Svg /> },
            { key: 'list', title: 'List', icon: <LayoutList16x16Svg /> },
        ];

        viewModes = viewModes.map((viewMode) => {
            const className = classNames('layout-switcher__button', {
                'layout-switcher__button--active': layout === viewMode.key,
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

        const viewOptionsClasses = classNames('view-options', {
            'view-options--offcanvas--always': offcanvas === 'always',
            'view-options--offcanvas--mobile': offcanvas === 'mobile',
        });

        return (
            <div className="products-view">
                <div className="products-view__options">
                    <div className={viewOptionsClasses}>
                        <div className="view-options__filters-button">
                            <button type="button" className="filters-button" onClick={() => sidebarOpen()}>
                                <Filters16Svg className="filters-button__icon" />
                                <span className="filters-button__title">Filters</span>
                                <span className="filters-button__counter">3</span>
                            </button>
                        </div>
                        <div className="view-options__layout">
                            <div className="layout-switcher">
                                <div className="layout-switcher__list">
                                    {viewModes}
                                </div>
                            </div>
                        </div>
                        {/*<div className="view-options__legend">Showing 6 of 98 products</div>*/}
                        <div className="view-options__divider" />
                        <div className="view-options__control">
                            <label htmlFor="view-options-sort">Sort By</label>
                            <div>
                                <select className="form-control form-control-sm" name="" id="view-options-sort">
                                    <option value="">Default</option>
                                    <option value="">Name (A-Z)</option>
                                </select>
                            </div>
                        </div>
                        {/*<div className="view-options__control">*/}
                        {/*    <label htmlFor="view-options-limit">Show</label>*/}
                        {/*    <div>*/}
                        {/*        <select className="form-control form-control-sm" name="" id="view-options-limit">*/}
                        {/*            <option value="10">10</option>*/}
                        {/*            <option value="20">20</option>*/}
                        {/*        </select>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                </div>

                <div
                    className="products-view__list products-list"
                    data-layout={layout !== 'list' ? grid : layout}
                    data-with-features={layout === 'grid-with-features' ? 'true' : 'false'}
                >

                    {console.log(this.state.products.length , !(this.state.products.length === headers.totalCount) , headers.totalCount )}

                        <InfiniteScroll
                            dataLength={this.state.products.length} //it needs to be setted to the current data we have
                            next={ this.fetchMoreData }
                            hasMore={!(this.state.products.length === headers.totalCount)}
                            loader={<div style={{textAlign: "center"}}><CircularLoader/></div>}
                            scrollableTarget
                            endMessage={
                                <p style={{ textAlign: "center", marginTop: 10}}>
                                    <b>No further records found !</b>
                                </p>
                            }
                        >
                            <div className="products-list__body">

                            {
                                products.map((product) => (
                                    <div key={product.id} className="products-list__item">
                                        <ProductCard product={product} />
                                    </div>
                                ))
                            }
                            </div>

                        </InfiniteScroll>


                </div>

                {/*<div className="products-view__pagination">*/}
                {/*    <Pagination*/}
                {/*        current={page}*/}
                {/*        siblings={2}*/}
                {/*        total={10}*/}
                {/*        onPageChange={this.handlePageChange}*/}
                {/*    />*/}
                {/*</div>*/}
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
    layout: PropTypes.oneOf(['grid', 'grid-with-features', 'list']),
    /**
     * products list layout (default: 'grid')
     * one of ['grid-3-sidebar', 'grid-4-full', 'grid-5-full']
     */
    grid: PropTypes.oneOf(['grid-3-sidebar', 'grid-4-full', 'grid-5-full']),
    /**
     * indicates when sidebar bar should be off canvas
     */
    offcanvas: PropTypes.oneOf(['always', 'mobile']),
};

ProductsView.defaultProps = {
    products: [],
    layout: 'grid',
    grid: 'grid-3-sidebar',
    offcanvas: 'mobile',
};

const mapDispatchToProps = {
    sidebarOpen,
};

export default connect(
    () => ({}),
    mapDispatchToProps,
)(ProductsView);
