import React, { useEffect, useState } from "react";
import { Button, Card, CardText, CardTitle } from "reactstrap";
function UnsubscribePage(props) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = () => {
    
  };

  return (
    <div>
      <Card body style={{marginTop: "40%", marginBottom: "60%"}}>
        <CardTitle tag="h4" className="p-c-heading">
        <i style={{color: "#28a745"}} class="fa fa-key" /> Enter New Password
        </CardTitle>
        
        <CardText className="p-c-description">
          <div className="form-row justify-content-center col-12">
            <div className="w-75">
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
            </div>

            </div>
            <div>
              <input
                onClick={handlePasswordChange}
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
