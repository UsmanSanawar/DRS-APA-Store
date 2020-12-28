// react
import React, { useState } from "react";

// third-party
import { Helmet } from "react-helmet";
import { Redirect } from "react-router-dom";
import { toast } from "react-toastify";

// data stubs
import theme from "../../data/theme";
import RestService from "../../store/restService/restService";

export default function AccountPagePassword(props) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = () => {
    try {
    if(oldPassword !== ""){  RestService.verifyOldPassword(oldPassword).then((res) => {
        if (res.data.toLowerCase() === "success") {
          if (
            newPassword !== "" &&
            confirmPassword !== "" &&
            newPassword === confirmPassword
          ) {
            RestService.changePassword(confirmPassword).then((res) => {
              toast[res.data.status](res.data.message)
            });
          } else {
            toast.info("Please enter both new and confirm password.");
          }
        } else {
          toast.error("Invalid old password.");
        }
      });
    
    
    } else {toast.error("Old password cannot be empty.")}
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="card">
      <Helmet>
        <title>{`Change Password — ${theme.name}`}</title>
      </Helmet>

      <div className="card-header">
        <h5>Change Password</h5>
      </div>
      <div className="card-divider" />
      <div className="card-body">
        <div className="row no-gutters">
          <div className="col-12 col-lg-7 col-xl-6">
            <div className="form-group">
              <label htmlFor="password-current">Old Password</label>
              <input
                type="password"
                className="form-control"
                id="password-current"
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter old password"
              />
              {oldPassword === "" && (
                <small className="text-danger">Enter old password.</small>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="password-new">New Password</label>
              <input
                type="password"
                className="form-control"
                id="password-new"
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password-confirm">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                id="password-confirm"
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Enter confirm password"
              />
              {newPassword !== "" && newPassword !== confirmPassword ? (
                <small className="text-danger">
                  Password and Confirm password do not match.
                </small>
              ) : null}
            </div>

            <div className="form-group mt-5 mb-0">
              <button
                onClick={handlePasswordChange}
                type="button"
                className="btn btn-primary"
              >
                Change
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
