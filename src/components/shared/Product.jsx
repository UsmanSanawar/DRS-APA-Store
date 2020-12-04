// react
import React, { Component } from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Form, FormGroup, Input, Label } from "reactstrap";
// application
import { Helmet } from "react-helmet";
import AsyncAction from "./AsyncAction";
import Currency from "./Currency";
import InputNumber from "./InputNumber";
import ProductGallery from "./ProductGallery";
import Rating from "./Rating";
import { cartAddItem } from "../../store/cart";
import { compareAddItem } from "../../store/compare";
import { Compare16Svg, Wishlist16Svg } from "../../svg";
import { wishlistAddItem } from "../../store/wishlist";
import "../../assets/CSS/customStylesForInputs.css";
import RestService from "../../store/restService/restService";

import { BASE_URL, IMAGE_URL } from "../../constant/constants";

class Product extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quantity: parseInt(this.props.product.minimumQuantity),
      // productPlusOptions: this.props.product.productOptions ? this.props.product.productOptions : [],
      options: [],
      slectedPr: {},
    };
  }

  componentDidMount() {
    // console.log(window.addthis.layers(), 'wondow addt this c');

    if (window.addthis && window.addthis.layers) {
      window.addthis.layers();
    }
    if (this.props.product.minimumQuantity) {
      this.setState({
        quantity: parseInt(this.props.product.minimumQuantity),
      });
    }

    this.getProductOptionCombination();
  }

  handleChangeQuantity = (quantity) => {
    this.setState({ quantity });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.product !== prevProps.product) {
      const { product } = this.props;
      const { prForShar } = this.state;

      this.getProductOptionCombination();
      this.setState({
        quantity: parseInt(this.props.product.minimumQuantity),
      });
    }
  }

  getProductOptionCombination = () => {
    if (this.props.product.productId) {
      RestService.getProductOptionCombination(
        this.props.product.productId
      ).then((res) => {
        if (res.data.status == "success") {
          this.setState({
            options: res.data.data !== null ? res.data.data : [],
          });
        }
      });
    }
  };

  getPrice = () => {
    if (this.props.product.productId) {
      let successFound = false;
      for (let prOption of this.props.product.productOptions) {
        let success = 0;
        for (let combination of prOption.productOptionCombination) {
          if (
            this.state.options.some(
              (option) =>
                option.optionId == combination.optionId &&
                (option.value == combination.optionValueId ||
                  combination.optionTypeId == 6)
            )
          ) {
            success++;
          }
        }

        if (success == this.state.options.length) {
          successFound = true;
          this.setState({
            slectedPr: prOption,
          });
        }

        if (!successFound) {
          // alert('else')
          this.setState({
            slectedPr: {},
          });
        }
      }
    }
  };

  handleInputChange = (event, optionId) => {
    if (event !== undefined && optionId !== undefined) {
      let index = this.state.options.findIndex((item) => {
        // return item.optionValues.some(comb => comb.optionId === optionId)
        return item.optionId == optionId;
      });
      //    alert(index)
      if (index > -1) {
        this.state.options[index].value =
          event.target.type == "checkbox"
            ? event.target.checked
            : event.target.value;
        this.setState(
          {
            options: this.state.options,
          },
          () => {
            this.getPrice();
          }
        );
      }
    }
  };

  render() {
    const {
      product,
      layout,
      wishlistAddItem,
      compareAddItem,
      cartAddItem,
    } = this.props;

    const { quantity } = this.state;

    const handleOptionValues = (options) => {
      let SelectOptions;
      if (options && options.length) {
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
            <div className="select">
              <select
                required
                name={item.optionName}
                onChange={(e) => this.handleInputChange(e, item.optionId)}
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
              onChange={(e) => this.handleInputChange(e, item.optionId)}
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
              onChange={(e) => this.handleInputChange(e, item.optionId)}
              className="checkbox"
              style={{ display: "block", marginLeft: "10px" }}
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
                        onChange={(e) =>
                          this.handleInputChange(e, item.optionId)
                        }
                        value={optValue.optionValueId}
                      />{" "}
                      {optValue.name}
                    </Label>
                  </FormGroup>
                ))}
            </FormGroup>
            {/* <Input onChange={e => this.handleInputChange(e, item.optionId)} name={item.optionName} style={{ display: "block", marginLeft: "0.5rem" }} type="radio" /> */}
          </div>
        );
      }
    };

    const renderOptions = () => {
      if (this.state.options !== null) {
        return this.state.options.map((item) => {
          return <FormGroup>{handleSelect(item)}</FormGroup>;
        });
      }
    };

    const getRatingCal = () => {
      return product.totalRating / product.totalReviewsCount;
    };

    const getNewPrice = () => {
      let price = product.price;
      if (this.state.slectedPr.optionPrice) {
        switch (this.state.slectedPr.priceParam) {
          case "equal":
            price = this.state.slectedPr.optionPrice;
            break;

          case "plus":
            price = this.state.slectedPr.optionPrice + product.price;
            break;

          case "minus":
            price = this.state.slectedPr.optionPrice - product.price;
            break;

          default:
            price = product.price;
            break;
        }
      }
      return price;
    };

    return (
      <div className={`product product--layout--${layout}`}>
        <Helmet>
          <title>{`FAQ — ${product.productName}`}</title>
          <meta property="og:title" content="European Travel Destinations" />
          <meta
            property="og:description"
            content="Offering tour packages for individuals or groups."
          />
          <meta
            property="og:image"
            content="https://drsapa.ddns.net:3450/Uploads/800px_COLOURBOX2650448.jpg"
          />
          <meta
            property="og:url"
            content="https://drsapa.ddns.net:2550/#/store/product/104"
          ></meta>
        </Helmet>

        <div className="product__content">
          <ProductGallery
            layout={layout}
            images={
              this.state.slectedPr.images
                ? [{ name: this.state.slectedPr.images }]
                : product.productPhotos
            }
          />

          <div className="product__info">
            <div className="product__wishlist-compare">
              <AsyncAction
                action={() => wishlistAddItem(product)}
                render={({ run, loading }) => (
                  <button
                    type="button"
                    data-toggle="tooltip"
                    data-placement="right"
                    title="Wishlist"
                    onClick={run}
                    className={classNames("btn btn-sm btn-light btn-svg-icon", {
                      "btn-loading": loading,
                    })}
                  >
                    <Wishlist16Svg />
                  </button>
                )}
              />
              <AsyncAction
                action={() => compareAddItem(product)}
                render={({ run, loading }) => (
                  <button
                    type="button"
                    data-toggle="tooltip"
                    data-placement="right"
                    title="Compare"
                    onClick={run}
                    className={classNames("btn btn-sm btn-light btn-svg-icon", {
                      "btn-loading": loading,
                    })}
                  >
                    <Compare16Svg />
                  </button>
                )}
              />
            </div>
            <h1 className="product__name">{product.productName}</h1>
            <div className="product__rating">
              <div className="product__rating-stars">
                <Rating value={getRatingCal()} />
              </div>
              <div className="product__rating-legend">
                <span>{`${
                  product.totalReviewsCount ? product.totalReviewsCount : 0
                } Reviews`}</span>
              </div>
            </div>
            <div className="product__description">
              {/* <div dangerouslySetInnerHTML={{__html: product.description}} />  */}
            </div>
            <ul className="product__features">
              <li>Speed: 750 RPM</li>
              <li>Power Source: Cordless-Electric</li>
              <li>Battery Cell Type: Lithium</li>
              <li>Voltage: 20 Volts</li>
              <li>Battery Capacity: 2 Ah</li>
            </ul>
            <ul className="product__meta">
              <li className="product__meta-availability">
                Availability:
                <span className="text-success">{product.stockStatusName}</span>
              </li>

              {product.manufacturerName ? (
                <li>Brand: {product.manufacturerName}</li>
              ) : null}

              {this.state.slectedPr.optionModel ? (
                <li>Model: {this.state.slectedPr.optionModel}</li>
              ) : null}
              {product.sku ? <li>SKU: {product.sku}</li> : null}
              {product.upc ? <li>UPC: {product.upc}</li> : null}
              {product.ean ? <li>EAN: {product.ean}</li> : null}
              {product.jan ? <li>JAN: {product.jan}</li> : null}
              {product.isbn ? <li>ISBN: {product.isbn}</li> : null}
              {product.mpn ? <li>ISBN: {product.mpn}</li> : null}
            </ul>
          </div>

          <div className="product__sidebar">
            <div className="product__availability">
              Availability:{" "}
              <span className="text-success">{product.stockStatusName}</span>
            </div>

            <div className="product__prices">
              <Currency value={getNewPrice()} />
            </div>

            <form
              className="product__options"
              onSubmit={(e) => {
                e.preventDefault();
                cartAddItem(
                  { ...product, selectedProductOption: this.state.slectedPr },
                  this.state.options,
                  quantity,
                  getNewPrice()
                );
                // alert(2)
              }}
            >
              <div className="form-group product__option">
                <h4>Available Options</h4>
                <div className="input-radio-label">{renderOptions()}</div>
              </div>
              <div className="form-group product__option">
                <label
                  htmlFor="product-quantity"
                  className="product__option-label"
                >
                  Quantity{" "}
                  <small style={{ color: "green" }}>
                    (Avaiable Quantity: {product.quantity})
                  </small>
                </label>
                <div className="product__actions">
                  <div className="product__actions-item">
                    <InputNumber
                      id="product-quantity"
                      aria-label="Quantity"
                      className="product__quantity"
                      optionQuantity={this.state.slectedPr.optionQuantity}
                      productQuantity={product.quantity}
                      stateQuantity={this.state.quantity}
                      size="lg"
                      min={parseInt(product.minimumQuantity)}
                      value={quantity}
                      onChange={this.handleChangeQuantity}
                    />
                  </div>
                  <div className="product__actions-item product__actions-item--addtocart">
                    {/* <AsyncAction
                                            action={() => {
                                                // prr.productOptions = this.state.productPlusOptions
                                                return cartAddItem(product, this.state.options, quantity, getNewPrice())
                                            }}
                                            render={({ run, loading }) => ( */}
                    <button
                      type="submit"
                      disabled={
                        this.state.slectedPr.optionQuantity
                          ? !(
                              this.state.slectedPr.optionQuantity >=
                              this.state.quantity
                            )
                          : !(product.quantity >= this.state.quantity)
                      }
                      className={classNames("btn btn-primary btn-lg", {
                        "btn-loading": "",
                      })}
                    >
                      {this.state.slectedPr.optionQuantity
                        ? this.state.slectedPr.optionQuantity >=
                          this.state.quantity
                          ? "Add to cart"
                          : product.minimumQuantity < product.quantity ||
                            product.minimumQuantity <
                              this.state.slectedPr.optionQuantity
                          ? "Less Quantity Avaialable"
                          : "Out of Stock"
                        : product.quantity >= this.state.quantity
                        ? "Add to cart"
                        : product.minimumQuantity < product.quantity ||
                          product.minimumQuantity <
                            this.state.slectedPr.optionQuantity
                        ? "Less Quantity Avaialable"
                        : "Out of Stock"}
                    </button>
                    {/* )}
                                        /> */}
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="product__footer">
            <div className="product__share-links share-links">
              {/* <div className="addthis_inline_share_toolbox" data-url={'http://drsapa.ddns.net:2550/#/store/product/104'}
                        data-description={product.description}
                        data-title={product.productName} data-media={`${IMAGE_URL}/${product.productPhotos && product.productPhotos.length > 0 ? product.productPhotos[0].name: ''}`  }
                        ></div> */}

              <div
                className="addthis_inline_share_toolbox"
                data-url="https://drsapa.ddns.net:2550/#/store/product/104"
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Product.propTypes = {
  // /** product object */
  product: PropTypes.object.isRequired,
  /** one of ['standard', 'sidebar', 'columnar', 'quickview'] (default: 'standard') */
  layout: PropTypes.oneOf(["standard", "sidebar", "columnar", "quickview"]),
};

Product.defaultProps = {
  layout: "standard",
};

const mapDispatchToProps = {
  cartAddItem,
  wishlistAddItem,
  compareAddItem,
};

export default connect(() => ({}), mapDispatchToProps)(Product);
