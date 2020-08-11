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

import CommonComp from "../../../common"


function ContactUs() {

    const [data, setData] = useState([]);

    useEffect(() => {
        RestService.getWebPageComponentByPageId(7).then(res => {
            if (res.data.status == "success") {
                setData(res.data.data)
            }
        })
    }, [])

    return (
        <React.Fragment>
            <Helmet>
                <title>{`Contact us — ${theme.name}`}</title>
            </Helmet>

            <div className="container text-center   ">
                {/* {getPreviewHTML()} */}
                <CommonComp data={data} />
            </div>

        </React.Fragment>
    );
}

export default ContactUs;
