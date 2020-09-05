// react
import React, {useEffect, useState} from 'react';
// third-party
import {Helmet} from 'react-helmet';
// blocks
import BlockBanner from '../blocks/BlockBanner';
import BlockBrands from '../blocks/BlockBrands';
import BlockCategories from '../blocks/BlockCategories';
import BlockFeatures from '../blocks/BlockFeatures';
import BlockPosts from '../blocks/BlockPosts';
import BlockProductColumns from '../blocks/BlockProductColumns';
import BlockProducts from '../blocks/BlockProducts';
import BlockSlideShow from '../blocks/BlockSlideShow';
import BlockTabbedProductsCarousel from '../blocks/BlockTabbedProductsCarousel';
// data stubs
import categories from '../../data/shopBlockCategories';
import posts from '../../data/blogPosts';
import products from '../../data/shopProducts';
import theme from '../../data/theme';
import RestService from "../../store/restService/restService";

function HomePageOne() {

    const [productList, setProductList] = useState([])
    useEffect(()=> {
        RestService.getProducts().then(res => {
            if (res.data.status === "success") {
                let data = res.data.data;

                // {
                //     "productId": 37,
                //     "productName": "Nokia N95",
                //     "description": "N95 slide phone with 13 Megapixel camera",
                //     "seoH1": "seoH1",
                //     "seoH2": "seoH2",
                //     "seoH3": "seoH3",
                //     "imageTitle": "imageTitle",
                //     "metaTagTitle": "metaTagTitle",
                //     "metaTagDescription": "metaTagDescription",
                //     "metaTagKeywords": "metaTagKeywords",
                //     "newTabName": "newTabName",
                //     "newTabContent": "newTabContent",
                //     "productTags": "productTags,productTags,productTags",
                //     "productPhotos": [],
                //     "model": "N95",
                //     "sku": "Piece",
                //     "upc": "upc",
                //     "ean": "ean",
                //     "jan": "jan",
                //     "isbn": "isbn",
                //     "mpn": "mpn",
                //     "location": "AJK",
                //     "price": 45000,
                //     "taxClassId": 2,
                //     "taxClassTitle": null,
                //     "quantity": 10,
                //     "minimumQuantity": 5,
                //     "subtractStock": true,
                //     "stockStatusId": 4,
                //     "stockStatusName": null,
                //     "requiresShipping": true,
                //     "seoUrl": "seoUrl",
                //     "dateAvailable": "2020-09-04T06:50:34.642",
                //     "length": "length",
                //     "width": "width",
                //     "height": "height",
                //     "lengthUnitId": 1,
                //     "lengthUnitName": null,
                //     "weight": "string",
                //     "weightUnitId": 1,
                //     "weightUnitName": null,
                //     "isActive": true,
                //     "sortOrder": 1,
                //     "manufacturerId": 5,
                //     "manufacturerName": null,
                //     "productCategoriesJunction": [],
                //     "storeId": 2,
                //     "storeName": "Secodary Store1",
                //     "relatedProducts": [],
                //     "productOptions": [],
                //     "discountProducts": [],
                //     "rewardPoints": null
                // }

                let array = [];
                let images = [];
                data.map(item => {

                    if (item.productPhotos.length > 0) {

                        item.productPhotos.map(image => {
                            images.push(`http://192.3.213.101:3450/Uploads/${image.name}`)
                        })
                    }

                    array.push(
                    {
                        id: item.productId,
                        name: item.productName,
                        price: item.price,
                        compareAtPrice: null, //need be added to DTO
                        images: images,
                        badges: [''],
                        rating: 3,
                        reviews: 15,
                        availability: 'in-stock',
                        features: [
                        { name: 'Speed', value: '750 RPM' },
                        { name: 'Power Source', value: 'Cordless-Electric' },
                        { name: 'Battery Cell Type', value: 'Lithium' },
                        { name: 'Voltage', value: '20 Volts' },
                        { name: 'Battery Capacity', value: '2 Ah' },
                    ],
                        options: item.productOptions,
                    })
                })

                setProductList(array)
            }
        })
    }, [])

    const columns = [
        {
            title: 'Top Rated Products',
            products: products.slice(0, 3),
        },
        {
            title: 'Special Offers',
            products: products.slice(3, 6),
        },
        {
            title: 'Bestsellers',
            products: products.slice(6, 9),
        },
    ];

    return (
        <React.Fragment>
            <Helmet>
                <title>{`Home Page — ${theme.name}`}</title>
            </Helmet>

            <BlockSlideShow
                withDepartments
                //above being used as side space for dropdown
            />

            <BlockFeatures/>

            <BlockTabbedProductsCarousel products={productList} title="Featured Products" layout="grid-4"/>

            <BlockBanner/>

            <BlockProducts
                title="Bestsellers"
                layout="large-first"
                featuredProduct={productList[0]}
                products={productList}
            />

            <BlockCategories title="Popular Categories" layout="classic" categories={categories}/>

            <BlockTabbedProductsCarousel title="New Arrivals" layout="horizontal" rows={2}/>

            <BlockPosts title="Latest News" layout="list-sm" posts={posts}/>

            <BlockBrands/>

            {/*<BlockProductColumns columns={columns}/>*/}
        </React.Fragment>
    );
}

export default HomePageOne;
