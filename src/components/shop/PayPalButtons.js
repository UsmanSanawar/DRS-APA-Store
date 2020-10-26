import React from "react";
import ReactDOM from "react-dom";
import scriptLoader from "react-async-script-loader";
import Spinner from "../../assets/loaders/index";
import PaymentSuccess from "../../assets/imgs/imagesuccessful.png";
import { Link } from "react-router-dom";

const CLIENT = {
    sandbox: "Ac43TGQt3nINl_4vGPrtvaM7IDXD8kMe5PWENT7xAPLclAUbq-m0Fk_2PU-2YjPgKq6NzwJv5vatxBKm",
      production:"Ac43TGQt3nINl_4vGPrtvaM7IDXD8kMe5PWENT7xAPLclAUbq-m0Fk_2PU-2YjPgKq6NzwJv5vatxBKm"
};

const CLIENT_ID =
    process.env.NODE_ENV === "production" ? CLIENT.production : CLIENT.sandbox;

let PayPalButton = null;
class PaypalButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showButtons: false,
            loading: true,
            paid: false
        };

        window.React = React;
        window.ReactDOM = ReactDOM;
    }

    componentDidMount() {
        const { isScriptLoaded, isScriptLoadSucceed } = this.props;

        if (isScriptLoaded && isScriptLoadSucceed) {
            PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });
            this.setState({ loading: false, showButtons: true });
        }
    }

    componentWillReceiveProps(nextProps) {
        const { isScriptLoaded, isScriptLoadSucceed } = nextProps;

        const scriptJustLoaded =
            !this.state.showButtons && !this.props.isScriptLoaded && isScriptLoaded;

        if (scriptJustLoaded) {
            if (isScriptLoadSucceed) {
                PayPalButton = window.paypal.Buttons.driver("react", {
                    React,
                    ReactDOM
                });
                this.setState({ loading: false, showButtons: true });
            }  else this.props.onError()
        } 
    }

    createOrder = (data, actions) => {
        console.log(data, 'createOrder' ,actions);
        return actions.order.create({
            purchase_units: [
                {
                    description: + "Cart items",
                    amount: {
                        currency_code: "USD",
                        value: this.props.total
                    }
                }
            ]
        });
    };

    onApprove = (data, actions) => {
        console.log(data, 'onApprove' ,actions);

        actions.order.capture().then(details => {
            console.log(details, "orderDetails")
            const paymentData = {
                payerID: data.payerID,
                orderID: data.orderID
            };
            console.log("Payment Approved: ", paymentData);
            this.setState({ showButtons: false, paid: true });
            if (details.status === "COMPLETED") {
                this.props.handleSubmitCheckout(paymentData.orderID)
            }
        });
    };

    postSaleOrderOnce = (function() {
        var executed = false;
        return function() {
            if (!executed) {
                executed = true;
                // this.props.handleSubmitCheckout()

            }
        };
    })();

    render() {
        const { showButtons, loading, paid } = this.state;

        return (
            <div className="main">
                {loading && <div style={{textAlign: "center"}}><Spinner /></div>}

                {showButtons && (
                    <div>
                        <PayPalButton
                            createOrder={(data, actions) => this.createOrder(data, actions)}
                            onApprove={(data, actions) => this.onApprove(data, actions)}
                        />
                    </div>
                )}

                {paid && (
                    <div className="main">
                        <img alt="payment-success" style={{width: "100%"}} src={PaymentSuccess} />
                        <div style={{textAlign: "center"}}>
                        <Link to="/store" className="btn btn-sm btn-success mx-auto">Continue Shopping</Link>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default scriptLoader(`https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}`)(PaypalButton);