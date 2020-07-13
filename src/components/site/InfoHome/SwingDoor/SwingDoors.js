import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import theme from "../../../../data/theme";

class SwingDoors extends Component {
    render() {
        return (
            <div>
                <Helmet>
                    <title>{`Home Page — ${theme.name}`}</title>
                </Helmet>

                <div className="container">
                    <h2 className={"my-5"}>Swing Doors</h2>

                    <div>
                        <p className={"m-3"}>Automatic Swing doors are probably the most common type of automatic
                            door as the space needed to use them is less than say an Automatic Sliding Door and also
                            existing swing doors can be readily automated.</p>
                        <p className={"m-3"}>The downside with Automatic Swings doors is they need a lot of
                            protection devices as the sweep of the door arc when opening or closing has the
                            potential to strike a person and so the needs of protection are greater.</p>
                    </div>

                    <h2 className={"my-5"}>Check out our Swing Door Operators</h2>
                </div>
            </div>
        );
    }
}

export default SwingDoors;
