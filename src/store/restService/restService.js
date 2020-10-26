/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
import axios from 'axios';

const BASE_URL = 'http://192.3.213.101:3450/api/DRS.APA';

const RestService = {
    getHeader: () => ({
        headers: {
            'Content-Type': 'application/json',
        },
    }),

    getReviews: (prId = 0, currentPage = 1, pageSize = 10) => axios.get(
        `${BASE_URL}/masterdata/Reviews/${currentPage}/${pageSize}?productId=${prId}`,
        FormData,
        RestService.getHeader(),
    ),

    postReview: (FormData) => axios.post(`${BASE_URL}/masterdata/Reviews`, FormData, RestService.getHeader()),

    getWebPageComponentByPageId: (id) => axios.get(`${BASE_URL}/website/WebPageComponent/GetWebPageComponentsOnPageId/${id}`, RestService.getHeader()),

    getWebPageComponentByPageSlug: (slug) => axios.get(`${BASE_URL}/website/WebPageComponent/GetWebPageComponentsOnSlug/${slug}`, RestService.getHeader()),

    getWebMenu: () => axios.get(`${BASE_URL}/website/WebMenu/0/0`, RestService.getHeader()),

    getProducts: () => axios.get(`${BASE_URL}/masterdata/Products/0/0`, RestService.getHeader()),

    getProductsByPageAndFilter: (pageNumber, pageSize, filters) => {
        const priceArray = filters.priceRange;
        const priceFrom = priceArray[0];
        const priceTo = priceArray[1];

        const manufacturers = [];
        if (filters.manufacturers && filters.manufacturers.length > 0) {
            for (const manufacturerId of filters.manufacturers) {
                manufacturers.push(`manufacturerId=${manufacturerId}`);
            }
        }
        return axios.get(
            `${BASE_URL}/masterdata/Products/${pageNumber}/${pageSize}?fromPrice=${priceFrom}&ToPrice=${priceTo}&categoryId=${filters.category}&${manufacturers.join('&')}&seachString=${filters.searchString}`,
            RestService.getHeader(),
        );
    },

    getProductById: (prId) => axios.get(`${BASE_URL}/masterdata/Products/${prId}`, RestService.getHeader()),

    getRelatedProductById: (prId) => axios.get(`${BASE_URL}/masterdata/Products/GetRelatedProductsByProductId/${prId}`, RestService.getHeader()),

    getAllCategories: () => axios.get(`${BASE_URL}/masterdata/ProductCategories/0/0`, RestService.getHeader()),

    getProductOptionCombination: (prId) => axios.get(`${BASE_URL}/masterdata/ProductOptionCombination/onProductId/${prId}`, RestService.getHeader()),

    getAllManufacturer: () => axios.get(`${BASE_URL}/masterdata/Manufacturers/0/0`, RestService.getHeader()),

    getOrganizationsByCode: (code) => axios.get(`${BASE_URL}/masterdata/Organization/${code}`, RestService.getHeader()),

    getAllCountries: () => axios.get(`${BASE_URL}/masterdata/Countries/0/0`, RestService.getHeader()),

    postSaleOrder: (FormData) => axios.post(`${BASE_URL}/masterdata/SaleOrders`, FormData, RestService.getHeader()),

    getAllHomePageCollection: () => axios.get(`${BASE_URL}/masterdata/HomePageCollection/0/0`, RestService.getHeader()),

    getWebBanner: () => axios.get(`${BASE_URL}/website/WebBanner`)
};
export default RestService;
