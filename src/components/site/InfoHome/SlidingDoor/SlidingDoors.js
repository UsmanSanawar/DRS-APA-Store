import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import theme from "../../../../data/theme";

class SlidingDoors extends Component {
    render() {
        return (
            <div>
                <Helmet>
                    <title>{`Home Page — ${theme.name}`}</title>
                </Helmet>

                <div className="container">
                    <h2 className={"my-5"}>Sliding Doors</h2>

                    <div>
                        <p className={"m-3"}>Automatic sliding doors are and ideal choice where ever space allows. It
                            can give large openings and is much better at tolerating winds than say a swing door would
                            be.</p>

                        <p className={"m-3"}>A fully pocketed doors set is probably the safest type of automatic door on
                            the market.</p>
                    </div>

                    <h2 className={"my-5"}>Check out  our Sliding Door Operators</h2>
                </div>
            </div>
        );
    }
}

export default SlidingDoors;
