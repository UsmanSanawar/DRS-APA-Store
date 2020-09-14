// react
import React, {Component} from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {Form, FormGroup, Input, Label} from "reactstrap";
// application
import AsyncAction from './AsyncAction';
import Currency from './Currency';
import InputNumber from './InputNumber';
import ProductGallery from './ProductGallery';
import Rating from './Rating';
import {cartAddItem} from '../../store/cart';
import {compareAddItem} from '../../store/compare';
import {Compare16Svg, Wishlist16Svg} from '../../svg';
import {wishlistAddItem} from '../../store/wishlist';


class Product extends Component {
    constructor(props) {
        super(props);

        this.state = {
            quantity: 1,
        };
    }

    handleChangeQuantity = (quantity) => {
        this.setState({quantity});
    };

    render() {
        const {
            product,
            layout,
            wishlistAddItem,
            compareAddItem,
            cartAddItem,
        } = this.props;
        const {quantity} = this.state;
        let prices;


        const handleOptionValues = (options) => {
            let SelectOptions;
            if (options && options.length) {
                SelectOptions = options.map(item => <option value={item.optionValue}>{item.name}</option>)
            }
            return SelectOptions;
        }

        const handleSelect = (item) => {
            if (item.optionTypeName === "Select") {
                return <Input type="select" name="select" id="exampleSelect">
                    {handleOptionValues(item.optionValues)}
                </Input>
            } else if (item.optionTypeName === "File") {
                return <Input type="file" name="file" id="exampleFile"/>
            } else if (item.optionTypeName === "Text") {
                return <Input name="text" id="exampleText"/>
            } else if (item.optionTypeName === "Date") {
                return <Input type={"date"} name="text" id="exampleText"/>
            } else if (item.optionTypeName === "TextArea") {
                return <Input type="textarea" name="textArea" id="exampleTextArea"/>
            } else if (item.optionTypeName === "Checkbox") {
                return <Input style={{display: "block", marginLeft: "0.5rem"}} type="checkbox"/>
            } else if (item.optionTypeName === "Time") {
                return <Input type="time"/>
            } else if (item.optionTypeName === "Radio") {
                return <Input style={{display: "block", marginLeft: "0.5rem"}} type="radio"/>
            } else if (item.optionTypeName === "Date & Time") {
                return <input type="datetime-local"/>
            }


        }

        const renderOptions = () => {
            if (product.productOptions != null) {

                return product.productOptions.map(item => {
                    return <FormGroup>
                        <Label for="exampleSelect">{item.option.optionName}</Label>
                        {
                            // item.option.optionTypeName === "Select" ?
                            handleSelect(item.option)
                            // : console.log("")
                        }
                    </FormGroup>
                })
            }
        }

        if (product.compareAtPrice) {
            prices = (
                <React.Fragment>
                    <span className="product__new-price"><Currency value={product.price}/></span>
                    {' '}
                    <span className="product__old-price"><Currency value={product.compareAtPrice}/></span>
                </React.Fragment>
            );
        } else {
            prices = <Currency value={product.price}/>;
        }

        return (
            <div className={`product product--layout--${layout}`}>
                <div className="product__content">
                    <ProductGallery layout={layout} images={product.productPhotos}/>

                    <div className="product__info">
                        <div className="product__wishlist-compare">
                            <AsyncAction
                                action={() => wishlistAddItem(product)}
                                render={({run, loading}) => (
                                    <button
                                        type="button"
                                        data-toggle="tooltip"
                                        data-placement="right"
                                        title="Wishlist"
                                        onClick={run}
                                        className={classNames('btn btn-sm btn-light btn-svg-icon', {
                                            'btn-loading': loading,
                                        })}
                                    >
                                        <Wishlist16Svg/>
                                    </button>
                                )}
                            />
                            <AsyncAction
                                action={() => compareAddItem(product)}
                                render={({run, loading}) => (
                                    <button
                                        type="button"
                                        data-toggle="tooltip"
                                        data-placement="right"
                                        title="Compare"
                                        onClick={run}
                                        className={classNames('btn btn-sm btn-light btn-svg-icon', {
                                            'btn-loading': loading,
                                        })}
                                    >
                                        <Compare16Svg/>
                                    </button>
                                )}
                            />
                        </div>
                        <h1 className="product__name">{product.productName}</h1>
                        <div className="product__rating">
                            <div className="product__rating-stars">
                                <Rating value={product.rating}/>
                            </div>
                            <div className="product__rating-legend">
                                <Link to="/">{`${product.reviews} Reviews`}</Link>
                                <span>/</span>
                                <Link to="/">Write A Review</Link>
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
                                {' '}
                                <span className="text-success">{product.stockStatusName}</span>
                            </li>
                            <li>Brand:<Link to="/">{product.manufacturerName}</Link></li>
                            <li>SKU: {product.sku}</li>
                        </ul>
                    </div>

                    <div className="product__sidebar">
                        <div className="product__availability">
                            Availability:
                            {' '}
                            <span className="text-success">{product.stockStatusName}</span>
                        </div>

                        <div className="product__prices">
                            {prices}
                        </div>

                        <form className="product__options">
                            {/*<div className="form-group product__option">*/}
                            {/*    <div className="product__option-label">Color</div>*/}
                            {/*    <div className="input-radio-color">*/}
                            {/*        <div className="input-radio-color__list">*/}
                            {/*            <label*/}
                            {/*                className="input-radio-color__item input-radio-color__item--white"*/}
                            {/*                style={{color: '#fff'}}*/}
                            {/*                data-toggle="tooltip"*/}
                            {/*                title="White"*/}
                            {/*            >*/}
                            {/*                <input type="radio" name="color"/>*/}
                            {/*                <span/>*/}
                            {/*            </label>*/}
                            {/*            <label*/}
                            {/*                className="input-radio-color__item"*/}
                            {/*                style={{color: '#ffd333'}}*/}
                            {/*                data-toggle="tooltip"*/}
                            {/*                title="Yellow"*/}
                            {/*            >*/}
                            {/*                <input type="radio" name="color"/>*/}
                            {/*                <span/>*/}
                            {/*            </label>*/}
                            {/*            <label*/}
                            {/*                className="input-radio-color__item"*/}
                            {/*                style={{color: '#ff4040'}}*/}
                            {/*                data-toggle="tooltip"*/}
                            {/*                title="Red"*/}
                            {/*            >*/}
                            {/*                <input type="radio" name="color"/>*/}
                            {/*                <span/>*/}
                            {/*            </label>*/}
                            {/*            <label*/}
                            {/*                className="input-radio-color__item input-radio-color__item--disabled"*/}
                            {/*                style={{color: '#4080ff'}}*/}
                            {/*                data-toggle="tooltip"*/}
                            {/*                title="Blue"*/}
                            {/*            >*/}
                            {/*                <input type="radio" name="color" disabled/>*/}
                            {/*                <span/>*/}
                            {/*            </label>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                            <div className="form-group product__option">
                                <div className="product__option-label">Available Options</div>
                                <div className="input-radio-label">
                                    <Form>

                                        {renderOptions()}

                                    </Form>
                                    {/*<div className="input-radio-label__list">*/}
                                    {/*    <label>*/}
                                    {/*        <input type="radio" name="material"/>*/}
                                    {/*        <span>Metal</span>*/}
                                    {/*    </label>*/}
                                    {/*    <label>*/}
                                    {/*        <input type="radio" name="material"/>*/}
                                    {/*        <span>Wood</span>*/}
                                    {/*    </label>*/}
                                    {/*    <label>*/}
                                    {/*        <input type="radio" name="material" disabled/>*/}
                                    {/*        <span>Plastic</span>*/}
                                    {/*    </label>*/}
                                    {/*</div>*/}
                                </div>
                            </div>
                            <div className="form-group product__option">
                                <label htmlFor="product-quantity" className="product__option-label">Quantity</label>
                                <div className="product__actions">
                                    <div className="product__actions-item">
                                        <InputNumber
                                            id="product-quantity"
                                            aria-label="Quantity"
                                            className="product__quantity"
                                            size="lg"
                                            min={1}
                                            value={quantity}
                                            onChange={this.handleChangeQuantity}
                                        />
                                    </div>
                                    <div className="product__actions-item product__actions-item--addtocart">
                                        <AsyncAction
                                            action={() => cartAddItem(product, [], quantity)}
                                            render={({run, loading}) => (
                                                <button
                                                    type="button"
                                                    onClick={run}
                                                    className={classNames('btn btn-primary btn-lg', {
                                                        'btn-loading': loading,
                                                    })}
                                                >
                                                    Add to cart
                                                </button>
                                            )}
                                        />
                                    </div>

                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="product__footer">
                        <div className="product__tags tags">
                            {/*<div className="tags__list">*/}
                            {/*    <Link to="/">Mounts</Link>*/}
                            {/*    <Link to="/">Electrodes</Link>*/}
                            {/*    <Link to="/">Chainsaws</Link>*/}
                            {/*</div>*/}
                        </div>

                        <div className="product__share-links share-links">
                            <ul className="share-links__list">
                                <li className="share-links__item share-links__item--type--like"><Link to="/">Like</Link>
                                </li>
                                <li className="share-links__item share-links__item--type--tweet"><Link
                                    to="/">Tweet</Link></li>
                                <li className="share-links__item share-links__item--type--pin"><Link to="/">Pin
                                    It</Link></li>
                                {/* <li className="share-links__item share-links__item--type--counter"><Link to="/">4K</Link></li> */}
                            </ul>
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
    layout: PropTypes.oneOf(['standard', 'sidebar', 'columnar', 'quickview']),
};

Product.defaultProps = {
    layout: 'standard',
};

const mapDispatchToProps = {
    cartAddItem,
    wishlistAddItem,
    compareAddItem,
};

export default connect(
    () => ({}),
    mapDispatchToProps,
)(Product);
