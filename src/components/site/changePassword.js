import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Card, CardText, CardTitle } from "reactstrap";
import RestService from "../../store/restService/restService";

function UnsubscribePage(props) {
  const [newPassword, setNewPassword] = useState("");
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
    if (activationCode !== "" && confirmPassword !== newPassword) {
      let data = {
        password: newPassword,
        activationCode: activationCode,
      };
      RestService.changePasswordAfterEmail(data).then((res) => {
        toast[res.data.status](res.data.message);
        if (res.data.status === "success") {
          return props.history.push("/store/login");
        }
      });
    } else {
      toast.error("Activaation code not valid or password do not match.");
    }
  };

  return (
    <div>
      <Card body style={{ marginTop: "40%", marginBottom: "60%" }}>
        <CardTitle tag="h4" className="p-c-heading">
          <i style={{ color: "#28a745" }} class="fa fa-key" /> Enter New
          Password
        </CardTitle>

        <CardText className="p-c-description">
          <div className="form-row justify-content-center col-12">
            <div style={{ width: "85%" }}>
              <div className="mb-3 w-100">
                <input
                  type="password"
                  className="form-control"
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter New Password"
                />
              </div>

              <div className="mb-3 w-100">
                <input
                  type="password"
                  className="form-control"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                />
                {newPassword && newPassword !== confirmPassword && (
                  <p>
                    <small>Both passwords don't match</small>
                  </p>
                )}
              </div>
            </div>
            <div>
              <input
                onClick={() => {
                  handlePasswordChange();
                  setSubmitted(true);
                }}
                disabled={submitted}
                type="button"
                value="Change"
                className="btn btn-sm btn-success"
              />
            </div>
          </div>
        </CardText>
      </Card>
    </div>
  );
}
export default UnsubscribePage;
