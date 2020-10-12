// react
import React, { useEffect, useState } from 'react';

// data stubs
import theme from '../../data/theme';


export default function FooterNewsletter(props) {

    const [Org, setOrg] = useState({defaultAddress: {}})
    useEffect(() => {
    if (props.organization) {
        setOrg(props.organization)
    }
    }, [props.organization])

    const socialLinks = [
        {
            key: 'facebook',
            url: `//${Org ? Org.facebook : ""}`,
            iconClass: 'fab fa-facebook-f',
        },
        {
            key: 'twitter',
            url: `//${Org ? Org.twitter : ""}`,
            iconClass: 'fab fa-twitter',
        },
        {
            key: 'youtube',
            url: `//${Org ? Org.youtube : ""}`,
            iconClass: 'fab fa-youtube',
        },
        {
            key: 'instagram',
            url: `//${Org ? Org.instagram : ""}`,
            iconClass: 'fab fa-instagram',
        },
        {
            key: 'rss',
            url: `//${Org ? Org.website : ""}`,
            iconClass: 'fas fa-rss',
        },
    ];

    const socialLinksList = socialLinks.map((item) => (
        <li key={item.key} className={`footer-newsletter__social-link footer-newsletter__social-link--${item.key}`}>
        
{console.log(item, "social link")}
            <a href={item.url} target="_blank" rel="noopener noreferrer">
                <i className={item.iconClass} />
            </a>
        </li>
    ));

    return (
        <div className="site-footer__widget footer-newsletter">
            <h5 className="footer-newsletter__title">Newsletter</h5>
            <div className="footer-newsletter__text">
                Praesent pellentesque volutpat ex, vitae auctor lorem pulvinar mollis felis
                at lacinia.
            </div>

            <form action="" className="footer-newsletter__form">
                <label className="sr-only" htmlFor="footer-newsletter-address">Email Address</label>
                <input
                    type="text"
                    className="footer-newsletter__form-input form-control"
                    id="footer-newsletter-address"
                    placeholder="Email Address..."
                />
                <button type="submit" className="footer-newsletter__form-button btn btn-primary">Subscribe</button>
            </form>

            <div className="footer-newsletter__text footer-newsletter__text--social">
                Follow us on social networks
            </div>

            <ul className="footer-newsletter__social-links">
                {socialLinksList}
            </ul>
        </div>
    );
}
