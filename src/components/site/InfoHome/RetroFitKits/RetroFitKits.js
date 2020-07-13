import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import theme from "../../../../data/theme";

class RetroFitKits extends Component {
    render() {
        return (
            <div>
                <Helmet>
                    <title>{`Home Page — ${theme.name}`}</title>
                </Helmet>

                <div className="container">
                    <h2 className={"my-5"}>Retro-Fit Kits</h2>

                    <div>
                        <p className={"m-3"}>When confronted with old / obsolete equipment or the extortionately high cost for some manufacturer’s spare parts, then an ideal remedy is to carry out the “retro-fitting” of that
                            that operator.</p>
                        <p className={"m-3"}>“Retro-fitting” is the process of replacing all the operating equipment of an old / obsolete sliding door operator and replacing it with new and up-to-date equipment but retaining the original mechanical parts.</p>
                    </div>

                    <h2 className={"my-5"}>Check out  our Retrofit Kits</h2>
                </div>
            </div>
        );
    }
}

export default RetroFitKits;
