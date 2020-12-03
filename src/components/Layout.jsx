// react
import React, { useEffect, useState, Suspense, lazy } from 'react';

// third-party
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';


// data stubs
import theme from '../data/theme';
import CommonComp from './common';
import RestService from '../store/restService/restService';
import { Spinner } from 'reactstrap';

// application
import Footer from './footer';
import Header from './header';
import MobileHeader from './mobile/MobileHeader'
import MobileMenu from './mobile/MobileMenu'
import Quickview from './shared/Quickview'

// pages
const AccountLayout = lazy(() => import('./account/AccountLayout'));
const AccountPageLogin = lazy(() => import('./account/AccountPageLogin'));
const BlogPageCategory = lazy(() => import('./blog/BlogPageCategory'));
const SitePageAboutUs = lazy(() => import('./site/SitePageAboutUs'));
const PageCart = lazy(() => import('./shop/ShopPageCart'));
const PageCheckout = lazy(() => import('./shop/ShopPageCheckout'));
const PageCompare = lazy(() => import('./shop/ShopPageCompare'));
const SitePageComponents = lazy(() => import('./site/SitePageComponents'));
const SitePageContactUs = lazy(() => import('./site/SitePageContactUs'));
const SitePageContactUsAlt = lazy(() => import('./site/SitePageContactUsAlt'));
const SitePageFaq = lazy(() => import('./site/SitePageFaq'));
const SitePageNotFound = lazy(() => import('./site/SitePageNotFound'));
const BlogPagePost = lazy(() => import('./blog/BlogPagePost'));
const ShopPageProduct = lazy(() => import('./shop/ShopPageProduct'));
const SitePageTerms = lazy(() => import('./site/SitePageTerms'));
const ShopPageTrackOrder = lazy(() => import('./shop/ShopPageTrackOrder'));
const SitePageTypography = lazy(() => import('./site/SitePageTypography'));
const PageWishlist = lazy(() => import('./shop/ShopPageWishlist'));
const ShopPageCategory = lazy(() => import('./shop/ShopPageCategory'));
const PaymentOptionsPage = lazy(() => import("./shop/PaymentOptionsPage"));
const PaymentSuccess = lazy(() => import("./site/paymentSuccess"))
const PaymentError = lazy(() => import("./site/paymentError"))



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
                    <Suspense fallback={<div><Spinner /></div>}>

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
                                    <PaymentSuccess {...props} />
                                )}
                            />

                            <Route
                                exact
                                path="/payment/error"
                                render={(props) => (
                                    <PaymentError {...props} />
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
                            {/* <Redirect exact from="/store/blog" to="/store/blog/posts" /> */}
                            {/* <Route
                                exact
                                path="/aa/aa/a/a"
                                render={(props) => (
                                    <BlogPageCategory {...props} layout="classic" sidebarPosition="end" />
                                )}
                            /> */}
                            <Route
                                exact
                                path="/store/blog/posts"
                                key="postsListings"
                                render={(props) => (
                                    <BlogPageCategory {...props} layout="grid" sidebarPosition="end" />
                                )}
                            />
                            {/* <Route
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
                            /> */}
                            <Route
                                exact
                                path="/store/blog/single-post/:id"
                                key="singlePost"
                                render={(props) => (
                                    <BlogPagePost {...props} layout="full"/>
                                )}
                            />

                            {/*
                        // Account
                        */}
                            <Route exact path="/store/login" component={AccountPageLogin} />
                            <Route path="/store" component={AccountLayout} />

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
                    </Suspense>
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
