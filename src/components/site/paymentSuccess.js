import React from 'react';
import {Card, CardTitle, CardText, Button} from "reactstrap"
function App() {

  return (
    <div>
      <Card body>
        <div className="p-c-s-icon">
        <i class="fas fa-check-circle"></i>
        </div>
            
          <CardTitle tag="h2" className="p-c-heading">Payment Successful</CardTitle>
          <CardText className="p-c-description">
            Thank you! Your payment is complete and your payment reference is : XXXXX
          </CardText>
          <Button href="/" outline color="success" className="p-c-button">Go to Home</Button>
        </Card>
    </div>
  );
}
export default App