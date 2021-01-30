// react
// third-party
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import CircularLoader from "../../assets/loaders";
import { productObjectConverter } from "../../constant/helpers";
import products from "../../data/shopProducts";

// data stubs
import categories from "../../data/shopWidgetCategories";
import theme from "../../data/theme";
import RestService from "../../store/restService/restService";

// blocks
import BlockProductsCarousel from "../blocks/BlockProductsCarousel";

// application
import PageHeader from "../shared/PageHeader";
import Product from "../shared/Product";

// widgets
import WidgetCategories from "../widgets/WidgetCategories";
import WidgetProducts from "../widgets/WidgetProducts";
import ProductTabs from "./ProductTabs";

function ShopPageProduct(props) {
  const { layout, sidebarPosition, match } = props;
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);

  const breadcrumb = [
    // {title: 'Home', url: ''},
    // {title: 'Screwdrivers', url: ''},
    // {title: product.productName, url: ''},
  ];

  const dispatch = useDispatch();

  useEffect(() => {
    let productId = match.params.productId;

    if (productId) {
      RestService.getProductById(productId).then((res) => {
        if (res.data.status === "success") {
          let data = productObjectConverter(res.data.data);
          setProduct(data);
          setLoading(false);
        }
      });

      RestService.getRelatedProductById(productId).then((res) => {
        if (res.data.status === "success") {

          dispatch({ type: "RELATED_PRODUCTS", data: res.data.data });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.params.productId]);
  const handleOptionWeight = (evt) => {
    if (parseFloat(product.weight) !== evt) {
      setProduct({
        ...product,
        newWeight: evt,
      });
    }
  };

  const { relatedProducts } = useSelector(({ webView }) => webView);

  let content;

  if (layout === "sidebar") {
    const sidebar = (
      <div className="shop-layout__sidebar">
        <div className="block block-sidebar">
          <div className="block-sidebar__item">
            <WidgetCategories categories={categories} location="shop" />
          </div>
          <div className="block-sidebar__item d-none d-lg-block">
            <WidgetProducts
              title="Latest Products"
              products={products.slice(0, 5)}
            />
          </div>
        </div>
      </div>
    );

    content = (
      <div className="container">
        <div className={`shop-layout shop-layout--sidebar--${sidebarPosition}`}>
          {sidebarPosition === "start" && sidebar}
          <div className=" shop-layout__content">
            <div className=" block">
              <Product
                handleOptionWeight={handleOptionWeight}
                product={product}
                layout={layout}
              />
              <ProductTabs product={product} withSidebar />
            </div>

            <BlockProductsCarousel
              title="Related Products"
              layout="grid-4-sm"
              products={products}
              withSidebar
            />
          </div>
          {sidebarPosition === "end" && sidebar}
        </div>
      </div>
    );
  } else {
    content = (
      <React.Fragment>
        <div className="block">
          <div className="container">
            <Product
              handleOptionWeight={handleOptionWeight}
              product={product}
              layout={layout}
            />
            <ProductTabs product={product} />
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <BlockProductsCarousel
            title="Related Products"
            layout="grid-5"
            products={relatedProducts}
          />
        )}
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>{`${product.productName} — ${theme.name}`}</title>
      </Helmet>

      <PageHeader breadcrumb={breadcrumb} />

      {loading ? (
        <div style={{ height: "80vh", width: "80vw" }}>
          <div style={{ display: "block", margin: "25% 50% 50% 50%" }}>
            <CircularLoader />
          </div>
        </div>
      ) : (
        content
      )}
    </React.Fragment>
  );
}

ShopPageProduct.propTypes = {
  /** one of ['standard', 'sidebar', 'columnar', 'quickview'] (default: 'standard') */
  layout: PropTypes.oneOf(["standard", "sidebar", "columnar", "quickview"]),
  /**
   * sidebar position (default: 'start')
   * one of ['start', 'end']
   * for LTR scripts "start" is "left" and "end" is "right"
   */
  sidebarPosition: PropTypes.oneOf(["start", "end"]),
};

ShopPageProduct.defaultProps = {
  layout: "standard",
  sidebarPosition: "start",
};

export default ShopPageProduct;
