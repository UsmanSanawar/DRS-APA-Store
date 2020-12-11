/* eslint-disable react/no-direct-mutation-state */
// react
import React, { Component } from "react";

// third-party
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

// application
import Collapse from "../shared/Collapse";
import Currency from "../shared/Currency";
import PageHeader from "../shared/PageHeader";
import { Check9x7Svg } from "../../svg";

// data stubs
import payments from "../../data/shopPayments";
import theme from "../../data/theme";
import { getAllCountries } from "../../store/webView";
import { postSaleOrder, resetCartPaid } from "../../store/cart";
import { toast } from "react-toastify";
import PayPalButtons from "./PayPalButtons";
import StripPayment from "../stripePayment";
import _ from "lodash";
import RestService from "../../store/restService/restService";
import {
  ConstCustomerGroupId,
  ConstCustomerId,
} from "../../constant/constants";

const initAddr = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  street: "",
  companyName: "",
  city: "",
  state: "",
  country: "",
  zipCode: "",
  latitude: "",
  longitude: "",
};

class ShopPageCheckout extends Component {
  payments = payments;
  deliveryTimeOptions = [
    { label: "Next Day", value: "nextDay" },
    { label: "Next Day by 12", value: "nextDayBy12" },
    { label: "Next Day by 9.30", value: "nextDayBy930" },
    { label: "Saturday by 12 non", value: "saturdayBy12Noon" },
  ];
  deliveryCharges;

  constructor(props) {
    super(props);

    this.state = {
      payment: "",
      formValues: {
        billing: { ...initAddr, addressType: "billing" },
        shipping: { ...initAddr, addressType: "shipping" },
      },
      orderNote: "",
      showPaypal: false,
      total: 0,
      currency: {},
      termNcondition: false,
      orderState: {},
    };
  }

  showPaypalButtons = () => {
    if (this.state.payment === "paypal") {
      this.setState({ showPaypal: true });
    }
  };

  componentDidMount() {
    this.props.getAllCountries();
    this.getUkBarrierDeliveryPrices();
    this.getCourierChargesPrices();
    let total = JSON.parse(localStorage.getItem("state")).cart.total
      ? JSON.parse(localStorage.getItem("state")).cart.total
      : 0;
    let currency = JSON.parse(localStorage.getItem("state")).currency;

    this.setState({
      total: total,
      currency: currency,
    });
  }

  getUkBarrierDeliveryPrices = () => {
    RestService.getUkBarrierDeliveryPrices().then((res) => {
      
      this.deliveryCharges = _.get(res, 'data.data');
      console.log("====uk delivery===", this.deliveryCharges);
    },
    (err) =>{
      console.log("====err===", err);
    });
  };

  getCourierChargesPrices = () => {
    RestService.getCourierChargesPrices().then((res) => {
      console.log("====getCourierChargesPrices===", res);
    },
    (err) =>{
      console.log("====err===", err);
    });
  };

  // componentDidUpdate(prevProps, prevState) {

  // 	if (prevProps.cart.orderId !== this.props.cart.orderId) {
  // 				return <Redirect to={{
  // 					pathname: `/store/payments-cashier/${this.props.cart.orderId}`,
  // 					state: { order: this.props.cart.orderId }
  // 				}} />
  // 	}
  // }

