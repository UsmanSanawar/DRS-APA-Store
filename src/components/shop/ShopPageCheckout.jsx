/* eslint-disable no-loop-func */
/* eslint-disable react/no-direct-mutation-state */
// react
import _, { uniq, uniqBy } from "lodash";
import React, { Component } from "react";
import { Helmet } from "react-helmet";
// third-party
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { bindActionCreators } from "redux";
import CircularLoader from "../../assets/loaders";
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
      taxRates: [],
      discount: {},
      totalOrderAmount: 0,
      totalTaxes: 0,
      totalDiscounts: 0,
      totalUnitPrice: 0,
      perLineTotal: [],
      discountsAppliedPerProduct: [],
      customerGroup: null,
    };
  }

  componentDidMount() {
    this.handleOrdereCalculations();
    RestService.getCustomerByToken()
      .then((res) => {
        if (res.data.status === "success") {
          let { customerAddress } = res.data.data;
          if (customerAddress.length > 0) {
            let shipping;
            let billing;
            // eslint-disable-next-line array-callback-return
            customerAddress.map((address) => {
              if (address.addressType === "shipping") {
                shipping = {
                  ...initAddr,
                  ...address,
                };
              }

              if (address.addressType === "billing") {
                billing = {
                  ...initAddr,
                  ...address,
                };
              }
            });
            this.setState({
              formValues: {
                billing: { ...initAddr, ...billing },
                shipping: { ...initAddr, ...shipping },
              },
            });
          }
        }
      })
      .catch((err) => {
        if (err.message.includes("403") || err.message.includes("401")) {
          localStorage.clear();
          return window.location.href.replace("#/store/login");
        }
      });

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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.cart.items !== this.props.cart.items) {
      if (this.props.cart.items.length > 0) {
        this.state.deliveryTime &&
          this.handleShipmentCalculation(this.state.deliveryTime);
      }
      this.handleOrdereCalculations();
    }
  }

  handleOrdereCalculations = async () => {
    let { items } = JSON.parse(localStorage.getItem("state")).cart;
    //customerGroupId
    let customerGroup = await RestService.getCustomerByToken(
      JSON.parse(localStorage.getItem("token"))
    ).then((res) => {
      if (res.data.status === "success") {
        this.setState({
          customerGroup: res.data.data.customerGroupId,
        });
        return res.data.data.customerGroupId;
      } else {
        return null;
      }
    });

    //variables
    let taxRateArray = [];
    let unitPriceTotal = 0;
    let discountThatMayApply = [];
    let perProductDiscountAndTax = [];
    let perLineTotal = [];
    let discountsAppliedPerProduct = [];
    if (items.length > 0) {
      for (let index = 0; index < items.length; index++) {
        let innerdiscount = {};
        let totalPerLine = 0;
        let aTax = 0;
        let discount = 0;
        let innerTotal = 0;
        let lineTotal = items[index].product.price * items[index].quantity;
        let innerTaxRates = [];

        unitPriceTotal = unitPriceTotal + lineTotal;
        innerTotal = lineTotal;
        let { taxClass } = items[index].product;

        let discountPercentage = 0;
        let applieddiscounts = [];

        items[index].product.discountProducts.map((p) => {
          p.discount &&
            p.discount.discountCustomerGroups &&
            p.discount.discountCustomerGroups !== undefined &&
            p.discount.discountCustomerGroups !== null &&
            p.discount.discountCustomerGroups.map((discountGroup) => {
              if (discountGroup.customerGroupId === customerGroup) {
                discountPercentage = p.discount.discountPercentage || 0;

                applieddiscounts.push({
                  discountId: p.discount.discountId,
                  discountName: p.discount.name,
                  discountPercentage: p.discount.discountPercentage,
                });

                discountThatMayApply.push({
                  discountId: p.discount.discountId,
                  discountName: p.discount.name,
                  discountPercentage: p.discount.discountPercentage,
                });
              }
            });
        });

        console.log(applieddiscounts, "asdasdsadsadsadsa");

        discountsAppliedPerProduct.push({
          discount: _.maxBy(
            applieddiscounts,
            (item) => item.discountPercentage
          ),
          productId: items[index].product.productId,
        });

        discount = (innerTotal * discountPercentage) / 100;
        innerTotal = innerTotal - discount;

        let taxPerRateLine = 0;
        if (taxClass && taxClass.taxRates.length > 0) {
          let { taxRates } = taxClass;
          for (const taxRate of taxRates) {
            let { taxRatesCustomerGroups } = taxRate;
            if (
              taxRatesCustomerGroups &&
              taxRatesCustomerGroups.some(
                (row) => row.customerGroupId === customerGroup
              )
            ) {
              taxPerRateLine = taxRate.rate;
              innerTaxRates.push(taxRate);
            }
          }

          taxRateArray.push({
            taxRates: innerTaxRates,
            productId: items[index].product.productId,
          });
        }
        aTax = (taxPerRateLine * innerTotal) / 100;

        totalPerLine = innerTotal + aTax;
        perLineTotal.push({
          total: totalPerLine,
          productId: items[index].product.productId,
        });

        perProductDiscountAndTax.push({
          aTax,
          discount,
          productId: items[index].product.productId,
        });
      }
    } else {
      this.setState({
        calculations: {},
        shippingTotal: 0,
      });
    }

    let totalDiscounts = 0;
    let totalTaxes = 0;

    for (const itm of perProductDiscountAndTax) {
      console.log(itm, "aaaabb1");

      totalDiscounts = totalDiscounts + itm.discount;
      totalTaxes = totalTaxes + parseFloat(itm.aTax);
    }

    let appliedDiscount = _.maxBy(
      discountThatMayApply,
      (obj) => obj.discountPercentage
    );

    console.log(appliedDiscount, "aaaabb2");

    let totalTaxRates = 0;
    for (let index = 0; index < taxRateArray.length; index++) {
      totalTaxRates = totalTaxRates + taxRateArray[index].rate;
    }

    this.setState({
      taxRates: taxRateArray,
      discounts: appliedDiscount || 0,
      totalDiscounts,
      totalTaxes,
      perLineTotal,
      totalUnitPrice: unitPriceTotal,
      discountsAppliedPerProduct,
    });
  };

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
    let total = 0;
    items = items ? items : [];

    items.map(({ product }) => {
      let discountThatMayApply = [];
      let { taxClass } = product;
      let taxrate = 0;

      product.discountProducts.map((p) => {
        p.discount &&
          p.discount.discountCustomerGroups &&
          p.discount.discountCustomerGroups !== undefined &&
          p.discount.discountCustomerGroups !== null &&
          p.discount.discountCustomerGroups.map((discountGroup) => {
            if (discountGroup.customerGroupId === this.state.customerGroup) {
              discountThatMayApply.push({
                discountId: p.discount.discountId,
                discountName: p.discount.name,
                discountPercentage: p.discount.discountPercentage,
              });
            }
          });
      });

      let discount = _.maxBy(
        discountThatMayApply,
        (item) => item.discountPercentage
      );

      if (taxClass && taxClass.taxRates.length > 0) {
        let { taxRates } = taxClass;
        for (const taxRate of taxRates) {
          let { taxRatesCustomerGroups } = taxRate;
          if (
            taxRatesCustomerGroups &&
            taxRatesCustomerGroups.some(
              (row) => row.customerGroupId === this.state.customerGroup
            )
          ) {
            taxrate = taxrate + taxRate.rate;
          }
        }
      }

      let unitPrice = product.price;

      console.log(taxrate, "adasdasdaaaaaaa");

      let unitDiscount =
        (unitPrice * (discount && discount.discountPercentage)) / 100 || 0;
      unitPrice = unitPrice - unitDiscount;
      let unitTax = (unitPrice * taxrate) / 100;
      unitPrice = unitPrice + unitTax;
      total = total + unitPrice;
    });

    return total;
  };

  handleOrderTotalAmount = () => {
    let TotalAmount = _.sumBy(this.state.perLineTotal, "total") || 0;
    return TotalAmount + this.state.shippingTotal;
  };

  hanldePerOrderLinePrice = (productId) => {
    let lineTotals = this.state.perLineTotal;
    let index = lineTotals.findIndex((item) => item.productId === productId);
    if (index > -1) {
      console.log(lineTotals[index].total, "sdsadasdasdsad");

      return lineTotals[index].total;
    } else {
      return 0;
    }
  };

  handleSaleorderObject = () => {
    let saleOrder = {
      orderId: null,
      orderIdentifier: "",
      isOnlineOrder: false,
      isPaymentOnline: false,
      customerId: this.props.customer.customerId,
      onlinePaymentId: "",
      orderDate: new Date().toISOString().slice(0, 20),
      orderDueDate: null,
      isCancelled: false,
      cancelReason: "",
      orderAmountWithTaxAndDiscount: this.handleOrderTotalAmount(),
      orderAmountWithTaxAndDiscountFreeEligible: this.handleOrderAmountWithTaxAndDiscountFreeEligible(
        this.props.cart.items
      ),
      orderNotes: this.state.orderNote,
      uK_DeliveryDurationId:
        this.state.deliveryTime && parseInt(this.state.deliveryTime),
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

    const handleDiscountbyLine = (productId, evt) => {
      let data = this.state.discountsAppliedPerProduct || [];

      for (const disc of data) {
        if (disc.discount) {
          if (disc.productId === productId) {
            return disc.discount[evt];
          }
        }
      }
    };
    for (let item of this.props.cart.items) {
      let line = {
        orderId: 0,
        orderLinesId: null,
        discountId: handleDiscountbyLine(item.product.id, "discountId"),
        discountName: handleDiscountbyLine(item.product.id, "discountName"),
        discountPercentage: handleDiscountbyLine(
          item.product.id,
          "discountPercentage"
        ),
        isActive: true,
        isProductReturn: false,
        orderLineProductOptions: [],
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        returnReason: "",
        taxClassId: item.product.taxClassId,
        taxClassName: "",
        taxPercentage: 0,
        unitPrice: item.price,
        orderLineTaxRates: [],

        lineTotal: this.hanldePerOrderLinePrice(item.product.productId),
      };

      if (
        item.product.selectedProductOption &&
        item.product.selectedProductOption.productId
      ) {
        let SelectedProduct = { ...item.product.selectedProductOption };
        SelectedProduct.orderLineProductOptionsId = 0;
        SelectedProduct.orderLineProductOptionCombinations =
          SelectedProduct.productOptionCombination;

        delete SelectedProduct.productOptionCombination;
        SelectedProduct.optionModel = SelectedProduct.optionModel
          ? SelectedProduct.optionModel
          : "";

        line.orderLineProductOptions = [SelectedProduct];
      }

      console.log(this.state.taxRates, "asddddddd");

      if (this.state.taxRates && this.state.taxRates.length > 0) {
        let taxratesArray = [];

        let taxrates = this.state.taxRates;

        console.log(taxrates, "sadsadasdasdsadasaaaa");

        for (const taxting of taxrates) {
          if (taxting.productId === item.product.id) {
            taxting.taxRates.length > 0 &&
              taxting.taxRates.map((rtes) => {
                taxratesArray.push({
                  orderLineTaxRateId: 0,
                  orderLineTaxRateName: rtes.taxRateName,
                  orderTaxRate: rtes.rate,
                  orderLineTaxRateCode: rtes.taxRateCode,
                  orderLinesId: null,
                });
              });
          }
        }
        let hazel = uniqBy(taxratesArray, "orderLineTaxRateCode");

        line.orderLineTaxRates = hazel;
        line.taxPercentage = _.sumBy(hazel, "orderTaxRate");
      }

      saleOrder.orderLines.push(line);
    }

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
      } else if (this.state.deliveryTime === null) {
        toast.warn("Please select delivery time.");
        this.handleSubmitLoading(false);
      } else {
        RestService.postSaleOrder(saleOrder).then((r) => {
          toast[r.data.status](r.data.message);
          if (r.data.status === "success") {
            this.setState({ orderState: r.data.data });
          } else {
            this.handleSubmitLoading(false);
          }
        });
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
              -<Currency value={this.state.totalDiscounts} />
            </td>
          </tr>
          <tr style={{ fontSize: 15 }}>
            <th>Total Tax</th>
            <td>
              <Currency value={this.state.totalTaxes} />
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
                  this.state.totalUnitPrice -
                  this.state.totalDiscounts +
                  this.state.totalTaxes +
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
    data.uK_DeliveryDurationId = parseInt(
      e.target ? e.target.value : this.state.deliveryTime
    );

    await RestService.calculateSaleOrderShipment({ ...data })
      .then((res) => {
        this.setState({ sloading: false });
        if (res.data.error === "") {
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
    // eslint-disable-next-line array-callback-return
    shippingKeys.map((item) => {
      if (
        condEligible.some((arrItem) => arrItem === item) &&
        parseInt(this.state.calculations[item]) !== 0
      ) {
        if (item.includes("Price")) {
          totalShipping =
            totalShipping + parseFloat(this.state.calculations[item]);
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
                      <h3 className="card-title">Billing Details</h3>
                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label htmlFor="checkout-first-name">
                            First Name <small className="text-danger">*</small>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="billing-first-name"
                            placeholder="First Name"
                            value={billing.firstName}
                            name={"firstName"}
                            onChange={this.handleChangeInput}
                            required
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label htmlFor="billing-last-name">
                            Last Name <small className="text-danger">*</small>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="billing-last-name"
                            placeholder="Last Name"
                            value={billing.lastName}
                            name={"lastName"}
                            onChange={this.handleChangeInput}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="billing-company-name">
                          Company Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="billing-company-name"
                          placeholder="Company Name"
                          value={billing.companyName}
                          name={"companyName"}
                          onChange={this.handleChangeInput}
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label htmlFor="billing-country">
                            Country <small className="text-danger">*</small>
                          </label>
                          <select
                            id="billing-country"
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
                          <label htmlFor="billing-city">
                            Town / City <small className="text-danger">*</small>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="billing-city"
                            value={billing.city}
                            name={"city"}
                            placeholder="Town / City"
                            onChange={this.handleChangeInput}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="billing-street-address">
                          Street Address{" "}
                          <small className="text-danger">*</small>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="billing-street-address"
                          placeholder="Street Address"
                          value={billing.street}
                          name={"street"}
                          onChange={this.handleChangeInput}
                          required
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label htmlFor="billing-state">
                            State / County{" "}
                            <small className="text-danger">*</small>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="billing-state"
                            value={billing.state}
                            name={"state"}
                            placeholder="State / County"
                            onChange={this.handleChangeInput}
                            required
                          />
                        </div>

                        <div className="form-group col-md-6">
                          <label htmlFor="billing-postcode">
                            Postcode / ZIP{" "}
                            <small className="text-danger">*</small>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="billing-postcode"
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
                          <label htmlFor="billing-email">
                            Email address{" "}
                            <small className="text-danger">*</small>
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            id="billing-email"
                            placeholder="Email address"
                            value={billing.email}
                            name={"email"}
                            onChange={this.handleChangeInput}
                            required
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label htmlFor="billing-phone">Phone</label>
                          <input
                            type="text"
                            className="form-control"
                            id="billing-phone"
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
                          <label htmlFor="shipping-first-name">
                            First Name <small className="text-danger">*</small>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="shipping-first-name"
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
                          <label htmlFor="shipping-last-name">
                            Last Name <small className="text-danger">*</small>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="shipping-last-name"
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
                        <label htmlFor="shipping-company-name">
                          Company Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="shipping-company-name"
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
                          <label htmlFor="shipping-country">
                            Country <small className="text-danger">*</small>
                          </label>
                          <select
                            id="shipping-country"
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
                          <label htmlFor="shipping-city">
                            Town / City <small className="text-danger">*</small>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="shipping-city"
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
                        <label htmlFor="shipping-street-address">
                          Street Address{" "}
                          <small className="text-danger">*</small>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="shipping-street-address"
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
                          <label htmlFor="shipping-state">State / County</label>
                          <input
                            type="text"
                            className="form-control"
                            id="shipping-state"
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
                          <label htmlFor="shipping-postcode">
                            Postcode / ZIP{" "}
                            <small className="text-danger">*</small>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="shipping-postcode"
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
                          <label htmlFor="shipping-email">
                            Email address{" "}
                            <small className="text-danger">*</small>
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            id="shipping-email"
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
                          <label htmlFor="shipping-phone">Phone</label>
                          <input
                            type="text"
                            className="form-control"
                            id="shipping-phone"
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
                        <label htmlFor="shipping-comment">
                          Order notes{" "}
                          <span className="text-muted">(Optional)</span>
                        </label>
                        <textarea
                          id="shipping-comment"
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
                          calculations={calculations}
                          totalShip={this.state.shippingTotal}
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
                            <Link to="/terms-condition">
                              terms and conditions
                            </Link>
                            *
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
