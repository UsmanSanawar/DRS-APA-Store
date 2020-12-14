/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
import axios from "axios";
import { BASE_URL } from "../../constant/constants";
const BASE_URL_API = `${BASE_URL}/api/Store`;
const BASE_URL_API_Admin = `${BASE_URL}/api/DRS.APA`;

const RestService = {
  getHeader: () => ({
    headers: {
      "Content-Type": "application/json",
    },
  }),

  getHeader2: () => ({
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer sk_test_zP6oE2wlbpaT39EQsqPNQGMn00VQlIJP4H",
    },
  }),

  getTransactionBySession: (sessionId) =>
    axios.get(
      `https://api.stripe.com/v1/checkout/sessions/cs_test_g1KUqbHTYsEqHJjf6XOoqb1265ynVIphfXeD5KF1QPuNiOwGVCh9zhed`,
      RestService.getHeader2()
    ),

  getReviews: (prId = 0, currentPage = 1, pageSize = 10) =>
    axios.get(
      `${BASE_URL_API}/masterdata/Reviews/${currentPage}/${pageSize}?productId=${prId}`,
      FormData,
      RestService.getHeader()
    ),

  getAttachmentsByPrId: (id) => {
    return axios.get(
      `${BASE_URL_API}/masterdata/Attachments/1/50?productId=${id}`,
      RestService.getHeader()
    );
  },

  postReview: (FormData) =>
    axios.post(
      `${BASE_URL_API}/masterdata/Reviews`,
      FormData,
      RestService.getHeader()
    ),

  getWebPageComponentByPageId: (id) =>
    axios.get(
      `${BASE_URL_API}/website/WebPageComponentForStore/GetWebPageComponentsOnStorePageId/${id}`,
      RestService.getHeader()
    ),

  getWebPageComponentByPageSlug: (slug) =>
    axios.get(
      `${BASE_URL_API}/website/WebPageComponentForStore/GetWebPageComponentsStoreOnSlug/${slug}`,
      RestService.getHeader()
    ),

  getWebMenu: () =>
    axios.get(`${BASE_URL_API}/website/WebMenuStore/0/0`, RestService.getHeader()),

  getProducts: () =>
    axios.get(
      `${BASE_URL_API}/masterdata/ProductStore/0/0`,
      RestService.getHeader()
    ),

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
      `${BASE_URL_API}/masterdata/ProductStore/${pageNumber}/${pageSize}?fromPrice=${priceFrom}&ToPrice=${priceTo}&categoryId=${
        filters.category
      }&${manufacturers.join("&")}&seachString=${filters.searchString}`,
      RestService.getHeader()
    );
  },

  getProductById: (prId) =>
    axios.get(
      `${BASE_URL_API}/masterdata/ProductStore/${prId}`,
      RestService.getHeader()
    ),

  getRelatedProductById: (prId) =>
    axios.get(
      `${BASE_URL_API}/masterdata/Products/GetRelatedStoreProductsByProductId/${prId}`,
      RestService.getHeader()
    ),

  getAllCategories: () =>
    axios.get(
      `${BASE_URL_API}/masterdata/ProductCategoriesStore/0/0`,
      RestService.getHeader()
    ),

  getProductOptionCombination: (prId) =>
    axios.get(
      `${BASE_URL_API}/masterdata/ProductOptionCombination/onProductId/${prId}`,
      RestService.getHeader()
    ),

  getAllManufacturer: () =>
    axios.get(
      `${BASE_URL_API}/masterdata/ManufacturerStore/0/0`,
      RestService.getHeader()
    ),

  getOrganizationsByCode: (code) =>
    axios.get(
      `${BASE_URL_API}/masterdata/OrganizationStore/${code}`,
      RestService.getHeader()
    ),

  getAllCountries: () =>
    axios.get(
      `${BASE_URL_API}/masterdata/Countries/0/0`,
      RestService.getHeader()
    ),

  postSaleOrder: (FormData) =>
    axios.post(
      `${BASE_URL_API}/masterdata/OrderStore`,
      FormData,
      RestService.getHeader()
    ),

  getOrderById: (orderId) =>
    axios.get(
      `${BASE_URL_API}/masterdata/OrderStore/${orderId}`,
      RestService.getHeader()
    ),

  getOrderByCustomerId: (page = 1, pageSize = 10, customerId) =>
    axios.get(
      `${BASE_URL_API}/masterdata/OrderStore/${page}/${pageSize}?CustomerId=${customerId}`,
      RestService.getHeader()
    ),

  getSaleOrderByCustomerId: (page = 1, pageSize = 10, customerId) =>
    axios.get(
      `${BASE_URL_API}/masterdata/SaleOrderStore/${page}/${pageSize}?CustomerId=${customerId}`,
      RestService.getHeader()
    ),

  getAllHomePageCollection: () =>
    axios.get(
      `${BASE_URL_API}/masterdata/HomePageCollectionStore/0/0`,
      RestService.getHeader()
    ),

  getWebBanner: () => axios.get(`${BASE_URL_API}/website/WebBannerStore`),

  getWebCarousal: () => axios.get(`${BASE_URL_API}/website/WebCarousalStore`),

  postSaleOrderConvertion: (ID, session) =>
    axios.post(
      `${BASE_URL_API}/masterdata/Orders/ConvertOrderToSaleOrder/${ID}?sessionId=${session}`,
      RestService.getHeader()
    ),

  getBlogCategories: () =>
    axios.get(`${BASE_URL}/api/DRS.APA/website/BlogCategory/0/0`),

  getBlogPosts: (pg = 1, filter = "") =>
    axios.get(`${BASE_URL}/api/DRS.APA/website/Blog/${pg}/${10}?${filter}`),

  getBlogPostById: (id) =>
    axios.get(`${BASE_URL}/api/DRS.APA/website/Blog/${id}`),

  getBlogPostCommentsByBlogId: (blogId) =>
    axios.get(
      `${BASE_URL}/api/DRS.APA/website/BlogComment/0/0?BlogId=${blogId}`
    ),

  postBlogComment: (FormData) =>
    axios.post(
      `${BASE_URL_API}/website/BlogComment`,
      FormData,
      RestService.getHeader()
    ),

  getUkShipmentCharges: () =>
    axios.get(`${BASE_URL}/api/DRS.APA/Shipment/UK_AllShipment`),

  getCourierChargesPrices: () =>
    axios.get(`${BASE_URL}/api/DRS.APA/Shipment/EU_CourierCharges/0/0`),

  userAuthenticate: (FormData) =>
    axios.post(
      `${BASE_URL}/Users/authenticate`,
      FormData,
      RestService.getHeader()
    ),

  userregistration: (FormData) =>
    axios.post(`${BASE_URL_API_Admin}/masterdata/Customers/FromSite`, FormData, RestService.getHeader()),

  subscribeNewsletter: (FormData) =>
    axios.post(
      `${BASE_URL_API}/masterdata/Subscribers`,
      FormData,
      RestService.getHeader()
    ),
};
export default RestService;
