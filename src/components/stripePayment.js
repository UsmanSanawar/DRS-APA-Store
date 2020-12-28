import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { BASE_URL } from "../constant/constants";
import { Button } from "reactstrap";
import { toast } from "react-toastify";
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  "pk_test_51HqwzDEvvQEaMZFUjzxUWggi1d2X64e2EuIeyhM8I8cfOQx8xo4r3ZoodWyrhZKiDVECYQjagws5tbNfjquXLvDd00Eqqk2nkN"
);

function App(props) {
  const handleClick = async (orderId) => {
    // Get Stripe.js instance
    const stripe = await stripePromise;
    const response = await fetch(
      `${BASE_URL}/api/Store/masterdata/StoreSaleOrders/create-checkout-session-by-id/${orderId}`,
      { method: "POST" }
    );
    if (response) {
      const session = await response.json();

      // When the customer clicks on the button, redirect them to Checkout.
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        toast.error("Error in Stripe API.")
        props.handleSubmitLoading(false)
      }
    }
  };

  useEffect(() => {

    if (props.order.orderId) {
      handleClick(props.order.orderId);
    }
  }, [props.order]);

  return (
    <Button
      type="submit"
      outline
      color="info"
      size="lg"
      disabled={props.termNcondition}
      block
    >
      <i className="fas fa-credit-card m-r-10"></i> Debit / Credit Card
    </Button>
  );
}
export default App;
