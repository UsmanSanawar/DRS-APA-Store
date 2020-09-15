// react
import React from 'react';
// third-party
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router-dom';
// application
import NavPanel from './NavPanel';
import Search from './Search';
import Topbar from './Topbar';
import logofull from "../../assets/imgs/logo-full.png";

function Header(props) { console.log(props, "headerProps");
    const {layout} = props;
    let bannerSection;

    // if (layout === 'default') {
    bannerSection = (
        <div className="site-header__middle container">
            <div className="site-header__logo">
                <Link to="/"><img src={logofull}
                                  style={{
                                      height: '55px',
                                      marginLeft: 'auto',
                                      marginRight: 'auto'
                                  }}
                                  alt="react-logo" className="light-logo"/></Link>
            </div>
            <div className="site-header__search">
                <Search/>
            </div>
            <div className="site-header__phone">
                <div className="site-header__phone-title">
                    <FormattedMessage id="header.phoneLabel" defaultMessage="Customer Service"/>
                </div>
                <div className="site-header__phone-number">
                    <FormattedMessage id="header.phone" defaultMessage=" (+0845) 5198 681
"/>
                </div>
            </div>
        </div>
    );
    // }

    return (
        <div className="site-header">
            <Topbar/>
            {bannerSection}
            <div className="site-header__nav-panel">
                <NavPanel layout={layout} {...props} />
            </div>
        </div>
    );
}

Header.propTypes = {
    /** one of ['default', 'compact'] (default: 'default') */
    layout: PropTypes.oneOf(['default', 'compact']),
};

Header.defaultProps = {
    layout: 'default',
};

export default Header;
