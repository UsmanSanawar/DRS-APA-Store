// react
import React from 'react';

// application
import FooterContacts from './FooterContacts';
import FooterLinks from './FooterLinks';
import FooterNewsletter from './FooterNewsletter';


export default function Footer(props) {
    const informationLinks = [
        { title: 'Contact Us', url: '/contact-us' },
        { title: 'Privacy Policy', url: '/privacy-policy' },
    ];

    const accountLinks = [
        { title: 'Your Orders', url: '/store/orders' },
        { title: 'Wish List', url: '/store/wishlist' },
    ];

    return (
        <div className="site-footer">
            <div className="container">
                <div className="site-footer__widgets">
                    <div className="row">
                        <div className="col-6 col-md-3 col-lg-2">
                            <FooterLinks title="Information" items={informationLinks} />
                        </div>
                        <div className="col-6 col-md-3 col-lg-2">
                            <FooterLinks title="My Account" items={accountLinks} />
                        </div>
                        <div className="col-12 col-md-12 col-lg-4">
                            <FooterNewsletter organization={props.organization} />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <FooterContacts organization={props.organization} />
                        </div>
                    </div>
                </div>

                <div className="site-footer__bottom">
                    <div className="site-footer__copyright">
                       All rights reserved &copy; 2021 APA Ltd Build: 010221
                    </div>
                    {/* <div className="site-footer__payments">
                        <img src="images/payments.png" alt="" />
                    </div> */}
                </div>
            </div>
        </div>
    );
}