  handleSubmitCheckout = (event) => {
    event.preventDefault();
    // if(!this.props.authUser || this.props.authUser == null || this.props.authUser == null){
    // 	userManager.signinRedirect();
    // }else{
    let saleOrder = {
      orderId: null,
      orderIdentifier: "",
      isOnlineOrder: false,
      isPaymentOnline: false,
      customerId: ConstCustomerId,
      onlinePaymentId: "",
      orderDate: new Date().toISOString().slice(0, 20),
      orderDueDate: null,
      isCancelled: false,
      cancelReason: "",
      orderAmountWithTaxAndDiscount: this.props.cart.total,
      orderNotes: this.state.orderNote,
      orderStatusId: 24,
      isActive: true,
      orderAddress: [],
      orderLines: [],
      orderStatusCode: "",
    };

    let shipping = { ...this.state.formValues.shipping };
    shipping.addressType = "shipping";
    shipping.orderAddressId = null;

    let billing = { ...this.state.formValues.billing };
    billing.orderAddressId = null;
    billing.addressType = "billing";

    saleOrder.orderAddress.push(shipping);
    saleOrder.orderAddress.push(billing);
    for (let item of this.props.cart.items) {
      let discountThatMayApply = [];
      let product = item.product;
      product.discountProducts.map((p) => {
        p.discount.discountCustomerGroups !== undefined &&
          p.discount.discountCustomerGroups !== null &&
          p.discount.discountCustomerGroups.map((discountGroup) => {
            if (discountGroup.customerGroupId === ConstCustomerGroupId) {
              discountThatMayApply.push({
                discountId: p.discount.discountId,
                discountName: p.discount.name,
                discountPercentage: p.discount.discountPercentage,
              });
            }
          });
      });

      let appliedDiscount = _.maxBy(
        discountThatMayApply,
        (obj) => obj.discountPercentage
      );

      let line = {
        orderId: 0,
        orderLinesId: null,
        discountId: appliedDiscount.discountId || null,
        discountName: appliedDiscount.discountName || "",
        discountPercentage: appliedDiscount.discountPercentage || 0,
        isActive: true,
        isProductReturn: false,
        orderLineProductOptions: [],
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        returnReason: "",
        taxClassId: null,
        taxClassName: "",
        taxPercentage: 0,
        unitPrice: item.price,
        orderLineTaxRates: [],
      };

      if (
        item.product.selectedProductOption &&
        item.product.selectedProductOption.productId
      ) {
        let SelectedProduct = { ...item.product.selectedProductOption };
        SelectedProduct.orderLineProductOptionsId = 0;
        SelectedProduct.productOptionCombination = [];
        SelectedProduct.optionModel = SelectedProduct.optionModel
          ? SelectedProduct.optionModel
          : "";

        line.orderLineProductOptions = [SelectedProduct];
      }

      if (item.rates && item.rates.length > 0) {
        let taxratesArray = [];

        console.log(item.rates, "sdasdsadsadsadasd");
        for (const rate of item.rates) {
          taxratesArray.push({
            orderLineTaxRateId: 0,
            orderLineTaxRateName: rate.taxRateName,
            orderTaxRate: rate.rate,
            orderLineTaxRateCode: rate.taxRateCode,
            orderLinesId: null,
          });
        }

        line.orderLineTaxRates = taxratesArray;
      }

      saleOrder.orderLines.push(line);
    }
    if (this.props.cart.items.length < 1) {
      toast.error("Cart is empty");
    } else {
      RestService.postSaleOrder(saleOrder).then(
        (r) =>
          r.data.status === "success" &&
          this.setState({ orderState: r.data.data })
      );
    }
  };
  // }

  handleAddressToggle = (event) => {
    if (event) {
      if (event.target.checked) {
        this.state.formValues.shipping = this.state.formValues.billing;
      } else {
        this.state.formValues.shipping = initAddr;
      }

      this.setState({
        formValues: this.state.formValues,
      });
    }
  };

  handleChangeInput = (event, addressType = "billing") => {
    if (event) {
      let name = event.target.name;
      name = name.replace("shipping-", "");
      // eslint-disable-next-line react/no-direct-mutation-state
      this.state.formValues[addressType][name] = event.target.value;

      this.setState({ formValues: this.state.formValues });
    }
  };

  handlePaymentChange = (event) => {
    if (event.target.checked) {
      this.setState({ payment: event.target.value });
    }
  };

  renderTotals() {
    const { cart } = this.props;

    if (cart.extraLines.length <= 0) {
      return null;
    }

    const extraLines = cart.extraLines.map((extraLine, index) => (
      <tr key={index}>
        <th>{extraLine.title}</th>
        <td>
          <Currency value={extraLine.price} />
        </td>
      </tr>
    ));

    return (
      <React.Fragment>
        <tbody className="checkout__totals-subtotals">
          <tr>
            <th>Subtotal</th>
            <td>
              <Currency value={cart.subtotal} />
            </td>
          </tr>
          {extraLines}
        </tbody>
      </React.Fragment>
    );
  }

