import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import theme from "../../../../data/theme";
import underDevelopment from "../../../../assets/imgs/Under-development.jpg";

class SwingDoorRetroFitKits extends Component {
    render() {
        return (
            <div>
                <Helmet>
                    <title>{`Home Page — ${theme.name}`}</title>
                </Helmet>

                <div className="container">
                    <h2 className={"my-5"}>Swing Door Retro-Fit Kits”</h2>

                    <div>
                        <p className={"my-3"} >APA will be offering a “Retro-fit Kit” solution for
                            select makes & models of automatic swing door systems.</p>
                        <p className={"my-3"} >Swing Door retro-fit kits are being designed for the
                            range of existing “in-head” units where a total new entrance way would be needed in order to
                            change the unit or a poor adaption of a surface mounted unit onto the outside of the
                            “In-head” unit. Not the nicest solution.</p>

                        <p className="my-4">
                            These are currently in our development schedule and further updates will appear here as the project progress
                        </p>

                        <div className="m-3 text-center">
                            <img src={underDevelopment} alt="Development"/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SwingDoorRetroFitKits;
