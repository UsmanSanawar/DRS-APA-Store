// react
import React, { useEffect, useState } from 'react';

// data stubs
import theme from '../../data/theme';


export default function FooterContacts(props) {

    const [Org, setOrg] = useState({defaultAddress: {}})
    useEffect(() => {
    if (props.organization) {
        setOrg(props.organization)
    }
    }, [props.organization])

console.log('OrgObject', Org)

    return (
        <div className="site-footer__widget footer-contacts">
            <h5 className="footer-contacts__title">Contact Us</h5>

            <ul className="footer-contacts__contacts">
                <li className="text-justify">
                    {Org.defaultAddress
                        ? <div>
                            <p className="m-0"> <i className="footer-contacts__icon fas fa-globe-americas" />{`${Org.defaultAddress.address}, ${Org.defaultAddress.city} ${Org.defaultAddress.postCode},`}</p>
                            <p className="m-0">{`${ Org.defaultAddress.country}`}</p>
                        </div> : ""}
                </li>
                <li>
                    <i className="footer-contacts__icon far fa-envelope" />
                    {Org.defaultAddress ? Org.defaultAddress.email : ""}
                </li>
                <li>
                    <i className="footer-contacts__icon fas fa-mobile-alt" />
                    {`${Org.defaultAddress ? `${Org.defaultAddress.phoneNo ? Org.defaultAddress.phoneNo : ""}, ${Org.defaultAddress ? Org.defaultAddress.whatsappNo: ""}` : ""}`}
                </li>
                <li>
                    <i className="footer-contacts__icon far fa-clock" />
                    {Org ? Org.officeTiming : ""}
                </li>
            </ul>
        </div>
    );
}
