import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import theme from "../../../../data/theme";
import RetroKit1 from "../../../../assets/imgs/Retrofit-Kit-Image-2.jpg"

class SlidingDoorRetroFitKits extends Component {
    render() {
        return (
            <div>
                <Helmet>
                    <title>{`Home Page — ${theme.name}`}</title>
                </Helmet>

                <div className="container">
                    <h2 className={"my-5"}>Sliding Door Retro-Fit Kits</h2>

                    <div>
                        <p className="my-3">APA offer a “Retro-fit Kit” solution for most makes & models of automatic
                            sliding door systems.</p>
                        <p className="my-3">APA offer what we believe is currently the quickest & easiest retro-fitting
                            solution in the market today.</p>
                    </div>

                    <div className="text-center my-3">
                        <img height={200} src={RetroKit1} alt="RetroKit1"/>
                    </div>

                    <div>
                        <p className="my-4">
                            When confronted with old / obsolete equipment or the extortionately high cost for some
                            manufacturer’s spare parts, then an ideal remedy is to carry out the “retro-fitting” of that
                            that operator. “Retro-fitting” is the process of replacing all the operating equipment of an
                            old / obsolete sliding door operator and replacing it with new and up-to-date equipment but
                            retaining the original mechanical parts. So providing the track & wheels are in a good
                            condition, then the “retro-fit” is ideally suited. APA is now pleased to offer our“EZI-FIT”
                            modularretro-fitting system for a wide range of makes / models of automatic sliding doors.
                        </p>

                        <p className="my-4">
                            We have done away with the need to have lots of loose parts / brackets etc. and having to
                            convert the drive belts / brackets or return pulley.
                            Unlike other kits which arrive as a pack of parts, our kit arrives fully assembled and ready
                            to fit. Each kit is specifically designed for certain
                            makes & models and is what makes it so “EZI” to fit. We have designed a simple purpose build
                            module system which has all
                            the major components on and which simply fits in pace of the existing motor & control
                            equipment.
                        </p>

                        <p className="my-4">
                            We use operator specific motor belt pulley’s which allow the reuse of existing drive belts &
                            return pulley.
                        </p>

                        <p className="my-4">
                            The whole system simplifies the installation and on average can be completed within an hour.
                        </p>

                        <p className="my-4">
                            Its virtually as easy as changing a motor /gearbox!!
                        </p>
                        <p>
                            The control system is fully programmable via the on board LCD display which uses plain
                            English and not a complicated error code system or numbers or letters.
                        </p>

                        <p className="my-4">
                            To complement the operator we have also developed our own five position key operated LCD
                            program switch which can virtually
                            eliminated user error as the functions are displayed in words and not symbols the average
                            user cannot understand.
                        </p>

                        <p className="my-4">
                            The “EZI-FIT” retro-fitting modules offer a quick and cost effective way to bring older door
                            systems up to the latest EN 16005 standard.
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default SlidingDoorRetroFitKits;
