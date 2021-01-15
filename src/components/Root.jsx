// react
// third-party
import PropTypes from "prop-types";
import React, {Component} from "react";
import {IntlProvider} from "react-intl";
import {connect} from "react-redux";
import {HashRouter, Redirect, Route, Switch} from "react-router-dom";
// application
import messages from "../i18n";
import HomePageOne from "./home/HomePageOne";
import HomePageTwo from "./home/HomePageTwo";
// pages
import Layout from "./Layout";
import ScrollToTop from "./scrollToTop";
import PasswordChangePage from "./site/changePassword";
import UnsubscribePage from "./site/unSubscribed";
import AccountActivated from "./site/accountActivated";


// export const store = configureStore();
class Root extends Component {
  componentDidMount() {
    setTimeout(() => {
      const preloader = document.querySelector(".site-preloader");

      preloader.addEventListener("transitionend", (event) => {
        if (event.propertyName === "opacity") {
          preloader.parentNode.removeChild(preloader);
        }
      });
      preloader.classList.add("site-preloader__fade");
    }, 500);

    window.scrollTo(0, 0);
  }

  render() {
    const {locale} = this.props;

    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        <HashRouter basename={process.env.PUBLIC_URL}>
          <ScrollToTop>
            <Switch>
              <Route exact path="/account-activated" component={AccountActivated}/>

              <Route exact path="/unsubscribe-newsletter" render={
                (props) => <UnsubscribePage {...props} />
              }/>

              <Route exact path="/change-forgotten-password" render={
                (props) => <PasswordChangePage {...props} />
              }/>

              <Route
                path="/store"
                render={(props) => (
                  <Layout
                    {...props}
                    headerLayout="compact"
                    homeComponent={HomePageOne}
                  />
                )}
              />

              <Route
                path="/"
                render={(props) => (
                  <Layout
                    {...props}
                    headerLayout="default"
                    homeComponent={HomePageTwo}
                  />
                )}
              />
              <Redirect to="/"/>
            </Switch>
          </ScrollToTop>
        </HashRouter>
      </IntlProvider>
    );
  }
}

Root.propTypes = {
  /** current locale */
  locale: PropTypes.string,
};

const mapStateToProps = (state) => ({
  locale: state.locale,
});

export default connect(mapStateToProps)(Root);
