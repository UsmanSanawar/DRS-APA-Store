// react
import React, { useEffect, useState } from "react";

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

export default function AccountPageLogin(props) {
  const breadcrumb = [
    { title: "Home", url: "" },
    { title: "My Account", url: "" },
  ];

  useEffect(() => {
    if (localStorage.getItem('token') && isTokenValid(localStorage.getItem('token'))) {
        return props.history.goBack()
    }
  }, [])

  const [loginFormData, setLoginFormData] = useState({});

  const handleSubmitLogin = () => {
    RestService.userAuthenticate(loginFormData).then(r => {
        if (r.data.token) {
            localStorage.setItem('token', JSON.stringify(r.data.token));
            toast.success("User authenticated");

            setLoginFormData({})
            return props.history.push('/store');

        } else {
            toast.error("Invald credentials")    
        }
    })
  };

  const [registerFormData, setRegisterFormData] = useState({});

  const handleRegistration = () => {
    console.log(registerFormData);
    registerFormData.isActive = true;
    RestService.userregistration(registerFormData).then(res => {
        toast[res.data.status](res.data.message)

        setRegisterFormData({})
    })

  };

  return (
    <React.Fragment>
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
                  <form onSubmit={(e) => {e.preventDefault(); handleSubmitLogin()}}>
                    <div className="form-group">
                      <label htmlFor="login-email">Username</label>
                      <input
                        id="login-email"
                        required
                        type="text"
                        className="form-control"
                        placeholder="Enter Username"
                        name="username"
                        onChange={(event) =>
                          setLoginFormData({
                            ...loginFormData,
                            username: event.target.value,
                          })
                        }
                        value={loginFormData.username || ""}
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
                        <Link to="/">Forgotten Password</Link>
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
                  <form onSubmit={(e) => {e.preventDefault(); handleRegistration();}}>
                    <div className="form-group">
                      <label htmlFor="name">Name</label>
                      <input
                        id="name"
                        required
                        type="text"
                        className="form-control"
                        placeholder="Enter name"
                        name="name"
                        onChange={(event) =>
                          setRegisterFormData({
                            ...registerFormData,
                            name: event.target.value,
                          })
                        }
                        value={registerFormData.name || ""}
                      />
                    </div>
                    <div className="form-group">
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
                    <div className="form-group">
                      <label htmlFor="register-email">Email address</label>
                      <input
                        id="register-email"
                        required
                        type="emailAddress"
                        className="form-control"
                        placeholder="Enter email"
                        onChange={(event) =>
                          setRegisterFormData({
                            ...registerFormData,
                            emailAddress: event.target.value,
                          })
                        }
                        value={registerFormData.emailAddress || ''}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="register-password">Password</label>
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
                    <button
                      type="sumbit"
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
