// react
import React from 'react';

// third-party
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// application
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

// data stubs
import theme from '../data/theme';
import FoldingDoor from "./site/InfoHome/FoldingDoor/FoldingDoor";
import EchoFold90 from "./site/InfoHome/FoldingDoor/EchoFold90";
import SwingDoors from "./site/InfoHome/SwingDoor/SwingDoors";
import EchoSwing90DoorUnit from "./site/InfoHome/SwingDoor/EchoSwing90DoorUnit";
import EcoSwing90IhHeadSwingUnit from "./site/InfoHome/SwingDoor/EcoSwing90-IH-HeadSwingUnit";
import EcoSwingBdBalanceDoor from "./site/InfoHome/SwingDoor/EcoSwingBdBalanceDoor";
import EcoSwingIfInFloorOperator from "./site/InfoHome/SwingDoor/EcoSwingIfInFloorOperator";
import SlidingDoors from "./site/InfoHome/SlidingDoor/SlidingDoors";
import Es400SlidingDoorUnit from "./site/InfoHome/SlidingDoor/ES400SlidingDoorUnit";
import Es400SlidingDoorUnit2 from "./site/InfoHome/SlidingDoor/ES400SlidingDoorUnit2";
import EcoSlide400TTelescopicDoorUunit from "./site/InfoHome/SlidingDoor/EcoSlide400tTelescopicDoorUunit";
import EcoSlide400TTelescopicDoorUnit2 from "./site/InfoHome/SlidingDoor/EcoSlide400tTelescopicDoorUnit2";
import RetroFitKits from "./site/InfoHome/RetroFitKits/RetroFitKits";
import SlidingDoorRetroFitKits from "./site/InfoHome/RetroFitKits/SlidingDoorRetroFitKits";
import SwingDoorRetroFitKits from "./site/InfoHome/RetroFitKits/SwingDoorRetroFitKits";
import ContactUs from "./site/InfoHome/ContactUs/ContactUs";
import CommonComp from "../components/common"

function Layout(props) {
    const { match, headerLayout, homeComponent } = props;

    return (
        <React.Fragment>
            <Helmet>
                <title>{theme.name}</title>
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
                    <Header layout={headerLayout} />
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
                            path="/shop/category-list"
                            render={(props) => (
                                <ShopPageCategory {...props} columns={3} viewMode="list" sidebarPosition="start" />
                            )}
                        />
                        <Route
                            exact
                            path="/shop/category-right-sidebar"
                            render={(props) => (
                                <ShopPageCategory {...props} columns={3} viewMode="grid" sidebarPosition="end" />
                            )}
                        />

                        <Route exact path="/shop/product/:productId" component={ShopPageProduct} />
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

                        <Route exact path="/shop/cart" component={PageCart} />
                        <Route exact path="/shop/checkout" component={PageCheckout} />
                        <Route exact path="/shop/wishlist" component={PageWishlist} />
                        <Route exact path="/shop/compare" component={PageCompare} />
                        <Route exact path="/shop/track-order" component={ShopPageTrackOrder} />

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
                        <Route exact path="/site/folding-doors" 
                        render={(props) => (
                            <CommonComp slug="folding-doors" {...props} />
                        )} />

                        <Route exact path="/site/folding-doors/eco-fold-90-folding-door" 
                        render={(props) => (
                            <CommonComp slug="eco-fold-90-folding-door" {...props} />
                        )} />
                        <Route exact path="/site/swing-doors" render={(props) => (
                                <CommonComp slug="swing-doors" {...props} />
                            )}/>
                        <Route exact path="/site/swing-doors/eco-swing-90-swing-door-unit-2"
                            render={(props) => (
                                <CommonComp slug="eco-swing-90-swing-door-unit-2" {...props} />
                            )} />

                        <Route exact path="/site/swing-doors/eco-swing-90-ih-in-head-swing-unit"
                            render={(props) => (
                                <CommonComp slug="eco-swing-90-ih-in-head-swing-unit" {...props} />
                            )}
                             />

                        <Route exact path="/site/swing-doors/eco-swing-bd-balance-door"
                         
                         render={(props) => (
                                <CommonComp slug="eco-swing-bd-balance-door" {...props} />
                            )}/>
                        <Route exact path="/site/swing-doors/eco-swing-if-in-floor-operator" 
                        render={(props) => (
                                <CommonComp slug="eco-swing-if-in-floor-operator" {...props} />
                            )} />
                        <Route exact path="/site/sliding-doors" 
                        render={(props) => (
                                <CommonComp slug="sliding-doors" {...props} />
                            )} />
                        <Route exact path="/site/sliding-doors/es400-sliding-door-unit" 
                        render={(props) => (
                                <CommonComp slug="es400-sliding-door-unit" {...props} />
                            )} />
                        <Route exact path="/site/sliding-doors/es400-sliding-door-unit-2" 
                        render={(props) => (
                                <CommonComp slug="es400-sliding-door-unit-2" {...props} />
                            )} />
                        <Route exact path="/site/sliding-doors/eco-slide-400t-telescopic-door-unit" 
                        render={(props) => (
                                <CommonComp slug="eco-slide-400t-telescopic-door-unit" {...props} />
                            )} />
                        <Route exact path="/site/sliding-doors/eco-slide-400t-telescopic-door-unit-2" 
                        render={(props) => (
                                <CommonComp slug="eco-slide-400t-telescopic-door-unit-2" {...props} />
                            )} />
                        <Route exact path="/site/retro-fit-kit" 
                        render={(props) => (
                                <CommonComp slug="retro-fit-kit" {...props} />
                            )} />
                        <Route exact path="/site/retro-fit-kit/sliding-door-retro-fit-kits" 
                        render={(props) => (
                                <CommonComp slug="sliding-door-retro-fit-kits" {...props} />
                            )} />
                        <Route exact path="/site/retro-fit-kit/swing-door-retro-fit-kits" 
                        render={(props) => (
                                <CommonComp slug="swing-door-retro-fit-kits" {...props} />
                            )} />
                        <Route exact path="/site/contact-us" 
                        render={(props) => (
                                <CommonComp slug="contact-us" {...props} />
                            )} />
                        <Route exact path="/site/about-us"  component={SitePageAboutUs}
                         />
                        
                        {/*<Route exact path="/site/contact-us" 
                        render={(props) => (
                                <CommonComp slug="eco-swing-90-swing-door-unit-2" {...props} />
                            )} />*/}
                        <Route exact path="/site/contact-us-alt" 
                        component={SitePageContactUsAlt} />
                        <Route exact path="/site/not-found" 
                        rcomponent={SitePageNotFound} />
                        <Route exact path="/site/faq" 
                        component={SitePageFaq} />
                        <Route exact path="/site/terms" 
                        component={SitePageTerms} />
                        <Route exact path="/site/typography" 
                        component={SitePageTypography} />

                        {/*
                        // Page Not Found
                        */}
                        <Route exact path="/site/components" component={SitePageComponents} />
                        <Route component={SitePageNotFound} />
                    </Switch>
                </div>

                <footer className="site__footer">
                    <Footer />
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
