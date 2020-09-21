import axios from 'axios';

const BASE_URL = 'http://192.3.213.101:3450/api/DRS.APA';

const RestService = {

    getHeader: () => ({
        headers: {
            'Content-Type': 'application/json',
        },
    }),
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

        getAllCategories: (prId) => axios.get(`${BASE_URL}/masterdata/ProductCategories/0/0`,
        RestService.getHeader()),

        getProductOptionCombination: (prId)=> axios.get(`${BASE_URL}/masterdata/ProductOptionCombination/${prId}`,
        RestService.getHeader()),


};
export default RestService;
