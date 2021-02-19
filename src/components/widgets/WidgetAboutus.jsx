// react
import React, { useEffect, useState } from 'react';

// data stubs
import theme from '../../data/theme';
import RestService from '../../store/restService/restService';


function WidgetAboutus() {

    const [state, setState] = useState({
        organization: {}
    })

    useEffect(() => {
        RestService.getOrganizationsByCode('ORG').then(res => {
            if (res.data.status === 'success') {
                setState({
                    organization: res.data.data
                })
            }
        })
    }, [])

    const links = [
        {
            key: 'facebook',
            url: `${state.organization ? state.organization.facebook : ""}`,
            iconClass: 'fab fa-facebook-f',
        },
        {
            key: 'twitter',
            url: `${state.organization ? state.organization.twitter : ""}`,
            iconClass: 'fab fa-twitter',
        },
        {
            key: 'youtube',
            url: `${state.organization ? state.organization.youtube : ""}`,
            iconClass: 'fab fa-youtube',
        },
        {
            key: 'instagram',
            url: `${state.organization ? state.organization.instagram : ""}`,
            iconClass: 'fab fa-instagram',
        },
    ].map((item) => {
        const itemClasses = `widget-aboutus__link widget-aboutus__link--${item.key}`;
        const iconClasses = `widget-social__icon ${item.iconClass}`;

        if(item.url !== ""){return (
            <li key={item.key}>
                <a className={itemClasses} href={item.url} target=" _blank">
                    <i className={iconClasses} />
                </a>
            </li>
        );}
    });

    return (
        <div className="widget-aboutus widget">
            <h4 className="widget__title">About Blog</h4>
            <div className="widget-aboutus__text">
                APA Blog a place to view all that is new in automatic door parts and equipments. 
            </div>
            <div className="widget-aboutus__socials">
                <ul>
                    {state.organization.organizationId && links}
                </ul>
            </div>
        </div>
    );
}

export default WidgetAboutus;
