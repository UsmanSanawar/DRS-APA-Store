import React, { Component } from "react";
import { Helmet } from "react-helmet";
import PageHeader from "../shared/PageHeader";
import theme from "../../data/theme";
import Collapse from "../shared/Collapse";
import payments from "../../data/shopPayments";
import PayPalButtons from "./PayPalButtons";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Currency from "../shared/Currency";
import { Redirect } from "react-router-dom";
import StripPayment from "../stripePayment";
import RestService from "../../store/restService/restService";
class paymentOptionsPage extends Component {
  payments = payments;

  constructor(props) {
    super(props);
    this.state = {
      order: {},
      payment: "stripe",
      showPaypal: false,
      hideButton: false,
      paid: false,
    };
  }

  handlePaymentChange = (event) => {
    if (event.target.checked) {
      this.setState({
        payment: event.target.value,
        hideButton: false,
        showPaypal: false,
      });
    }
  };

  renderPaymentsList() {
    const { payment: currentPayment } = this.state;

    const payments = this.payments.map((payment) => {
      const renderPayment = ({ setItemRef, setContentRef }) => (
        <li className="payment-methods__item" ref={setItemRef}>
          <label className="payment-methods__item-header">
            <span className="payment-methods__item-radio input-radio">
              <span className="input-radio__body">
                <input
                  type="radio"
                  className="input-radio__input"
                  name="checkout_payment_method"
                  value={payment.key}
                  checked={currentPayment === payment.key}
                  onChange={this.handlePaymentChange}
                />
                <span className="input-radio__circle" />
              </span>
            </span>
            <span className="payment-methods__item-title">{payment.title}</span>
          </label>
          <div className="payment-methods__item-container" ref={setContentRef}>
            <div className="payment-methods__item-description text-muted">
              {payment.description}
            </div>
          </div>
        </li>
      );

      return (
        <Collapse
          key={payment.key}
          open={currentPayment === payment.key}
          toggleClass="payment-methods__item--active"
          render={renderPayment}
        />
      );
    });

    return (
      <div className="payment-methods">
        <ul className="payment-methods__list">{payments}</ul>
      </div>
    );
  }

  showPaymentButtons = () => {
    if (this.state.payment === "paypal") {
      this.setState({
        showPaypal: true,
        hideButton: true,
      });
    }
  };

  handlePaid = (event) => {
    if (event) {
      this.setState({
        order: [],
      });

      this.props.history.push("/store");
    }
  };

  componentDidMount() {
    this.getSetOrder();
  }

  getSetOrder = () => {
    let orderId =
      this.props.match.params && this.props.match.params.orderId
        ? this.props.match.params.orderId
        : null;
    if (orderId !== null && orderId !== 0) {
      RestService.getOrderById(orderId).then((res) => {
        if (res.data.data && res.data.data !== null) {
          this.setState({
            order: res.data.data,
          });
        }
      });
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props.match !== prevProps.match) {
      this.getSetOrder();
    }
  }

  render() {
    const breadcrumb = [
      { title: "Home", url: "" },
      { title: "Shopping Cart", url: "/store/cart" },
      { title: "Payment Cashier", url: "" },
    ];

    return (
      <div>
        <React.Fragment>
          <Helmet>
            <title>{`Payment Cashier — ${theme.name}`}</title>
          </Helmet>

          <PageHeader header="Payment Cashier" breadcrumb={breadcrumb} />

          <div className="checkout block">
            <div className="container">
              <div className="row">
                <div className="col-6">
                  <h2 className="mr-auto">Payment Cashier</h2>
                </div>

                <div className="col-6 text-right">
                  <h2>
                    <Currency
                      value={this.state.order.orderAmountWithTaxAndDiscount}
                    />
                  </h2>
                </div>
              </div>

              <div className="row py-5">
                <div className="col-6">{this.renderPaymentsList()}</div>

                <div className="col-6">
                  {this.state.payment === "paypal" ? (
                    <PayPalButtons
                      handleSubmitCheckout={this.handleSubmitCheckout}
                      total={this.state.order.orderAmountWithTaxAndDiscount}
                      currency={
                        JSON.parse(localStorage.getItem("state")).currency
                      }
                      handlePaid={this.handlePaid}
                    />
                  ) : null}

                  {this.state.payment === "stripe" && (
                    <StripPayment order={this.state.order} />
                  )}
                </div>
              </div>

              <div className="row"></div>
            </div>
          </div>
        </React.Fragment>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

const mapStateToProps = (state) => ({
  cart: state.cart,
});

export default connect(mapStateToProps, mapDispatchToProps)(paymentOptionsPage);
