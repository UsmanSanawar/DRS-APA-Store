import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {BASE_URL} from "../constant/constants"
import {Button} from "reactstrap"
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_6awA8Z1Thz08dGIG0blDxRZ900nlIQurIk');

function App(props) {
  const handleClick = async (event) => {
    // Get Stripe.js instance
    const stripe = await stripePromise;
    const response = await fetch(`${BASE_URL}/api/DRS.APA/masterdata/SaleOrders/create-checkout-session-by-id/${props.order.orderId}`, {method: 'POST'});
    if(response){
      const session = await response.json();
      // When the customer clicks on the button, redirect them to Checkout.
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
  
      if (result.error) {

      }
    }
  };


  return (
  <Button onClick={handleClick} outline color="info" size="lg" block><i className="fas fa-credit-card m-r-10"></i>{" "} Debit / Credit Card</Button>
  );
}
export default App