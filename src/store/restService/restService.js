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

        getWebPageComponentByPageSlug:(slug) => axios.get(`${BASE_URL}/website/WebPageComponent/GetWebPageComponentsOnSlug/${slug}`,
        RestService.getHeader()),

        getWebMenu:() => axios.get(`${BASE_URL}/website/WebMenu/0/0`,
        RestService.getHeader()),
};
export default RestService;
