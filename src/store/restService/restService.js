/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
import axios from "axios";
import { BASE_URL } from "../../constant/constants";

const BASE_URL_API = `${BASE_URL}/api/Store`;
const BASE_URL_API_Admin = `${BASE_URL}/api/DRS.APA`;


const axiosInterceptor = () => {
  axios.interceptors.response.use(
    (response) => {

      console.log(response, 'axiosResponse')

      return response;
    },
    (error) => {
      console.log(error, 'axiosError')

      if (error.message.includes("403")) {
        localStorage.clear();
        return window.location.replace("#/login");
      } else if (error.message.includes("401")) {
        localStorage.clear();
        return window.location.replace("#/login");
      } else if (error.message.includes("500")) {
        window.alert("Something went wrong");
        window.location.reload();
      } else if (error.message.includes("413")) {
        window.alert("File Size Limit exceeded (5MB)");
        window.location.reload();
      } else {
        throw error;
      }
      return {
        status: error.status,
        error: error.message,
      };
    }
  );
};

const RestService = {

  getHeader: () => ({
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
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
      `${BASE_URL_API_Admin}/masterdata/StoreReviews/${currentPage}/${pageSize}?productId=${prId}`,
      FormData,
      RestService.getHeader()
    ),

  getAttachmentsByPrId: (id) => {
    return axios.get(
      `${BASE_URL_API_Admin}/masterdata/Attachments/1/50?productId=${id}`,
      RestService.getHeader()
    );
  },

  postReview: (FormData) =>
    axios.post(
      `${BASE_URL_API_Admin}/masterdata/StoreReviews`,
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
    axios.get(
      `${BASE_URL_API}/website/WebMenuStore/0/0`,
      RestService.getHeader()
    ),

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
      `${BASE_URL_API}/masterdata/ProductStore/${pageNumber}/${pageSize}?fromPrice=${priceFrom}&ToPrice=${priceTo}&categoryId=${filters.category
      }&${manufacturers.join("&")}&searchString=${filters.searchString}`,
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
      `${BASE_URL_API}/masterdata/ProductStore/GetRelatedStoreProductsByProductId/${prId}`,
      RestService.getHeader()
    ),

  getAllCategories: () =>
    axios.get(
      `${BASE_URL_API}/masterdata/ProductCategoriesStore/0/0`,
      RestService.getHeader()
    ),

  getProductOptionCombination: (prId) =>
    axios.get(
      `${BASE_URL_API_Admin}/masterdata/ProductOptionCombination/onProductId/${prId}`,
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
      `${BASE_URL_API_Admin}/masterdata/StoreCountries/0/0`,
      RestService.getHeader()
    ),

  calculateSaleOrderShipment: (formData) =>
    axios.post(
      `${BASE_URL_API}/masterdata/OrderStore/CalculateShipment`,
      formData,
      RestService.getHeader()
    ),

  postSaleOrder: (formData) => {
    axiosInterceptor();
    return axios.post(
      `${BASE_URL_API}/masterdata/OrderStore`,
      formData,
      RestService.getHeader()
    )
  },

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
    axios.get(`${BASE_URL}/api/DRS.APA/website/StoreBlogCategory/0/0`),

  getBlogPosts: (pg = 1, filter = "") =>
    axios.get(
      `${BASE_URL}/api/DRS.APA/website/StoreBlog/${pg}/${10}?${filter}`
    ),

  getBlogPostById: (id) =>
    axios.get(`${BASE_URL}/api/DRS.APA/website/StoreBlog/${id}`),

  getBlogPostCommentsByBlogId: (blogId) =>
    axios.get(
      `${BASE_URL}/api/DRS.APA/website/StoreBlogComment/0/0?BlogId=${blogId}`
    ),

  postBlogComment: (FormData) =>
    axios.post(
      `${BASE_URL}/api/DRS.APA/website/StoreBlogComment`,
      FormData,
      RestService.getHeader()
    ),

  getUkShipmentCharges: () =>
    axios.get(`${BASE_URL}/api/DRS.APA/Shipment/UK_AllShipment`),

  getCourierChargesPrices: () =>
    axios.get(`${BASE_URL}/api/DRS.APA/Shipment/StoreEU_CourierCharges/0/0`),

  userAuthenticate: (FormData) =>
    axios.post(
      `${BASE_URL}/Users/LoginCustomerUser`,
      FormData,
      RestService.getHeader()
    ),

  userForgotPassword: (FormData) =>
    axios.post(
      `${BASE_URL_API_Admin}/masterdata/Customers/ForgetCustomerPassword/${FormData}`,
      RestService.getHeader()
    ),

  userregistration: (FormData) =>
    axios.post(
      `${BASE_URL_API_Admin}/masterdata/Customers/FromSite`,
      FormData,
      RestService.getHeader()
    ),

  subscribeNewsletter: (FormData) =>
    axios.post(
      `${BASE_URL_API_Admin}/masterdata/Subscribers`,
      FormData,
      RestService.getHeader()
    ),

  verifyOldPassword: (OldPassword) => {
    return axios.get(
      `${BASE_URL_API_Admin}/masterdata/Customers/VerifyCustomerPassword/${OldPassword}`,
      RestService.getHeader()
    );
  },

  changePassword: (formData) => {
    return axios.put(
      `${BASE_URL_API_Admin}/masterdata/Customers/ChangeCustomerPassword`,
      { password: formData },
      RestService.getHeader()
    );
  },

  changePasswordAfterEmail: (formData) => {
    return axios.put(
      `${BASE_URL_API_Admin}/masterdata/Customers/ChangeCustomerPasswordAfterEmail`,
      formData,
      RestService.getHeader()
    );
  },

  getAllStoreCustomerGroups: () => {
    return axios.get(
      `${BASE_URL_API_Admin}/masterdata/StoreCustomerGroups/0/0`,
      RestService.getHeader()
    );
  },

  getAllParcelDeliveries: () => {
    return axios.get(
      `${BASE_URL_API_Admin}/masterdata/UK_ParcelDeliveries/0/0`,
      RestService.getHeader()
    );
  },

  getCustomerByToken: () => {
    return axios.get(
      `${BASE_URL_API_Admin}/masterdata/Customers/GetCustomerByTokenDetailed`,
      RestService.getHeader()
    );
  },

  editCustomerProfile: (formData, customerId) => {
    return axios.put(
      `${BASE_URL_API_Admin}/masterdata/Customers/UpdateCustomerFromStore/${customerId}`,
      formData,
      RestService.getHeader()
    );
  },

  editCustomerProfileAddress: (formData, customerAddId) => {
    return axios.put(
      `${BASE_URL_API_Admin}/masterdata/Customers/UpdateCustomerAddressStore/${customerAddId}`,
      formData,
      RestService.getHeader()
    );
  },

  postCustomerProfileAddress: (FormData) =>
    axios.post(
      `${BASE_URL_API_Admin}/masterdata/Customers/AddCustomerAddressStore`,
      FormData,
      RestService.getHeader()
    ),

  getCustomerAddressById: (customerId) =>
    axios.get(
      `${BASE_URL_API_Admin}/masterdata/Customers/GetCustomerAddressByIdStore/${customerId}`,
      RestService.getHeader()
    ),

  activateCustomerByCode: (code) => {
    return axios.get(
      `${BASE_URL_API_Admin}/masterdata/Customers/ActivateCustomer/${code}`,
      RestService.getHeader()
    );
  },

  activateUserByCode: (code) => {
    return axios.get(
      `${BASE_URL_API_Admin}/JWT/User/ActivateUser/${code}`,
      RestService.getHeader()
    );
  },

  getProductsBySearch: (string) =>
    axios.get(
      `${BASE_URL_API}/masterdata/ProductStore/0/0?searchString=${string}`,
      RestService.getHeader()
    ),
};
export default RestService;
