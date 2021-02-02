import React from "react";
import { Card, CardText, CardTitle } from "reactstrap";

function ReciveEmail() {

  return (
    <div>
      <Card body>
        <div className="p-c-s-icon">
          <i className="far fa-envelope" />
        </div>

        <CardTitle tag="h2" className="p-c-heading">
          Check your email inbox
        </CardTitle>
        <CardText className="p-c-description">
          Your account has been created successfully and an email with activation link has been sent to your email address.
        </CardText>
        <div className="text-center">
          <a href="#/store/login" className="btn btn-success">Go to Login</a>
        </div>
      </Card>
    </div>
  );
}

export default ReciveEmail;
