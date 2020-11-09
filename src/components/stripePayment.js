import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {BASE_URL} from "../constant/constants"
import {Button} from "reactstrap"
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_6awA8Z1Thz08dGIG0blDxRZ900nlIQurIk');

function App() {
  const handleClick = async (event) => {
    // Get Stripe.js instance
    const stripe = await stripePromise;

    // Call your backend to create the Checkout Session
    const response = await fetch(`${BASE_URL}/api/DRS.APA/masterdata/SaleOrders/create-checkout-session`, {method: 'POST'});

    console.log(response, 'response is the');
    if(response){
      const session = await response.json();

      console.log(response, 'repose session', session);
      
      // When the customer clicks on the button, redirect them to Checkout.
      console.log(session.id, 'session.client_secret');
      
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
  
      console.log(result, 'resout. sd');
      
      if (result.error) {
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `result.error.message`.
      }
    }

  };

  return (
  <Button onClick={handleClick} outline color="info" size="lg" block><i className="fas fa-credit-card m-r-10"></i>{" "} Debit / Credit Card</Button>
  );
}
export default App