// react
// third-party
import PropTypes from "prop-types";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import CircularLoader from "../assets/loaders";
// data stubs
import theme from "../data/theme";
import { ProtectedRoutes } from "../protectedRoutes";
import RestService from "../store/restService/restService";
import CommonComp from "./common";
// application
import Footer from "./footer";
import Header from "./header";
import MobileHeader from "./mobile/MobileHeader";
import MobileMenu from "./mobile/MobileMenu";
import Quickview from "./shared/Quickview";
import ReciveEmail from './site/willReciveEmail';




// pages
const AccountLayout = lazy(() => import("./account/AccountLayout"));
const AccountPageLogin = lazy(() => import("./account/AccountPageLogin"));
const BlogPageCategory = lazy(() => import("./blog/BlogPageCategory"));
const SitePageAboutUs = lazy(() => import("./site/SitePageAboutUs"));
const PageCart = lazy(() => import("./shop/ShopPageCart"));
const PageCheckoutPayment = lazy(() => import("./shop/CheckoutFromPayment"));
const PageCheckout = lazy(() => import("./shop/ShopPageCheckout"));
const PageCompare = lazy(() => import("./shop/ShopPageCompare"));
const SitePageComponents = lazy(() => import("./site/SitePageComponents"));
const SitePageContactUs = lazy(() => import("./site/SitePageContactUs"));
const SitePageContactUsAlt = lazy(() => import("./site/SitePageContactUsAlt"));
const SitePageFaq = lazy(() => import("./site/SitePageFaq"));
const SitePageNotFound = lazy(() => import("./site/SitePageNotFound"));
const BlogPagePost = lazy(() => import("./blog/BlogPagePost"));
const ShopPageProduct = lazy(() => import("./shop/ShopPageProduct"));
const SitePageTerms = lazy(() => import("./site/SitePageTerms"));
const ShopPageTrackOrder = lazy(() => import("./shop/ShopPageTrackOrder"));
const SitePageTypography = lazy(() => import("./site/SitePageTypography"));
const PageWishlist = lazy(() => import("./shop/ShopPageWishlist"));
const ShopPageCategory = lazy(() => import("./shop/ShopPageCategory"));
const PaymentOptionsPage = lazy(() => import("./shop/PaymentOptionsPage"));
const PaymentSuccess = lazy(() => import("./site/paymentSuccess"));
const PaymentError = lazy(() => import("./site/paymentError"));

