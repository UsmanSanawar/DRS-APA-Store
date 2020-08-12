// react
import React, {useEffect, useState} from 'react';

// third-party
import {Helmet} from 'react-helmet';
import RestService from "../../store/restService/restService";
// blocks
import BlockBrands from '../blocks/BlockBrands';
import BlockFeatures from '../blocks/BlockFeatures';

// data stubs
import products from '../../data/shopProducts';
import theme from '../../data/theme';
import bg1 from '../../assets/imgs/door2.jpg';
import {Fi24Hours48Svg, FiFreeDelivery48Svg, FiPaymentSecurity48Svg, FiTag48Svg} from "../../svg";
import {IMAGE_URL} from "../../constant/constants";
import CommonCom from "../../components/common"


function HomePageTwo() {

    const [data, setData] = useState([]);

    useEffect(() => {
        RestService.getWebPageComponentByPageId(6).then(res => {
            if (res.data.status == "success") {

                setData(res.data.data)
            }
        })
    }, [])       

    return ( 
        <React.Fragment>
            <Helmet>
                <title>{`Home Page Two — ${theme.name}`}</title>
            </Helmet>

            <div className="container">
            {/* {getPreviewHTML()} */}
            <CommonCom data={data} />
            </div>

        </React.Fragment>
    );
}

export default HomePageTwo;
