import React, {Component} from 'react';
import APALogo from "../../../../assets/imgs/APA-Contact-Us.jpg";

class ContactUs extends Component {
    render() {
        return (
            <div>
                <div className="container my-5">
                    <h3 className={'my-4'}>Contact Us</h3>

                    <div className="text-center">
                        <img className="mb-5" src={APALogo} alt="APALogo"/>

                        <div className="mb-5">
                            <p className="my-1">Unit 14</p>
                            <p className="my-1">Maylands Business Centre</p>
                            <p className="my-1">Hemel Hempstead. Herts. HP2 7ES</p>
                        </div>

                        <div>
                            <p className="my-1">1, Riverside Ave West</p>
                            <p className="my-1">Lawford</p>
                            <p className="my-1">Manningtree. Essex.  CO11 1UN</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ContactUs;
