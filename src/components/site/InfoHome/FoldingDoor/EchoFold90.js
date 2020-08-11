// react
import React, {useEffect, useState} from 'react';

// third-party
import {Helmet} from 'react-helmet';
import RestService from "../../../../store/restService/restService";
// blocks

// data stubs
import products from '../../../../data/shopProducts';
import theme from '../../../../data/theme';
import {Fi24Hours48Svg, FiFreeDelivery48Svg, FiPaymentSecurity48Svg, FiTag48Svg} from "../../../../svg";
import {IMAGE_URL} from "../../../../constant/constants";
import CommonComp from "../../../common";


function EcoSwing90() {

    const [data, setData] = useState([]);
    const [video, setVideo] = useState([]);
    const [html, setHtml] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [cards, setCards] = useState([]);
    const [docs, setDocs] = useState([]);

    useEffect(() => {
        RestService.getWebPageComponentByPageId(10).then(res => {
            if (res.data.status == "success") {

                setData(res.data.data)
            }
        })
    }, [])


    return (
        <React.Fragment>
            <Helmet>
                <title>{`Eco Swing 90 Folding Door— ${theme.name}`}</title>
            </Helmet>

            <div className="container p-4">
                <CommonComp data={data} />
            </div>

        </React.Fragment>
    );
}

export default EcoSwing90;
