import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import theme from "../../../../data/theme";
import underDevelopment from "../../../../assets/imgs/Under-development.jpg";

class EcoSwingBdBalanceDoor extends Component {
    render() {
        return (
            <div>
                <Helmet>
                    <title>{`Home Page — ${theme.name}`}</title>
                </Helmet>

                <div className="container">
                    <h2 className={"my-5"}>Eco-Swing BD ” Balance Door “</h2>

                    <div>
                        <p className={"m-3"} style={{fontSize: 20}}>The APA Eco-Swing BD “Balance Door” system is
                            planned for development in the short to medium term and will uses the same unique control
                            system that runs the ES90 swing operator.</p>

                        <p className={"m-3"} style={{fontSize: 20}}>This are currently in our development schedule and further updates will appear here as the project progresses</p>

                        <div className="text-center">
                            <img src={underDevelopment} alt="underDevelopment"/>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default EcoSwingBdBalanceDoor;
