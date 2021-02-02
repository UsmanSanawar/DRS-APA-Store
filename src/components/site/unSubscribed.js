import React, { useEffect } from "react";
import { Button, Card, CardText, CardTitle } from "reactstrap";
function UnsubscribePage(props) {
  useEffect(() => {}, []);

  return (
    <div style={{height: '100%', width: '100%', overflow: "hidden", display: "grid"}}>
      <Card body style={{margin: "auto"}}>
        <div className="p-c-s-icon">
          <i class="fa fa-newspaper"></i>
        </div>

        <CardTitle tag="h2" className="p-c-heading">
          Un-Subscribed Newsletter
        </CardTitle>
        <CardText className="p-c-description">
          You have successfully unsubscribed from newsletter list.
          <br />
          <br />
          <div className="text-left">
            If you want to subscribe again please follow the steps:
            <ul className="pl-2">
              <li>
                Go to our website and enter your email in newsletter and
                subscribe.
              </li>
              <li>
                Login into your account page and check the subscribe newsletter
                box.
              </li>
            </ul>
          </div>
        </CardText>
        <Button href="/" outline color="success" className="p-c-button">
          Go to Store
        </Button>
      </Card>
    </div>
  );
}
export default UnsubscribePage;
