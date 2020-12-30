// react
import React, { useEffect, useState } from "react";

// third-party
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

// data stubs
// import addresses from "../../data/accountAddresses";
// import allOrders from "../../data/accountOrders";
import theme from "../../data/theme";
import RestService from "../../store/restService/restService";
import { filter } from "lodash";

export default function AccountPageDashboard(props) {
  const [state, setstate] = useState({});
  const [allOrders, setOrders] = useState([]);
  useEffect(() => {
    if (Object.entries(props.customer).length > 0) {
      setstate(props.customer);
    }

    if (props.customer.customerId) {
      RestService.getOrderByCustomerId(props.customer.customerId).then(
        (res) => {
          if (res.data.status === "success") {
            setOrders(res.data.data);
          }
        }
      );
    }
  }, [props.customer]);

  let address = {};
  let customerAddresses = state.customerAddress || []
  for (const item of customerAddresses) {
    if(item.addressType === "billing") {
      address = item
    }
  }
    // state.customerAddress && state.customerAddress.length > 0
    //   ? filter(state.customerAddress, (item) => item.addressType === "billing")
    //   : [];
  const orders = allOrders.slice(0, 3).map((order) => (
    <tr key={order.id}>
      <td>
        <Link to="/">#{order.id}</Link>
      </td>
      <td>{order.date}</td>
      <td>{order.status}</td>
      <td>{order.total}</td>
    </tr>
  ));

  // activationCode: ""
  // approved: false
  // customerAddress: []
  // customerGroupId: 2
  // customerGroupName: null
  // customerId: 64
  // email: "raufshakeel@gmail.com"
  // fax: null
  // firstName: "Abdul"
  // gender: "male"
  // isActive: true
  // isEmailVerified: false
  // lastName: "aAaa"
  // newsletter: true
  // orders: []
  // password: ""
  // safe: false
  // saleOrders: []
  // status: false
  // taxNumber: "3423fff33w"
  // telephone: null

  return (
    <div className="dashboard">
      <Helmet>
        <title>{`My Account — ${theme.name}`}</title>
      </Helmet>
      
      <div className="dashboard__profile card profile-card">
        <div className="card-body profile-card__body">
          <div className="profile-card__avatar">
            <img src="images/avatars/avatar-3.jpg" alt="" />
          </div>
          <div className="profile-card__name">{`${state.firstName || ""} ${
            state.lastName || ""
          }`}</div>
          <div className="profile-card__email">{state.email}</div>
          <div className="profile-card__edit">
            <Link to="profile" className="btn btn-secondary btn-sm">
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
      <div className="dashboard__address card address-card address-card--featured">
        {address.default && (
          <div className="address-card__badge">Default Address</div>
        )}
        <div className="address-card__body">
          <div className="address-card__name">{`${address.firstName || ""} ${address.lastName || ""}`}</div>
          <div className="address-card__row">
            {address.country || ""}
            <br />
            {address.postcode || ""},{address.city || ""}
            <br />
            {address.address || ""}
          </div>
          <div className="address-card__row">
            <div className="address-card__row-title">Phone Number</div>
            <div className="address-card__row-content">{address.phone || '-'}</div>
          </div>
          <div className="address-card__row">
            <div className="address-card__row-title">Email Address</div>
            <div className="address-card__row-content">{address.email || '-'}</div>
          </div>
        </div>
      </div>
      <div className="dashboard__orders card">
        <div className="card-header">
          <h5>Recent Orders</h5>
        </div>
        <div className="card-divider" />
        <div className="card-table">
          <div className="table-responsive-sm">
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>{orders}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
