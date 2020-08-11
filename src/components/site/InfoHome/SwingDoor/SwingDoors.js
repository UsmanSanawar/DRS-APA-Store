// react
import React, {useEffect, useState} from 'react';

// third-party
import {Helmet} from 'react-helmet';
import RestService from "../../../../store/restService/restService";
// blocks
// data stubs
import theme from '../../../../data/theme';
import CommonComp from "../../../common";


function SwingDoors() {

    const [data, setData] = useState([]);

    useEffect(() => {
        RestService.getWebPageComponentByPageId(14).then(res => {
            if (res.data.status == "success") {

                setData(res.data.data)
            }
        })
    }, [])


    return (
        <React.Fragment>
            <Helmet>
                <title>{`Swing Door — ${theme.name}`}</title>
            </Helmet>

            <div className="container p-4">
                <CommonComp data={data}/>
            </div>

        </React.Fragment>
    );
}

export default SwingDoors;
