// third-party
import classNames from "classnames";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FormGroup, Input, Label, Modal } from "reactstrap";
import { cartAddItem } from "../../store/cart";
import { compareAddItem } from "../../store/compare";
import { quickviewOpen } from "../../store/quickview";
import RestService from "../../store/restService/restService";
import { wishlistAddItem, wishlistRemoveItem } from "../../store/wishlist";
import { Wishlist16Svg, Wishlist16SvgRed } from "../../svg";

// application
import AsyncAction from "./AsyncAction";
import Currency from "./Currency";
import Rating from "./Rating";
import {sortBy} from "lodash";

function ProductCard(props) {
  const {
    layout,
    cartAddItem,
    wishlistAddItem,
    wishlistRemoveItem,
    customer,
  } = props;

  const [productOptions, setProductOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [slectedPr, setSlectedPr] = useState({});

  let product = props.product;
  product.productId = product.id || product.productId;

  const getProductById = async () => {
    await RestService.getProductById(product.productId).then((res) => {
      if (res.data.status === "success") {
        product.productOptions = res.data.data.productOptions;
      } else {
        toast[res.data.status](res.data.message);
      }
    });
  };

  useEffect(() => {
    if (open === true) {
      getProductById();
    }
  }, [open]);

  const { wishlist } = useSelector((state) => state);

  const containerClasses = classNames("product-card", {
    "product-card--layout--grid product-card--size--sm": layout === "grid-sm",
    "product-card--layout--grid product-card--size--nl": layout === "grid-nl",
    "product-card--layout--grid product-card--size--lg": layout === "grid-lg",
    "product-card--layout--list": layout === "list",
    "product-card--layout--horizontal": layout === "horizontal",
  });

  let badges = [];
  let image;
  let price;
  let features;

  badges = badges.length ? (
    <div className="product-card__badges-list">{badges}</div>
  ) : null;

  if (product.images && product.images.length > 0) {
    image = (
      <div className="product-card__image">
        <Link to={`/store/product/${product.id}`}>
          <img src={product.images[0]} alt="Product" />
        </Link>
      </div>
    );
  }

  if (product.compareAtPrice) {
    price = (
      <div className="product-card__prices">
        <span className="product-card__new-price">
          <Currency value={product.price} />
        </span>{" "}
        <span className="product-card__old-price">
          <Currency value={product.compareAtPrice} />
        </span>
      </div>
    );
  } else {
    price = (
      <div className="product-card__prices">
        <Currency value={product.price} />
      </div>
    );
  }

  if (product.features && product.features.length) {
    features = (
      <ul className="product-card__features-list">
        {product.features.map((feature, index) => {


         return <li key={index}>{`${feature.name}: ${feature.value}`}</li>
        })}
      </ul>
    );
  }

  const handleProductWithOptions = async (id, run) => {
    await RestService.getProductOptionCombination(id).then((res) => {
      if (res.data.status === "success") {
        if (res.data.data && res.data.data.length > 0) {
          setOptions(res.data.data || []);
          setOpen(true);
        } else {
          return run();
        }
      } else {
        toast.error(res.data.message);
      }
    });
  };

  const getPrice = () => {
    if (product.productId) {
      let successFound = false;
      for (let prOption of product.productOptions) {
        let success = 0;

        for (let combination of prOption.productOptionCombination) {
          if (
            options.some(
              (option) =>
                parseInt(option.optionId) === parseInt(combination.optionId) &&
                (parseInt(option.value) ===
                  parseInt(combination.optionValueId) ||
                  combination.optionTypeId === 6)
            )
          ) {
            success++;
          }

          if (success === options.length) {
            successFound = true;

            getNewPrice();
            setSlectedPr(prOption);
          }
        }

        if (!successFound) {
          setSlectedPr({});
        }
      }
    }
  };

  const handleInputChange = (event, optionId) => {
    if (event !== undefined && optionId !== undefined) {
      let index = options.findIndex((item) => {
        return item.optionId === optionId;
      });
      if (index > -1) {
        options[index].value =
          event.target.type === "checkbox"
            ? event.target.checked
            : event.target.value;
        getPrice();
        setOptions(options);
      }
    }
  };

  const handleOptionValues = (options) => {
    let SelectOptions;
    if (options && options.length)
    {
      options = sortBy(options, (option) => option.name);

      SelectOptions = options.map((item) => (
        <option value={item.optionValueId}>{item.name}</option>
      ));
    }
    return SelectOptions;
  };

  const handleSelect = (item) => {
    if (item.optionTypeName === "Select") {
      return (
        <div>
          <Label for="exampleSelect">{item.optionName}</Label>
          <div className="select_option_modal">
            <select
              required
              name={item.optionName}
              onChange={(e) => handleInputChange(e, item.optionId)}
            >
              <option value={""}>{"N/A"}</option>
              {handleOptionValues(item.optionValues)}
            </select>
          </div>
        </div>
      );
    } else if (item.optionTypeName === "Text") {
      return (
        <div>
          <Label for="exampleSelect">{item.optionName}</Label>
          <Input
            onChange={(e) => handleInputChange(e, item.optionId)}
            style={{ width: "55%" }}
            name={item.optionName}
            id="exampleText"
          />
        </div>
      );
    } else if (item.optionTypeName === "Checkbox") {
      return (
        <div>
          <Label for="exampleSelect">{item.optionName}</Label>
          <Input
            onChange={(e) => handleInputChange(e, item.optionId)}
            className="checkbox"
            style={{ display: "block", marginLeft: 10 }}
            type="checkbox"
            name={item.optionName}
          />
        </div>
      );
    } else if (item.optionTypeName === "Radio") {
      return (
        <div>
          <FormGroup check required>
            <Label for="exampleSelect">{item.optionName}</Label>
            {item.optionValues &&
              item.optionValues.map((optValue) => (
                <FormGroup check required>
                  <Label check>
                    <Input
                      required
                      type="radio"
                      name={item.optionName}
                      onChange={(e) => handleInputChange(e, item.optionId)}
                      value={optValue.optionValueId}
                    />{" "}
                    {optValue.name}
                  </Label>
                </FormGroup>
              ))}
          </FormGroup>
          {/* <Input onChange={e => handleInputChange(e, item.optionId)} name={item.optionName} style={{ display: "block", marginLeft: "0.5rem" }} type="radio" /> */}
        </div>
      );
    }
  };

  const renderOptions = () => {
    if (options !== null) {
      return options.map((item) => {
        return (
          <div className="col-12 col-sm-12 col-md-6">
            <FormGroup className="w-100">{handleSelect(item)}</FormGroup>
          </div>
        );
      });
    }
  };

  const getNewPrice = () => {
    let price = product.price;
    if (slectedPr.optionPrice) {
      switch (slectedPr.priceParam) {
        case "equal":
          price = slectedPr.optionPrice;
          break;

        case "plus":
          price = slectedPr.optionPrice + product.price;
          break;

        case "minus":
          price = slectedPr.optionPrice - product.price;
          break;

        default:
          price = product.price;
          break;
      }
    }
    return price;
  };

  const handleCartItem = () => {
    // if (product.minimumQuantity > 0) {
    //   cartAddItem(
    //     { ...product, selectedProductOption: slectedPr },
    //     options,
    //     product.minimumQuantity > 0 ? product.minimumQuantity : 1,
    //     getNewPrice(),
    //     customer
    //   );
    // } else {
    //   toast.error("Minimum quantity cannot be less than 0");
    // }
  };

  return (
    <div className={containerClasses}>
      <Modal isOpen={open} toggle={() => setOpen(!open)} centered size="lg">
        <div
          className="container"
          style={{ minWidth: "300px", minHeight: "300px", overflowY: "scroll" }}
        >
          <div className="row p-5">
            <div className="col-md-12">
              <form
                className="product__options"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCartItem();
                }}
              >
                <div className="d-flex justify-content-between">
                  <span>
                    <h4>
                      Select Options <span className="text-danger">*</span>
                    </h4>
                  </span>

                  <span>
                    With selected options price ={" "}
                    <span
                      style={{ fontSize: 18, fontWeight: "bold" }}
                      className="text-success"
                    >
                      £{getNewPrice()}
                    </span>
                  </span>
                </div>

                <div className="row mt-3">{open && renderOptions()}</div>

                <div className="mt-3">
                  <button
                    type="submit"
                    disabled={
                      slectedPr.optionQuantity
                        ? !(slectedPr.optionQuantity >= product.minimumQuantity)
                        : !(product.quantity >= product.minimumQuantity) ||
                        product.stockStatusId === 5
                    }
                    className={classNames(
                      "btn btn-primary product-card__addtocart"
                    )}
                  >
                    {slectedPr.optionQuantity
                      ? slectedPr.optionQuantity >= product.minimumQuantity
                        ? "Add to cart"
                        : product.minimumQuantity < product.quantity ||
                          product.minimumQuantity < slectedPr.optionQuantity
                        ? "Less Quantity Avaialable"
                        : "Out of Stock"
                      : product.quantity >= product.minimumQuantity
                      ? "Add to cart"
                      : product.minimumQuantity < product.quantity ||
                        product.minimumQuantity < slectedPr.optionQuantity
                      ? "Less Quantity Avaialable"
                      : "Out of Stock"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal>
      {badges}
      {image}
      <div className="product-card__info">
        <div
          style={{ color: "#ee7647", fontWeight: "bold" }}
          className="product-card__name"
        >
          <Link to={`/store/product/${product.id}`}>{product.name}</Link>
        </div>
        <div className="product-card__rating">
          <Rating value={product.rating / product.reviews} />
          <div className=" product-card__rating-legend">{`${product.reviews} Reviews`}</div>
        </div>
        {features}
      </div>
      <div className="product-card__actions">
        <div className="product-card__availability">
          Availability:
          <span className="text-success"> {console.log(product.availability)}</span>
        </div>

        <div className="product-card__availability">
          Manufacturer:
          <span style={{ fontWeight: "bold", color: "black" }}>
            {console.log(product.model)}
          </span>
        </div>

        {price}

        <div className="product-card__buttons">
          <AsyncAction
            action={() => {
              if (product.minimumQuantity > 0) {
                return cartAddItem(
                  product,
                  options,
                  product.minimumQuantity > 0 ? product.minimumQuantity : 1,
                  getNewPrice(),
                  customer
                );
              } else {
                toast.error("Quantity cannot be less than 0");
              }
            }}
            render={({ run, loading }) => (
              <React.Fragment>
                <button
                  type="button"
                  disabled={
                    slectedPr.optionQuantity
                        ? !(slectedPr.optionQuantity >= product.minimumQuantity)
                        : !(product.quantity >= product.minimumQuantity) ||
                        product.stockStatusId === 5
                  }
                  onClick={() => {
                    handleProductWithOptions(product.id, run);
                  }}
                  className={"btn btn-primary product-card__addtocart"}
                >
                  Add to cart
                </button>
                <Link
                  type="button"
                  onClick={run}
                  to={`/store/product/${product.id}`}
                  className={classNames(
                    "btn btn-secondary product-card__addtocart product-card__addtocart--list"
                  )}
                >
                  View Product
                </Link>
              </React.Fragment>
            )}
          />

          <AsyncAction
            action={() =>
              wishlist.length > 0 &&
              wishlist.some((item) => item.productId === product.productId)
                ? wishlistRemoveItem(product.productId)
                : wishlistAddItem(product)
            }
            render={({ run, loading }) => (
              <button
                type="button"
                onClick={run}
                className={classNames(
                  "btn btn-light btn-svg-icon btn-svg-icon--fake-svg product-card__wishlist",
                  {
                    "btn-loading": loading,
                  }
                )}
              >
                {wishlist.length > 0 &&
                wishlist.some(
                  (item) => item.productId === product.productId
                ) ? (
                  <Wishlist16SvgRed />
                ) : (
                  <Wishlist16Svg />
                )}
              </button>
            )}
          />
        </div>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  /**
   * product object
   */
  product: PropTypes.object.isRequired,
  /**
   * product card layout
   * one of ['grid-sm', 'grid-nl', 'grid-lg', 'list', 'horizontal']
   */
  layout: PropTypes.oneOf([
    "grid-sm",
    "grid-nl",
    "grid-lg",
    "list",
    "horizontal",
  ]),
};

const mapStateToProps = (state) => {
  return {
    customer: state.auth.profile,
  };
};

const mapDispatchToProps = {
  cartAddItem,
  wishlistAddItem,
  compareAddItem,
  quickviewOpen,
  wishlistRemoveItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductCard);
