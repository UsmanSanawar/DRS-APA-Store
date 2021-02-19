import { productObjectConverter } from "../constant/helpers";
import RestService from "./restService/restService"

const initialState = {
    storeView: false,
    menu: [],
    categories: [],
    relatedProducts: [],
    allCountries: [],
};

export default function quickviewReducer(state = initialState, action) {

    switch (action.type) {
        case 'STORE_VIEW': {
            return {
                ...state,
                storeView: action.storeView,
                menu: state.menu
            };
        }

        case 'SAVE_WEB_MENU': {
            let dataList = action.data.sort((a, b) => a.order - b.order)
            dataList.unshift({
                hasSubMenu: false,
                order: 1,
                slug: "/store",
                webMenuId: 5,
                webMenuTitle: "STORE",
                webPageId: 2,
                webPageTitle: "Store Page",
                webSubMenu: []
            })


            dataList.push({
                hasSubMenu: false,
                order: 99,
                slug: "/store/account_logout",
                webMenuId: null,
                webMenuTitle: "LOGOUT",
                webPageId: null,
                webPageTitle: "LOGOUT",
                webSubMenu: []
            })

            dataList.push({
                code: null,
                hasSubMenu: false,
                isActive: true,
                metaDescription: "",
                metaKeywords: "",
                metaTitle: "",
                name: "BLOG",
                parentCategoryId: null,
                parentCategoryName: null,
                productCategoryId: undefined,
                slug: "/store/products/undefined",
                subCategories: [],
                thumbPath: "",
                urlSeo: "",
                visibleOnMainMenu: true,
                webMenuId: undefined,
                webMenuTitle: "BLOG",
                webSubMenu: [],
                webSubMenuTitle: "BLOG"
              });

            return {
                ...state,
                menu: dataList,
                storeView: state.storeView
            };
        }

        case 'RELATED_PRODUCTS': {
            let dataList = action.data;
            let array = [];
            dataList.map(item => {

                array.push(productObjectConverter(item))
            })

            return {
                ...state,
                relatedProducts: array
            };
        }

        case 'SAVE_CATEGORIES': {
            let dataList = action.data;

            function getChild(obj) {
                let subArr = []
                for (let item of dataList) {
                    if (obj.productCategoryId === item.parentCategoryId) {
                        subArr.push(createObj(item))
                    }
                }

                return subArr
            }

            function createObj(obj) {
                return {
                    ...obj,
                    hasSubMenu: getChild(obj).length > 0 ? true : false,
                    // order: 2,
                    slug: `/store/products/${obj.productCategoryId}`,
                    webMenuId: obj.productCategoryId,
                    webMenuTitle: obj.name,
                    webSubMenuTitle: obj.name,
                    // webPageId: 13,
                    // webPageTitle: "Folding Door",
                    webSubMenu: getChild(obj)

                }
            }

            let newArr = [];

            for (let category of dataList) {

                let obj = createObj(category);

                if (obj.parentCategoryId == null) {
                    newArr.push(obj)
                }
            }

            let newNewArray = newArr;
            newNewArray.push({
                code: null,
                hasSubMenu: false,
                isActive: true,
                metaDescription: "",
                metaKeywords: "",
                metaTitle: "",
                name: "Trainings",
                parentCategoryId: null,
                parentCategoryName: null,
                productCategoryId: undefined,
                slug: "/trainings",
                subCategories: [],
                thumbPath: "",
                urlSeo: "",
                visibleOnMainMenu: true,
                webMenuId: undefined,
                webMenuTitle: "Trainings",
                webSubMenu: [],
                webSubMenuTitle: "Trainings"
            })
            state.categories = newNewArray

            state.categories.unshift({
                hasSubMenu: false,
                order: 1,
                slug: "/home",
                webMenuId: 5,
                webMenuTitle: "Home",
                webPageId: 2,
                webPageTitle: "Homepage",
                webSubMenu: []
            })

            state.categories.push({
                hasSubMenu: false,
                order: 1,
                slug: "/store/account_logout",
                webMenuId: 5,
                webMenuTitle: "Logout",
                webPageId: 2,
                webPageTitle: "Logout",
                webSubMenu: []
            })

            return {
                ...state,
                categories: state.categories
            }

        }


        case 'GET_ALL_COUNTRIES': {
            if (action.response.data.status === 'success') {
                state.allCountries = action.response.data.data != null ? action.response.data.data : []
            }
            return {
                ...state,
                allCountries: state.allCountries
            }
        }


        default:
            return state;
    }
}


export function getAllCountries() {
    // sending request to server, timeout is used as a stub
    return dispatch => (
        RestService.getAllCountries().then((response) => {
            if (response.data) {

                dispatch({
                    type: 'GET_ALL_COUNTRIES',
                    response: response
                })

            }
        })
    )
}