// react
import React, { useEffect, useState } from 'react';

// third-party
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// application
import { useDispatch, useSelector } from 'react-redux';
import Footer from './footer';
import Header from './header';
import MobileHeader from './mobile/MobileHeader';
import MobileMenu from './mobile/MobileMenu';
import Quickview from './shared/Quickview';

// pages
import AccountLayout from './account/AccountLayout';
import AccountPageLogin from './account/AccountPageLogin';
import BlogPageCategory from './blog/BlogPageCategory';
import SitePageAboutUs from './site/SitePageAboutUs';
import PageCart from './shop/ShopPageCart';
import PageCheckout from './shop/ShopPageCheckout';
import PageCompare from './shop/ShopPageCompare';
import SitePageComponents from './site/SitePageComponents';
import SitePageContactUs from './site/SitePageContactUs';
import SitePageContactUsAlt from './site/SitePageContactUsAlt';
import SitePageFaq from './site/SitePageFaq';
import SitePageNotFound from './site/SitePageNotFound';
import BlogPagePost from './blog/BlogPagePost';
import ShopPageProduct from './shop/ShopPageProduct';
import SitePageTerms from './site/SitePageTerms';
import ShopPageTrackOrder from './shop/ShopPageTrackOrder';
import SitePageTypography from './site/SitePageTypography';
import PageWishlist from './shop/ShopPageWishlist';
import ShopPageCategory from './shop/ShopPageCategory';
import PaymentOptionsPage from "./shop/PaymentOptionsPage";
import PaymentSuccess from "./site/paymentSuccess"
import PaymentError from "./site/paymentError"

// data stubs
import theme from '../data/theme';
import CommonComp from './common';
import RestService from '../store/restService/restService';

