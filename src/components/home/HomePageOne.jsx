// react
import React, {useEffect, useState} from "react";
// third-party
import {Helmet} from "react-helmet";
// data stubs
import products from "../../data/shopProducts";
import theme from "../../data/theme";
import RestService from "../../store/restService/restService";
// blocks
import BlockBanner from "../blocks/BlockBanner";
import BlockFeatures from "../blocks/BlockFeatures";
import BlockSlideShow from "../blocks/BlockSlideShow";
import BlockTabbedProductsCarousel from "../blocks/BlockTabbedProductsCarousel";
import {productObjectConverter} from "../../constant/helpers";

function HomePageOne() {
  const [productList, setProductList] = useState([]);
  useEffect(() => {
    RestService.getAllHomePageCollection().then((res) => {
      if (res.data.status === "success") {
        const {data} = res.data;
        setProductList(data);
      }
    });
  }, []);

  const columns = [
    {
      title: "Top Rated Products",
      products: products.slice(0, 3),
    },
    {
      title: "Special Offers",
      products: products.slice(3, 6),
    },
    {
      title: "Bestsellers",
      products: products.slice(6, 9),
    },
  ];

  const handleListProduct = (item) => {
    const {productCategoriesJunctionForHome} = item;
    let productLists = [];
    if (
      productCategoriesJunctionForHome != null &&
      productCategoriesJunctionForHome.length > 0
    ) {
      // eslint-disable-next-line array-callback-return
      productCategoriesJunctionForHome.map(({product}) => {
        let item = productObjectConverter(product);
        productLists.push(item);
      });
    }

    return productLists;
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>{`Home Page — ${theme.name}`}</title>
      </Helmet>

      <BlockSlideShow
        withDepartments
        // above being used as side space for dropdown
      />

      <BlockFeatures/>
      {productList && productList.length > 0
        ? productList.map((item) => {
          return (
            <BlockTabbedProductsCarousel
              products={handleListProduct(item)}
              title={item.productCategoryName}
              layout="grid-4"
            />
          );
        })
        : null}
      <BlockBanner/>

      {/* <BlockCategories title="Popular Categories" layout="classic" categories={categories}/> */}

      {/*<BlockTabbedProductsCarousel title="New Arrivals" layout="horizontal" rows={2} />*/}

      {/* <BlockPosts title="Latest News" layout="list-sm" posts={posts}/> */}

      {/* <BlockBrands/> */}

      {/* <BlockProductColumns columns={columns}/> */}
    </React.Fragment>
  );
}

export default HomePageOne;
