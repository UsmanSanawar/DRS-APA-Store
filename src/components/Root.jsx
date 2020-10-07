// react
import React, { Component } from 'react';

// third-party
import PropTypes from 'prop-types';
import {
    HashRouter,
    Route,
    Redirect,
    Switch,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';

// application
import messages from '../i18n';

// pages
import Layout from './Layout';
import HomePageOne from './home/HomePageOne';
import HomePageTwo from './home/HomePageTwo';
import ScrollToTop from "./scrollToTop"

class Root extends Component {
    componentDidMount() {
        setTimeout(() => {
            const preloader = document.querySelector('.site-preloader');

            preloader.addEventListener('transitionend', (event) => {
                if (event.propertyName === 'opacity') {
                    preloader.parentNode.removeChild(preloader);
                }
            });
            preloader.classList.add('site-preloader__fade');
        }, 500);

        window.scrollTo(0, 0);
    }

    render() {
        const { locale } = this.props;

        return (
            <IntlProvider locale={locale} messages={messages[locale]}>
                
                <HashRouter basename={process.env.PUBLIC_URL} >
                <ScrollToTop>
                    <Switch>
                        <Route
                            path="/store"
                            render={(props) => (
                                <Layout {...props} headerLayout="compact" homeComponent={HomePageOne} />
                            )}
                        />
                        <Route
                            path="/"
                            render={(props) => (
                                <Layout {...props} headerLayout="default" homeComponent={HomePageTwo} />
                            )}
                        />
                        <Redirect to="/" />
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