function Layout(props) {
  const { match, headerLayout, homeComponent } = props;

  const dispatch = useDispatch();
  const { menu } = useSelector(({ webView }) => webView);
  const [menuList, setMenuList] = useState([]);
  const [organization, setOrganization] = useState({});

  useEffect(() => {
    RestService.getWebMenu().then((res) => {
      if (res.data.status === "success") {
        dispatch({ type: "SAVE_WEB_MENU", data: res.data.data });
      }
    });

    RestService.getAllCategories().then((res) => {
      if (res.data.status === "success") {
        dispatch({ type: "SAVE_CATEGORIES", data: res.data.data });
      }
    });

    RestService.getOrganizationsByCode("ORG").then((res) => {
      if (res.data.status === "success") {
        let org = {};
        org = res.data.data;
        let addresses =
          res.data.data && res.data.data.locations
            ? res.data.data.locations
            : [];

        addresses = res.data.data.locations.filter(
          (item) => item.isDefault === true
        );

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

      <MobileMenu layout={headerLayout} />

      <div className="site">
        <header className="site__header d-lg-none">
          <MobileHeader {...props} layout={headerLayout} />
        </header>

        <header className="site__header d-lg-block d-none">
          <Header
            organization={organization}
            layout={headerLayout}
            {...props}
          />
        </header>

        <div className="site__body">
          <Suspense
            fallback={
              <div style={{ height: "80vh", width: "80vw" }}>
                <div style={{ display: "block", margin: "25% 50% 50% 50%" }}>
                  <CircularLoader />
                </div>
              </div>
            }
          >
            <Switch>
              {/*
                        // Home
                        */}
              <Route exact path={`${match.path}`} component={homeComponent} />

              {/*
                        // Shop
                        */}
              <Redirect
                exact
                from="/store/products/undefined"
                to="/blog/posts"
              />
              <Redirect
                exact
                from="/shop"
                to="/shop/category-grid-3-columns-sidebar"
              />
              <Route
                exact
                path="/shop/category-grid-3-columns-sidebar"
                render={(props) => (
                  <ShopPageCategory
                    {...props}
                    columns={3}
                    viewMode="grid"
                    sidebarPosition="start"
                  />
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
                path="/store/products/search"
                render={(props) => (
                  <ShopPageCategory
                    {...props}
                    columns={3}
                    viewMode="grid"
                    sidebarPosition="start"
                  />
                )}
              />

              <Route
                exact
                path="/store/products/:id"
                render={(props) => (
                  <ShopPageCategory
                    {...props}
                    columns={3}
                    viewMode="grid"
                    sidebarPosition="start"
                  />
                )}
              />

              <Route
                path="/payment/success/:sessionId"
                render={(props) => <PaymentSuccess {...props} />}
              />

              <Route
                exact
                path="/payment/error"
                render={(props) => <PaymentError {...props} />}
              />

              <Route
                exact
                path="/store/email-confirm"
                render={(props) => <ReciveEmail {...props} />}
              />

              <Route
                exact
                path="/shop/category-right-sidebar"
                render={(props) => (
                  <ShopPageCategory
                    {...props}
                    columns={3}
                    viewMode="grid"
                    sidebarPosition="end"
                  />
                )}
              />

              <Route
                exact
                path="/store/product/:productId"
                component={ShopPageProduct}
              />
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
              <ProtectedRoutes
                exact
                path="/store/checkout"
                component={PageCheckout}
              />
              <ProtectedRoutes
                exact
                path="/store/paynow/checkout/:id"
                component={PageCheckoutPayment}
              />
              <Route exact path="/store/wishlist" component={PageWishlist} />
              <Route exact path="/shop/compare" component={PageCompare} />
              <Route
                exact
                path="/shop/track-order"
                component={ShopPageTrackOrder}
              />
              <Route
                path="/store/payments-cashier/:orderId"
                component={PaymentOptionsPage}
              />

              {/* Blog */}
              {/* <Redirect exact from="/blog" to="/blog/posts" /> */}
              <Route
                exact
                path="/blog/posts"
                key="postsListings"
                render={(props) => (
                  <BlogPageCategory
                    {...props}
                    layout="grid"
                    sidebarPosition="end"
                  />
                )}
              />
              <Route
                exact
                path="/blog/single-post/:id"
                key="singlePost"
                render={(props) => <BlogPagePost {...props} layout="full" />}
              />

              {/*
                        // Account
                        */}
              <Route exact path="/store/login" component={AccountPageLogin} />
              <Route exact path="/store/account_logout" render={(props) => {
                let token = JSON.parse(localStorage.getItem('token'));
                return <AccountPageLogin accountLogut={token ? true : false} {...props} />
              }
              } />
              <Route path="/store" component={AccountLayout} />

              {/*
                        // Site
                        */}
              <Redirect exact from="/site" to="/site/contact-us" />

              {menu &&
                menu.map((item) => (
                  <Route
                    path="/:slug"
                    render={(props) => (
                      <CommonComp slug={item.slug} {...props} />
                    )}
                  />
                ))}

              <Route exact path="/site/contact-us" component={SitePageAboutUs} />

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
              <Route exact path="/site/faq" component={SitePageFaq} />
              <Route exact path="/site/terms" component={SitePageTerms} />
              <Route
                exact
                path="/site/typography"
                component={SitePageTypography}
              />

              {/*
                        // Page Not Found
                        */}
              <Route
                exact
                path="/site/components"
                component={SitePageComponents}
              />
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
  headerLayout: PropTypes.oneOf(["default", "compact"]),
  /**
   * home component
   */
  homeComponent: PropTypes.elementType.isRequired,
};

Layout.defaultProps = {
  headerLayout: "default",
};

export default Layout;
