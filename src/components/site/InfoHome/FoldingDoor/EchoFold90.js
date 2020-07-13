import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import theme from "../../../../data/theme";
import underDevelopment from "../../../../assets/imgs/Under-development.jpg";

class EchoFold90 extends Component {
    render() {
        return (
            <div>
                <Helmet>
                    <title>{`Home Page — ${theme.name}`}</title>
                </Helmet>

                <div className="container">
                    <h2 className={"my-5"}>Eco-Fold 90 “Folding Door”</h2>

                    <div>
                        <p className={"my-3"} style={{fontSize:20}}>The APA  ES90 based folding door system is currently under development and uses the same powered operator what we employ for the ES90  “Inhead” swing.</p>
                        <p className={"my-3"} style={{fontSize:20}}>This are currently in our development schedule and further updates will appear here as the project progresses</p>
                        <div className="my-3 text-center">
                            <img src={underDevelopment} alt="Development"/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default EchoFold90;
