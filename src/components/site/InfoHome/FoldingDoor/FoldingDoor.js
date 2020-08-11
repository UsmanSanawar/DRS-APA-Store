// react
import React, {useEffect, useState} from 'react';

// third-party
import {Helmet} from 'react-helmet';
import RestService from "../../../../store/restService/restService";
// blocks
// data stubs
import theme from '../../../../data/theme';
import CommonComp from "../../../common";


function FoldingDoor() {

    const [data, setData] = useState([]);

    useEffect(() => {
        RestService.getWebPageComponentByPageId(13).then(res => {
            if (res.data.status == "success") {

                setData(res.data.data)
            }
        })
    }, [])


    return (
        <React.Fragment>
            <Helmet>
                <title>{`Folding Door — ${theme.name}`}</title>
            </Helmet>

            <div className="container p-4">
                <CommonComp data={data}/>
            </div>

        </React.Fragment>
    );
}

export default FoldingDoor;
