// react
import React, { useState, useEffect } from 'react';

// third-party
import { Link } from 'react-router-dom';
import RestService from '../../store/restService/restService';
import { IMAGE_URL } from "../../constant/constants";
import { Button } from 'reactstrap';


export default function BlockBanner() {
    const [Banner, setBanner] = useState({})
    useEffect(() => {
        RestService.getWebBanner().then(res => {
            if (res.data.status === "success") {
                if (res.data.data.length > 0) {
                    setBanner(res.data.data[0]);
                }
            }
        })
    }, [])

    console.log(Banner, "bannerData is as");

    return (
        <div className="block block-banner">
            <div className="container">
                <Link to={Banner.buttonUrl} className="block-banner__body">
                    <div
                        className="block-banner__image block-banner__image--desktop"
                        style={{ backgroundImage: `url(${IMAGE_URL}/webBanner/${Banner.photoUrl})` }}
                    />
                    <div
                        className="block-banner__image block-banner__image--mobile"
                        style={{ backgroundImage: `url(${IMAGE_URL}/webBanner/${Banner.photoUrl})` }}
                    />
                    <div style={{ color: `${Banner.headerTextColor}` }} className="block-banner__title">
                        {Banner.headerText}
                    </div>
                    <div style={{ color: `${Banner.subTextColor}` }} className="block-banner__text">
                        {Banner.subText}
                    </div>
                    {Banner.showButton ?
                        <div className="block-banner__button">
                            <Button className="btn btn-sm" style={{ backgroundColor: `${Banner.buttonColor}`, border: `1px solid ${Banner.buttonColor}` }}>{Banner.buttonText}</Button>
                        </div>
                        : null
                    }
                </Link>
            </div>
        </div>
    );
}
