// react
import React, { useEffect, useState } from 'react';

// third-party
import classNames from 'classnames';
import {
    Link,
    matchPath,
    Redirect,
    Switch,
    Route,
} from 'react-router-dom';

// application
import PageHeader from '../shared/PageHeader';

// pages
import AccountPageAddresses from './AccountPageAddresses';
import AccountPageDashboard from './AccountPageDashboard';
import AccountPageOrders from './AccountPageOrders';
import AccountPagePassword from './AccountPagePassword';
import AccountPageProfile from './AccountPageProfile';
import { ProtectedRoutes } from '../../protectedRoutes';
import RestService from '../../store/restService/restService';
import { toast } from 'react-toastify';


export default function AccountLayout(props) {
    const { match, location } = props;
const [customer, setCustomer] = useState({})    
    useEffect(() => {
        RestService.getCustomerByToken().then(res => {
            if (res.data.status === 'success') {
                setCustomer(res.data.data)
            } else {
                toast.error(res.data.message)
            }
        }).catch(err => {
            if (err.message.includes('403') || err.message.includes('401')) {
                localStorage.clear();
                return window.location.href.replace("#/store/login")
            }
        })
    }, [])

    const breadcrumb = [
        { title: 'Home', url: '' },
        { title: 'My Account', url: '' },
    ];

    const links = [
        { title: 'Dashboard', url: 'dashboard' },
        { title: 'Edit Profile', url: 'profile' },
        { title: 'Your Orders', url: 'orders' },
        // { title: 'Addresses', url: 'addresses' },
        { title: 'Password', url: 'password' },
    ].map((link) => {
        const url = `${match.url}/${link.url}`;
        const isActive = matchPath(location.pathname, { path: url });
        const classes = classNames('account-nav__item', {
            'account-nav__item--active': isActive,
        });

        return (
            <li key={link.url} className={classes}>
                <Link to={url}>{link.title}</Link>
            </li>
        );
    });

    return (
        <React.Fragment>
            <PageHeader header="My Account" breadcrumb={breadcrumb} />

            <div className="block">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-lg-3 d-flex">
                            <div className="account-nav flex-grow-1">
                                <h4 className="account-nav__title">Navigation</h4>
                                <ul>{links}</ul>
                            </div>
                        </div>
                        <div className="col-12 col-lg-9 mt-4 mt-lg-0">
                            <Switch>
                                <Redirect exact from={match.path} to={`${match.path}/dashboard`} />
                      
                                    <ProtectedRoutes exact path={`${match.path}/dashboard`} customer={customer} component={AccountPageDashboard} />
                                    <ProtectedRoutes exact path={`${match.path}/profile`} customer={customer} component={AccountPageProfile} />
                                    <ProtectedRoutes exact path={`${match.path}/orders`} customer={customer} component={AccountPageOrders} />
                                    <ProtectedRoutes exact path={`${match.path}/addresses`} customer={customer} component={AccountPageAddresses} />
                                    <ProtectedRoutes exact path={`${match.path}/password`} customer={customer} component={AccountPagePassword} />

                            </Switch>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
