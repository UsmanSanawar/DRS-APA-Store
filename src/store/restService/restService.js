import axios from 'axios';

const BASE_URL = 'http://192.3.213.101:3450/api/DRS.APA';

const RestService = {

    getHeader: () => ({
        headers: {
            'Content-Type': 'application/json',
        },
    }),


    getReviews:( prId=0,currentPage=1, pageSize=10 ) => axios.get(`${BASE_URL}/masterdata/Reviews/${currentPage}/${pageSize}?productId=${prId}`, FormData, 
    RestService.getHeader()),


    postReview:(FormData) => axios.post(`${BASE_URL}/masterdata/Reviews`, FormData, 
    RestService.getHeader()),

    getWebPageComponentByPageId: (id) => axios.get(`${BASE_URL}/website/WebPageComponent/GetWebPageComponentsOnPageId/${id}`,
        RestService.getHeader()),

    getWebPageComponentByPageSlug: (slug) => axios.get(`${BASE_URL}/website/WebPageComponent/GetWebPageComponentsOnSlug/${slug}`,
        RestService.getHeader()),

    getWebMenu: () => axios.get(`${BASE_URL}/website/WebMenu/0/0`,
        RestService.getHeader()),

    getProducts: () => axios.get(`${BASE_URL}/masterdata/Products/0/0`,
        RestService.getHeader()),

    getProductById: (prId) => axios.get(`${BASE_URL}/masterdata/Products/${prId}`,
        RestService.getHeader()),

    getAllCategories: () => axios.get(`${BASE_URL}/masterdata/ProductCategories/0/0`,
        RestService.getHeader()),

    getProductOptionCombination: (prId) => axios.get(`${BASE_URL}/masterdata/ProductOptionCombination/onProductId/${prId}`,
        RestService.getHeader()),


};
export default RestService;
