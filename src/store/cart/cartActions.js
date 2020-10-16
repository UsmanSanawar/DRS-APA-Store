import { toast } from 'react-toastify';
import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_UPDATE_QUANTITIES,ERROR,POST_SALE_ORDER} from './cartActionTypes';
import RestService from '../restService/restService';


export function postSaleOrder(formData) {
    console.log(formData, 'formData 1');
    
    return (dispatch) => {
    console.log(formData, 'formData 2');

      RestService.postSaleOrder(formData).then(response => {
    console.log(formData, 'formData 3', response);
        if (response.data) {
          dispatch({
            type: POST_SALE_ORDER,
            response: response
          });
        } else {
          dispatch({
            type: ERROR,
            response: response,
          });
        }
      })
    }
  }



export function cartAddItemSuccess(product, options = [], quantity = 1) {
    toast.success(`Product "${product.productName ? product.productName : product.name}" added to cart!`);

    return {
        type: CART_ADD_ITEM,
        product,
        options,
        quantity,
    };
}

export function cartRemoveItemSuccess(itemId) {
    return {
        type: CART_REMOVE_ITEM,
        itemId,
    };
}

export function cartUpdateQuantitiesSuccess(quantities) {
    return {
        type: CART_UPDATE_QUANTITIES,
        quantities,
    };
}

export function cartAddItem(product, options = [], quantity = 1) {
    // sending request to server, timeout is used as a stub
    return dispatch => (
        new Promise((resolve) => {
            setTimeout(() => {
                dispatch(cartAddItemSuccess(product, options, quantity));
                resolve();
            }, 500);
        })
    );
}

export function cartRemoveItem(itemId) {
    // sending request to server, timeout is used as a stub
    return dispatch => (
        new Promise((resolve) => {
            setTimeout(() => {
                dispatch(cartRemoveItemSuccess(itemId));
                resolve();
            }, 500);
        })
    );
}

export function cartUpdateQuantities(quantities) {
    // sending request to server, timeout is used as a stub
    return dispatch => (
        new Promise((resolve) => {
            setTimeout(() => {
                dispatch(cartUpdateQuantitiesSuccess(quantities));
                resolve();
            }, 500);
        })
    );
}
