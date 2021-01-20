// react
import React, { useEffect, useState } from "react";
// third-party
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { isTokenValid } from "../../constant/helpers";
// application
import Dropdown from "./Dropdown";



function Topbar(props) {
  const [Organization, setOrganization] = useState({ defaultAddress: {} });
  useEffect(() => {


    console.log(Organization, "ddddddd")
    setOrganization(props.organization);
  }, [props.organization]);

  const links = [
    {
      title: <FormattedMessage id="topbar.aboutUs" defaultMessage="About Us" />,
      url: "/site/about-us",
    },
    {
      title: (
        <FormattedMessage id="topbar.contacts" defaultMessage="Contacts" />
      ),
      url: "/site/contact-us",
    },
    {
      title: (
        <FormattedMessage
          id="topbar.storeLocation"
          defaultMessage="Store Location"
        />
      ),
      url: "",
    },
    {
      title: (
        <FormattedMessage id="topbar.trackOrder" defaultMessage="Track Order" />
      ),
      url: "/shop/track-order",
    },
    {
      title: <FormattedMessage id="topbar.blog" defaultMessage="Blog" />,
      url: "/blog/category-classic",
    },
  ];

  const accountLinks = [
    { title: "Dashboard", url: "/store/dashboard" },
    { title: "Edit Profile", url: "/store/profile" },
    { title: "Your Orders", url: "/store/orders" },
    // { title: "Addresses", url: "/store/addresses" },
    { title: "Password", url: "/store/password" },
    { title: "Logout", url: "/store/login" },
  ];

  const linksList = (
    <div>
      <span className="pr-2">
        <i className="fa fa-envelope pr-1" />
        {Organization.defaultAddress ? Organization.defaultAddress.email : ""}
      </span>{" "}
      {" | "}{" "}
      <span className="pl-2">
        <i className="fa fa-phone pr-1" />{" "}
        {Organization.defaultAddress ? Organization.defaultAddress.phoneNo : ""}
      </span>{" "}
    </div>
  );

  return (
    <div className="site-header__topbar topbar">
      <div className="topbar__container container">
        <div className="topbar__row">
          {linksList}
          <div className="topbar__spring" />
          {JSON.parse(localStorage.getItem("token")) &&
          isTokenValid(localStorage.getItem("token")) ? (
            <div className="topbar__item">
              <Dropdown
                {...props}
                title={
                  <FormattedMessage
                    id="topbar.myAccount"
                    defaultMessage="My Account"
                  />
                }
                items={accountLinks}
              />
            </div>
          ) : (
            <>
              <div className="topbar__item px-2 topnav_link">
                <Link
                  to="/store/login"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Sign up/ Sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Topbar;
