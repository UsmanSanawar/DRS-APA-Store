import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import theme from "../../../../data/theme";
import ES400B_CU from "../../../../assets/imgs/ES400B-CU-Trans-1024x207.png";
import ES400_IH_Track_Cover from "../../../../assets/imgs/ES400-IH-Track-Cover-768x428.png";

class Es400SlidingDoorUnit2 extends Component {
    render() {
        return (
            <div>
                <Helmet>
                    <title>{`Home Page — ${theme.name}`}</title>
                </Helmet>

                <div className="container">
                    <h2 className={"my-5"}>Eco-Slide 400IH “In-Head” Sliding Door Unit</h2>

                    <p className={"text-center my-"} style={{fontSize: 20, color: "#f1630c", fontWeight: "bold"}}>At the
                        heart of the new Eco-Slide 400 series Sliding Door Operator is the new ES400B Control Unit</p>

                    <p className="my-3">Designed to be both simple & reliable but also to comply with the EN 16005 : 2012
                        regulations.</p>

                    <p className="my-3">The Control unit is what we term “an All in one” this meaning the controller houses
                        not only the electronic control system but also the power supply & battery back, thus making this a
                        very compact unit.</p>

                    <div className="text-center">
                        <img height={165} className="my-2" src={ES400B_CU} alt="ES400B_CU"/>
                    </div>

                    <p className={"text-center my-4"} style={{fontSize: 20, color: "#f1630c", fontWeight: "bold"}}>A control
                        system built by engineers for engineers</p>

                    <div>
                        <p className="my-3">The aim being to make a unit which is not only highly functional and reliable
                            but is also very easy to setup and adjust.</p>
                        <p className="my-3">We use simple led’s to verify status & error conditions, thus showing at a
                            glance what the controller is doing.</p>
                        <p className="my-3">The adjusters give the full range of adjustments needed as regards door speeds,
                            opening times, etc and a few simple switches allow for functions to be turned on / off.</p>
                    </div>

                    <p className={"text-center my-4"} style={{fontSize: 26, color: "#f1630c", fontWeight: "bold"}}>Eco-Slide
                        400-IH Features</p>

                    <div>
                        <p className="my-3">Compact Operator housing with lift off cover & opening interlock c/w Cover Stay
                            100mm high x 165mm wide.</p>
                        <p className="my-3">Also our unique “cable retaining System” built into the cover helps keep all
                            your sensor cables tidy and secure.</p>
                    </div>

                    <div className="text-center my-4">
                        <img height={485} src={ES400_IH_Track_Cover} alt="ES400_IH_Track_Cover"/>
                    </div>

                    <p className={"text-center my-4"} style={{fontSize: 20, color: "#f1630c", fontWeight: "bold"}}>All
                        operating equipment mounted to a "quick release" module allowing for quick and simple installation /
                        removal.</p>

                    <div className="my-3">
                        <ul>
                            <li>It uses the highly respected ” Dunker Motor ” Zero offset Motor /Gearbox Unit. A Slim but
                                powerful unit.
                            </li>
                            <li>Electronic Motor lock Option ( Switchable)</li>
                            <li>Inner & Outer Activation inputs with monitored threshold safety</li>
                            <li>Monitored side screen safety sensors inputs</li>
                            <li>Mode Switch input can accept a wide range of switches, from a simple rocker switch, a key
                                switch or our new touch screen switch (coming soon)
                            </li>
                        </ul>
                    </div>

                    <p className={"my-4"} style={{fontSize: 24, color: "#f1630c", fontWeight: "bold"}}>Other options include</p>

                    <div className="my-3">
                        <ul>
                            <li>Motor Direction (Switchable)</li>
                            <li>Electric Lock</li>
                            <li>Remote Reset Line</li>
                            <li>Stop Command</li>
                            <li>Fire Alarm Input</li>
                            <li>Morning Entry Input</li>
                        </ul>
                    </div>

                </div>
            </div>
        );
    }
}

export default Es400SlidingDoorUnit2;
