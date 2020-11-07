import React, { useMemo } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  Elements,
} from '@stripe/react-stripe-js';
import useResponsiveFontSize from "./useResponsiveFontSize";
import "./style.css";


const stripePromise = loadStripe('pk_test_6awA8Z1Thz08dGIG0blDxRZ900nlIQurIk');


const useOptions = () => {
  const fontSize = useResponsiveFontSize();
  const options = useMemo(
    () => ({
      style: {
        base: {
          fontSize,
          color: "#424770",
          letterSpacing: "0.025em",
          display: 'block',
          fontFamily: "Source Code Pro, monospace",
          "::placeholder": {
            color: "#aab7c4"
          },
        },
        invalid: {
          color: "#9e2146"
        }
      }
    }),
    [fontSize]
  );

  return options;
};

const SplitForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const options = useOptions();

  const handleSubmit = async event => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardNumberElement)
    }).then(function (result) {
      console.log(result, 'result');
      if (!result.error) {
        console.log(result.paymentMethod, 'result.paymentMethod');

        var paymentRequest = stripe.paymentRequest({
          country: 'US',
          currency: 'usd',
          total: {
            label: 'Demo total',
            amount: 1000,
          },
          requestPayerName: true,
          requestPayerEmail: true,
        });

        console.log(paymentRequest, 'paymentRequest');

        stripe
          .handleCardPayment('sk_test_zP6oE2wlbpaT39EQsqPNQGMn00VQlIJP4H', elements.getElement(CardNumberElement), {
            payment_method_data: {
              billing_details: {
                name: 'Jenny Rosen',
              },
            },
          })
          .then(function (result) {
            console.log(result, 'reslut of success');
            
            // Handle result.error or result.paymentIntent
          }).catch(err =>{
            console.log(err, 'error while success');
            
          })

        // paymentRequest.canMakePayment().then(result => {
        //   console.log('canMakePayment',result );
        //   // paymentRequest.show();
        // })
      }
      // Handle result.error or result.paymentMethod
    }).catch(err => {
      console.log(err, 'error while payment');

    })


  };

  return (
    <form onSubmit={handleSubmit} className="payment-card-form">
      <label>
        Card number
        <CardNumberElement
          options={options}
          onReady={() => {
            console.log("CardNumberElement [ready]");
          }}
          onChange={event => {
            console.log("CardNumberElement [change]", event);
          }}
          onBlur={() => {
            console.log("CardNumberElement [blur]");
          }}
          onFocus={() => {
            console.log("CardNumberElement [focus]");
          }}
        />
      </label>
      <label>
        Expiration date
        <CardExpiryElement
          options={options}
          onReady={() => {
            console.log("CardNumberElement [ready]");
          }}
          onChange={event => {
            console.log("CardNumberElement [change]", event);
          }}
          onBlur={() => {
            console.log("CardNumberElement [blur]");
          }}
          onFocus={() => {
            console.log("CardNumberElement [focus]");
          }}
        />
      </label>
      <label>
        CVC
        <CardCvcElement
          options={options}
          onReady={() => {
            console.log("CardNumberElement [ready]");
          }}
          onChange={event => {
            console.log("CardNumberElement [change]", event);
          }}
          onBlur={() => {
            console.log("CardNumberElement [blur]");
          }}
          onFocus={() => {
            console.log("CardNumberElement [focus]");
          }}
        />
      </label>
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>

  );
};


const App = () => (
  <Elements stripe={stripePromise}>
    <SplitForm />
  </Elements>
);

export default App