function Layout(props) {
    const { match, headerLayout, homeComponent } = props;

    const dispatch = useDispatch();
    const { menu } = useSelector(({ webView }) => webView);
    const [menuList, setMenuList] = useState([]);
    const [organization, setOrganization] = useState({});

    useEffect(() => {
        RestService.getWebMenu().then((res) => {
            if (res.data.status == 'success') {
                dispatch({ type: 'SAVE_WEB_MENU', data: res.data.data });
            }
        });

        RestService.getAllCategories().then((res) => {
            if (res.data.status == 'success') {
                dispatch({ type: 'SAVE_CATEGORIES', data: res.data.data });
            }
        });

        RestService.getOrganizationsByCode('ORG').then((res) => {
            if (res.data.status === 'success') {
                let org = {};
                org = res.data.data;
                let addresses = res.data.data && res.data.data.locations ? res.data.data.locations : [];
                addresses = res.data.data.locations.filter((item) => item.isDefault === true);
                if (addresses.length > 0) {
                    org.defaultAddress = addresses[0];
                }
                setOrganization(org);
            }
        });
    }, []);

    return (
        <React.Fragment>
            <Helmet>
                <title>{organization.name}</title>
                <meta name="description" content={theme.fullName} />
            </Helmet>

            <ToastContainer autoClose={5000} hideProgressBar />

            <Quickview />

            <MobileMenu />

            <div className="site">
                <header className="site__header d-lg-none">
                    <MobileHeader />
                </header>

                <header className="site__header d-lg-block d-none">
                    <Header organization={organization} layout={headerLayout} {...props} />
                </header>

                <div className="site__body">
                    <Switch>
                        {/*
                        // Home
                        */}
                        <Route exact path={`${match.path}`} component={homeComponent} />

                        {/*
                        // Shop
                        */}
                        <Redirect exact from="/shop" to="/shop/category-grid-3-columns-sidebar" />
                        <Route
                            exact
                            path="/shop/category-grid-3-columns-sidebar"
                            render={(props) => (
                                <ShopPageCategory {...props} columns={3} viewMode="grid" sidebarPosition="start" />
                            )}
                        />
                        <Route
                            exact
                            path="/shop/category-grid-4-columns-full"
                            render={(props) => (
                                <ShopPageCategory {...props} columns={4} viewMode="grid" />
                            )}
                        />
                        <Route
                            exact
                            path="/shop/category-grid-5-columns-full"
                            render={(props) => (
                                <ShopPageCategory {...props} columns={5} viewMode="grid" />
                            )}
                        />
                        <Route
                            exact
                            path="/store/products"
                            render={(props) => (
                                <ShopPageCategory {...props} columns={3} viewMode="grid" sidebarPosition="start" />
                            )}
                        />


                        <Route
                            
                            path="/payment/success/:sessionId"
                            render={(props) => (
                                <PaymentSuccess {...props}  />
                            )}
                        />

<Route
                            exact
                            path="/payment/error"
                            render={(props) => (
                                <PaymentError {...props}  />
                            )}
                        />

                        <Route
                            exact
                            path="/shop/category-right-sidebar"
                            render={(props) => (
                                <ShopPageCategory {...props} columns={3} viewMode="grid" sidebarPosition="end" />
                            )}
                        />

                        <Route exact path="/store/product/:productId" component={ShopPageProduct} />
                        <Route
                            exact
                            path="/shop/product-standard"
                            render={(props) => (
                                <ShopPageProduct {...props} layout="standard" />
                            )}
                        />
                        <Route
                            exact
                            path="/shop/product-columnar"
                            render={(props) => (
                                <ShopPageProduct {...props} layout="columnar" />
                            )}
                        />
                        <Route
                            exact
                            path="/shop/product-sidebar"
                            render={(props) => (
                                <ShopPageProduct {...props} layout="sidebar" />
                            )}
                        />

                        <Route exact path="/store/cart" component={PageCart} />
                        <Route exact path="/store/checkout" component={PageCheckout} />
                        <Route exact path="/store/wishlist" component={PageWishlist} />
                        <Route exact path="/shop/compare" component={PageCompare} />
                        <Route exact path="/shop/track-order" component={ShopPageTrackOrder} />
                        <Route path="/store/payments-cashier/:orderId" component={PaymentOptionsPage} />

                        {/*
                        // Blog
                        */}
                        <Redirect exact from="/blog" to="/blog/category-classic" />
                        <Route
                            exact
                            path="/blog/category-classic"
                            render={(props) => (
                                <BlogPageCategory {...props} layout="classic" sidebarPosition="end" />
                            )}
                        />
                        <Route
                            exact
                            path="/blog/category-grid"
                            render={(props) => (
                                <BlogPageCategory {...props} layout="grid" sidebarPosition="end" />
                            )}
                        />
                        <Route
                            exact
                            path="/blog/category-list"
                            render={(props) => (
                                <BlogPageCategory {...props} layout="list" sidebarPosition="end" />
                            )}
                        />
                        <Route
                            exact
                            path="/blog/category-left-sidebar"
                            render={(props) => (
                                <BlogPageCategory {...props} layout="classic" sidebarPosition="start" />
                            )}
                        />
                        <Route
                            exact
                            path="/blog/post-classic"
                            render={(props) => (
                                <BlogPagePost {...props} layout="classic" sidebarPosition="end" />
                            )}
                        />
                        <Route
                            exact
                            path="/blog/post-full"
                            render={(props) => (
                                <BlogPagePost {...props} layout="full" />
                            )}
                        />

                        {/*
                        // Account
                        */}
                        <Route exact path="/account/login" component={AccountPageLogin} />
                        <Route path="/account" component={AccountLayout} />

                        {/*
                        // Site
                        */}
                        <Redirect exact from="/site" to="/site/about-us" />

                        {
                            menu && menu.map((item) => (
                                <Route
                                    path="/:slug"
                                    render={(props) => (
                                        <CommonComp slug={item.slug} {...props} />
                                    )}
                                />
                            ))
                        }

                        <Route
                            exact
                            path="/site/about-us"
                            component={SitePageAboutUs}
                        />

                        <Route
                            exact
                            path="/site/contact-us-alt"
                            component={SitePageContactUsAlt}
                        />
                        <Route
                            exact
                            path="/site/not-found"
                            rcomponent={SitePageNotFound}
                        />
                        <Route
                            exact
                            path="/site/faq"
                            component={SitePageFaq}
                        />
                        <Route
                            exact
                            path="/site/terms"
                            component={SitePageTerms}
                        />
                        <Route
                            exact
                            path="/site/typography"
                            component={SitePageTypography}
                        />

                        {/*
                        // Page Not Found
                        */}
                        <Route exact path="/site/components" component={SitePageComponents} />
                        <Route component={SitePageNotFound} />
                    </Switch>
                </div>

                <footer className="site__footer">
                    <Footer organization={organization} />
                </footer>
            </div>
        </React.Fragment>
    );
}

Layout.propTypes = {
    /**
     * header layout (default: 'classic')
     * one of ['classic', 'compact']
     */
    headerLayout: PropTypes.oneOf(['default', 'compact']),
    /**
     * home component
     */
    homeComponent: PropTypes.elementType.isRequired,
};

Layout.defaultProps = {
    headerLayout: 'default',
};

export default Layout;
