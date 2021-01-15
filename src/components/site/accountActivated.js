import React from "react";
import {Card, CardText, CardTitle} from "reactstrap";

function App(props) {
  return (
    <div>
      <Card body style={{marginTop: "25%", marginBottom: "25%"}}>
        <div className="p-c-s-icon">
          <i className="fas fa-user"/>
        </div>

        <CardTitle tag="h2" className="p-c-heading">
          Account Activated
        </CardTitle>
        <CardText className="p-c-description">
          Congrats! Your account is now activated you can now login to your account.
        </CardText>
      </Card>
    </div>
  );
}

export default App;
