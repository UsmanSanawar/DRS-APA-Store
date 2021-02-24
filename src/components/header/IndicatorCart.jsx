// react
import React from "react";

// third-party
import classNames from "classnames";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

// application
import AsyncAction from "../shared/AsyncAction";
import Currency from "../shared/Currency";
import Indicator from "./Indicator";
import { Cart20Svg, Cross10Svg } from "../../svg";
import { cartRemoveItem } from "../../store/cart";

function IndicatorCart(props) {
  const { cart, cartRemoveItem } = props;
  let dropdown;
  let totals;

  if (cart && cart.extraLines.length > 0) {
    const extraLines = cart.extraLines.map((extraLine, index) => (
      <tr key={index}>
        <th>{extraLine.title}</th>
        <td>
          <Currency value={extraLine.price} />
        </td>
      </tr>
    ));

    totals = (
      <React.Fragment>
        <tr>
          <th>Subtotal</th>
          <td>
            <Currency value={cart.subtotal} />
          </td>
        </tr>
        {extraLines}
      </React.Fragment>
    );
  }

  const getSeletedOptionValue = (option) => {
    let index = option.optionValues.findIndex((item) => {
      return parseInt(item.optionValueId) === parseInt(option.value);
    });

    if (index > -1) {
      return option.optionValues[index].name;
    }
    return "";
  };

  const items =
    cart &&
    cart.items.map((item) => {
      let options;
      let image;

      console.log(item, "===item")

      if (item.options) {
        options = (
          <ul className="dropcart__product-options">
            {item.options.map((option, index) => {

              return (
                <li key={index}>{`${option.optionName}:  ${
                  option.optionTypeId === 1 || option.optionTypeId === 2
                    ? getSeletedOptionValue(option)
                    : option.optionTypeId === 3
                    ? option.value === undefined || option.value === false
                      ? false
                      : true
                    : option.optionTypeId === 6
                    ? option.value
                      ? option.value
                      : ""
                    : ""
                }`}</li>
              );
            })}
          </ul>
        );
      }


      if (
        item.product &&
        item.product.images &&
        item.product.images.length > 0
      ) {
        image = (
          <div className="dropcart__product-image">
            <Link to={`/store/product/${item.product.id}`}>
              <img src={item.product.images[0]} alt="" />
            </Link>
          </div>
        );
      }

      const removeButton = (
        <AsyncAction
          action={() => cartRemoveItem(item.id)}
          render={({ run, loading }) => {
            const classes = classNames(
              "dropcart__product-remove btn btn-light btn-sm btn-svg-icon",
              {
                "btn-loading": loading,
              }
            );

            return (
              <button type="button" onClick={run} className={classes}>
                <Cross10Svg />
              </button>
            );
          }}
        />
      );

      return (
        <div key={item.id} className="dropcart__product">
          {image}
          <div className="dropcart__product-info">
            <div className="dropcart__product-name">
              <Link to={`/store/product/${item.product.id}`}>
                {item.product.name}
              </Link>
            </div>
            {options}
            <div className="dropcart__product-meta">
              <span className="dropcart__product-quantity">
                {item.quantity}
              </span>
              {" x "}
              <span className="dropcart__product-price">
                <Currency value={item.price} />
              </span>
            </div>
          </div>
          {removeButton}
        </div>
      );
    });

  if (cart.quantity) {
    dropdown = (
      <div className="dropcart">
        <div className="dropcart__products-list">{items}</div>

        <div className="dropcart__totals">
          <table>
            <tbody>
              {totals}
              <tr>
                <th>Total</th>
                <td>
                  <Currency value={cart.total} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="dropcart__buttons">
          <Link className="btn btn-secondary" to="/store/cart">
            View Cart
          </Link>
          <Link className="btn btn-primary" to="/store/checkout">
            Checkout
          </Link>
        </div>
      </div>
    );
  } else {
    dropdown = (
      <div className="dropcart">
        <div className="dropcart__empty">Your shopping cart is empty!</div>
      </div>
    );
  }

  return (
    <Indicator
      url="/store/cart"
      dropdown={dropdown}
      value={cart.quantity}
      icon={<Cart20Svg />}
    />
  );
}

const mapStateToProps = (state) => ({
  cart: state.cart,
});

const mapDispatchToProps = {
  cartRemoveItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorCart);
