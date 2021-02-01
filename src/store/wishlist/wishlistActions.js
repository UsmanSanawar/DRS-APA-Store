import {toast} from 'react-toastify';
import {WISHLIST_ADD_ITEM, WISHLIST_REMOVE_ITEM} from './wishlistActionTypes';


export function wishlistAddItemSuccess(product) {
  // toast.success(`Product "${product.productName ? product.productName : product.name}" added to wishlist!`);
  return {
    type: WISHLIST_ADD_ITEM,
    product,
  };
}

export function wishlistRemoveItemSuccess(productId) {
  return {
    type: WISHLIST_REMOVE_ITEM,
    productId,
  };
}

export function wishlistAddItem(product) {
  return dispatch => (
    new Promise((resolve) => {
      dispatch(wishlistAddItemSuccess(product));
      resolve();
    })
  );
}

export function wishlistRemoveItem(productId) {
  return dispatch => (
    new Promise((resolve) => {
      dispatch(wishlistRemoveItemSuccess(productId));
      resolve();
    })
  );
}
