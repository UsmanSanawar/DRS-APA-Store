// react
import React,{useEffect, useState} from 'react';

// third-party
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

// application
import PageHeader from '../shared/PageHeader';
import Product from '../shared/Product';
import ProductTabs from './ProductTabs';

// blocks
import BlockProductsCarousel from '../blocks/BlockProductsCarousel';

// widgets
import WidgetCategories from '../widgets/WidgetCategories';
import WidgetProducts from '../widgets/WidgetProducts';

// data stubs
import categories from '../../data/shopWidgetCategories';
import products from '../../data/shopProducts';
import theme from '../../data/theme';
import RestService from '../../store/restService/restService';


function ShopPageProduct(props) {
    const { layout, sidebarPosition, match } = props;
    // let product = {};

    const [product, setProduct] = useState({})

    // if (match.params.productId) {
    //     product = products.find((x) => x.id === parseFloat(match.params.productId));
    // } else {
        // product = products[products.length - 1];
    // }

    const breadcrumb = [
        { title: 'Home', url: '' },
        { title: 'Screwdrivers', url: '' },
        { title: product.name, url: '' },
    ];




    useEffect(()=> {
        let productId = match.params.productId;

        if(productId){

        RestService.getProductById(productId).then(res => {
            if (res.data.status === "success") {
                let data = res.data.data;
                setProduct(data)
console.log(data, 'data data pr');

            }
        })
    }
    }, [])



    let content;

    if (layout === 'sidebar') {
        const sidebar = (
            <div className="shop-layout__sidebar">
                <div className="block block-sidebar">
                    <div className="block-sidebar__item">
                        <WidgetCategories categories={categories} location="shop" />
                    </div>
                    <div className="block-sidebar__item d-none d-lg-block">
                        <WidgetProducts title="Latest Products" products={products.slice(0, 5)} />
                    </div>
                </div>
            </div>
        );

        content = (
            <div className="container">
                <div className={`shop-layout shop-layout--sidebar--${sidebarPosition}`}>
                    {sidebarPosition === 'start' && sidebar}
                    <div className=" shop-layout__content">
                        <div className=" block">
                            <Product product={product} layout={layout} />
                            <ProductTabs product={product} withSidebar   />
                        </div>

                        <BlockProductsCarousel title="Related Products" layout="grid-4-sm" products={products} withSidebar />
                    </div>
                    {sidebarPosition === 'end' && sidebar}
                </div>
            </div>
        );
    } else {
        content = (
            <React.Fragment>
                <div className="block">
                    <div className="container">
                        <Product product={product} layout={layout} />
                        <ProductTabs product={product} />
                    </div>
                </div>

                <BlockProductsCarousel title="Related Products" layout="grid-5" products={products} />
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>{`${product.name} — ${theme.name}`}</title>
            </Helmet>

            <PageHeader breadcrumb={breadcrumb} />

            {content}
        </React.Fragment>
    );
}

ShopPageProduct.propTypes = {
    /** one of ['standard', 'sidebar', 'columnar', 'quickview'] (default: 'standard') */
    layout: PropTypes.oneOf(['standard', 'sidebar', 'columnar', 'quickview']),
    /**
     * sidebar position (default: 'start')
     * one of ['start', 'end']
     * for LTR scripts "start" is "left" and "end" is "right"
     */
    sidebarPosition: PropTypes.oneOf(['start', 'end']),
};

ShopPageProduct.defaultProps = {
    layout: 'standard',
    sidebarPosition: 'start',
};

export default ShopPageProduct;