  renderCart() {
    const { cart } = this.props;

    const items = cart.items.map((item) => (
      <tr key={item.id}>
        <td>{`${item.product.name} × ${item.quantity}`}</td>
        <td>
          <Currency value={item.total} />
        </td>
      </tr>
    ));

    return (
      <table className="checkout__totals">
        <thead className="checkout__totals-header">
          <tr>
            <th>Product</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody className="checkout__totals-products">{items}</tbody>
        {this.renderTotals()}
        <tfoot className="checkout__totals-footer">
          <tr style={{ fontSize: 15 }}>
            <th>Total Discount</th>
            <td>
              -<Currency value={cart.totalDiscounts} />
            </td>
          </tr>
          <tr style={{ fontSize: 15 }}>
            <th>Total Tax</th>
            <td>
              <Currency value={cart.totalTaxs} />
            </td>
          </tr>
          <tr>
            <th>Total</th>
            <td>
              <Currency value={cart.total} />
            </td>
          </tr>
        </tfoot>
      </table>
    );
  }

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

  render() {
    const { cart, allCountries } = this.props;
    const { billing, shipping } = this.state.formValues;
    const { showPaypal, payment, termNcondition } = this.state;

    const breadcrumb = [
      { title: "Home", url: "" },
      { title: "Shopping Cart", url: "/store/cart" },
      { title: "Checkout", url: "" },
    ];

    return (
      <React.Fragment>
        <Helmet>
          <title>{`Checkout — ${theme.name}`}</title>
        </Helmet>

        <PageHeader header="Checkout" breadcrumb={breadcrumb} />

        <div className="checkout block">
          <div className="container">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                this.handleSubmitCheckout(e);
              }}
            >
              <div className="row">
                <div className="col-12 col-lg-6 col-xl-7">
                  <div className="card mb-lg-0">
                    <div className="card-body">
                      <h3 className="card-title">Billing details</h3>
                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label htmlFor="checkout-first-name">
                            First Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="checkout-first-name"
                            placeholder="First Name"
                            value={billing.firstName}
                            name={"firstName"}
                            onChange={this.handleChangeInput}
                            required
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label htmlFor="checkout-last-name">Last Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="checkout-last-name"
                            placeholder="Last Name"
                            value={billing.lastName}
                            name={"lastName"}
                            onChange={this.handleChangeInput}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="checkout-company-name">
                          Company Name{" "}
                          <span className="text-muted">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="checkout-company-name"
                          placeholder="Company Name"
                          value={billing.companyName}
                          name={"companyName"}
                          onChange={this.handleChangeInput}
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label htmlFor="checkout-country">Country</label>
                          <select
                            id="checkout-country"
                            className="form-control"
                            value={billing.country}
                            name={"country"}
                            onChange={this.handleChangeInput}
                            required
                          >
                            <option>Select a country...</option>
                            {allCountries &&
                              allCountries.map((item) => {
                                return (
                                  <option value={item.countryName}>
                                    {item.countryName}
                                  </option>
                                );
                              })}
                          </select>
                        </div>

                        <div className="form-group col-md-6">
                          <label htmlFor="checkout-city">Town / City</label>
                          <input
                            type="text"
                            className="form-control"
                            id="checkout-city"
                            value={billing.city}
                            name={"city"}
                            placeholder="Town / City"
                            onChange={this.handleChangeInput}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="checkout-street-address">
                          Street Address
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="checkout-street-address"
                          placeholder="Street Address"
                          value={billing.street}
                          name={"street"}
                          onChange={this.handleChangeInput}
                          required
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label htmlFor="checkout-state">State / County</label>
                          <input
                            type="text"
                            className="form-control"
                            id="checkout-state"
                            value={billing.state}
                            name={"state"}
                            placeholder="State / County"
                            onChange={this.handleChangeInput}
                            required
                          />
                        </div>

