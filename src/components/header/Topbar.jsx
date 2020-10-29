// react
import React, { useEffect, useState } from 'react';

// third-party
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import RestService from '../../store/restService/restService';

// application
import Dropdown from './Dropdown';
import DropdownCurrency from './DropdownCurrency';
import DropdownLanguage from './DropdownLanguage';


function Topbar(props) {

const [Organization, setOrganization] = useState({defaultAddress:{}})
useEffect(() => {

    setOrganization(props.organization)

}, [props.organization])
    
    const links = [
        { title: <FormattedMessage id="topbar.aboutUs" defaultMessage="About Us" />, url: '/site/about-us' },
        { title: <FormattedMessage id="topbar.contacts" defaultMessage="Contacts" />, url: '/site/contact-us' },
        { title: <FormattedMessage id="topbar.storeLocation" defaultMessage="Store Location" />, url: '' },
        { title: <FormattedMessage id="topbar.trackOrder" defaultMessage="Track Order" />, url: '/shop/track-order' },
        { title: <FormattedMessage id="topbar.blog" defaultMessage="Blog" />, url: '/blog/category-classic' },
    ];

    const accountLinks = [
        // { title: 'Dashboard', url: '/account/dashboard' },
        // { title: 'Edit Profile', url: '/account/profile' },
        // { title: 'Order History', url: '/account/orders' },
        // { title: 'Addresses', url: '/account/addresses' },
        { title: 'Password', url: '/account/password' },
        { title: 'Logout', url: '/account/login' },
    ];


    const linksList = <div><span className="pr-2"><i className="fa fa-envelope pr-1" />{Organization.defaultAddress ? Organization.defaultAddress.email : ""}</span> {" | "} <span className="pl-2"><i className="fa fa-phone pr-1"/>  {Organization.defaultAddress ? Organization.defaultAddress.phoneNo : ""}</span> </div>

    return (
        <div className="site-header__topbar topbar">
            <div className="topbar__container container">
                <div className="topbar__row">
                    {linksList}
                    <div className="topbar__spring" />
                    <div className="topbar__item">
                        <Dropdown
                            title={<FormattedMessage id="topbar.myAccount" defaultMessage="My Account" />}
                            items={accountLinks}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Topbar;
