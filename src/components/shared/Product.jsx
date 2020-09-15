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
import "../../assets/CSS/customStylesForInputs.css";


class Product extends Component {
    constructor(props) {
        super(props);

        this.state = {
            quantity: parseInt(this.props.product.minimumQuantity),
            productPlusOptions: this.props.product.productOptions ? this.props.product.productOptions : []
        };
    }


    componentDidMount() {
        if (this.props.product.minimumQuantity) {
            this.setState({
                quantity : parseInt(this.props.product.minimumQuantity)
            })
        }
    }


    handleChangeQuantity = (quantity) => {
        this.setState({quantity});
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.product != prevProps.product) {
            this.setState({
                productPlusOptions: this.props.product.productOptions
            })

            this.setState({
                quantity: parseInt(this.props.product.minimumQuantity)
            })

        }
    }

    handleInputChange = (event, optionId) => {
        if (event && optionId) {
           let index =   this.state.productPlusOptions.findIndex(item => item.optionId === optionId)
            if (index > -1) {
                this.state.productPlusOptions[index].value = event.target.value;

                this.setState({
                    productPlusOptions: this.state.productPlusOptions
                })

            }
        }
    }

    render() {

        console.log(this.state.quantity, "QuantitiyPrice");

        let CartObj = localStorage.getItem("state");
        if(CartObj){
            let Cart = JSON.parse(CartObj).cart;
        }
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
                SelectOptions = options.map(item => <option value={item.optionValueId}>{item.name}</option>)
            }
            return SelectOptions;
        }

        const handleSelect = (item) => {


            if (item.optionTypeName === "Select") {
                return <div>
                    <Label for="exampleSelect">{item.optionName}</Label>
                    <div className="select">
                        <select name={item.optionName} onChange={e => this.handleInputChange(e, item.optionId)}>
                            {handleOptionValues(item.optionValues)}
                        </select>
                    </div>
                </div>
            } else if (item.optionTypeName === "File") {

                return <div>
                    <Label for="exampleSelect">{item.optionName}</Label>
                    <Input onChange={e => this.handleInputChange(e, item.optionId)} style={{width:"55%"}} type="file" name={item.optionName} id="exampleFile"/>
                </div>

            } else if (item.optionTypeName === "Text") {

                return <div>
                    <Label for="exampleSelect">{item.optionName}</Label>
                    <Input onChange={e => this.handleInputChange(e, item.optionId)} style={{width:"55%"}} name={item.optionName} id="exampleText"/>
                </div>

            } else if (item.optionTypeName === "Date") {

                return <div>
                    <Label for="exampleSelect">{item.optionName}</Label>
                    <Input onChange={e => this.handleInputChange(e, item.optionId)} style={{width:"55%"}} type={"date"} name={item.optionName} id="exampleText"/>
                </div>

            } else if (item.optionTypeName === "TextArea") {

                return <div>
                    <Label for="exampleSelect">{item.optionName}</Label>
                    <Input onChange={e => this.handleInputChange(e, item.optionId)} style={{width:"55%"}} type="textarea" name={item.optionName} id="exampleTextArea"/>
                </div>

            } else if (item.optionTypeName === "Checkbox") {

                return <div>
                    <Label for="exampleSelect">{item.optionName}</Label>
                    <Input onChange={e => this.handleInputChange(e, item.optionId)} className="checkbox" style={{display:"block", marginLeft: "10px"}} type="checkbox" name={item.optionName}/>
                </div>

            } else if (item.optionTypeName === "Time") {

                return <div>
                    <Label for="exampleSelect">{item.optionName}</Label>
                    <Input onChange={e => this.handleInputChange(e, item.optionId)} name={item.optionName} style={{width:"55%"}} type="time"/>
                </div>

            } else if (item.optionTypeName === "Radio") {

                return <div>
                    <Label for="exampleSelect">{item.optionName}</Label>
                    <Input onChange={e => this.handleInputChange(e, item.optionId)} name={item.optionName} style={{display: "block", marginLeft: "0.5rem"}} type="radio"/>
                </div>

            } else if (item.optionTypeName === "Date & Time") {

                return <div>
                    <Label for="exampleSelect">{item.optionName}</Label>
                    <input onChange={e => this.handleInputChange(e, item.optionId)} name={item.optionName} style={{width:"55%"}} type="datetime-local"/>
                </div>
            }


        }

        const renderOptions = () => {
            if (product.productOptions != null) {

                return product.productOptions.map(item => {
                    return <FormGroup>
                        {
                            handleSelect(item.option)
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

        console.log(quantity, "allQuantity")

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
                            {product.sku ?
                                <li>SKU: {product.sku}</li>
                                :null
                            }
                            {product.upc ?
                                <li>UPC: {product.upc}</li>
                                :null
                            }
                            {product.ean ?
                                <li>EAN: {product.ean}</li>
                                :null
                            }
                            {product.jan ?
                                <li>JAN: {product.jan}</li>
                                :null
                            }
                            {product.isbn ?
                                <li>ISBN: {product.isbn}</li>
                                :null
                            }
                            {product.mpn ?
                                <li>ISBN: {product.mpn}</li>
                                :null
                            }
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
                                <h4>Available Options</h4>
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
                                            min={parseInt(product.minimumQuantity)}
                                            value={quantity}
                                            onChange={this.handleChangeQuantity}
                                        />
                                    </div>
                                    <div className="product__actions-item product__actions-item--addtocart">
                                        <AsyncAction
                                            action={() => {
                                                let prr = product
                                                prr.productOptions = this.state.productPlusOptions
                                                return cartAddItem(prr, [], quantity)
                                            }}
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
