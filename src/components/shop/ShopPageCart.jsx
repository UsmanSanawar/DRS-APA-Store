// react
import React, { Component } from "react";

// third-party
import classNames from "classnames";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

// application
import AsyncAction from "../shared/AsyncAction";
import Currency from "../shared/Currency";
import PageHeader from "../shared/PageHeader";
import { cartRemoveItem, cartUpdateQuantities } from "../../store/cart";
import { Cross12Svg } from "../../svg";

// data stubs
import theme from "../../data/theme";

class ShopPageCart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      /** example: [{itemId: 8, value: 1}] */
      quantities: [],
      total: 0,
      slectedPr: {},
    };
  }

  getSeletedOptionValue = (option) => {
    let index = option.optionValues.findIndex(
      (item) => item.optionValueId === option.value
    );
    if (index > -1) {
      return option.optionValues[index].name;
    }
    return "";
  };

  getItemQuantity(item) {
    const { quantities } = this.state;
    const quantity = quantities.find((x) => x.itemId === item.id);

    return quantity ? quantity.value : item.quantity;
  }

  handleChangeQuantity = (item, quantity) => {
    this.setState((state) => {
      const stateQuantity = state.quantities.find((x) => x.itemId === item.id);

      if (!stateQuantity) {
        state.quantities.push({ itemId: item.id, value: quantity });
        this.setState({ quantity: quantity });
      } else {
        stateQuantity.value = quantity;
        this.setState({ quantity: quantity });
      }

      return {
        quantities: state.quantities,
      };
    });
  };

  cartNeedUpdate() {
    const { quantities } = this.state;
    const { cart } = this.props;

    return (
      quantities.filter((x) => {
        const item = cart.items.find((item) => item.id === x.itemId);

        return item && item.quantity !== x.value;
      }).length > 0
    );
  }

  handleDiscount = (item) => {
    let product = item.product;
    let discountedPrice = 0;
    let discountThatMayApply = [];
    product.discountProducts.length > 0 && product.discountProducts.map((p) => {
      p.discount.discountCustomerGroups !== null &&
        p.discount.discountCustomerGroups.map((discountGroup) => {
          if (
            discountGroup.customerGroupId ===
            this.props.customer.customerGroupId
          ) {
            discountThatMayApply.push(p.discount.discountPercentage);
          }
        });
    });

    let discountPercentageToBeApplied = !isNaN(
      Math.max(...discountThatMayApply)
    )
      ? Math.max(...discountThatMayApply)
      : 0;

    discountedPrice = (item.total * discountPercentageToBeApplied) / 100;
    discountedPrice = isFinite(discountedPrice) ? discountedPrice : 0;
    return parseFloat(discountedPrice);
  };

  handleTaxCalc = (item) => {
    let taxClass = item.product.taxClass;
    let taxApply = 0;
    let rates = [];
    if(taxClass && taxClass.taxRates.length > 0){
      for (let tax of taxClass.taxRates) {
        if (
          tax.taxRatesCustomerGroups.some(
            (row) => row.customerGroupId === this.props.customer.customerGroupId
          )
        ) {
          rates.push(tax.rate);
        }
      }
    }
    let sum = rates.reduce(function (a, b) {
      return a + b;
    }, 0);
    let totalPrice = item.total - this.handleDiscount(item);

    taxApply = (totalPrice * sum) / 100;
    taxApply = isFinite(taxApply) ? taxApply : 0;
    return parseFloat(taxApply);
  };

  handleTotalPerRow = (item) => {
    return item.total - this.handleDiscount(item) + this.handleTaxCalc(item);
  };

  renderItems() {
    const { cart, cartRemoveItem } = this.props;

    return cart.items.map((item) => {
      let image;
      let options;

      if (
        item.product.selectedProductOption &&
        item.product.selectedProductOption.images
      ) {
        image = (
          <Link to={`/store/product/${item.product.id}`}>
            <img src={item.product.selectedProductOption.images} alt="" />
          </Link>
        );
      } else if (
        item.product &&
        item.product.images &&
        item.product.images.length > 0
      ) {
        image = (
          <Link to={`/store/product/${item.product.id}`}>
            <img src={item.product.images[0]} alt="" />
          </Link>
        );
      }

      if (item.options.length > 0) {
        options = (
          <ul className="cart-table__options">
            {item.options.map((option, index) => (
              <li key={index}>{`${option.optionName}:  ${option.optionTypeId === 1 || option.optionTypeId === 2
                  ? this.getSeletedOptionValue(option)
                  : option.optionTypeId === 3
                    ? !(option.value === undefined || option.value === false)
                    : option.optionTypeId === 6
                      ? option.value
                        ? option.value
                          ? option.value
                          : ""
                        : ""
                      : ""
                }`}</li>
            ))}
          </ul>
        );
      }

      const removeButton = (
        <AsyncAction
          action={() => cartRemoveItem(item.id)}
          render={({ run, loading }) => {
            const classes = classNames("btn btn-light btn-sm btn-svg-icon", {
              "btn-loading": loading,
            });

            return (
              <button type="button" onClick={run} className={classes}>
                <Cross12Svg />
              </button>
            );
          }}
        />
      );

      return (
        <tr key={item.id} className="cart-table__row">
          <td className="cart-table__column cart-table__column--image">
            {image}
          </td>
          <td className="cart-table__column cart-table__column--product">
            <Link
              to={`/store/product/${item.product.id}`}
              className="cart-table__product-name"
            >
              {item.product.name}
            </Link>
            {options}
          </td>
          <td
            className="cart-table__column cart-table__column--price"
            data-title="Price"
          >
            <Currency value={item.price} />
          </td>
          <td
            className="cart-table__column cart-table__column--quantity"
            data-title="Quantity"
          >

            {this.getItemQuantity(item)}
            {/* <InputNumber
              onChange={(quantity) => {
                this.handleChangeQuantity(item, quantity);
              }}
              optionQuantity={this.state.slectedPr.optionQuantity}
              productQuantity={item.product.quantity}
              stateQuantity={this.state.quantity}
              value={this.getItemQuantity(item)}
              min={item.product.minimumQuantity}
            /> */}
          </td>
          {/* <td
            className="cart-table__column cart-table__column--price"
            data-title="Discount"
          >
            - {<Currency value={this.handleDiscount(item)} />}
          </td>
          <td
            className="cart-table__column cart-table__column--price"
            data-title="Tax"
          >
            <Currency value={this.handleTaxCalc(item)} />
          </td> */}
          <td
            className="cart-table__column cart-table__column--total"
            data-title="Total"
          >
            <Currency value={this.handleTotalPerRow(item)} />
          </td>
          <td className="cart-table__column cart-table__column--remove">
            {removeButton}
          </td>
        </tr>
      );
    });
  }

  renderTotals() {
    const { cart } = this.props;

    if (cart.extraLines.length <= 0) {
      return null;
    }

    const extraLines = cart.extraLines.map((extraLine, index) => {
      let calcShippingLink;

      if (extraLine.type === "shipping") {
        calcShippingLink = (
          <div className="cart__calc-shipping">
            <Link to="/">Calculate Shipping</Link>
          </div>
        );
      }

      return (
        <tr key={index}>
          <th>{extraLine.title}</th>
          <td>
            <Currency value={extraLine.price} />
            {calcShippingLink}
          </td>
        </tr>
      );
    });

    return (
      <React.Fragment>
        <thead className="cart__totals-header">
          <tr>
            <th>Subtotal</th>
            <td>
              <Currency value={cart.total} />
            </td>
          </tr>
        </thead>
        <tbody className="cart__totals-body">{extraLines}</tbody>
      </React.Fragment>
    );
  }

  renderCart() {
    const { cart, cartUpdateQuantities } = this.props;
    const { quantities } = this.state;

    const updateCartButton = (
      <AsyncAction
        action={() => cartUpdateQuantities(quantities)}
        render={({ run, loading }) => {
          const classes = classNames("btn btn-primary cart__update-button", {
            "btn-loading": loading,
          });

          return (
            <>
              {/* <button
                type="button"
                onClick={run}
                className={classes}
                disabled={!this.cartNeedUpdate()}
              >
                Update Cart
              </button> */}
            </>
          );
        }}
      />
    );

    return (
      <div className="cart block">
        <div className="container">
          <table id="totalCart" className="cart__table cart-table">
            <thead className="cart-table__head">
              <tr className="cart-table__row">
                <th className="cart-table__column cart-table__column--image">
                  Image
              </th>
                <th className="cart-table__column cart-table__column--product">
                  Product
              </th>
                <th className="cart-table__column cart-table__column--price">
                  Price
              </th>
                <th className="cart-table__column cart-table__column--quantity">
                  Quantity
              </th>
                {/* <th className="cart-table__column cart-table__column--quantity">
                  Discount
              </th>
                <th className="cart-table__column cart-table__column--quantity">
                  Tax
              </th> */}
                <th className="cart-table__column cart-table__column--total">
                  Total
              </th>
                <th
                  className="cart-table__column cart-table__column--remove"
                  aria-label="Remove"
                />
              </tr>
            </thead>
            <tbody className="cart-table__body">{this.renderItems()}</tbody>
          </table>
          <div className="cart__actions">
            <form className="cart__coupon-form">
              {/* <label htmlFor="input-coupon-code" className="sr-only">Password</label>
                            <input type="text" className="form-control" id="input-coupon-code" placeholder="Coupon Code" />
                            <button type="submit" className="btn btn-primary">Apply Coupon</button> */}
            </form>
            <div className="cart__buttons">
              <Link to="/store" className="btn btn-light">
                Continue Shopping
              </Link>
              {updateCartButton}
            </div>
          </div>

          <div className="row justify-content-between pt-md-5 pt-4">
            <div className="col-12 col-md-7 col-lg-6 col-xl-5 ml-auto">
              <div className="card">
                <div className="card-body p-0">
                  <h3 className="card-title">Cart Totals</h3>
                  <table className="cart__totals">
                    {this.renderTotals()}
                    <tfoot className="cart__totals-footer">
                      {this.props.customer.customerId &&
                        this.props.customer.customerGroupId ? (
                          <>
                            <tr style={{ fontSize: "15px" }}>
                              <th>Total Discount</th>
                              <td>
                                -<Currency value={cart.totalDiscounts} />
                              </td>
                            </tr>
                            <tr style={{ fontSize: "15px" }}>
                              <th>Total Tax</th>
                              <td>
                                <Currency value={cart.totalTaxs} />
                              </td>
                            </tr>
                          </>
                        ) : (
                          <p style={{ fontSize: 14, width: "100%" }}>
                            <span className="text-danger">*</span> Login to see
                        discount and taxes.
                          </p>
                        )}
                      <tr>
                        <th>Total</th>
                        <td>
                          <Currency value={cart.total} />
                        </td>
                      </tr>

                    <tr>
                      <small style={{ fontSize: "13px", marginTop: 10 }}>(excluding shipping, tax & discounts )</small>
                    </tr>
                    </tfoot>
                  </table>
                  <Link
                    style={{ fontSize: 19 }}
                    to="/store/checkout"
                    className="btn btn-primary btn-xl btn-block cart__checkout-button"
                  >
                    Proceed to checkout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { cart } = this.props;
    const breadcrumb = [
      { title: "Home", url: "" },
      { title: "Shopping Cart", url: "" },
    ];

    let content;

    if (cart.quantity) {
      content = this.renderCart();
    } else {
      content = (
        <div className="block block-empty">
          <div className="container">
            <div className="block-empty__body">
              <div className="block-empty__message">
                Your shopping cart is empty!
              </div>
              <div className="block-empty__actions">
                <Link to="/store" className="btn btn-primary btn-sm">
                  Continue
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <React.Fragment>
        <Helmet>
          <title>{`Shopping Cart — ${theme.name}`}</title>
        </Helmet>

        <PageHeader header="Shopping Cart" breadcrumb={breadcrumb} />

        {content}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  cart: state.cart,
  customer: state.auth.profile,
});

const mapDispatchToProps = {
  cartRemoveItem,
  cartUpdateQuantities,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopPageCart);
