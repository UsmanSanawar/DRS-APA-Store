import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import theme from "../../../../data/theme";

class FoldingDoor extends Component {
    render() {
        return (
            <div>
                <Helmet>
                    <title>{`Home Page — ${theme.name}`}</title>
                </Helmet>

                <div className="container">
                    <h2 className={"my-5"}>Folding Doors</h2>

                    <div>
                        <p className={"m-3"}>Automatic Folding doors are known as “space saving ” doors.</p>
                        <p className={"m-3"}>These can be a good choice where the overall opening to fit a door into is relatively small and the largest possible clear opening is required.</p>
                        <p className={"m-3"}>Also Folding doors are prominently safer than a conventional swing doors as the arc of door movement / coverage is smaller and less likely to strike anybody.</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default FoldingDoor;
