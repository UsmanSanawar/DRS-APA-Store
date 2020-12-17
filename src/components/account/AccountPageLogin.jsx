// react
import React, { useEffect, useState } from "react";
import classnames from "classnames";
// third-party
import { Helmet } from "react-helmet";
import { Link, Redirect } from "react-router-dom";

// application
import PageHeader from "../shared/PageHeader";
import { Check9x7Svg } from "../../svg";

// data stubs
import theme from "../../data/theme";
import RestService from "../../store/restService/restService";
import { toast } from "react-toastify";
import { isTokenValid } from "../../constant/helpers";
import { Modal, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import _ from "lodash";

export default function AccountPageLogin(props) {
  const breadcrumb = [
    { title: "Home", url: "" },
    { title: "My Account", url: "" },
  ];
  const [customerGroups, setcustomerGroups] = useState([]);
  useEffect(() => {
    if (
      localStorage.getItem("token") &&
      isTokenValid(localStorage.getItem("token"))
    ) {
      return props.history.goBack();
    }

    RestService.getAllStoreCustomerGroups().then((res) => {
      if (res.data.status === "success") {
        setcustomerGroups(res.data.data);
      }
    });
  }, []);

  const [loginFormData, setLoginFormData] = useState({});
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("1");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const handleSubmitLogin = () => {
    RestService.userAuthenticate(loginFormData).then((r) => {
      if (r.data.token) {
        localStorage.setItem("token", JSON.stringify(r.data.token));
        localStorage.setItem("identity", JSON.stringify(r.data.id))
        toast.success("User authenticated");

        setLoginFormData({});
        return props.history.push("/store");
      } else {
        toast.error("Invald credentials");
      }
    });
  };

  const [registerFormData, setRegisterFormData] = useState({
    shipping: {},
    billing: {},
    gender: "male"
  });

  const handleRegistration = () => {
    console.log(registerFormData, "formDataaaaa");

    registerFormData.isActive = true;
    console.log(registerFormData, "registerFormDataaaaa");
    let array = [];
    registerFormData.shipping.addressType = "shipping";
    if(registerFormData.shipping.firstName && registerFormData.shipping.city) {
    array.push({ ...registerFormData.shipping });}
    registerFormData.billing.addressType = "billing";
    if(registerFormData.billing.firstName && registerFormData.billing.city) {
    array.push({ ...registerFormData.billing });}

    console.log(array, "dasdasdsa");
    registerFormData.customerAddress = array;

    delete registerFormData.billing;
    delete registerFormData.shipping;

    console.log(registerFormData, "registerFormData");

    RestService.userregistration(registerFormData).then((res) => {
      toast[res.data.status](res.data.message);

      setRegisterFormData({gender: "", shipping: {}, billing: {} });
    });
  };

  const [forgotEmail, setForgotEmail] = useState('');
  const handleForgotPass = () => {
    RestService.userForgotPassword(forgotEmail).then(res => {
        toast[res.data.status](res.data.message)   
        setOpen(false) 
    })
  }

  return (
    <React.Fragment>
      <Modal isOpen={open} toggle={() => setOpen(!open)} centered size="md">
        <div
          style={{ borderBottom: "1px solid lightgray" }}
          className="content pt-3 pl-4"
        >
          <h4>Forgot Password</h4>
        </div>
        <div className="quickview pt-4">
          
            <div className="form-row">
              <div className="col-12">
                <div className="form-group">
                  <label htmlFor="email">Enter email</label>
                  <input onChange={(e) => setForgotEmail(e.target.value)} name="email" type="email" className="form-control" />
                </div>
              </div>
            </div>
            <input
              value="Send"
              onClick={handleForgotPass}
              type="button"
              className="btn btn-sm btn-primary float-right"
            />
        

          <small>*An email will be sent to email address if it exists</small>
        </div>
      </Modal>

      <Helmet>
        <title>{`Login — ${theme.name}`}</title>
      </Helmet>

      <PageHeader header="My Account" breadcrumb={breadcrumb} />

      <div className="block">
        <div className="container">
          <div className="row">
            <div className="col-md-6 d-flex">
              <div className="card flex-grow-1 mb-md-0">
                <div className="card-body">
                  <h3 className="card-title">Login</h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmitLogin();
                    }}
                  >
                    <div className="form-group">
                      <label htmlFor="login-email">Email</label>
                      <input
                        id="login-email"
                        required
                        type="text"
                        className="form-control"
                        placeholder="Enter email"
                        name="email"
                        onChange={(event) =>
                          setLoginFormData({
                            ...loginFormData,
                            email: event.target.value,
                          })
                        }
                        value={loginFormData.email || ""}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="login-password">Password</label>
                      <input
                        id="login-password"
                        type="password"
                        required
                        className="form-control"
                        placeholder="Password"
                        name="password"
                        onChange={(event) =>
                          setLoginFormData({
                            ...loginFormData,
                            password: event.target.value,
                          })
                        }
                        value={loginFormData.password || ""}
                      />
                      <small className="form-text text-muted">
                        <a onClick={() => setOpen(true)} href="void:0">
                          Forgotten Password?
                        </a>
                      </small>
                    </div>
                    <div className="form-group">
                      <div className="form-check">
                        <span className="form-check-input input-check">
                          <span className="input-check__body">
                            <input
                              id="login-remember"
                              type="checkbox"
                              className="input-check__input"
                            />
                            <span className="input-check__box" />
                            <Check9x7Svg className="input-check__icon" />
                          </span>
                        </span>
                        <label
                          className="form-check-label"
                          htmlFor="login-remember"
                        >
                          Remember Me
                        </label>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary mt-2 mt-md-3 mt-lg-4"
                    >
                      Login
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* //register */}
            <div className="col-md-6 d-flex mt-4 mt-md-0">
              <div className="card flex-grow-1 mb-0">
                <div className="card-body">
                  <h3 className="card-title">Register</h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleRegistration();
                    }}
                  >
                    <Nav tabs>
                      <NavItem>
                        <NavLink
                          className={classnames({ active: activeTab === "1" })}
                          onClick={() => {
                            toggle("1");
                          }}
                        >
                          General
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames({ active: activeTab === "2" })}
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
                                  setRegisterFormData({
                                    ...registerFormData,
                                    firstName: event.target.value,
                                  })
                                }
                                value={registerFormData.firstName || ""}
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
                                  setRegisterFormData({
                                    ...registerFormData,
                                    lastName: event.target.value,
                                  })
                                }
                                value={registerFormData.lastName || ""}
                              />
                            </div>

                            <div className="form-group col-6">
                              <label htmlFor="phone">Phone No.</label>
                              <input
                                id="phone"
                                type="text"
                                className="form-control"
                                placeholder="Enter Phone No."
                                name="phoneNumber"
                                onChange={(event) =>
                                  setRegisterFormData({
                                    ...registerFormData,
                                    phoneNumber: event.target.value,
                                  })
                                }
                                value={registerFormData.phoneNumber || ""}
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
                                  setRegisterFormData({
                                    ...registerFormData,
                                    taxNumber: event.target.value,
                                  })
                                }
                                value={registerFormData.taxNumber || ""}
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
                                  setRegisterFormData({
                                    ...registerFormData,
                                    gender: event.target.value,
                                  })
                                }
                                value={registerFormData.gender || ""}
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
                                  setRegisterFormData({
                                    ...registerFormData,
                                    customerGroupId: event.target.value,
                                  })
                                }
                                value={registerFormData.customerGroupId || ""}
                              >
                                <option value="" key="">
                                  N/A
                                </option>

                                {customerGroups &&
                                  _.filter(customerGroups, (item) => item.displayOnSite === true).map((item) => (
                                    <option value={item.customerGroupId}>
                                      {item.customerGroupName}
                                    </option>
                                  ))}
                              </select>
                            </div>

                            <div className="form-group col-6">
                              <label htmlFor="register-email">
                                Email address
                              </label>
                              <input
                                id="register-email"
                                required
                                type="email"
                                className="form-control"
                                placeholder="Enter email"
                                onChange={(event) =>
                                  setRegisterFormData({
                                    ...registerFormData,
                                    email: event.target.value,
                                  })
                                }
                                value={registerFormData.email || ""}
                              />
                            </div>

                            <div className="form-group col-6">
                              <label htmlFor="register-password">
                                Password
                              </label>
                              <input
                                required
                                id="register-password"
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                onChange={(event) =>
                                  setRegisterFormData({
                                    ...registerFormData,
                                    password: event.target.value,
                                  })
                                }
                                value={registerFormData.password || ""}
                              />
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
                                setRegisterFormData({
                                  ...registerFormData,
                                  newsletter: event.target.checked,
                                })
                              }
                              checked={registerFormData.newsletter || false}
                            />
                            <p>Subscribe newsletter</p>
                          </div>

                          <div className="form-group w-100 mb-0 d-inline-flex">
                            <input
                              style={{
                                marginRight: 10,
                                height: 22,
                                width: 20,
                              }}
                              id="register-termPolicy"
                              type="checkbox"
                              placeholder="termPolicy"
                              onChange={(event) =>
                                setRegisterFormData({
                                  ...registerFormData,
                                  termPolicy: event.target.checked,
                                })
                              }
                              checked={registerFormData.termPolicy || false}
                            />
                            <p>Agree to terms & condition and privacy policy</p>
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
                                  setRegisterFormData({
                                    ...registerFormData,
                                    shipping: {
                                      ...registerFormData.shipping,
                                      firstName: event.target.value,
                                    },
                                  })
                                }
                                value={
                                  registerFormData.shipping.firstName || ""
                                }
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
                                  setRegisterFormData({
                                    ...registerFormData,
                                    shipping: {
                                      ...registerFormData.shipping,
                                      lastName: event.target.value,
                                    },
                                  })
                                }
                                value={registerFormData.shipping.lastName || ""}
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
                                  setRegisterFormData({
                                    ...registerFormData,
                                    shipping: {
                                      ...registerFormData.shipping,
                                      phone: event.target.value,
                                    },
                                  })
                                }
                                value={registerFormData.shipping.phone || ""}
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
                                  setRegisterFormData({
                                    ...registerFormData,
                                    shipping: {
                                      ...registerFormData.shipping,
                                      email: event.target.value,
                                    },
                                  })
                                }
                                value={registerFormData.shipping.email || ""}
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
                                  setRegisterFormData({
                                    ...registerFormData,
                                    shipping: {
                                      ...registerFormData.shipping,
                                      street: event.target.value,
                                    },
                                  })
                                }
                                value={registerFormData.shipping.street || ""}
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
                                  setRegisterFormData({
                                    ...registerFormData,
                                    shipping: {
                                      ...registerFormData.shipping,
                                      city: event.target.value,
                                    },
                                  })
                                }
                                value={registerFormData.shipping.city || ""}
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
                                  setRegisterFormData({
                                    ...registerFormData,
                                    shipping: {
                                      ...registerFormData.shipping,
                                      state: event.target.value,
                                    },
                                  })
                                }
                                value={registerFormData.shipping.state || ""}
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
                                  setRegisterFormData({
                                    ...registerFormData,
                                    shipping: {
                                      ...registerFormData.shipping,
                                      country: event.target.value,
                                    },
                                  })
                                }
                                value={registerFormData.shipping.country || ""}
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
                                  setRegisterFormData({
                                    ...registerFormData,
                                    shipping: {
                                      ...registerFormData.shipping,
                                      zipCode: event.target.value,
                                    },
                                  })
                                }
                                value={registerFormData.shipping.zipCode || ""}
                              />
                            </div>
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
                                  setRegisterFormData({
                                    ...registerFormData,
                                    billing: {
                                      ...registerFormData.billing,
                                      firstName: event.target.value,
                                    },
                                  })
                                }
                                value={registerFormData.billing.firstName || ""}
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
                                  setRegisterFormData({
                                    ...registerFormData,
                                    billing: {
                                      ...registerFormData.billing,
                                      lastName: event.target.value,
                                    },
                                  })
                                }
                                value={registerFormData.billing.lastName || ""}
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
                                  setRegisterFormData({
                                    ...registerFormData,
                                    billing: {
                                      ...registerFormData.billing,
                                      phone: event.target.value,
                                    },
                                  })
                                }
                                value={registerFormData.billing.phone || ""}
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
                                  setRegisterFormData({
                                    ...registerFormData,
                                    billing: {
                                      ...registerFormData.billing,
                                      email: event.target.value,
                                    },
                                  })
                                }
                                value={registerFormData.billing.email || ""}
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
                                  setRegisterFormData({
                                    ...registerFormData,
                                    billing: {
                                      ...registerFormData.billing,
                                      street: event.target.value,
                                    },
                                  })
                                }
                                value={registerFormData.billing.street || ""}
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
                                  setRegisterFormData({
                                    ...registerFormData,
                                    billing: {
                                      ...registerFormData.billing,
                                      city: event.target.value,
                                    },
                                  })
                                }
                                value={registerFormData.billing.city || ""}
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
                                  setRegisterFormData({
                                    ...registerFormData,
                                    billing: {
                                      ...registerFormData.billing,
                                      state: event.target.value,
                                    },
                                  })
                                }
                                value={registerFormData.billing.state || ""}
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
                                  setRegisterFormData({
                                    ...registerFormData,
                                    billing: {
                                      ...registerFormData.billing,
                                      country: event.target.value,
                                    },
                                  })
                                }
                                value={registerFormData.billing.country || ""}
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
                                  setRegisterFormData({
                                    ...registerFormData,
                                    billing: {
                                      ...registerFormData.billing,
                                      zipCode: event.target.value,
                                    },
                                  })
                                }
                                value={registerFormData.billing.zipCode || ""}
                              />
                            </div>
                          </div>
                        </div>
                      </TabPane>
                    </TabContent>

                    <button
                      type="submit"
                      disabled={!registerFormData.termPolicy || false}
                      className="btn btn-primary mt-2 mt-md-3 mt-lg-4"
                    >
                      Register
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
