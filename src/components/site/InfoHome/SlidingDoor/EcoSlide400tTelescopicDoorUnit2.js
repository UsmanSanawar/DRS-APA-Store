import React, {Component} from 'react';
import {Helmet} from "react-helmet/es/Helmet";
import theme from "../../../../data/theme";
import ES400B_CU from "../../../../assets/imgs/ES400B-CU-Trans-1024x207.png";
import ES400T_IH_Track_Cover from "../../../../assets/imgs/ES400T-IH-Track-Cover.png";

class EcoSlide400TTelescopicDoorUnit2 extends Component {
    render() {
        return (
            <div>
                <Helmet>
                    <title>{`Home Page — ${theme.name}`}</title>
                </Helmet>

                <div className="container">
                    <h2 className={"my-5"}>Eco-Slide 400T-IH “In-Head” Telescopic Sliding Door Unit</h2>

                    <p className={"text-center my-"} style={{fontSize: 20, color: "#f1630c", fontWeight: "bold"}}>At the
                        heart of the new Eco-Slide 400 series Sliding Door Operator is the new ES400B Control Unit</p>

                    <p className="my-3">Designed to be both simple & reliable but also to comply with the EN 16005 :
                        2012 regulations. It has all the functions expected on a high tech door control system.</p>

                    <p className="my-3">The Control unit is what we term “an All in one” this meaning the controller
                        houses not only the electronic control system but also the power supply & battery back, thus
                        making this a very compact unit.</p>

                    <div className="text-center">
                        <img height={165} className="my-2" src={ES400B_CU} alt="ES400B_CU"/>
                    </div>

                    <p className={"text-center my-4"} style={{fontSize: 20, color: "#f1630c", fontWeight: "bold"}}>
                        A control system built by engineers for engineers</p>

                    <div>
                        <p className={"my-3"}>The aim being to make a unit which is not only highly functional and
                            reliable but is also very easy to setup and adjust.</p>
                        <p className={"my-3"}>We use simple led’s to verify status & error conditions, thus showing at a
                            glance what the controller is doing.</p>
                        <p className={"my-3"}>The adjusters give the full range of adjustments needed as regards door
                            speeds, opening times, etc and a few simple switches allow for functions to be turned on /
                            off </p>
                    </div>


                    <p
                        className={"text-center my-4"}
                        style={{fontSize: 26, color: "#f1630c", fontWeight: "bold"}}
                    >
                        ES400T-IH Features
                    </p>


                    <div>
                        <p className="my-3">Compact Operator housing with lift off cover & opening interlock c/w Cover Stay   100mm high   x  295mm  wide</p>
                        <p className="my-3">Also our unique “cable retaining system” built into the cover  helps keep all your sensor cables tidy and secure</p>
                        <p className="my-3">We also developed a “3 part system” which uses a “built in adaptor section” to which the secondary track is fitted.</p>
                        <p className="my-3">This is coupled to a standard ES400 sliding door operator. This makes it very easy to install as the secondary track is fitted first along with the secondary door leaves. Only then is the standard operator fitted and then connected.</p>
                        <p className="my-3">All our sliding door operators throughout the range have comment components.</p>
                    </div>

                    <div className="text-center my-4">
                        <img height={485} src={ES400T_IH_Track_Cover} alt="ES400T_Track_Cover"/>
                    </div>

                    <p className={"text-center my-4"} style={{fontSize: 20, color: "#f1630c", fontWeight: "bold"}}>
                        All operating equipment mounted to a "quick release" module allowing for quick and simple installation / removal.</p>

                    <div>
                        <ul>
                            <li>It uses the highly respected ” Dunker Motor ” Zero offset Motor /Gearbox Unit. A Slim but powerful unit.</li>
                            <li>Electronic Motor lock Option ( Switchable)</li>
                            <li>Inner & Outer Activation inputs with monitored threshold safety</li>
                            <li>Monitored side screen safety sensors inputs</li>
                            <li>Mode Switch input can accept a wide range of switches, from a simple rocker switch, a key switch or our new touch screen switch (coming soon)</li>
                        </ul>
                    </div>

                    <p
                        className={"my-4"}
                        style={{fontSize: 26, color: "#f1630c", fontWeight: "bold"}}
                    >
                        Other Options include
                    </p>

                    <div>
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

export default EcoSlide400TTelescopicDoorUnit2;
