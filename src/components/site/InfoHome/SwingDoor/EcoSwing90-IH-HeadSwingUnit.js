import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import theme from "../../../../data/theme";
import underDevelopment from '../../../../assets/imgs/Under-development.jpg'

class EcoSwing90IhHeadSwingUnit extends Component {
    render() {
        return (
            <div>
                <Helmet>
                    <title>{`Home Page — ${theme.name}`}</title>
                </Helmet>

                <div className="container">
                    <h2 className={"my-5"}>Eco-Swing IH “In-Head” Swing Unit</h2>

                    <div>
                        <p className={"m-3"} style={{fontSize: 20}}>The APA Eco-Swing IH is an “In-head” door system and
                            is currently under development. It uses the same powered operator what we employ for the
                            ES90 swing operator.</p>

                        <p className={"m-3"} style={{fontSize: 20}}>This are currently in our development schedule and
                            further updates will appear here as the project progresses</p>

                        <div className="text-center">
                        <img src={underDevelopment} alt="underDevelopment"/>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default EcoSwing90IhHeadSwingUnit;
