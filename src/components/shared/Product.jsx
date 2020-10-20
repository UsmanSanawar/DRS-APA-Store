// react
import React, { Component } from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, FormGroup, Input, Label } from "reactstrap";
// application
import { Helmet } from 'react-helmet';
import AsyncAction from './AsyncAction';
import Currency from './Currency';
import InputNumber from './InputNumber';
import ProductGallery from './ProductGallery';
import Rating from './Rating';
import { cartAddItem } from '../../store/cart';
import { compareAddItem } from '../../store/compare';
import { Compare16Svg, Wishlist16Svg } from '../../svg';
import { wishlistAddItem } from '../../store/wishlist';
import "../../assets/CSS/customStylesForInputs.css";
import RestService from '../../store/restService/restService';
import { BASE_URL, IMAGE_URL } from "../../constant/constants"

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
        console.log(window.addthis.layers(), 'wondow addt this c');

        if (window.addthis && window.addthis.layers) {
            window.addthis.layers();
        }
        if (this.props.product.minimumQuantity) {
            this.setState({
                quantity: parseInt(this.props.product.minimumQuantity)
            })
        }


        this.getProductOptionCombination()
    }


    handleChangeQuantity = (quantity) => {
        this.setState({ quantity });

    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.product != prevProps.product) {
            const { product } = this.props
            const { prForShar } = this.state
            //  prForShar.data_url = 'http://192.3.213.101:2550/#/store/product/104'
            //  prForShar.data_title = product.productName
            //  prForShar.data_media = product.productPhotos.length > 0 ? `${IMAGE_URL}/${product.productPhotos[0].name}`: ''

            // this.setState({
            //     prForShar
            // },()=>{
            //     if(window.addthis){
            //         window.addthis.layers.refresh();
            //     }
            // })



            // window.addthis.update('share', 'media', 'http://i.imgur.com/sI5mrZP.png');
            // window.addthis.update('share', 'url', 'http://192.3.213.101:2550/#/store/product/104');


            console.log(product.productPhotos.length > 0 ? IMAGE_URL + '/' + product.productPhotos[0].name : '', 'product.productPhotos[0].name image');


            this.getProductOptionCombination()
            this.setState({
                quantity: parseInt(this.props.product.minimumQuantity)
            })


        }
    }

    getProductOptionCombination = () => {

        if (this.props.product.productId) {
            RestService.getProductOptionCombination(this.props.product.productId).then(res => {
                if (res.data.status == 'success') {
                    this.setState({
                        options: res.data.data != null ? res.data.data : []
                    })
                }
            })
        }
    }

    getPrice = () => {
        if (this.props.product.productId) {
            let successFound = false;
            for (let prOption of this.props.product.productOptions) {
                let success = 0;
                for (let combination of prOption.productOptionCombination) {
                    console.log(combination, 'option ptions combination ', this.state.options);
                    if (this.state.options.some(option => option.optionId == combination.optionId && option.value == combination.optionValueId)) {
                        success++
                    }
                }

                console.log(success, 'success, sucees', this.state.options.length);

                if (success == this.state.options.length) {
                    successFound = true
                    this.setState({
                        slectedPr: prOption
                    })
                }

                if (!successFound) {
                    // alert('else')
                    this.setState({
                        slectedPr: {}
                    })
                }
            }
        }

    }



    handleInputChange = (event, optionId) => {
        console.log(event, optionId, 'event && optionId', this.state.options);

        if (event != undefined && optionId != undefined) {

            let index = this.state.options.findIndex(item => {
                return item.optionValues.some(comb => comb.optionId === optionId)
                //   return item.optionId === optionId
            })
            //    alert(index)
            if (index > -1) {
                this.state.options[index].value = event.target.value;
                this.setState({
                    options: this.state.options
                }, () => {
                    this.getPrice()
                })

            }

        }
    }



    render() {

        console.log(window.addthis, 'sdfaf');

        // if(window.addthis){
        //     if(document.getElementById('share-btn') != null){
        //         document.getElementById('share-btn').setAttribute('data-media', 'http://i.imgur.com/sI5mrZP.png')
        //     }

        //     window.addthis.update('share', 'media', 'http://i.imgur.com/sI5mrZP.png');
        //     window.addthis.media = "http://i.imgur.com/sI5mrZP.png";
        //     window.addthis.toolbox(".addthis_toolbox");
        // }


        const {
            product,
            layout,
            wishlistAddItem,
            compareAddItem,
            cartAddItem,
        } = this.props;
        console.log(this.state.slectedPr, "slectedPr", product);

        let CartObj = localStorage.getItem("state");
        if (CartObj) {
            let Cart = JSON.parse(CartObj).cart;
        }


        const { quantity } = this.state;
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
                            <option value={null}>{'N/A'}</option>
                            {handleOptionValues(item.optionValues)}
                        </select>
                    </div>
                </div>
            } else if (item.optionTypeName === "File") {

                return <div>
                    <Label for="exampleSelect">{item.optionName}</Label>
                    <Input onChange={e => this.handleInputChange(e, item.optionId)} style={{ width: "55%" }} type="file" name={item.optionName} id="exampleFile" />
                </div>

            } else if (item.optionTypeName === "Text") {

                return <div>
                    <Label for="exampleSelect">{item.optionName}</Label>
                    <Input onChange={e => this.handleInputChange(e, item.optionId)} style={{ width: "55%" }} name={item.optionName} id="exampleText" />
                </div>

            } else if (item.optionTypeName === "Date") {

                return <div>
                    <Label for="exampleSelect">{item.optionName}</Label>
                    <Input onChange={e => this.handleInputChange(e, item.optionId)} style={{ width: "55%" }} type={"date"} name={item.optionName} id="exampleText" />
                </div>

            } else if (item.optionTypeName === "TextArea") {

                return <div>
                    <Label for="exampleSelect">{item.optionName}</Label>
                    <Input onChange={e => this.handleInputChange(e, item.optionId)} style={{ width: "55%" }} type="textarea" name={item.optionName} id="exampleTextArea" />
                </div>

            } else if (item.optionTypeName === "Checkbox") {

                return <div>
                    <Label for="exampleSelect">{item.optionName}</Label>
                    <Input onChange={e => this.handleInputChange(e, item.optionId)} className="checkbox" style={{ display: "block", marginLeft: "10px" }} type="checkbox" name={item.optionName} />
                </div>

            } else if (item.optionTypeName === "Time") {

                return <div>
                    <Label for="exampleSelect">{item.optionName}</Label>
                    <Input onChange={e => this.handleInputChange(e, item.optionId)} name={item.optionName} style={{ width: "55%" }} type="time" />
                </div>

            } else if (item.optionTypeName === "Radio") {

                return <div>
                    <Label for="exampleSelect">{item.optionName}</Label>
                    <Input onChange={e => this.handleInputChange(e, item.optionId)} name={item.optionName} style={{ display: "block", marginLeft: "0.5rem" }} type="radio" />
                </div>

            } else if (item.optionTypeName === "Date & Time") {

                return <div>
                    <Label for="exampleSelect">{item.optionName}</Label>
                    <input onChange={e => this.handleInputChange(e, item.optionId)} name={item.optionName} style={{ width: "55%" }} type="datetime-local" />
                </div>
            }

        }

        const renderOptions = () => {
            if (this.state.options != null) {
                return this.state.options.map(item => {
                    return <FormGroup>
                        {
                            handleSelect(item)
                        }
                    </FormGroup>
                })
            }
        }

        if (product.compareAtPrice) {
            prices = (
                <React.Fragment>
                    <span className="product__new-price"><Currency value={product.price} /></span>
                    {' '}
                    <span className="product__old-price"><Currency value={product.compareAtPrice} /></span>
                </React.Fragment>
            );
        } else {
            prices = <Currency value={product.price} />;
        }

        const getRatingCal = () => {
            return product.totalRating / product.totalReviewsCount

        }

        console.log(layout, "|LAayout")
        return (
            <div className={`product product--layout--${layout}`}>

                <Helmet>
                    <title>{`FAQ — ${product.productName}`}</title>
                    <meta property="og:title" content="European Travel Destinations" />
                    <meta property="og:description" content="Offering tour packages for individuals or groups." />
                    <meta property="og:image" content="http://192.3.213.101:3450/Uploads/800px_COLOURBOX2650448.jpg" />
                    <meta property="og:url" content="http://192.3.213.101:2550/#/store/product/104"></meta>
                </Helmet>

                <div className="product__content">
                    <ProductGallery layout={layout} images={product.productPhotos} />

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
                                        className={classNames('btn btn-sm btn-light btn-svg-icon', {
                                            'btn-loading': loading,
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
                                        className={classNames('btn btn-sm btn-light btn-svg-icon', {
                                            'btn-loading': loading,
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
                                <span>{`${product.totalReviewsCount ? product.totalReviewsCount : 0} Reviews`}</span>
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
                                {console.log(product, "availableii")}
                                <span className="text-success">{product.stockStatusName}</span>
                            </li>

                            {product.manufacturerName ? <li>Brand: {product.manufacturerName}</li> : null}

                            {this.state.slectedPr.optionModel ?
                                <li>Model: {this.state.slectedPr.optionModel}</li>
                                : null
                            }
                            {product.sku ?
                                <li>SKU: {product.sku}</li>
                                : null
                            }
                            {product.upc ?
                                <li>UPC: {product.upc}</li>
                                : null
                            }
                            {product.ean ?
                                <li>EAN: {product.ean}</li>
                                : null
                            }
                            {product.jan ?
                                <li>JAN: {product.jan}</li>
                                : null
                            }
                            {product.isbn ?
                                <li>ISBN: {product.isbn}</li>
                                : null
                            }
                            {product.mpn ?
                                <li>ISBN: {product.mpn}</li>
                                : null
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
                            {this.state.slectedPr.optionPrice ?
                                this.state.slectedPr.priceParam === "equal" ?
                                <Currency value={this.state.slectedPr.optionPrice} />
                                    : this.state.slectedPr.priceParam === "plus" ?
                                       <Currency value={(this.state.slectedPr.optionPrice + product.price)} />
                                        : this.state.slectedPr.priceParam === "minus" ?
                                             <Currency value={(this.state.slectedPr.optionPrice - product.price)} />
                                            : 0
                                : prices
                            }
                        </div>

                        <form className="product__options">
                            <div className="form-group product__option">
                                <h4>Available Options</h4>
                                <div className="input-radio-label">
                                    <Form>

                                        {renderOptions()}

                                    </Form>
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
                                                // prr.productOptions = this.state.productPlusOptions
                                                return cartAddItem(prr, [], quantity)
                                            }}
                                            render={({ run, loading }) => (
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
                            {/* <div className="addthis_inline_share_toolbox" data-url={'http://192.3.213.101:2550/#/store/product/104'}
                        data-description={product.description}
                        data-title={product.productName} data-media={`${IMAGE_URL}/${product.productPhotos && product.productPhotos.length > 0 ? product.productPhotos[0].name: ''}`  }
                        ></div> */}

                            <div className="addthis_inline_share_toolbox"

                                data-url="http://192.3.213.101:2550/#/store/product/104"
                                // data-title="The AddThis Blog"
                                // data-media="http://192.3.213.101:3450/Uploads/800px_COLOURBOX2650448.jpg"

                            ></div>
                            {/* <ul className="share-links__list">
                                <li className="share-links__item share-links__item--type--like"><Link to="/">Like</Link>
                                </li>
                                <li className="share-links__item share-links__item--type--tweet"><Link
                                    to="/">Tweet</Link></li>
                                <li className="share-links__item share-links__item--type--pin"><Link to="/">Pin
                                    It</Link></li>
                            </ul> */}
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
