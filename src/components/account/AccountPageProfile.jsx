// react
import React, {useEffect, useState} from "react";

// third-party
import {Helmet} from "react-helmet";

// data stubs
import theme from "../../data/theme";
import {Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";
import _ from "lodash";
import classNames from "classnames";
import RestService from "../../store/restService/restService";
import {toast} from "react-toastify";

export default function AccountPageProfile(props) {
  const [userFormData, setUserFormData] = useState({
    shipping: {},
    billing: {},
    gender: "male",
  });
  const [activeTab, setActiveTab] = useState("1");
  const [customerGroups, setcustomerGroups] = useState([]);
  useEffect(() => {
    RestService.getAllStoreCustomerGroups().then((res) => {
      if (res.data.status === "success") {
        setcustomerGroups(res.data.data);
      }
    });
  }, []);

  useEffect(() => {
    if (Object.entries(props.customer).length > 0) {
      let customerData = props.customer;
      customerData.billing = {};
      customerData.shipping = {};

      if (customerData.customerAddress.length > 0) {
        let index = customerData.customerAddress.findIndex(
          (item) => item.addressType === "shipping"
        );
        if (index > -1) {
          customerData.shipping = customerData.customerAddress[index];
        }

        let index2 = customerData.customerAddress.findIndex(
          (item) => item.addressType === "billing"
        );
        if (index2 > -1) {
          customerData.billing = customerData.customerAddress[index2];
        }
      }
      setUserFormData(customerData);
    }
  }, [props.customer]);

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const handleRegistration = () => {
    userFormData.isActive = true;
    let array = [];

    userFormData.shipping.addressType = "shipping";
    if (userFormData.shipping.firstName && userFormData.shipping.city) {
      userFormData.shipping.customerId = userFormData.customerId;

      if (userFormData.shipping.customerAddressId) {
        RestService.editCustomerProfileAddress(
          userFormData.shipping,
          userFormData.shipping.customerAddressId
        ).then((res) => {
          //
        });
      } else {
        RestService.postCustomerProfileAddress(userFormData.shipping).then(
          (res) => {
            //
          }
        );
      }

      array.push({...userFormData.shipping});
    }

    userFormData.billing.addressType = "billing";
    if (userFormData.billing.firstName && userFormData.billing.city) {
      userFormData.billing.customerId = userFormData.customerId;

      if (userFormData.billing.customerAddressId) {
        RestService.editCustomerProfileAddress(
          userFormData.billing,
          userFormData.billing.customerAddressId
        ).then((res) => {
          //
        });
      } else {
        RestService.postCustomerProfileAddress(userFormData.billing).then(
          (res) => {
            //
          }
        );
      }

      array.push({...userFormData.billing});
    }

    userFormData.customerAddress = [];

    RestService.editCustomerProfile(userFormData, userFormData.customerId).then(
      (res) => {
        toast[res.data.status](res.data.message);
      }
    );
  };


  const handleSameAsShip = () => {
    let shipping = userFormData.shipping;
    let billingAddressId = 0;
    if (userFormData.billing.customerAddressId) {
      billingAddressId = userFormData.billing.customerAddressId
    }

    userFormData.billing = {...shipping, customerAddressId: billingAddressId, addressType: 'billing'};

    setUserFormData({...userFormData, billing: userFormData.billing})
  }

  console.log(userFormData, "Waresssst")

  return (
    <div className="card">
      <Helmet>
        <title>{`Profile — ${theme.name}`}</title>
      </Helmet>

      <div className="card-header">
        <h5>Edit Profile</h5>
      </div>
      <div className="card-divider"/>
      <div className="card-body m-0">
        <div className="row no-gutters">
          <div className="col-12 col-lg-9 col-xl-9">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleRegistration();
              }}
            >
              <input hidden value={userFormData.password || ""}/>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classNames({active: activeTab === "1"})}
                    onClick={() => {
                      toggle("1");
                    }}
                  >
                    General
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classNames({active: activeTab === "2"})}
                    onClick={() => {
                      toggle("2");
                    }}
                  >
                    Address
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                  <div className="pt-4">
                    <div className="form-row">
                      <div className="form-group col-6">
                        <label htmlFor="name">First Name</label>
                        <input
                          id="firstName"
                          required
                          type="text"
                          className="form-control"
                          placeholder="Enter First Name"
                          name="firstName"
                          onChange={(event) =>
                            setUserFormData({
                              ...userFormData,
                              firstName: event.target.value,
                            })
                          }
                          value={userFormData.firstName || ""}
                        />
                      </div>

                      <div className="form-group col-6">
                        <label htmlFor="name">Last Name</label>
                        <input
                          id="lastName"
                          required
                          type="text"
                          className="form-control"
                          placeholder="Enter Last Name"
                          name="lastName"
                          onChange={(event) =>
                            setUserFormData({
                              ...userFormData,
                              lastName: event.target.value,
                            })
                          }
                          value={userFormData.lastName || ""}
                        />
                      </div>

                      <div className="form-group col-6">
                        <label htmlFor="phone">Phone No.</label>
                        <input
                          id="phone"
                          type="text"
                          className="form-control"
                          placeholder="Enter Phone No."
                          name="telephone"
                          onChange={(event) =>
                            setUserFormData({
                              ...userFormData,
                              telephone: event.target.value,
                            })
                          }
                          value={userFormData.telephone || ""}
                        />
                      </div>

                      <div className="form-group col-6">
                        <label htmlFor="register-email">Email address</label>
                        <input
                          id="register-email"
                          disabled
                          type="email"
                          className="form-control"
                          placeholder="Enter email"
                          onChange={(event) =>
                            setUserFormData({
                              ...userFormData,
                              email: event.target.value,
                            })
                          }
                          value={userFormData.email || ""}
                        />
                      </div>

                      <div className="form-group col-6">
                        <label htmlFor="phone">Tax Number</label>
                        <input
                          id="taxNumber"
                          type="text"
                          className="form-control"
                          placeholder="Enter Tax Number"
                          name="taxNumber"
                          onChange={(event) =>
                            setUserFormData({
                              ...userFormData,
                              taxNumber: event.target.value,
                            })
                          }
                          value={userFormData.taxNumber || ""}
                        />
                      </div>

                      <div className="form-group col-6">
                        <label htmlFor="phone">Gender</label>
                        <select
                          id="gender"
                          className="form-control border"
                          placeholder="Select gender"
                          name="gender"
                          onChange={(event) =>
                            setUserFormData({
                              ...userFormData,
                              gender: event.target.value,
                            })
                          }
                          value={userFormData.gender || ""}
                        >
                          <option value="male" key="male">
                            Male
                          </option>
                          <option value="female" key="female">
                            Female
                          </option>
                          <option value="other" key="other">
                            Other
                          </option>
                        </select>
                      </div>

                      <div className="form-group col-6">
                        <label htmlFor="phone">Customer Group</label>
                        <select
                          id="customerGroupId"
                          className="form-control border"
                          placeholder="Select customer group"
                          name="customerGroupId"
                          onChange={(event) =>
                            setUserFormData({
                              ...userFormData,
                              customerGroupId: event.target.value,
                            })
                          }
                          value={userFormData.customerGroupId || ""}
                        >
                          <option value="" key="">
                            N/A
                          </option>

                          {customerGroups &&
                          _.filter(
                            customerGroups,
                            (item) => item.displayOnSite === true
                          ).map((item) => (
                            <option value={item.customerGroupId}>
                              {item.customerGroupName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="form-group w-100 mb-0 d-inline-flex">
                      <input
                        style={{
                          marginRight: 10,
                          height: 22,
                          width: 20,
                        }}
                        id="register-newsletter"
                        type="checkbox"
                        placeholder="newsletter"
                        onChange={(event) =>
                          setUserFormData({
                            ...userFormData,
                            newsletter: event.target.checked,
                          })
                        }
                        checked={userFormData.newsletter || false}
                      />
                      <p>Subscribe newsletter</p>
                    </div>
                  </div>
                </TabPane>

                <TabPane tabId="2">
                  <div className="pt-4">
                    <div className="form-row mb-2">
                      <h4>Shipping Address</h4>
                    </div>

                    <div className="form-row">
                      <div className="col-6 form-group">
                        <label htmlFor="name">First Name</label>
                        <input
                          id="firstName"
                          type="text"
                          className="form-control"
                          placeholder="Enter First Name"
                          name="firstName"
                          onChange={(event) =>
                            setUserFormData({
                              ...userFormData,
                              shipping: {
                                ...userFormData.shipping,
                                firstName: event.target.value,
                              },
                            })
                          }
                          value={userFormData.shipping.firstName || ""}
                        />
                      </div>

                      <div className="col-6 form-group">
                        <label htmlFor="name">Last Name</label>
                        <input
                          id="lastName"
                          type="text"
                          className="form-control"
                          placeholder="Enter Last Name"
                          name="lastName"
                          onChange={(event) =>
                            setUserFormData({
                              ...userFormData,
                              shipping: {
                                ...userFormData.shipping,
                                lastName: event.target.value,
                              },
                            })
                          }
                          value={userFormData.shipping.lastName || ""}
                        />
                      </div>

                      <div className="col-6 form-group">
                        <label htmlFor="name">Phone</label>
                        <input
                          id="phone"
                          type="text"
                          className="form-control"
                          placeholder="Enter Phone"
                          name="phone"
                          onChange={(event) =>
                            setUserFormData({
                              ...userFormData,
                              shipping: {
                                ...userFormData.shipping,
                                phone: event.target.value,
                              },
                            })
                          }
                          value={userFormData.shipping.phone || ""}
                        />
                      </div>

                      <div className="col-6 form-group">
                        <label htmlFor="name">Email</label>
                        <input
                          id="email"
                          type="email"
                          className="form-control"
                          placeholder="Enter email"
                          name="email"
                          onChange={(event) =>
                            setUserFormData({
                              ...userFormData,
                              shipping: {
                                ...userFormData.shipping,
                                email: event.target.value,
                              },
                            })
                          }
                          value={userFormData.shipping.email || ""}
                        />
                      </div>

                      <div className="col-6 form-group">
                        <label htmlFor="name">Street</label>
                        <input
                          id="street"
                          type="text"
                          className="form-control"
                          placeholder="Enter street"
                          name="street"
                          onChange={(event) =>
                            setUserFormData({
                              ...userFormData,
                              shipping: {
                                ...userFormData.shipping,
                                street: event.target.value,
                              },
                            })
                          }
                          value={userFormData.shipping.street || ""}
                        />
                      </div>

                      <div className="col-6 form-group">
                        <label htmlFor="name">City</label>
                        <input
                          id="city"
                          type="text"
                          className="form-control"
                          placeholder="Enter city"
                          name="city"
                          onChange={(event) =>
                            setUserFormData({
                              ...userFormData,
                              shipping: {
                                ...userFormData.shipping,
                                city: event.target.value,
                              },
                            })
                          }
                          value={userFormData.shipping.city || ""}
                        />
                      </div>

                      <div className="col-6 form-group">
                        <label htmlFor="state">State</label>
                        <input
                          id="state"
                          type="text"
                          className="form-control"
                          placeholder="Enter state"
                          name="state"
                          onChange={(event) =>
                            setUserFormData({
                              ...userFormData,
                              shipping: {
                                ...userFormData.shipping,
                                state: event.target.value,
                              },
                            })
                          }
                          value={userFormData.shipping.state || ""}
                        />
                      </div>

                      <div className="col-6 form-group">
                        <label htmlFor="state">Country</label>
                        <input
                          id="country"
                          type="text"
                          className="form-control"
                          placeholder="Enter country"
                          name="country"
                          onChange={(event) =>
                            setUserFormData({
                              ...userFormData,
                              shipping: {
                                ...userFormData.shipping,
                                country: event.target.value,
                              },
                            })
                          }
                          value={userFormData.shipping.country || ""}
                        />
                      </div>

                      <div className="col-6 form-group">
                        <label htmlFor="state">Zip Code</label>
                        <input
                          id="zipCode"
                          type="text"
                          className="form-control"
                          placeholder="Enter zipCode"
                          name="zipCode"
                          onChange={(event) =>
                            setUserFormData({
                              ...userFormData,
                              shipping: {
                                ...userFormData.shipping,
                                zipCode: event.target.value,
                              },
                            })
                          }
                          value={userFormData.shipping.zipCode || ""}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <input style={{
                        margin: 1,
                        height: 20,
                        width: 15,
                      }} type="checkbox" name="sameAsShipping" onChange={handleSameAsShip}/>
                      <span className="ml-2">Same as shipping</span>
                    </div>

                    <div className="form-row my-2">
                      <h4>Billing Address</h4>
                    </div>

                    <div className="form-row">
                      <div className="col-6 form-group">
                        <label htmlFor="name">First Name</label>
                        <input
                          id="firstName"
                          type="text"
                          className="form-control"
                          placeholder="Enter First Name"
                          name="firstName"
                          onChange={(event) =>
                            setUserFormData({
                              ...userFormData,
                              billing: {
                                ...userFormData.billing,
                                firstName: event.target.value,
                              },
                            })
                          }
                          value={userFormData.billing.firstName || ""}
                        />
                      </div>

                      <div className="col-6 form-group">
                        <label htmlFor="name">Last Name</label>
                        <input
                          id="lastName"
                          type="text"
                          className="form-control"
                          placeholder="Enter Last Name"
                          name="lastName"
                          onChange={(event) =>
                            setUserFormData({
                              ...userFormData,
                              billing: {
                                ...userFormData.billing,
                                lastName: event.target.value,
                              },
                            })
                          }
                          value={userFormData.billing.lastName || ""}
                        />
                      </div>

                      <div className="col-6 form-group">
                        <label htmlFor="name">Phone</label>
                        <input
                          id="phone"
                          type="text"
                          className="form-control"
                          placeholder="Enter Phone"
                          name="phone"
                          onChange={(event) =>
                            setUserFormData({
                              ...userFormData,
                              billing: {
                                ...userFormData.billing,
                                phone: event.target.value,
                              },
                            })
                          }
                          value={userFormData.billing.phone || ""}
                        />
                      </div>

                      <div className="col-6 form-group">
                        <label htmlFor="name">Email</label>
                        <input
                          id="email"
                          type="email"
                          className="form-control"
                          placeholder="Enter Email"
                          name="email"
                          onChange={(event) =>
                            setUserFormData({
                              ...userFormData,
                              billing: {
                                ...userFormData.billing,
                                email: event.target.value,
                              },
                            })
                          }
                          value={userFormData.billing.email || ""}
                        />
                      </div>

                      <div className="col-6 form-group">
                        <label htmlFor="name">Street</label>
                        <input
                          id="street"
                          type="text"
                          className="form-control"
                          placeholder="Enter street"
                          name="street"
                          onChange={(event) =>
                            setUserFormData({
                              ...userFormData,
                              billing: {
                                ...userFormData.billing,
                                street: event.target.value,
                              },
                            })
                          }
                          value={userFormData.billing.street || ""}
                        />
                      </div>

                      <div className="col-6 form-group">
                        <label htmlFor="name">City</label>
                        <input
                          id="city"
                          type="text"
                          className="form-control"
                          placeholder="Enter city"
                          name="city"
                          onChange={(event) =>
                            setUserFormData({
                              ...userFormData,
                              billing: {
                                ...userFormData.billing,
                                city: event.target.value,
                              },
                            })
                          }
                          value={userFormData.billing.city || ""}
                        />
                      </div>

                      <div className="col-6 form-group">
                        <label htmlFor="state">State</label>
                        <input
                          id="state"
                          type="text"
                          className="form-control"
                          placeholder="Enter state"
                          name="state"
                          onChange={(event) =>
                            setUserFormData({
                              ...userFormData,
                              billing: {
                                ...userFormData.billing,
                                state: event.target.value,
                              },
                            })
                          }
                          value={userFormData.billing.state || ""}
                        />
                      </div>

                      <div className="col-6 form-group">
                        <label htmlFor="state">Country</label>
                        <input
                          id="country"
                          type="text"
                          className="form-control"
                          placeholder="Enter country"
                          name="country"
                          onChange={(event) =>
                            setUserFormData({
                              ...userFormData,
                              billing: {
                                ...userFormData.billing,
                                country: event.target.value,
                              },
                            })
                          }
                          value={userFormData.billing.country || ""}
                        />
                      </div>

                      <div className="col-6 form-group">
                        <label htmlFor="state">Zip Code</label>
                        <input
                          id="zipCode"
                          type="text"
                          className="form-control"
                          placeholder="Enter zipCode"
                          name="zipCode"
                          onChange={(event) =>
                            setUserFormData({
                              ...userFormData,
                              billing: {
                                ...userFormData.billing,
                                zipCode: event.target.value,
                              },
                            })
                          }
                          value={userFormData.billing.zipCode || ""}
                        />
                      </div>
                    </div>
                  </div>
                </TabPane>
              </TabContent>

              <button
                type="submit"
                className="btn btn-primary mt-2 mt-md-3 mt-lg-4"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
