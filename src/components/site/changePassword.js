import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Card, CardText, CardTitle, Spinner } from "reactstrap";
import RestService from "../../store/restService/restService";

function ChangePassword(props) {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [activationCode, setActivationCode] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let uri = window.location.href;
    uri = uri.split("?")[1];
    if (uri !== "") {
      setActivationCode(uri);
    }
  }, []);

  const handlePasswordChange = () => {
    if (activationCode !== "" && confirmPassword === newPassword) {
      let data = {
        password: newPassword,
        activationCode: activationCode,
      };
      setLoading(true);
      RestService.changePasswordAfterEmail(data).then((res) => {
        toast[res.data.status](res.data.message);
        setLoading(false);

        if (res.data.status === "success") {
          return props.history.push("/store/login");
        } else {
          toast.error("Link is expired");
        }
      });
    } else {
      toast.error("Activation code not valid or password do not match.");
    }
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        overflow: "hidden",
        display: "grid",
      }}
    >
      <Card body style={{ width: "fit-content", margin: "auto" }}>
        <CardTitle tag="h4" className="p-c-heading">
          <i style={{ color: "#28a745" }} class="fa fa-key" /> Enter New
          Password
        </CardTitle>

        <CardText className="p-c-description">
          <div className="form-row justify-content-center col-12">
            <div style={{ width: "85%" }}>
              <div className="mb-3 col-md-12 w-100">
                <input
                  type="password"
                  className="form-control"
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter New Password"
                />
              </div>

              <div className="mb-3 col-md-12 w-100">
                <input
                  type="password"
                  className="form-control"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                />
                {newPassword && newPassword !== confirmPassword && (
                  <p>
                    <small style={{ float: "left" }} className="text-danger">
                      *Both passwords don't match
                    </small>
                  </p>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                {loading ? (
                  <div className="col-12 text-center">
                    <Spinner />
                  </div>
                ) : (
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      if (
                        newPassword !== "" &&
                        newPassword === confirmPassword
                      ) {
                        handlePasswordChange();
                        setSubmitted(true);
                      } else if (newPassword === "") {
                        toast.error("Please enter password.");
                      }
                    }}
                    disabled={submitted}
                  >
                    {"Change Password"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </CardText>
      </Card>
    </div>
  );
}

export default ChangePassword;
