import {productObjectConverter} from "../constant/helpers";
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
        case 'STORE_VIEW':
            return {
                ...state,
                storeView: action.storeView,
                menu: state.menu
            };

        case 'SAVE_WEB_MENU': {
            let dataList = action.data.sort((a, b) => a.order - b.order)
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

            state.categories = newArr

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


        case 'SIGNIN_USER_SUCCESS':{
            return{...state, authUser: action.payload}
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