                        <div className="form-group col-md-6">
                          <label htmlFor="checkout-postcode">
                            Postcode / ZIP
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="checkout-postcode"
                            value={billing.zipCode}
                            name={"zipCode"}
                            placeholder="Postcode / ZIP"
                            onChange={this.handleChangeInput}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label htmlFor="checkout-email">Email address</label>
                          <input
                            type="email"
                            className="form-control"
                            id="checkout-email"
                            placeholder="Email address"
                            value={billing.email}
                            name={"email"}
                            onChange={this.handleChangeInput}
                            required
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label htmlFor="checkout-phone">Phone</label>
                          <input
                            type="text"
                            className="form-control"
                            id="checkout-phone"
                            placeholder="Phone"
                            value={billing.phone}
                            name={"phone"}
                            onChange={this.handleChangeInput}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="card-divider" />
                    <div className="card-body">
                      <h3 className="card-title">Shipping Details</h3>

                      <div className="form-group">
                        <div className="form-check">
                          <span className="form-check-input input-check">
                            <span className="input-check__body">
                              <input
                                className="input-check__input"
                                type="checkbox"
                                id="checkout-different-address"
                                onChange={this.handleAddressToggle}
                              />
                              <span className="input-check__box" />
                              <Check9x7Svg className="input-check__icon" />
                            </span>
                          </span>
                          <label
                            className="form-check-label"
                            htmlFor="checkout-different-address"
                          >
                            Same Shipping Address
                          </label>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label htmlFor="checkout-first-name1">
                            First Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            // id="checkout-first-name"
                            placeholder="First Name"
                            value={shipping.firstName}
                            name={"shipping-firstName"}
                            onChange={(e) =>
                              this.handleChangeInput(e, "shipping")
                            }
                            required
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label htmlFor="checkout-last-name">Last Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="checkout-last-name"
                            placeholder="Last Name"
                            value={shipping.lastName}
                            name={"shipping-lastName"}
                            onChange={(e) =>
                              this.handleChangeInput(e, "shipping")
                            }
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="checkout-company-name">
                          Company Name{" "}
                          <span className="text-muted">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="checkout-company-name"
                          placeholder="Company Name"
                          value={shipping.companyName}
                          name={"shipping-companyName"}
                          onChange={(e) =>
                            this.handleChangeInput(e, "shipping")
                          }
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label htmlFor="checkout-country">Country</label>
                          <select
                            id="checkout-country"
                            className="form-control"
                            value={shipping.country}
                            name={"shipping-country"}
                            onChange={(e) =>
                              this.handleChangeInput(e, "shipping")
                            }
                            required
                          >
                            <option>Select a country...</option>
                            {allCountries &&
                              allCountries.map((item) => {
                                return (
                                  <option value={item.countryName}>
                                    {item.countryName}
                                  </option>
                                );
                              })}
                          </select>
                        </div>

