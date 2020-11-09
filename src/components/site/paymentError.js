import React from 'react';
import {Card, CardTitle, CardText, Button} from "reactstrap"
function App() {

  return (
    <div>
      <Card body>
        <div className="p-c-e-icon">
        <i class="far fa-times-circle"></i>
        </div>
            
          <CardTitle tag="h2" className="p-c-heading">Sorry Payment Failed</CardTitle>
          <CardText className="p-c-description">
            Please Try a different payment method
          </CardText>
          <Button outline color="primary" className="p-c-button">Try again</Button>
        </Card>
    </div>
  );
}
export default App