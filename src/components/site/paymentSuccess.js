import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Card, CardText, CardTitle } from "reactstrap";
import { resetCartPaid } from "../../store/cart";
function App(props) {
  const [sessionId, setsessionId] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetCartPaid());
    let uri = window.location.hash.split("/")[3];

    setsessionId(uri);
  }, []);

  return (
    <div>
      <Card body>
        <div className="p-c-s-icon">
          <i class="fas fa-check-circle"></i>
        </div>

        <CardTitle tag="h2" className="p-c-heading">
          Payment Successful
        </CardTitle>
        <CardText className="p-c-description">
          Thank you! Your payment is complete and your payment reference is :{" "}
          {sessionId}
        </CardText>
        <Button href="/" outline color="success" className="p-c-button">
          Go to Home
        </Button>
      </Card>
    </div>
  );
}
export default App;
