// react
import React, { Component } from 'react';

// third-party
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

// application
import Indicator from '../header/Indicator';
import {
    Menu18x14Svg,
    Search20Svg,
    Cross20Svg,
    Heart20Svg,
    Cart20Svg,
} from '../../svg';
import { mobileMenuOpen } from '../../store/mobile-menu';
import logo from "../../assets/imgs/logo-mini.png"
import RestService from '../../store/restService/restService';
import { Spinner, Card } from 'reactstrap';
import { debounce } from 'lodash';
import { IMAGE_URL } from '../../constant/constants';

class MobileHeader extends Component {
    constructor(props) {
        super(props);
        this.sendQuery = query => this.productSearchAPI(query);
        this.debounceQuery = debounce(q => this.sendQuery(q), 400);
        this.state = {
            searchOpen: false,
            loading: false,
            results: [],
            searchString: ""
        };
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleOutsideClick);
    }

    componentDidUpdate(prevProps, prevState) {
        const { searchOpen } = this.state;

        if (searchOpen && searchOpen !== prevState.searchOpen && this.searchInputRef) {
            this.searchInputRef.focus();
        }
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleOutsideClick);
    }

    setSearchWrapperRef = (node) => {
        this.searchWrapperRef = node;
    };

    setSearchInputRef = (node) => {
        this.searchInputRef = node;
    };

    handleOutsideClick = (event) => {
        if (this.searchWrapperRef && !this.searchWrapperRef.contains(event.target)) {
            this.setState(() => ({ searchOpen: false }));
        }
    };

    handleOpenSearch = () => {
        this.setState(() => ({ searchOpen: true }));
    };

    handleCloseSearch = () => {
        this.setState(() => ({ searchOpen: false, results: [], searchString: "" }));
    };

    handleSearchKeyDown = (event) => {
        if (event.which === 27) {
            this.setState(() => ({ searchOpen: false }));
        }
    };

    productSearchAPI = (string) => {
        this.setState({
            loading: true,
            results: []
        })
        RestService.getProductsBySearch(string).then(res => {
            this.setState({
                loading: false
            })
            if (res.data.status === 'success') {
                this.setState({ results: res.data.data })
            }
            console.log(res, "propseeee")
        })
    }

    render() {
        const { openMobileMenu, wishlist, cart } = this.props;
        const { searchOpen, searchString, loading, results } = this.state;
        const searchClasses = classNames('mobile-header__search', {
            'mobile-header__search--opened': searchOpen,
        });

        return (
            <div className="mobile-header">
                <div className="mobile-header__panel">
                    <div className="container">
                        <div className="mobile-header__body">
                            <button type="button" className="mobile-header__menu-button" onClick={openMobileMenu}>
                                <Menu18x14Svg />
                            </button>
                            <Link to="/" className="mobile-header__logo"><img height={52} src={logo} alt="main logo" /></Link>
                            <div className={searchClasses} ref={this.setSearchWrapperRef}>
                                <form className="mobile-header__search-form" onSubmit={(e) => e.preventDefault()}>
                                    <input
                                        className="mobile-header__search-input"
                                        name="search"
                                        placeholder="Search products"
                                        aria-label="Site search"
                                        onChange={(e) => {
                                            this.setState({
                                                searchString: e.target.value
                                            })

                                            this.debounceQuery(e.target.value)

                                        }}
                                        value={searchString}
                                        type="text"
                                        autoComplete="off"
                                        onKeyDown={this.handleSearchKeyDown}
                                        ref={this.setSearchInputRef}
                                    />
                                    <button type="button" className="mobile-header__search-button mobile-header__search-button--submit">
                                        {loading ? <Spinner style={{ height: 20, width: 20, color: "#f6965c" }} /> : <Search20Svg />}
                                    </button>
                                    <button
                                        type="button"
                                        className="mobile-header__search-button mobile-header__search-button--close"
                                        onClick={this.handleCloseSearch}
                                    >
                                        <Cross20Svg />
                                    </button>
                                    <div className="mobile-header__search-body" />
                                </form>

                                <div style={{ position: "absolute" }}>
                                    {results.length > 0 &&
                                        <>
                                            <div
                                                className="col-12 m-0 p-0"
                                                style={{
                                                    zIndex: 110000,
                                                    height: 500,
                                                    overflowY: "scroll",
                                                    overflowX: "hidden",
                                                    backgroundColor: '#929394d9'
                                                }}> {results.map(item => (
                                                    <Card style={{ backgroundColor: "#ffffff" }} className="row m-0 p-2">
                                                        <div className="row">
                                                            <div className="col-4">
                                                                <Link to={`/store/product/${item.productId}`}>
                                                                    <img
                                                                        style={{ height: 80, width: '100%' }}
                                                                        src={`${IMAGE_URL}/${item.image}`}
                                                                        alt="product" />
                                                                </Link>
                                                            </div>

                                                            <div className="col-8">
                                                                <Link style={{ color: '#f6965c' }} to={`/store/product/${item.productId}`}>
                                                                    <p style={{ fontSize: 14 }} className="mb-0">
                                                                        <b>{item.productName}</b>
                                                                    </p>
                                                                </Link>
                                                                <p className="text-success">£{item.price}</p>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                ))}
                                            </div>
                                        </>}
                                </div>
                            </div>

                            <div className="mobile-header__indicators">
                                <Indicator
                                    className="indicator--mobile indicator--mobile-search d-sm-none"
                                    onClick={this.handleOpenSearch}
                                    icon={<Search20Svg />}
                                />
                                <Indicator
                                    className="indicator--mobile indicator--mobile-search d-sm-none"
                                    onClick={() => this.props.history.push('/store/login') }
                                    icon={<i className="fa fa-user" />}
                                />
                                <Indicator
                                    className="indicator--mobile d-sm-flex d-none"
                                    url="/store/wishlist"
                                    value={wishlist.length}
                                    icon={<Heart20Svg />}
                                />
                                <Indicator
                                    className="indicator--mobile"
                                    url="/store/cart"
                                    value={cart.quantity}
                                    icon={<Cart20Svg />}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return ({
        cart: state.cart,
        wishlist: state.wishlist,
    })
};

const mapDispatchToProps = {
    openMobileMenu: mobileMenuOpen,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(MobileHeader);
