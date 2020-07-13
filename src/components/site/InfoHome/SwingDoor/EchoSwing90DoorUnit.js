import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import theme from "../../../../data/theme";
import SwingDoor1 from "../../../../assets/imgs/SwingDoorUnitnocover.jpeg";
import SwingDoor2 from "../../../../assets/imgs/ES90-Cover-View-50-per-cent-50-50-1024x370.jpg";
import wifiLogo from "../../../../assets/imgs/wifi-logo.png";
import PDFImage from "../../../../assets/imgs/PDF-Image.png";
import ScreenShot1 from "../../../../assets/imgs/Screenshot-Engineers-1.png";
import ScreenShot2 from "../../../../assets/imgs/ScreenShot-Errors.png";
import ScreenShot3 from "../../../../assets/imgs/Screenshot-Staus-Page-.png";
import Part1 from "../../../../assets/imgs/Spindle-Ext.-Kit-300x225.jpg";
import Part2 from "../../../../assets/imgs/Push-Arm-2-300x136.gif";
import Part3 from "../../../../assets/imgs/Pull-Arm-300x176.jpg";
import Door from "../../../../assets/imgs/ES90_SWING-2-1024x582.png";

class EchoSwing90DoorUnit extends Component {
    render() {
        return (
            <div>
                <Helmet>
                    <title>{`Home Page — ${theme.name}`}</title>
                </Helmet>

                <div className="container">
                    <h2 className={"my-5"}>Eco-Swing 90 Swing Door Unit</h2>

                    <p className={"text-center"} style={{fontSize: 22, color: "#f1630c", fontWeight: "bold"}}>The New
                        WiFi Enable Automatic Swing Door Operator</p>

                    <div>
                        <div className="text-center">
                            <img className="my-2" src={SwingDoor1} alt="SwingDoorUnitNoCover"/>
                        </div>

                        <div className="row  my-5">
                            <div className="col-md-6">
                                <div className="text-center">
                                    <img height={72} src={wifiLogo} alt="wifi-logo"/>
                                </div>
                            </div>

                            <div className="col-md-6" style={{alignSelf: "center"}}>
                                <div className="text-center">
                                    <p className="m-0" style={{fontSize: 23}}>Reliable, Robust, High Quality, Simple to
                                        Use</p>
                                </div>
                            </div>
                        </div>

                        <div className={"text-center my-3"}>
                            <img width="80%" src={SwingDoor2} alt="CoverView50"/>
                        </div>

                        <div className="text-center">
                            <p className={"my-2"}
                               style={{fontSize: 22, color: "#f1630c", fontWeight: "bold"}}>ES90 Technical Manual</p>
                            <p className="my-1">
                                <small>Click to View</small>
                            </p>
                            <img width={117} height={117} src={PDFImage} alt="PdfImage"/>
                        </div>

                        <p className={'my-4'}>This Wifi enabled swing door controller brings a wealth of benefits to engineers installing
                            and maintaining these units. The unit can be accessed from any WiFi enabled device with a
                            web browser and the interface has been designed to be clear and simple to use.</p>


                        <div className="row my-5">
                            <div className="col-md-4 text-center">
                                <img src={ScreenShot1} alt="ScreenShot1"/>
                            </div>

                            <div className="col-md-4 text-center">
                                <img src={ScreenShot2} alt="ScreenShot2"/>
                            </div>

                            <div className="col-md-4 text-center">
                                <img src={ScreenShot3} alt="ScreenShot3"/>
                            </div>
                        </div>

                        <div>
                            <h3 style={{borderBottom:"1px solid black", width: "fit-content", color: "#f1630c"}} className={"my-4"}>Eco-Swing 90 Features</h3>

                            <p>Compact 90mm X 135mm Aluminium Profile With “Easy Clip” Cover</p>
                            <p>Push & Pull Arm Systems. Pull Arm With Integrated Guide Channel Spacing ( i.e. No Packing Of Door Channel Required)</p>
                            <p>Powerful Microprocessor Based Control System With All Options Integrated Within the Programming / Setup.</p>
                            <p>It Uses A Self Diagnostic System To Identify Faults And Make Installations / Maintenance As Simple As Possible</p>
                            <p>Low Energy Operation</p>
                            <p>Power Assist Mode</p>
                            <p>Push and Go Option</p>
                            <p>Electric Lock Output</p>
                            <p>Fire Alarm Input (N/O or N/C Selectable)</p>
                            <p>Morning Entry / Access Control Key Input (N/O)</p>
                            <p>Safety Mat Input (N/O)</p>
                            <p>Emergency Stop Input (N/O or N/C Selectable)</p>
                            <p>Auxiliary Locking Relay ( N/O & N/C)</p>
                            <p>Master/Slave Connection Interlocking Between Door Sets</p>
                            <p>Rebated Door Mode Fully Monitored Safety Sensor System (EN16005 : 2012)</p>
                            <p>Easy To Use Wifi Interface Set-Up Program With Status & Error Reporting (using any wifi enabled browser)</p>

                        </div>


                        <div>
                            <h3 style={{borderBottom:"1px solid black", width: "fit-content", color: "#f1630c"}} className={"my-4"}>Mode Switch Options</h3>

                            <p>Rocker Switch (Standard) – Key Operated Switch – LCD Key Switch Options</p>
                            <p>Battery Back-Up Manual Display / Adjustment Board Spindle Extension Kit</p>
                            <p className="mb-4">All settings, adjustments, status & error messages are available through the WiFi interface.</p>
                        </div>

                        <div className="row my-4">
                            <div className="col-md-4 text-center">
                                <img width={'100%'} src={Part1} alt="part1"/>
                            </div>
                            <div className="col-md-4 text-center">
                                <img width={'100%'} src={Part2} alt="part2"/>
                            </div>
                            <div className="col-md-4 text-center">
                                <img width={'100%'} src={Part3} alt="part3"/>
                            </div>
                        </div>

                        <div className={'col-md-12'}>
                            <img width="100%" src={Door} alt="ES90-Door"/>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default EchoSwing90DoorUnit;
