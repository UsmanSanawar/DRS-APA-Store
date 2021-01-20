import React, { useEffect } from "react";
import { Card, CardText, CardTitle } from "reactstrap";
import RestService from "../../store/restService/restService";

function App(props) {

  useEffect(() => {
    let x = window.location.href.split("?");
    let activationCode = x.length > 1 ? x[1] : null;

    RestService.activateCustomerByCode(activationCode);
    RestService.activateUserByCode(activationCode);
  }, []);

  return (
    <div>
      <Card body style={{ marginTop: "25%", marginBottom: "25%" }}>
        <div className="p-c-s-icon">
          <i className="fas fa-user" />
        </div>

        <CardTitle tag="h2" className="p-c-heading">
          Account Activated
        </CardTitle>
        <CardText className="p-c-description">
          Congrats! Your account is now activated you can now login to your
          account. 
        </CardText>
      </Card>
    </div>
  );
}

export default App;
