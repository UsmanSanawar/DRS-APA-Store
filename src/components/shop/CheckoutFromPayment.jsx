/* eslint-disable react/no-direct-mutation-state */
// react
import React, { Component } from "react";
import { Helmet } from "react-helmet";
// third-party
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { bindActionCreators } from "redux";
import CircularLoader from "../../assets/loaders";
import { sumBy } from "lodash";

// data stubs
import payments from "../../data/shopPayments";
import theme from "../../data/theme";
import { postSaleOrder, resetCartPaid } from "../../store/cart";
import RestService from "../../store/restService/restService";
import { getAllCountries } from "../../store/webView";
import { Check9x7Svg } from "../../svg";
// application
import Collapse from "../shared/Collapse";
import Currency from "../shared/Currency";
import PageHeader from "../shared/PageHeader";
import StripPayment from "../stripePayment";
import PayPalButtons from "./PayPalButtons";
import ShippingCollapse from "./ShippingCollapse";

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

  constructor(props) {
    super(props);
    this.state = {
      payment: "",
      formValues: {
        billing: { ...initAddr, addressType: "billing" },
        shipping: { ...initAddr, addressType: "shipping" },
      },
      loading: false,
      orderNote: "",
      showPaypal: false,
      total: 0,
      currency: {},
      termNcondition: false,
      orderState: {},
      submitLoading: false,
      deliveryTimeOptions: [],
      deliveryTime: null,
      orderById: {},
      collapse: false,
      sloading: false,
      calculations: {},
      shippingTotal: 0,
    };
  }

  showPaypalButtons = () => {
    if (this.state.payment === "paypal") {
      this.setState({ showPaypal: true });
    }
  };

  componentDidMount() {
    let { id } = this.props.match.params;
    if (id) {
      RestService.getOrderById(id).then((res) => {
        if (res.data.status === "success") {
          let obj = {
            ...this.state.formValues,
            ...res.data.data,
          };

          this.setState({
            formValues: obj,
          });
        }
      });
    }
    this.getAllDeliveryTimeOptions();
    this.props.getAllCountries();
    let total = JSON.parse(localStorage.getItem("state")).cart.total
      ? JSON.parse(localStorage.getItem("state")).cart.total
      : 0;
    let currency = JSON.parse(localStorage.getItem("state")).currency;

    this.setState({
      total: total,
      currency: currency,
    });
  }

  getAllDeliveryTimeOptions = () => {
    RestService.getAllParcelDeliveries().then((r) => {
      if (r.data.status === "success") {
        this.setState({
          deliveryTimeOptions: r.data.data,
        });
      }
    });
  };

  handleOrderAmountWithTaxAndDiscountFreeEligible = (items) => {
    let orderAmountWithTaxAndDiscountF = 0;
    items = items ? items : [];
    items.map(
      (item) =>
        (orderAmountWithTaxAndDiscountF =
          orderAmountWithTaxAndDiscountF + (item.ukFreeDeliverPrices || 0))
    );

    return orderAmountWithTaxAndDiscountF;
  };

  handleSaleorderObject = () => {
    let saleOrder = this.state.formValues;

    let shipping = { ...this.state.formValues.shipping };
    shipping.addressType = "shipping";
    shipping.orderAddressId = null;

    let billing = { ...this.state.formValues.billing };
    billing.orderAddressId = null;
    billing.addressType = "billing";

    saleOrder.orderAddress.push(shipping);
    saleOrder.orderAddress.push(billing);
    return saleOrder;
  };

  handleSubmitCheckout = (event) => {
    if (
      this.state.formValues.shipping.firstName !== "" &&
      this.state.formValues.shipping.lastName !== "" &&
      this.state.formValues.shipping.street !== "" &&
      this.state.formValues.billing.firstName !== "" &&
      this.state.formValues.billing.lastName !== "" &&
      this.state.formValues.billing.street !== ""
    ) {
      this.handleSubmitLoading(true);

      let saleOrder = this.handleSaleorderObject();

      if (this.props.cart.items.length < 1) {
        toast.error("Cart is empty");
      } else {

          this.setState({
            orderState: saleOrder
          })

        // RestService.postSaleOrder(saleOrder).then((r) => {
        //   toast[r.data.status](r.data.message);
        //   if (r.data.status === "success") {
        //     this.setState({ orderState: r.data.data });
        //   } else {
        //     this.handleSubmitLoading(false);
        //   }
        // });
      }
    }
  };

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
    const { formValues } = this.state;
    console.log(formValues && formValues.orderLines, "sdasdasdasdasd");
    const { orderLines } = formValues || [];

    let discount = 0;
    let tax = 0;
    let orderTotal = 0;

    let cart = orderLines || [];

    function totalValue(prod) {
      let total = prod.quantity * prod.unitPrice;

      if (prod.orderLineTaxRates && prod.orderLineTaxRates.length > 0) {
        let totalTaxRate = sumBy(prod.orderLineTaxRates, "orderTaxRate");
        let taxOnProduct = (total * totalTaxRate) / 100;

        tax = tax + taxOnProduct;
      }

      return total;
    }

    const items = cart.map((item) => (
      <tr key={item.id}>
        <td>{`${item.productName} × ${item.quantity}`}</td>
        <td>
          <Currency value={totalValue(item)} />
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
              <Currency value={tax} />
            </td>
          </tr>
          <tr style={{ fontSize: 15 }}>
            <th>Total Shipping</th>
            <td>
              <Currency value={this.state.shippingTotal} />
            </td>
          </tr>
          <tr>
            <th>Total</th>
            <td>
              <Currency
                value={
                  formValues.orderAmountWithTaxAndDiscount +
                  this.state.shippingTotal
                }
              />
            </td>
          </tr>
        </tfoot>
      </table>
    );
  }

  handleShipmentCalculation = async (e) => {
    this.setState({ sloading: true });
    let formDataSaleOrders = this.handleSaleorderObject();
    let data = { ...formDataSaleOrders };
    data.uK_DeliveryDurationId = parseInt(e.target.value);
    console.log(data, "dasdasdasdasd");

    await RestService.calculateSaleOrderShipment({ ...data })
      .then((res) => {
        this.setState({ sloading: false });
        console.log(res, "response of API.");
        if (res.data.error === "") {
          console.log(res.data.order, "successful");
          this.setState({
            calculations: res.data.order,
          });
        }
      })
      .catch((err) => err && console.log(err, "error"));

    this.handleShipping();
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

  handleSubmitLoading = (value) => {
    this.setState({
      submitLoading: value,
    });
  };

  handleCollapseToggle = () => {
    this.setState({
      collapse: !this.state.collapse,
    });
  };

  handleShipping = () => {
    let totalShipping = 0;

    const eligiableTrue = [
      // "parcelWeightNotEligible",
      "totalParcelWeight",
      "parcelPriceNotEligible",

      // "totalBarriersNotEligible",
      "totalBarriers",
      "totalBarrierPriceNotEligible",

      // "totalRetrofitsNotEligible",
      "totalRetrofits",
      "totalRetrofitPricesNotEligible",

      // "totalOperatorsNotEligible",
      "totalOperators",
      "totalOperatorPricesNotEligible",

      "numberOfRacksUsed",
      "totalRackPrice",
    ];

    //? IsOrderEligibleForFreeDelivery=false
    const eligiableFalse = [
      "totalParcelWeight",
      "totalParcelPrice",
      "totalOperators",
      "totalOperatorPrice",
      "totalBarriers",
      "totalBarrierPrice",
      "totalRackPrice",
      "totalRetrofitPrices",
      "numberOfRacksUsed",
      "totalRetrofits",
    ];

    const condEligible = this.state.calculations.isOrderEligibleForFreeDelivery
      ? eligiableTrue
      : eligiableFalse;
    const shippingKeys = Object.keys(this.state.calculations);

    shippingKeys.map((item) => {
      if (
        condEligible.some((arrItem) => arrItem === item) &&
        parseInt(this.state.calculations[item]) !== 0
      ) {
        if (item.includes("Price")) {
          totalShipping =
            totalShipping + parseInt(this.state.calculations[item]);
        }
      }
    });

    this.setState({
      shippingTotal: totalShipping,
    });
  };

  render() {
    const { cart, allCountries } = this.props;
    const { billing, shipping } = this.state.formValues;
    const {
      showPaypal,
      payment,
      termNcondition,
      deliveryTimeOptions,
      calculations,
    } = this.state;

    const breadcrumb = [
      { title: "Home", url: "" },
      { title: "Shopping Cart", url: "/store/cart" },
      { title: "Checkout", url: "" },
    ];

    console.log(this.state.formValues, "ssssssssssssss");

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
                      <div className="form-group">
                        <label htmlFor="checkout-country">
                          Delivery Time Options{" "}
                          <i style={{ color: "red" }}>*</i>
                        </label>
                        <select
                          required
                          id="delivery-time"
                          className="form-control"
                          value={billing.deliveryTime}
                          name={"country"}
                          onChange={(e) => {
                            this.setState({ deliveryTime: e.target.value });
                            this.handleShipmentCalculation(e);
                          }}
                        >
                          <option key={null} value={null}>
                            Select Delivery Time...
                          </option>
                          {deliveryTimeOptions.map((item) => {
                            return (
                              <option value={item.uK_ParcelDeliveryId}>
                                {item.duration}
                              </option>
                            );
                          })}
                        </select>

                        <div
                          onClick={() => {
                            this.handleCollapseToggle();
                          }}
                          style={
                            !this.state.deliveryTime
                              ? { pointerEvents: "none", opacity: "0.7" }
                              : { cursor: "pointer" }
                          }
                          className="text-center border-bottom mt-3 w-100"
                        >
                          <h6>
                            Shipping{" "}
                            <i
                              className={
                                !this.state.collapse
                                  ? "fa fa-chevron-down my-auto float-right"
                                  : "fa fa-chevron-up my-auto float-right"
                              }
                            />
                          </h6>
                        </div>
                      </div>

                      <div>
                        <ShippingCollapse
                          toggle={this.handleCollapseToggle}
                          open={this.state.collapse}
                          isLoading={this.state.sloading}
                          setShippingTotal={this.setShippingTotal}
                          calculations={calculations}
                        />
                      </div>

                      <div className="text-center border-bottom w-100">
                        <h6>Order Items</h6>
                      </div>
                      {this.renderCart()}
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
                            <Link to="/site/terms">terms and conditions</Link>*
                          </label>
                        </div>
                      </div>

                      {this.state.payment === "paypal" && (
                        <PayPalButtons
                          handleSubmitCheckout={this.handleSubmitCheckout}
                          total={this.props.cart.total}
                          currency={
                            JSON.parse(localStorage.getItem("state")).currency
                          }
                          handlePaid={this.handlePaid}
                        />
                      )}

                      {this.state.payment === "stripe" &&
                        (this.state.submitLoading ? (
                          <div className="text-center my-1">
                            <CircularLoader />
                          </div>
                        ) : null)}

                      <div
                        className={
                          this.state.submitLoading ? "d-none" : "d-block"
                        }
                      >
                        {this.state.payment === "stripe" && (
                          <StripPayment
                            handleSubmitLoading={this.handleSubmitLoading}
                            termNcondition={!termNcondition}
                            order={this.state.orderState}
                          />
                        )}
                      </div>

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
  customer: state.auth.profile,
});

export default connect(mapStateToProps, mapDispatchToProps)(ShopPageCheckout);