                        <div className="form-group col-md-6">
                          <label htmlFor="checkout-city">Town / City</label>
                          <input
                            type="text"
                            className="form-control"
                            id="checkout-city"
                            value={shipping.city}
                            name={"shipping-city"}
                            placeholder="Town / City"
                            onChange={(e) =>
                              this.handleChangeInput(e, "shipping")
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="checkout-street-address">
                          Street Address
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="checkout-street-address"
                          placeholder="Street Address"
                          value={shipping.street}
                          name={"shipping-street"}
                          onChange={(e) =>
                            this.handleChangeInput(e, "shipping")
                          }
                          required
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label htmlFor="checkout-state">State / County</label>
                          <input
                            type="text"
                            className="form-control"
                            id="checkout-state"
                            value={shipping.state}
                            name={"shipping-state"}
                            placeholder="State / County"
                            onChange={(e) =>
                              this.handleChangeInput(e, "shipping")
                            }
                            required
                          />
                        </div>

                        <div className="form-group col-md-6">
                          <label htmlFor="checkout-postcode">
                            Postcode / ZIP
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="checkout-postcode"
                            value={shipping.zipCode}
                            name={"shipping-zipCode"}
                            placeholder="Postcode / ZIP"
                            onChange={(e) =>
                              this.handleChangeInput(e, "shipping")
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label htmlFor="checkout-email">Email address</label>
                          <input
                            type="email"
                            className="form-control"
                            id="checkout-email"
                            placeholder="Email address"
                            value={shipping.email}
                            name={"shipping-email"}
                            onChange={(e) =>
                              this.handleChangeInput(e, "shipping")
                            }
                            required
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label htmlFor="checkout-phone">Phone</label>
                          <input
                            type="text"
                            className="form-control"
                            id="checkout-phone"
                            placeholder="Phone"
                            value={shipping.phone}
                            name={"shipping-phone"}
                            onChange={(e) =>
                              this.handleChangeInput(e, "shipping")
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="card-divider" />
                      <br />

                      <div className="form-group">
                        <label htmlFor="checkout-comment">
                          Order notes{" "}
                          <span className="text-muted">(Optional)</span>
                        </label>
                        <textarea
                          id="checkout-comment"
                          className="form-control"
                          rows="4"
                          onChange={(e) =>
                            this.setState({ orderNote: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-lg-6 col-xl-5 mt-4 mt-lg-0">
                  <div className="card mb-0">
                    <div className="card-body">
                      <h3 className="card-title">Your Orders</h3>

                      {this.renderCart()}
                      Delivery Time:    
                      <select>
                        
                      </select>

                      <div className="form-group">
                          <label htmlFor="checkout-country">Delivery Option</label>
                          <select
                            id="delivery-time"
                            className="form-control"
                            value={billing.deliveryTime}
                            name={"country"}
                            onChange={this.handleShipment}
                            required
                          >
                            <option>Select Delivery Time...</option>
                            {this.deliveryTimeOptions.map((item) => {
                              return (
                                <option value={item.value}>{item.label}</option>
                              );
                            })}
                          </select>
                        </div>

                      {this.renderPaymentsList()}

                      <div className="checkout__agree form-group">
                        <div className="form-check">
                          <span className="form-check-input input-check">
                            <span className="input-check__body">
                              <input
                                className="input-check__input"
                                type="checkbox"
                                onChange={(e) =>
                                  this.setState({
                                    termNcondition: e.target.checked,
                                  })
                                }
                                id="checkout-terms"
                              />
                              <span className="input-check__box" />
                              <Check9x7Svg className="input-check__icon" />
                            </span>
                          </span>
                          <label
                            style={{ fontSize: "13px", fontWeight: "bold" }}
                            className="form-check-label"
                            htmlFor="checkout-terms"
                          >
                            I have read and agree to the website{" "}
                            <Link to="site/terms">terms and conditions</Link>*
                          </label>
                        </div>
                      </div>

                      {this.state.payment === "paypal" ? (
                        <PayPalButtons
                          handleSubmitCheckout={this.handleSubmitCheckout}
                          total={this.props.cart.total}
                          currency={
                            JSON.parse(localStorage.getItem("state")).currency
                          }
                          handlePaid={this.handlePaid}
                        />
                      ) : null}

                      {this.state.payment === "stripe" && (
                        <StripPayment order={this.state.orderState} />
                      )}

                      {/*<button*/}
                      {/*  type="submit"*/}
                      {/*  disabled={!termNcondition}*/}
                      {/*  className="btn btn-primary btn-xl btn-block"*/}
                      {/*>*/}
                      {/*  Pay Now*/}
                      {/*</button>*/}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getAllCountries,
      postSaleOrder,
      resetCartPaid,
    },
    dispatch
  );
}

const mapStateToProps = (state) => ({
  cart: state.cart,
  allCountries: state.webView.allCountries,
  authUser: state.auth.authUser,
});

export default connect(mapStateToProps, mapDispatchToProps)(ShopPageCheckout);
