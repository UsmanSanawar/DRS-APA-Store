import React,{useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import {Card, CardTitle, CardText, Button} from "reactstrap"
import { resetCartPaid } from '../../store/cart';
import RestService from '../../store/restService/restService';
function App(props) {

const [sessionId, setsessionId] = useState(null)
const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetCartPaid())

    if(props.match && props.match.params && props.match.params.sessionId){
      setsessionId(props.match.params.sessionId)
      RestService.postSaleOrderConvertion(props.match.params.sessionId);
    }   
 
  }, [])

  return (
    <div>
      <Card body>
        <div className="p-c-s-icon">
        <i class="fas fa-check-circle"></i>
        </div>
            
          <CardTitle tag="h2" className="p-c-heading">Payment Successful</CardTitle>
          <CardText className="p-c-description">
            Thank you! Your payment is complete and your payment reference is : {sessionId}
          </CardText>
          <Button href="/" outline color="success" className="p-c-button">Go to Home</Button>
        </Card>
    </div>
  );
}
export default App